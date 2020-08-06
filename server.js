const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};
let count = 0;

io.on('connection', socket => {

    if (!users[socket.id]) {
        users[socket.id] = (++count).toString();
        console.log(users[socket.id]);
        socket.emit("yourID", socket.id);
        io.sockets.emit("allUsers", users);

        socket.on('disconnect', () => {
            console.log(users[socket.id] + " - deleted");
            delete users[socket.id];
            io.sockets.emit("allUsers", users);
        })

        socket.on("callUser", (data) => {
            console.log(`${users[data.from]} called ${users[data.userToCall]}`);
            io.to(data.userToCall).emit('receiveCall', { signal: data.signalData, from: { id: data.from, name: users[data.from] } });
        })

        socket.on("acceptCall", (data) => {
            io.to(data.to).emit('callAccepted', data.signal);
        });

        socket.on("endCall", (data) => {
            io.to(data.id).emit("callEnded");
            socket.emit("callEnded");
        })


        socket.on("changeName", (data) => {
            let alreadyTaken = false;
            Object.keys(users).map(key => {
                if (key !== socket.id) {
                    if (data.name === users[key]) {
                        alreadyTaken = true;
                    }
                }
            })
            if (alreadyTaken) {                
                socket.emit("changeNameStatus", {status:false});
            } else {
                users[socket.id] = data.name;
                io.sockets.emit("allUsers", users);
                socket.emit("changeNameStatus", {status:true});
            }
        })
    }

});

server.listen(8000, () => console.log('server is running on port 8000'));


