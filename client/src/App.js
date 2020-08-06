import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button, Col, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const UserVideoComponent = styled.video`
  border: 1px solid grey;
  width: 100%;
  height: 250px;
`;
const PartenrVideoComponent = styled.video`
  border: 1px solid blue;
  width: 100%;
  height: 250px;
`;

function App() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const [callButtonDisability, setCallButtonDisability] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    // 1. connect to server
    // socket.current = io.connect("http://192.168.29.67:8000/");
    socket.current = io.connect("http://192.168.1.105:8000/");
    // socket.current = io.connect("https://c631dbd39801.ngrok.io/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);

      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      console.log(users);

      setUsers(users);
    })

    socket.current.on("receiveCall", (data) => {
      setReceivingCall(true);
      // setCallButtonDisability(true);
      setCaller(data.from.name);
      setRemoteUserId(data.from.id);
      setCallerSignal(data.signal);
    })


    socket.current.on("changeNameStatus", (response) => {      
      if (response.status) {
        toast.success("Name changed!");
      } else {
        toast.error("name already taken!")
      }
    });
  }, []);

  function callPeer(id) {

    // setCallButtonDisability(true);

    const peer1 = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer1.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID });
    });

    peer1.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      setRemoteUserId(id);
      peer1.signal(signal);
      setCallButtonDisability(true);
      console.log("accepted");
    });


    peer1.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!")
      }
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);

      socket.current.removeListener("callAccepted");
    })


    socket.current.on("callEnded", () => {
      peer1.destroy("Call ended");
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setReceivingCall(false);
    setCallButtonDisability(true);
    // setCaller(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: remoteUserId });
    });

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);


    peer.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!")
      }
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      setCallButtonDisability(false);
    });


    socket.current.on("callEnded", () => {
      peer.destroy("Call ended");
    })

  }

  function endCall(key) {
    socket.current.emit("endCall", { id: remoteUserId })
  }

  function changeName(event) {
    event.preventDefault();
    const name = event.target.name.value;
    let alreadyTaken = false;
    Object.keys(users).map(key => {
      if (key !== yourID) {
        if (name === users[key]) {
          alreadyTaken = true;
        }
      }        
    })
    if (alreadyTaken){
      toast.error("name already taken!"); return;
    } else {
      socket.current.emit("changeName", {name})
    }
    
  }

  const changeNameInput = (
    <Form onSubmit={changeName}>
      <Row>
        <Form.Group controlId="name" >
          <Form.Label>Change Display name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" />
        </Form.Group>
      </Row>
      <Button variant="primary" type="submit">
        Change Name
      </Button>
    </Form>
  );


  let UserVideo;
  let CallUserList;
  if (stream) {
    UserVideo = (
      <UserVideoComponent playsInline muted ref={userVideo} autoPlay />
    );
    CallUserList = Object.keys(users).map(key => {
      if (key === yourID) {
        return null;
      }
      return (
        <Button variant="primary" onClick={() => callPeer(key)} disabled={callButtonDisability}>Call {users[key]}</Button>
      );
    })
  }

  let PartnerVideo;
  let endCallButton;
  if (callAccepted) {
    PartnerVideo = (
      <Col>
        <PartenrVideoComponent playsInline ref={partnerVideo} autoPlay />
        <h1>Partner: {users[remoteUserId]}</h1>
      </Col>
    );
    endCallButton = (
      <Button variant="danger" onClick={() => endCall()} >End Call</Button>
    );
  }

  let incomingCall;
  if (receivingCall && users[remoteUserId]) {
    incomingCall = (
      <div>
        <h4>{caller} is calling you</h4>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
    CallUserList = null;
  }

  return (
    <Container style={{ backgroundColor: "black", color: "grey" }}>
      <Row>
        {CallUserList}
      </Row>
      <Row>
        {incomingCall}
        {endCallButton}
      </Row>
      <Row>
        {PartnerVideo}
        <Col>
          {UserVideo}
          <h1>You: {users[yourID]}</h1>
          {changeNameInput}
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
    </Container>
  );
}

export default App;
