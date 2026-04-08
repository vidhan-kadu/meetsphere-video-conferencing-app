import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router("/home");
    }
  }, []);

  const generateDemoRoom = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo/20 rounded-full blur-3xl opacity-20" />

      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold tracking-tight">
            <span className="gradient-text">Meet</span>
            <span className="text-white">Sphere</span>
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router(`/${generateDemoRoom()}`)}
              className="btn-ghost text-sm"
            >
              Join as Guest
            </button>

            <button
              onClick={() => router("/auth")}
              className="btn-ghost text-sm hidden sm:inline-flex"
            >
              Register
            </button>

            <button
              onClick={() => router("/auth")}
              className="btn-primary text-sm"
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Secure Peer-to-Peer Meetings
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6 animate-fadeIn animation-delay-100">
              <span className="gradient-text">Connect</span> with your{" "}
              <br className="hidden md:block" />
              loved ones
            </h2>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 animate-fadeIn animation-delay-200">
              Crystal-clear video calls powered by WebRTC. No downloads, no
              signups required — just click and connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeIn animation-delay-300">
              <Link
                to="/auth"
                className="btn-primary text-center text-lg px-8 py-4 animate-pulse-glow"
              >
                Get Started — It's Free
              </Link>
              <button
                onClick={() => router(`/${generateDemoRoom()}`)}
                className="btn-ghost text-center text-lg px-8 py-4"
              >
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-gray-500 animate-fadeIn animation-delay-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                No Sign-up Required
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                End-to-End Encrypted
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center animate-fadeIn animation-delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-3xl scale-110 opacity-30" />
              <img
                src="/mobile.png"
                alt="MeetSphere video conferencing app preview"
                className="relative z-10 w-full max-w-md lg:max-w-lg animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:border-accent/30">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent"
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
            </div>
            <h3 className="text-lg font-semibold mb-2">HD Video Calls</h3>
            <p className="text-gray-400 text-sm">
              Crystal-clear video powered by WebRTC with adaptive quality based
              on your connection.
            </p>
          </div>

          <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:border-indigo/30">
            <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Chat</h3>
            <p className="text-gray-400 text-sm">
              Send messages during your calls with our integrated Socket.IO
              powered chat system.
            </p>
          </div>

          <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:border-accent/30">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Screen Sharing</h3>
            <p className="text-gray-400 text-sm">
              Share your screen with one click. Perfect for presentations,
              demos, and collaboration.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} MeetSphere. Built with React, WebRTC &
            Socket.IO
          </p>
        </div>
      </footer>
    </div>
  );
}
