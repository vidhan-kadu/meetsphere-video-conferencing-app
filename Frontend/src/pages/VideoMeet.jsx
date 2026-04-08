import React, { useEffect, useRef, useState } from "react";
import "webrtc-adapter";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

const server_url = import.meta.env.VITE_BACKEND_URL;
const connections = {};

const perrConfigConnection = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();
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
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);
  let routeTo = useNavigate();

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
        video: hasVideo,
        audio: hasAudio,
      });
      window.localStream = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);
      console.log("Stream started:", { video: hasVideo, audio: hasAudio });
    } catch (err) {
      console.error("Media permission error:", err.name, err.message);
    }
  };

  const startAudioOnly = async () => {
    try {
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
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    window.localStream = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);
          try {
            const tracks = localVideoRef.current.srcObject?.getTracks();
            tracks?.forEach((t) => t.stop());
          } catch {}
        }),
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
        .then(getUserMediaSuccess)
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
      getUserMedia();
    }
  }, [audio, video]);

  const gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const connectToSocket = () => {
    socketRef.current = io(server_url, { transports: ["websocket"] });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      // console.log("CONNECTED TO SOCKET SERVER", socketRef.current.id);

      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", window.location.href);
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((prev) =>
          Array.isArray(prev) ? prev.filter((v) => v.socketId !== id) : [],
        );
      });
      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (socketListId === socketIdRef.current) return;
          connections[socketListId] = new RTCPeerConnection(
            perrConfigConnection,
          );
          if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
              const senders = connections[socketListId].getSenders();
              const alreadyAdded = senders.some(
                (sender) => sender.track && sender.track.id === track.id,
              );
              if (!alreadyAdded) {
                connections[socketListId].addTrack(track, window.localStream);
              }
            });
          }
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };
          connections[socketListId].ontrack = (event) => {
            const stream = event.streams[0];
            setVideos((prev) => {
              const existing = prev.find((v) => v.socketId === socketListId);
              if (existing) {
                return prev.map((v) =>
                  v.socketId === socketListId ? { ...v, stream } : v,
                );
              }
              return [...prev, { socketId: socketListId, stream }];
            });
          };
        });
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;
            connections[id2].createOffer().then((offer) => {
              connections[id2].setLocalDescription(offer).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription }),
                );
              });
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocket();
  };

  let sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let handleVideo = () => setVideo(!video);
  let handleAudio = () => setAudio(!audio);

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}

    // UX FIX: If the user is logged in, return to Dashboard.
    // If they are a guest (Watch Demo), return to Landing Page block so they don't hit an auth error.
    if (localStorage.getItem("token")) {
      routeTo("/home");
    } else {
      routeTo("/");
    }
  };

  let getDisplayMediaSuccess = async (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
    const screenTrack = stream.getVideoTracks()[0];
    for (let id in connections) {
      const sender = connections[id]
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);
    }
    screenTrack.onended = async () => {
      try {
        setScreen(false);
      } catch (err) {
        console.log("failed to restore camera", err);
      }
    };
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
    if (screen && window.localStream) {
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
      for (let id in connections) {
        const sender = connections[id]
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(camTrack);
      }
    }
    setScreen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-surface">
      {askForUsername === true ? (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo/20 rounded-full blur-3xl opacity-20" />

          <div className="relative z-10 w-full max-w-lg mx-4 animate-fadeIn">
            <div className="glass-card p-8">
              <div className="relative text-center mb-6">
                <button
                  onClick={() =>
                    localStorage.getItem("token")
                      ? routeTo("/home")
                      : routeTo("/")
                  }
                  className="absolute left-0 top-1 text-gray-400 hover:text-white transition-colors"
                  title="Go back"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>

                {/* Clickable Logo */}
                <h1
                  className="text-2xl font-display font-bold cursor-pointer hover:opacity-80 transition-opacity inline-block"
                  onClick={() =>
                    localStorage.getItem("token")
                      ? routeTo("/home")
                      : routeTo("/")
                  }
                  title="Return to Home"
                >
                  <span className="gradient-text">Meet</span>
                  <span className="text-white">Sphere</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1 block">
                  Set up your camera & mic before joining
                </p>
              </div>

              {/* VIDEO PREVIEW */}
              <div className="relative bg-surface-100 rounded-2xl overflow-hidden mb-6 aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-100/80 to-transparent" />
              </div>

              {/* USERNAME INPUT */}
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Your Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                className="input-field mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && username.trim()) {
                    getMedia();
                    setAskForUsername(false);
                  }
                }}
              />

              {/* JOIN BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!username.trim()) return;
                    getMedia();
                    setAskForUsername(false);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <VideocamIcon style={{ fontSize: 20 }} />
                  Join with Video
                </button>
                <button
                  onClick={() => {
                    if (!username.trim()) return;
                    startAudioOnly();
                    getMedia();
                    setAskForUsername(false);
                  }}
                  className="btn-ghost flex items-center justify-center gap-2"
                >
                  <MicIcon style={{ fontSize: 20 }} />
                  Audio
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 
           IN-CALL SCREEN
         */
        <div className="relative w-screen h-screen bg-surface-100 overflow-hidden">
          {/* REMOTE VIDEOS */}
          <div className="absolute inset-0 p-4 pb-24 flex flex-wrap gap-4 content-center justify-center">
            {videos.length === 0 ? (
              <div className="text-center text-gray-500 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-surface-200 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="font-medium">Waiting for others to join...</p>
                <p className="text-sm mt-1">
                  Share the meeting link to invite participants
                </p>
              </div>
            ) : (
              videos.map((vid) => (
                <div
                  key={vid.socketId}
                  className="relative bg-surface rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    width:
                      videos.length === 1
                        ? "80%"
                        : videos.length <= 4
                          ? "calc(50% - 8px)"
                          : "calc(33% - 8px)",
                    maxHeight: videos.length === 1 ? "70vh" : "45vh",
                  }}
                >
                  <video
                    data-socket={vid.socketId}
                    ref={(ref) => {
                      if (ref && vid.stream && ref.srcObject !== vid.stream) {
                        ref.srcObject = vid.stream;
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-sm text-white">
                    Participant
                  </div>
                </div>
              ))
            )}
          </div>

          {/* LOCAL VIDEO (Picture-in-Picture) */}
          <div className="absolute bottom-24 left-4 z-30 animate-fadeIn">
            <div
              className="relative bg-surface rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ width: "200px", height: "150px" }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-white">
                You
              </div>
            </div>
          </div>

          {/* CHAT PANEL */}
          {showModal && (
            <div
              className="absolute top-0 right-0 bottom-0 w-80 z-40 
                            bg-surface/95 backdrop-blur-xl border-l border-white/10 
                            flex flex-col animate-slideIn"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Chat</h3>
                <button
                  onClick={() => {
                    setModal(false);
                    setNewMessages(0);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((item, index) => (
                    <div
                      key={index}
                      className={`flex ${item.sender === username ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                          item.sender === username
                            ? "bg-accent text-white rounded-br-md"
                            : "bg-surface-200 text-gray-200 rounded-bl-md"
                        }`}
                      >
                        {item.sender !== username && (
                          <p className="text-xs font-semibold text-accent mb-0.5">
                            {item.sender}
                          </p>
                        )}
                        <p>{item.data}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation!</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input-field flex-1 text-sm py-2.5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* CONTROL BAR — Floating pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-2xl">
              <button
                onClick={handleVideo}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${video ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
                title={video ? "Turn off camera" : "Turn on camera"}
              >
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
              </button>
              <button
                onClick={handleAudio}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${audio ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
                title={audio ? "Mute" : "Unmute"}
              >
                {audio ? <MicIcon /> : <MicOffIcon />}
              </button>
              {screenAvailable && (
                <button
                  onClick={handleScreen}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${screen ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-white/10 text-white hover:bg-white/20"}`}
                  title={screen ? "Stop sharing" : "Share screen"}
                >
                  {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                </button>
              )}
              <button
                onClick={() => {
                  setModal(!showModal);
                  if (!showModal) setNewMessages(0);
                }}
                className="relative w-12 h-12 rounded-xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                title="Toggle chat"
              >
                <ChatIcon />
                {newMessages > 0 && !showModal && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {newMessages > 9 ? "9+" : newMessages}
                  </span>
                )}
              </button>
              <div className="w-px h-8 bg-white/10 mx-1" />
              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-xl bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="End call"
              >
                <CallEndIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
