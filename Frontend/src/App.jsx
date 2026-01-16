import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import HomeComponent from "./pages/home";
import History from "./pages/history";
import VideoMeetComponent from "./pages/VideoMeet";
import GuestJoinComponent from "./pages/guestJoin";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<HomeComponent />} />
          <Route path="/history" element={<History />} />
          <Route path="/guest-join" element={<GuestJoinComponent />} />
          <Route path="/room/:roomId" element={<VideoMeetComponent />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
