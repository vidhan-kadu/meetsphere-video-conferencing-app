import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

import withAuth from "../utils/withAuth";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

function HomeComponent() {
  const navigate = useNavigate();
  const { addToUserHistory } = useContext(AuthContext);

  const [meetingCode, setMeetingCode] = useState("");

  const handleJoinVideoCall = async () => {
    const code = meetingCode.trim();
    if (!code) return;

    try {
      await addToUserHistory(code);
    } catch (err) {
      console.error("History save failed:", err);
    }

    navigate(`/room/${code}`);
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>MeetSphere</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <h2>Providing Quality Video Call Just Like Quality Education</h2>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <TextField
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              label="Meeting Code"
              variant="outlined"
            />

            <Button variant="contained" onClick={handleJoinVideoCall}>
              Join
            </Button>
          </div>
        </div>

        <div className="rightPanel">
          <img src="/logo.png" alt="MeetSphere" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent)