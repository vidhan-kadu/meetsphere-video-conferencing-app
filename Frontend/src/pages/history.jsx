import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // If there's an error, meetings stays empty → shows empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format time
  let formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-display font-bold tracking-tight cursor-pointer"
            onClick={() => routeTo("/home")}
          >
            <span className="gradient-text">Meet</span>
            <span className="text-white">Sphere</span>
          </h1>

          <button
            onClick={() => routeTo("/home")}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-10 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Meeting <span className="gradient-text">History</span>
          </h2>
          <p className="text-gray-400">Your past meetings and call records.</p>
        </div>

        {/* STATE 1: LOADING */}
        {isLoading ? (
          <div className="space-y-4 animate-fadeIn">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-surface-300/50 rounded w-1/3 mb-3" />
                <div className="h-3 bg-surface-300/30 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          /* STATE 2: EMPTY — No meetings found */
          <div className="glass-card p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-surface-200 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Meetings Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Your meeting history will appear here once you join or create your
              first video call.
            </p>
            <button onClick={() => routeTo("/home")} className="btn-primary">
              Start Your First Call
            </button>
          </div>
        ) : (
          /* STATE 3: DATA — Show meeting cards */
          <div className="space-y-4">
            {meetings.map((meeting, index) => (
              <div
                key={index}
                className="glass-card p-5 flex items-center justify-between
                           hover:border-accent/30 hover:-translate-y-0.5
                           transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
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

                  <div>
                    <p className="text-white font-semibold">
                      {meeting.meetingCode}
                    </p>
                    {/* Date and time */}
                    <p className="text-gray-500 text-sm flex items-center gap-2 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(meeting.date)}
                      {" · "}
                      {formatTime(meeting.date)}
                    </p>
                  </div>
                </div>

                {/*  Rejoin button */}
                <button
                  onClick={() => routeTo(`/${meeting.meetingCode}`)}
                  className="btn-ghost text-sm hidden sm:inline-flex items-center gap-1.5"
                >
                  Rejoin
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
