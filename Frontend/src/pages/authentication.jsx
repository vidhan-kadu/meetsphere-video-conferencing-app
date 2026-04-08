import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const router = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  let handleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      if (formState === 0) {
        let result = await handleLogin(username, password);
        console.log(result);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage(result);
        setError("");
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      let message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAuth();
  };

  return (
    // FULL SCREEN CONTAINER

    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo/20 rounded-full blur-3xl opacity-20" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/background2.jpg')" }}
      />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        <div className="glass-card p-8">
          <div className="relative text-center mb-8">
            <button
              onClick={() => router("/")}
              className="absolute left-0 top-1.5 text-gray-400 hover:text-white transition-colors"
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

            <h1
              onClick={() => router("/")}
              className="text-3xl font-display font-bold cursor-pointer hover:opacity-80 transition-opacity inline-block"
              title="Return to home page"
            >
              <span className="gradient-text">Meet</span>
              <span className="text-white">Sphere</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {formState === 0
                ? "Welcome back! Sign in to continue."
                : "Create your account to get started."}
            </p>
          </div>

          <div className="flex bg-surface-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setFormState(0)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                formState === 0
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setFormState(1)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                formState === 1
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {/* Full Name field — only visible when registering */}
            {formState === 1 && (
              <div className="animate-fadeIn">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
            )}

            {/* Username field */}
            <div>
              <label
                htmlFor="auth-username"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Username
              </label>
              <input
                id="auth-username"
                type="text"
                placeholder="Enter your username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="auth-password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-fadeIn">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2 animate-fadeIn">
              <svg
                className="w-5 h-5 flex-shrink-0"
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
              {message}
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={isLoading}
            className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                {/* CSS-only spinner — no external library needed */}
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </>
            ) : formState === 0 ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          {/* TOGGLE LINK */}
          <p className="text-center text-gray-500 text-sm mt-6">
            {formState === 0 ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setFormState(1)}
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setFormState(0)}
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
