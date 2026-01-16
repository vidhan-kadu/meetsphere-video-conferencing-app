import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import "../App.css";

export default function GuestJoinComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleJoinAsGuest = () => {
    const code = meetingCode.trim();
    if (!code) {
      alert("Please enter a meeting code");
      return;
    }

    // Navigate to the video meeting room
    navigate(`/room/${code}`);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Join Meeting as Guest
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter the meeting code to join
        </Typography>

        <Box sx={{ mt: 1, width: "100%" }}>
          <TextField
            fullWidth
            label="Meeting Code"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            variant="outlined"
            margin="normal"
            placeholder="Enter meeting code"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleJoinAsGuest();
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleJoinAsGuest}
            sx={{ mt: 2, mb: 2 }}
          >
            Join Meeting
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{ mt: 1 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
