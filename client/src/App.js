import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button, Col, Form, Container, Modal, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { CameraVideo, CameraVideoOff, MicMute, Mic } from 'react-bootstrap-icons';
const incommingCallAudio = new Audio('./skype_remix_2.mp3')
incommingCallAudio.loop = true

const Row = styled.div`
  display: flex;
  width: 100%;
`;

function App() {
  const peer = useRef(null)
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

  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);

  useEffect(() => {
    // 1. connect to server
    // socket.current = io.connect("http://192.168.29.67:8000/");
    // socket.current = io.connect("http://192.168.1.105:8000/");
    // socket.current = io.connect("https://ielts-video-chat.herokuapp.com/");
    socket.current = io.connect("");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    }).catch((reason) => {
      toast.error("Provide Permission")
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      console.log(users);

      setUsers(users);
    })

    socket.current.on("receiveCall", (data) => {
      console.log("Reciving");
      setReceivingCall(true);
      // setCallButtonDisability(true);
      setCaller(data.from.name);
      setRemoteUserId(data.from.id);
      setCallerSignal(data.signal);
    })


    socket.current.on("changeNameStatus", (response) => {
      if (response.status) {
        // toast.success("Name changed!");
      } else {
        toast.error("name already taken!")
      }
    });
  }, []);

  function callPeer(id) {

    // setCallButtonDisability(true);

    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    console.log("Call user")
    peer.current.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID });
    });

    peer.current.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      setRemoteUserId(id);
      peer.current.signal(signal);
      setCallButtonDisability(true);
      console.log("accepted");
    });


    peer.current.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!")
      }
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);

      socket.current.removeListener("callAccepted");
      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    })


    socket.current.on("callEnded", () => {
      peer.current.destroy("Call ended");
    })

    socket.current.on("error", (error) => {
      peer.current.destroy(error.message);
    })


  }



  function acceptCall() {
    incommingCallAudio.pause()
    incommingCallAudio.currentTime = 0;
    setCallAccepted(true);
    setReceivingCall(false);
    setCallButtonDisability(true);
    // setCaller(false);

    peer.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.current.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: remoteUserId });
    });

    peer.current.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.current.signal(callerSignal);


    peer.current.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!")
      }
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      setCallButtonDisability(false);

      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });


    socket.current.on("callEnded", () => {
      peer.current.destroy("Call ended");
    })


  }

  function toggleVideo() {

    const oldTrack = stream.getVideoTracks()[0];

    if (oldTrack.readyState === "ended") {

      navigator.mediaDevices.getUserMedia({ video: true }).then(newStream => {
        const newTrack = newStream.getVideoTracks()[0]
        stream.removeTrack(oldTrack)
        stream.addTrack(newTrack)
        setVideoStatus(true);
        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, newTrack, stream);
        }
      })
    }
    else if (oldTrack.readyState === "live") {

      oldTrack.stop();
      setVideoStatus(false);

      if (callAccepted) {
        peer.current.replaceTrack(oldTrack, oldTrack, stream);
      }
    }

  }

  function toggleAudio() {


    const oldTrack = stream.getAudioTracks()[0];

    if (oldTrack.readyState === "ended") {

      navigator.mediaDevices.getUserMedia({ audio: true }).then(newStream => {
        const newTrack = newStream.getAudioTracks()[0]
        stream.removeTrack(oldTrack)
        stream.addTrack(newTrack)
        setAudioStatus(true);
        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, newTrack, stream);
        }
      })
    }
    else if (oldTrack.readyState === "live") {

      oldTrack.stop();
      setAudioStatus(false);

      if (callAccepted) {
        peer.current.replaceTrack(oldTrack, oldTrack, stream);
      }
    }

  }



  function endCall(key) {
    socket.current.emit("endCall", { id: remoteUserId })
  }

  function changeName(event) {
    event.preventDefault();
    const name = event.target.name.value;
    let alreadyTaken = false;
    Object.keys(users).forEach(key => {
      if (key !== yourID) {
        if (name === users[key]) {
          alreadyTaken = true;
        }
      }
    })
    if (alreadyTaken) {
      toast.error("name already taken!"); return;
    } else {
      socket.current.emit("changeName", { name })
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
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
    if (users[yourID] === "professor") {
      CallUserList = Object.keys(users).map(key => {
        if (key === yourID) {
          return null;
        }
        return (
          <Button variant="primary" onClick={() => callPeer(key)} disabled={callButtonDisability} style={{ margin: 5 }} >Call {users[key]}</Button>
        );
      })
    }
  }

  let PartnerVideo;
  let endCallButton;
  let partnerName;
  let ToggleMediaButtons;

  if (callAccepted) {
    PartnerVideo = <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    partnerName = <h4>Partner: {users[remoteUserId]}</h4>
    endCallButton = (
      <Button variant="danger" onClick={() => endCall()} >End Call</Button>
    );

  }

  const videobutton = videoStatus ? "success" : "danger";
  const audiobutton = audioStatus ? "success" : "danger";
  const videoIcon = videoStatus ? <CameraVideo size={30} /> : <CameraVideoOff size={30} />;
  const audioIcon = audioStatus ? <Mic size={30} /> : <MicMute size={30} />;
  ToggleMediaButtons = (
    <div className="mediaButtons">
      <Button variant={videobutton} onClick={toggleVideo} style={{ margin: 5 }}> {videoIcon} </Button>
      <Button variant={audiobutton} onClick={toggleAudio} style={{ margin: 5 }}> {audioIcon} </Button>
    </div>
  )


  let professorOnline;
  if (users[yourID] !== "professor") {
    Object.keys(users).forEach(key => {
      if (key !== yourID) {
        if (users[key] === "professor") {
          professorOnline = "Professor online";
        }
      }
    })
  }

  let incommintCall;
  if ((receivingCall && users[remoteUserId])) {
    incommingCallAudio.play()

    incommintCall = (
      <div className="incommingCall">

        <Card className="text-center" style={{ background: "black", color: "white" }}>
          <Card.Header><h2>{caller} is calling you</h2></Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>
            <Container>
              <Row>
                <Col><Button size="lg" variant="danger" onClick={() => { }}>Reject</Button></Col>
                <Col><Button size="lg" variant="success" onClick={acceptCall}>Accept</Button></Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>

      </div>
    )
  } else {
    incommingCallAudio.pause()
    incommingCallAudio.currentTime = 0;
  }


  return (
    <>
      {incommintCall}
      {PartnerVideo}
      {UserVideo}
      {ToggleMediaButtons}
      <Container style={{ color: "white" }} fluid>
        <Row>
          {CallUserList}
        </Row>
        <Row>
          {endCallButton}
        </Row>

        <Row>

          <Col>
            <h4>You: {users[yourID]}</h4>
            {changeNameInput}
            <Row style={{ color: "green", fontWeight: "bold" }}>
              {professorOnline}
            </Row>
          </Col>

          {/* {partnerName} */}

        </Row>
        <ToastContainer autoClose={2000} />
      </Container>
      
    </>
  );
}

export default App;
