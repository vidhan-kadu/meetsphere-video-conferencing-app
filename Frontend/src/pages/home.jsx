import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory, handleLogout } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return; // Don't join without a code
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleJoinVideoCall();
  };

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo/10 rounded-full blur-3xl" />

      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-display font-bold tracking-tight cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <span className="gradient-text">Meet</span>
            <span className="text-white">Sphere</span>
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/history")}
              className="btn-ghost text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              History
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-sm text-red-400 border border-red-500/20 rounded-xl
                         hover:bg-red-500/10 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              You're logged in
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-4">
              Start or Join a <span className="gradient-text">Video Call</span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Enter a meeting code to join an existing call, or create your own
              room and share the code.
            </p>

            <div className="glass-card p-6 max-w-lg mx-auto lg:mx-0 animate-fadeIn animation-delay-200">
              <label
                htmlFor="meeting-code"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Meeting Code
              </label>
              <div className="flex gap-3">
                <input
                  id="meeting-code"
                  type="text"
                  placeholder="Enter meeting code..."
                  className="input-field flex-1"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleJoinVideoCall}
                  className="btn-primary whitespace-nowrap flex items-center gap-2"
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Join
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-lg mx-auto lg:mx-0 animate-fadeIn animation-delay-300">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Create a Room</p>
                  <p>Type any unique code and share it with others</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-indigo-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Secure Calls</p>
                  <p>All calls are peer-to-peer encrypted via WebRTC</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center animate-fadeIn animation-delay-200">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo/20 rounded-3xl blur-3xl scale-110 opacity-20" />
              <img
                src="/logo.png"
                alt="MeetSphere video conferencing illustration"
                className="relative z-10 w-full max-w-sm lg:max-w-md rounded-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// redirects to /auth if not logged in//

export default withAuth(HomeComponent);
