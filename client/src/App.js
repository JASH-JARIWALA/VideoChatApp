import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button, Col, Form, Container, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  CameraVideo,
  CameraVideoOff,
  MicMute,
  Mic,
  ArrowBarUp,
} from "react-bootstrap-icons";
import Loader from "react-loader-spinner";

const incommingCallAudio = new Audio("./skype_remix_2.mp3");
incommingCallAudio.loop = true;

const LoadingTailSpin = () => {
  return (
    <Loader
      type="TailSpin"
      color="#00BFFF"
      // timeout={3000}
    />
  );
};

const Row = styled.div`
  display: flex;
  width: 100%;
`;

function App() {
  const peer = useRef(null);
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [userMediaLoading, setUserMediaLoading] = useState(false);

  const [callingPermission, setCallingPermission] = useState(false);

  const [callButtonDisability, setCallButtonDisability] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [screenShareStatus, setScreenShareStatus] = useState(false);
  const [cameraMode, setCameraMode] = useState("user");

  useEffect(() => {
    // 1. connect to server
    // socket.current = io.connect("http://localhost:8000/");
    // socket.current = io.connect("http://192.168.29.67:8000/");
    // socket.current = io.connect("http://192.168.1.105:8000/");
    // socket.current = io.connect("https://ielts-video-chat.herokuapp.com/");
    socket.current = io.connect("");
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: cameraMode }, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((reason) => {
        toast.error("Provide Permission");
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users) => {
      console.log(users);

      setUsers(users);
    });

    socket.current.on("receiveSignal", (data) => {
      console.log("Reciving signal");
      setCallerSignal(data.signal);
    });

    socket.current.on("receiveCall", (data) => {
      console.log("Reciving");
      setReceivingCall(true);
      setCallButtonDisability(true);
      setCaller(data.from.name);
      setRemoteUserId(data.from.id);
      // setCallerSignal(data.signal);
    });

    socket.current.on("changeNameStatus", (response) => {
      if (response.status) {
        // toast.success("Name changed!");
      } else {
        toast.error("name already taken!");
      }
    });
  }, []);

  useEffect(() => {
    socket.current.on("callPermissionGranted", (data) => {
      if (users[data.from]) {
        console.log("Permission Granted from " + users[data.from]);
        setCallingPermission(data.from);
      }
    });
  }, [users]);

  function callPeer(id) {
    setCallButtonDisability(true);

    peer.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
      config: {
        iceServers: [
          // { urls: "iphone-stun.strato-iphone.de:3478" },
          // { urls: "numb.viagenie.ca:3478" },
          { urls: "stun:stun.12connect.com:3478" },
          { urls: "stun:stun.12voip.com:3478" },
          { urls: "stun:stun.1und1.de:3478" },
          { urls: "stun:stun.3cx.com:3478" },
          { urls: "stun:stun.acrobits.cz:3478" },
          { urls: "stun:stun.actionvoip.com:3478" },
          { urls: "stun:stun.advfn.com:3478" },
          { urls: "stun:stun.altar.com.pl:3478" },
          { urls: "stun:stun.antisip.com:3478" },
          { urls: "stun:stun.avigora.fr:3478" },
          { urls: "stun:stun.bluesip.net:3478" },
          { urls: "stun:stun.cablenet-as.net:3478" },
          { urls: "stun:stun.callromania.ro:3478" },
          { urls: "stun:stun.callwithus.com:3478" },
          { urls: "stun:stun.cheapvoip.com:3478" },
          { urls: "stun:stun.cloopen.com:3478" },
          { urls: "stun:stun.commpeak.com:3478" },
          { urls: "stun:stun.cope.es:3478" },
          { urls: "stun:stun.counterpath.com:3478" },
          { urls: "stun:stun.counterpath.net:3478" },
          { urls: "stun:stun.dcalling.de:3478" },
          { urls: "stun:stun.demos.ru:3478" },
          { urls: "stun:stun.dus.net:3478" },
          { urls: "stun:stun.easycall.pl:3478" },
          { urls: "stun:stun.easyvoip.com:3478" },
          { urls: "stun:stun.ekiga.net:3478" },
          { urls: "stun:stun.epygi.com:3478" },
          { urls: "stun:stun.etoilediese.fr:3478" },
          { urls: "stun:stun.faktortel.com.au:3478" },
          { urls: "stun:stun.freecall.com:3478" },
          { urls: "stun:stun.freeswitch.org:3478" },
          { urls: "stun:stun.freevoipdeal.com:3478" },
          { urls: "stun:stun.gmx.de:3478" },
          { urls: "stun:stun.gmx.net:3478" },
          { urls: "stun:stun.halonet.pl:3478" },
          { urls: "stun:stun.hoiio.com:3478" },
          { urls: "stun:stun.hosteurope.de:3478" },
          { urls: "stun:stun.infra.net:3478" },
          { urls: "stun:stun.internetcalls.com:3478" },
          { urls: "stun:stun.intervoip.com:3478" },
          { urls: "stun:stun.ipfire.org:3478" },
          { urls: "stun:stun.ippi.fr:3478" },
          { urls: "stun:stun.ipshka.com:3478" },
          { urls: "stun:stun.it1.hr:3478" },
          { urls: "stun:stun.ivao.aero:3478" },
          { urls: "stun:stun.jumblo.com:3478" },
          { urls: "stun:stun.justvoip.com:3478" },
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun.linphone.org:3478" },
          { urls: "stun:stun.liveo.fr:3478" },
          { urls: "stun:stun.lowratevoip.com:3478" },
          { urls: "stun:stun.lundimatin.fr:3478" },
          { urls: "stun:stun.mit.de:3478" },
          { urls: "stun:stun.miwifi.com:3478" },
          { urls: "stun:stun.modulus.gr:3478" },
          { urls: "stun:stun.myvoiptraffic.com:3478" },
          { urls: "stun:stun.netappel.com:3478" },
          { urls: "stun:stun.netgsm.com.tr:3478" },
          { urls: "stun:stun.nfon.net:3478" },
          { urls: "stun:stun.nonoh.net:3478" },
          { urls: "stun:stun.nottingham.ac.uk:3478" },
          { urls: "stun:stun.ooma.com:3478" },
          { urls: "stun:stun.ozekiphone.com:3478" },
          { urls: "stun:stun.pjsip.org:3478" },
          { urls: "stun:stun.poivy.com:3478" },
          { urls: "stun:stun.powervoip.com:3478" },
          { urls: "stun:stun.ppdi.com:3478" },
          { urls: "stun:stun.qq.com:3478" },
          { urls: "stun:stun.rackco.com:3478" },
          { urls: "stun:stun.rockenstein.de:3478" },
          { urls: "stun:stun.rolmail.net:3478" },
          { urls: "stun:stun.rynga.com:3478" },
          { urls: "stun:stun.schlund.de:3478" },
          { urls: "stun:stun.sigmavoip.com:3478" },
          { urls: "stun:stun.sip.us:3478" },
          { urls: "stun:stun.sipdiscount.com:3478" },
          { urls: "stun:stun.sipgate.net:10000" },
          { urls: "stun:stun.sipgate.net:3478" },
          { urls: "stun:stun.siplogin.de:3478" },
          { urls: "stun:stun.sipnet.net:3478" },
          { urls: "stun:stun.sipnet.ru:3478" },
          { urls: "stun:stun.sippeer.dk:3478" },
          { urls: "stun:stun.siptraffic.com:3478" },
          { urls: "stun:stun.sma.de:3478" },
          { urls: "stun:stun.smartvoip.com:3478" },
          { urls: "stun:stun.smsdiscount.com:3478" },
          { urls: "stun:stun.solcon.nl:3478" },
          { urls: "stun:stun.solnet.ch:3478" },
          { urls: "stun:stun.sonetel.com:3478" },
          { urls: "stun:stun.sonetel.net:3478" },
          { urls: "stun:stun.sovtest.ru:3478" },
          { urls: "stun:stun.srce.hr:3478" },
          { urls: "stun:stun.stunprotocol.org:3478" },
          { urls: "stun:stun.t-online.de:3478" },
          { urls: "stun:stun.tel.lu:3478" },
          { urls: "stun:stun.telbo.com:3478" },
          { urls: "stun:stun.tng.de:3478" },
          { urls: "stun:stun.twt.it:3478" },
          { urls: "stun:stun.uls.co.za:3478" },
          { urls: "stun:stun.unseen.is:3478" },
          { urls: "stun:stun.usfamily.net:3478" },
          { urls: "stun:stun.viva.gr:3478" },
          { urls: "stun:stun.vivox.com:3478" },
          { urls: "stun:stun.vo.lu:3478" },
          { urls: "stun:stun.voicetrading.com:3478" },
          { urls: "stun:stun.voip.aebc.com:3478" },
          { urls: "stun:stun.voip.blackberry.com:3478" },
          { urls: "stun:stun.voip.eutelia.it:3478" },
          { urls: "stun:stun.voipblast.com:3478" },
          { urls: "stun:stun.voipbuster.com:3478" },
          { urls: "stun:stun.voipbusterpro.com:3478" },
          { urls: "stun:stun.voipcheap.co.uk:3478" },
          { urls: "stun:stun.voipcheap.com:3478" },
          { urls: "stun:stun.voipgain.com:3478" },
          { urls: "stun:stun.voipgate.com:3478" },
          { urls: "stun:stun.voipinfocenter.com:3478" },
          { urls: "stun:stun.voipplanet.nl:3478" },
          { urls: "stun:stun.voippro.com:3478" },
          { urls: "stun:stun.voipraider.com:3478" },
          { urls: "stun:stun.voipstunt.com:3478" },
          { urls: "stun:stun.voipwise.com:3478" },
          { urls: "stun:stun.voipzoom.com:3478" },
          { urls: "stun:stun.voys.nl:3478" },
          { urls: "stun:stun.voztele.com:3478" },
          { urls: "stun:stun.webcalldirect.com:3478" },
          { urls: "stun:stun.wifirst.net:3478" },
          { urls: "stun:stun.xtratelecom.es:3478" },
          { urls: "stun:stun.zadarma.com:3478" },
          { urls: "stun:stun1.faktortel.com.au:3478" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun.nextcloud.com:443" },
          { urls: "stun:relay.webwormhole.io:3478" },
        ],
      },
    });

    console.log("Call user");
    peer.current.on("signal", (data) => {
      socket.current.emit("callerSignal", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });
    socket.current.emit("callUser", { userToCall: id, from: yourID });

    peer.current.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.current.on("connect", () => {
      toast.info("Connected");
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setRemoteUserId(id);
      peer.current.signal(signal);
      setCallButtonDisability(true);
      console.log("accepted");
      setCallingPermission(false);
    });

    peer.current.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!");
      }
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);

      socket.current.removeListener("callAccepted");
      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });

    socket.current.on("callEnded", () => {
      // peer.current.destroy("Call ended");
      setRemoteUserId("");
      setCallAccepted(false);
      setCallButtonDisability(false);

      socket.current.removeListener("callAccepted");
      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });

    socket.current.on("error", (error) => {
      peer.current.destroy(error.message);
    });
  }

  function acceptCall() {
    incommingCallAudio.pause();
    incommingCallAudio.currentTime = 0;
    setCallAccepted(true);
    setReceivingCall(false);
    setCallButtonDisability(true);
    // setCaller(false);

    peer.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      reconnectTimer: true,
    });

    peer.current.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: remoteUserId });
    });

    peer.current.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.current.signal(callerSignal);

    peer.current.on("connect", () => {
      toast.info("Connected");
    });

    peer.current.on("error", (error) => {
      console.log(error);
      if (error !== "Call ended") {
        alert("Connection error or client closed webpage!");
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
      // peer.current.destroy("Call ended");
      setCallAccepted(false);
      setCaller("");
      setRemoteUserId("");
      setCallerSignal();
      setCallButtonDisability(false);

      socket.current.removeListener("videoStatusChange");
      socket.current.removeListener("audioStatusChange");
    });
  }

  function endCall(key) {
    socket.current.emit("endCall", { id: remoteUserId });
    peer.current.destroy("Call ended");
  }

  function giveCallPermission(id) {
    socket.current.emit("giveCallPermission", { from: yourID, to: id });
  }

  function toggleVideo() {
    startUserMediaLoadingTimeout(1000);

    if (screenShareStatus) {
      toggleScreenShare();
    }

    setTimeout(() => {
      const oldTrack = stream.getVideoTracks()[0];

      if (oldTrack.readyState === "ended") {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: cameraMode } })
          .then((newStream) => {
            const newTrack = newStream.getVideoTracks()[0];
            stream.removeTrack(oldTrack);
            stream.addTrack(newTrack);
            setVideoStatus(true);
            if (callAccepted) {
              peer.current.replaceTrack(oldTrack, newTrack, stream);
            }
          });
      } else if (oldTrack.readyState === "live") {
        oldTrack.stop();
        setVideoStatus(false);

        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, oldTrack, stream);
        }
      }
    }, 500);
  }

  function toggleScreenShare() {
    startUserMediaLoadingTimeout(1000);

    if (videoStatus) {
      toggleVideo();
    }

    setTimeout(() => {
      const oldScreenTrack = stream.getVideoTracks()[0];

      if (oldScreenTrack.readyState === "ended") {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((newStream) => {
            const newTrack = newStream.getVideoTracks()[0];
            stream.removeTrack(oldScreenTrack);
            stream.addTrack(newTrack);
            setScreenShareStatus(true);
            if (callAccepted) {
              peer.current.replaceTrack(oldScreenTrack, newTrack, stream);
            }
            stream.getVideoTracks()[0].addEventListener("ended", () => {
              setScreenShareStatus(false);
            });
          });
      } else if (oldScreenTrack.readyState === "live") {
        oldScreenTrack.stop();
        setScreenShareStatus(false);

        if (callAccepted) {
          peer.current.replaceTrack(oldScreenTrack, oldScreenTrack, stream);
        }
      }
    }, 500);
  }

  function toggleAudio() {
    startUserMediaLoadingTimeout(400);

    const oldTrack = stream.getAudioTracks()[0];

    if (oldTrack.readyState === "ended") {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((newStream) => {
        const newTrack = newStream.getAudioTracks()[0];
        stream.removeTrack(oldTrack);
        stream.addTrack(newTrack);
        setAudioStatus(true);
        if (callAccepted) {
          peer.current.replaceTrack(oldTrack, newTrack, stream);
        }
      });
    } else if (oldTrack.readyState === "live") {
      oldTrack.stop();
      setAudioStatus(false);

      if (callAccepted) {
        peer.current.replaceTrack(oldTrack, oldTrack, stream);
      }
    }
  }

  // function toggleCamera() {
  //   startUserMediaLoadingTimeout(1700);
  //   const newCameraMode = cameraMode === 'user' ? 'environment' : 'user';
  //   const oldTrack = stream.getVideoTracks()[0];
  //   oldTrack.stop()
  //   navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraMode } }).then(newStream => {
  //     const newTrack = newStream.getVideoTracks()[0]
  //     stream.removeTrack(oldTrack)
  //     stream.addTrack(newTrack)
  //     setVideoStatus(true);
  //     if (callAccepted) {
  //       peer.current.replaceTrack(oldTrack, newTrack, stream);
  //     }
  //   })
  //   setCameraMode(newCameraMode)
  // }

  const startUserMediaLoadingTimeout = (milisec) => {
    setUserMediaLoading(true);
    setTimeout(() => {
      setUserMediaLoading(false);
    }, milisec);
  };

  function changeName(event) {
    event.preventDefault();
    const name = event.target.name.value;
    let alreadyTaken = false;
    Object.keys(users).forEach((key) => {
      if (key !== yourID) {
        if (name === users[key]) {
          alreadyTaken = true;
        }
      }
    });
    if (alreadyTaken) {
      toast.error("name already taken!");
      return;
    } else {
      socket.current.emit("changeName", { name });
    }
  }

  const changeNameInput = (
    <Form onSubmit={changeName}>
      <Form.Group controlId="name">
        <Form.Label>Change Display name</Form.Label>

        <Form.Control type="text" placeholder="Enter name" />
      </Form.Group>
      <Button variant="primary" type="submit" size="sm">
        <small>Change Name</small>
      </Button>
    </Form>
  );

  let UserVideo;
  let CallUserList;
  let callFaculty;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
    // if (users[yourID] === "professor") {
    CallUserList = Object.keys(users).map((key) => {
      if (key === yourID) {
        return null;
      }
      return (
        <>
          {/* <Button
            variant="primary"
            onClick={() => callPeer(key)}
            disabled={callButtonDisability}
            style={{ margin: 5 }}
          >
            Call {users[key]}
          </Button> */}
          <Button
            variant="success"
            onClick={() => giveCallPermission(key)}
            disabled={callButtonDisability}
            style={{ margin: 5 }}
          >
            give Permission to {users[key]}
          </Button>
        </>
      );
    });
    // } else
    if (callingPermission) {
      callFaculty = (
        <Button
          variant="primary"
          onClick={() => callPeer(callingPermission)}
          disabled={callButtonDisability}
          style={{ margin: 5 }}
        >
          Call {users[callingPermission]}
        </Button>
      );
    }
  }

  let PartnerVideo;
  let endCallButton;

  if (callAccepted) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
    endCallButton = (
      <div className="endCallButton">
        <Button variant="danger" onClick={() => endCall()}>
          End Call
        </Button>
      </div>
    );
  }

  let ToggleMediaButtons;
  const videobutton = videoStatus ? "success" : "danger";
  const audiobutton = audioStatus ? "success" : "danger";
  const screenSharebutton = screenShareStatus ? "success" : "danger";
  const videoIcon = videoStatus ? (
    <CameraVideo size={20} />
  ) : (
    <CameraVideoOff size={20} />
  );
  const audioIcon = audioStatus ? <Mic size={20} /> : <MicMute size={20} />;
  const screenShareIcon = <ArrowBarUp size={20} />;
  const mediaButtonDisable = !callAccepted;
  ToggleMediaButtons = (
    <Row className="justify-content-md-center">
      <Button
        variant={videobutton}
        onClick={toggleVideo}
        style={{ margin: 5 }}
        disabled={mediaButtonDisable}
      >
        {" "}
        {videoIcon}{" "}
      </Button>
      <Button
        variant={audiobutton}
        onClick={toggleAudio}
        style={{ margin: 5 }}
        disabled={mediaButtonDisable}
      >
        {" "}
        {audioIcon}{" "}
      </Button>
      <Button
        variant={screenSharebutton}
        onClick={toggleScreenShare}
        style={{ margin: 5 }}
        disabled={mediaButtonDisable}
      >
        {" "}
        {screenShareIcon}{" "}
      </Button>
      {/* {videoStatus &&
        <Button onClick={toggleCamera} style={{ margin: 5 }} disabled={mediaButtonDisable}> <ArrowRepeat /> </Button>
      } */}
    </Row>
  );

  let professorOnline;
  if (users[yourID] !== "professor") {
    Object.keys(users).forEach((key) => {
      if (key !== yourID) {
        if (users[key] === "professor") {
          professorOnline = "Professor online";
        }
      }
    });
  }

  let incommintCall;
  if (receivingCall && users[remoteUserId] && callerSignal) {
    incommingCallAudio.play();

    incommintCall = (
      <div className="incommingCall">
        <Card
          className="text-center"
          style={{ background: "black", color: "white" }}
        >
          <Card.Header>
            <h2>{caller} is calling you</h2>
          </Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>
            <Container>
              <Row>
                <Col>
                  <Button size="lg" variant="danger" onClick={() => {}}>
                    Reject
                  </Button>
                </Col>
                <Col>
                  <Button size="lg" variant="success" onClick={acceptCall}>
                    Accept
                  </Button>
                </Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  } else {
    incommingCallAudio.pause();
    incommingCallAudio.currentTime = 0;
  }

  return (
    <>
      {/* ABSOLUTE POSITIONED components  */}
      {incommintCall}
      {PartnerVideo}
      <div className="userElements">
        {UserVideo}
        {ToggleMediaButtons}
      </div>
      <div className="userElementsLoadingBox" hidden={!userMediaLoading}>
        <div className="userElementsLoading">
          <LoadingTailSpin />
        </div>
      </div>

      {endCallButton}

      {/* DEFAULT POSITIONED components  */}
      <Container style={{ color: "white" }} fluid>
        <Row>
          {CallUserList} {callFaculty}
        </Row>
        <Row>
          <Col>
            <h4>You: {users[yourID]}</h4>
            {changeNameInput}
            {/* <Row style={{ color: "green", fontWeight: "bold" }}>
              {professorOnline}
            </Row> */}
          </Col>
        </Row>
        <ToastContainer autoClose={2000} />
      </Container>
    </>
  );
}

export default App;
