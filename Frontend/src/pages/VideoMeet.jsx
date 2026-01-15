import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Avatar,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Badge,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import styles from "../styles/videoComponent.module.css";
import { useNavigate } from "react-router-dom";

const server_url = import.meta.env.VITE_BACKEND_URL;

const perrConfigConnection = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
    const { roomId } = useParams();
  var socketRef = useRef();
  let socketIdRef = useRef();
  const connectionsRef = useRef({});
  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState(false);

  let [audio, setAudio] = useState(false);

  let [screen, setScreen] = useState(false);

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  // const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  let routeTo = useNavigate();

  //   TODO
  // if(isChrome()=== false){

  // }

  // const connectToSocket = () => {
  //   socketRef.current = io("http://localhost:8000");

  //   socketRef.current.on("connect", () => {
  //     console.log("CONNECTED TO SOCKET SERVER", socketRef.current.id);
  //     socketIdRef.current = socketRef.current.id;
  //   });
  // };

  const getPermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const hasVideo = devices.some((d) => d.kind === "videoinput");
      const hasAudio = devices.some((d) => d.kind === "audioinput");

      setVideoAvailable(hasVideo);
      setAudioAvailable(hasAudio);

      if (!hasVideo && !hasAudio) {
        console.error("No camera or microphone found");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: hasVideo, // false if no camera
        audio: hasAudio, // true if mic exists
      });

      window.localStream = stream;

      // Attach stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      console.log("Stream started:", {
        video: hasVideo,
        audio: hasAudio,
      });
      // if (navigator.mediaDevices.getDisplayMedia) {
      //   setScreenAvailable(true);
      // } else {
      //   setScreenAvailable(false);
      // }

      // if (videoAvailable || audioAvailable) {
      //   const userMediaStream = await navigator.mediaDevices.getUserMedia({
      //     video: hasVideo,
      //     audio: hasAudio,
      //   });

      //   if (userMediaStream) {
      //     window.localStream = userMediaStream;
      //     if (localVideoRef.current) {
      //       localVideoRef.current.srcObject = userMediaStream; //intialize the stream  it's javascript object
      //     }
      //   }
      // }
    } catch (err) {
      console.error("Media permission error:", err.name, err.message);
    }
  };
  const startAudioOnly = async () => {
    try {
      // stop existing tracks
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      window.localStream = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setVideoAvailable(false);
      setAudioAvailable(true);
    } catch (err) {
      console.error("Audio-only error:", err);
    }
  };

useEffect(() => {
  if (!roomId) return;
  getPermissions();
}, [roomId]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected on unmount");
      }
    };
  }, []);

  let getUserMediaSuccess = (stream) => {
    // try {
    //   window.localStream.getTracks().forEach((track) => track.stop());
    // } catch (e) {
    //   console.log(e);
    // }

    window.localStream = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // localVideoRef.current.srcObject = stream;

    // for (let id in connectionsRef.current ) {
    //   if (id === socketIdRef.current) continue;          //temporray for black screeen error
    ////////////////////////////
    //       window.localStream.getTracks().forEach(track => {
    //   connectionsRef.current [id].addTrack(track, window.localStream);
    // });

    //     connectionsRef.current [id].createOffer().then((offer) => {
    //   connectionsRef.current [id].setLocalDescription(offer).then(() => {
    //     socketRef.current.emit(
    //       "signal",
    //       id,
    //       JSON.stringify({ sdp: connectionsRef.current [id].localDescription })
    //     );
    //   });
    // });

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          //
          try {
            const tracks = localVideoRef.current.srcObject?.getTracks();
            tracks?.forEach((t) => t.stop());
          } catch {}

          //BlackSilence
          // let blackSlience = (...args) =>
          //   new MediaStream([black(...args), silence()]);
          // window.localStream = blackSlience();

          // if (localVideoRef.current) {
          //   localVideoRef.current.srcObject = window.localStream;
          // }

          //         for (let id in connectionsRef.current ) {
          //            window.localStream.getTracks().forEach(track => {
          //   connectionsRef.current [id].addTrack(track, window.localStream);
          // });
          //          const offer =  connectionsRef.current [id].createOffer();
          //   connectionsRef.current [id].setLocalDescription(offer);
          //                 socketRef.current.emit(
          //                   "signal",
          //                   id,
          //                   JSON.stringify({ sdp: connectionsRef.current [id].localDescription })
          //                 );

          //               // .catch((e) => console.log(e));

          //         }
          //remove just after workig vvide screen share
          // {         if (localVideoRef.current) {
          //   localVideoRef.current.srcObject = stream;

          //   const cameraTrack = stream.getVideoTracks()[0];

          //   for(let id in connectionsRef.current ){
          //     const sender = connectionsRef.current [id]
          //     .getSender()
          //     .find(s=> s.track && s.track.kind === "video");

          //     if(sender){
          //       sender.replaceTrack(cameraTrack);

          //     }
          //   }
          // }
          // }
        })
    );
  };
  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = async () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess) //TODO: getUserMediaSuccess
        // .then((stream) => {})                                                     //temporary for black screen error
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia(); //temorary for black screen error
    }
  }, [audio, video]);

  const gotMessageFromServer = (fromId, message) => {
    
   const signal = JSON.parse(message);

   if (fromId === socketIdRef.current) return;

  const pc = connectionsRef.current[fromId];
  if (!pc) return;

  if (signal.sdp) {
    pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      .then(() => {
        if (signal.sdp.type === "offer") {
          pc.createAnswer()
            .then((answer) => pc.setLocalDescription(answer))
            .then(() => {
              socketRef.current.emit(
                "signal",
                fromId,
                JSON.stringify({ sdp: pc.localDescription })
              );
            });
        }
      })
      .catch(console.error);
    };
    
  if (signal.ice) {
    pc.addIceCandidate(new RTCIceCandidate(signal.ice))
      .catch(console.error);
  
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevMessages) => prevMessages + 1);
    }
  };

// ================= SOCKET HELPERS =================

const handleUserLeft = (id) => {
  if (connectionsRef.current[id]) {
    connectionsRef.current[id].close();
    delete connectionsRef.current[id];
  }

  setVideos((prev) => prev.filter((v) => v.socketId !== id));
};

const handleUserJoined = (id, clients) => {
  clients.forEach((socketListId) => {
    if (socketListId === socketIdRef.current) return;
    if (connectionsRef.current[socketListId]) return;

    const pc = new RTCPeerConnection(perrConfigConnection);
    connectionsRef.current[socketListId] = pc;

    if (window.localStream) {
  window.localStream.getTracks().forEach((track) => {
    pc.addTrack(track, window.localStream);
  });
}


    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit(
          "signal",
          socketListId,
          JSON.stringify({ ice: event.candidate })
        );
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setVideos((prev) => {
  if (prev.find(v => v.socketId === socketListId)) return prev;
  return [...prev, { socketId: socketListId, stream }];
});

    };
  });
};


const connectToSocket = () => {
  if (socketRef.current?.connected) return;

  socketRef.current = io(server_url, {
    transports: ["websocket"],
    withCredentials: true,
  });

socketRef.current.off();

  socketRef.current.on("signal", gotMessageFromServer);

  socketRef.current.on("connect", () => {
    socketIdRef.current = socketRef.current.id;

    if (!roomId) {
      console.error("Room ID missing");
      return;
    }

socketRef.current.emit("join-call", roomId); 


    socketRef.current.on("chat-message", addMessage);
    socketRef.current.on("user-left", handleUserLeft);
    socketRef.current.on("user-joined", handleUserJoined);
  });
};

     
  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocket();
  };

  let sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}

    routeTo("/home");
  };

  let getDisplayMediaSuccess = async (stream) => {
    console.log("Screen share started");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    const screenTrack = stream.getVideoTracks()[0];

    for (let id in connectionsRef.current) {
      const sender = connectionsRef.current[id]
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
      }
    }
    screenTrack.onended = async () => {
      try {
        console.log("Screen Share ended,resoring camera");
        setScreen(false);
      } catch (err) {
        console.log("failed to resolve camera", err);
      }
    };

    // getUserMedia();

    //   if(id === socketIdRef.current)continue;

    //   connectionsRef.current [id].addStream (window.localStream)
    //   connectionsRef.current [id].createOffer().then((description)=> [
    //     connectionsRef.current [id].setLocalDescription(description)
    //     .then(()=>{
    //       socketRef.current.emit("signal",id ,JSON.stringify({"sdp": connectionsRef.current [id].localDescription}))
    //     })
    //     .catch(e => console.log(e))
    // ])
    // }  stream.getTracks().forEach(
    // (track) =>
    //   (track.onended = () => {
    //   setScreen(false);
    //     //
    //     try {
    //       const tracks = localVideoRef.current.srcObject?.getTracks();
    //       tracks?.forEach((t) => t.stop());
    //     } catch (e){console.log(e)}

    //     getUserMedia();
  };
  let getDisplayMedia = () => {
    if (!screen) return;
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(getDisplayMediaSuccess)

      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = async () => {
    console.log("Screen button clicked.Current state:", screen);
    if (screen && window.localStream) {
      console.log("stopping screen share manually");

      window.localStream.getTracks().forEach((t) => t.stop());
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: audioAvailable,
      });

      window.localStream = camStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = camStream;
      }
      const camTrack = camStream.getVideoTracks()[0];

      for (let id in connectionsRef.current) {
        const sender = connectionsRef.current[id]
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender) sender.replaceTrack(camTrack);
      }
    }

    setScreen((prev) => !prev);
  };
  return (
    <div>
      {askForUsername === true ? (
        <div>
          {messages.length > 0};<h2> Enter into Lobby </h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={() => {
              getMedia();
              setAskForUsername(false);
            }}
          >
            Connect
          </Button>
          <Button onClick={startAudioOnly} variant="contained">
            Join with Audio
          </Button>
          <div>
            <video ref={localVideoRef} autoPlay muted playsInline></video>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal ? (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <h1>Chat</h1>

                <div className={styles.chattingDisplay}>
                  {messages.length > 0 ? (
                    messages.map((item, index) => {
                      return (
                        <div
                          className={`${styles.messageRow} ${
                            item.sender === username
                              ? styles.myMessage
                              : styles.otherMessage
                          }`}
                          style={{ marginBottom: "20px" }}
                          key={index}
                        >
                          <div className={styles.messageBubble}>
                            <p
                              className={styles.sender}
                              style={{ fontWeight: "bold" }}
                            >
                              {" "}
                              {item.sender}
                            </p>
                            <p>{item.data}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p> No Messages Yet</p>
                  )}
                </div>

                <div className={styles.chattingArea}>
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Enter Your Chat"
                    variant="outlined"
                  />
                  <Button variant="contained" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge badgeContent={newMessages} max={999} color="secondary">
              <IconButton
                onClick={() => setModal(!showModal)}
                style={{ color: "white" }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          {/* local video */}
          <div className={styles.videoWrapper}>
            <video
              className={styles.meetUserVideo}
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              // style={{ width: "300px" }}
            />
          </div>

          {/* remote videos */}
          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <div key={video.socketId}>
                {/* <h2>{video.socketId}</h2> */}

                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream && ref.srcObject !== video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  // style={{ width: "300px" }}
                  // className={styles.meetUserVideo}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}