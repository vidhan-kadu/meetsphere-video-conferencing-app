import * as React from "react";

import {
  Avatar,
  Button,
  ButtonGroup,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a",
      paper: "#020617",
    },
  },
});

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);

  const [open, setOpen] = React.useState(false);


  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        let result = await handleLogin(username,password);
        console.log(result);
        
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage(result);
        setOpen(true);
        setError("")
        setFormState(0)
        setPassword("")
      }
    } catch (err) {
    console.log(err);
      let message = err?.response?.data?.message || err?.message||
      "something went wrong";
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* BACKGROUND IMAGE */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg,rgba(2,6,23,0.58), rgba(2,6,23,0.90)), url('/background2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* SIGN IN CARD */}
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <ButtonGroup
              fullWidth
              sx={{
                mb: 2,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Button
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setFormState(0)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Sign In
              </Button>

              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Sign Up
              </Button>
            </ButtonGroup>

            {/* <Typography variant="h4" sx={{ mb: 2 }}>
              Sign in
            </Typography> */}

            {formState === 1 ? (
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                required
                id="username"
                name="username"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <></>
            )}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              required
              id="username"
              name="username"
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              name="password"
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              sx={{ alignSelf: "flex-start", mt: 1 }}
            /> */}
            <p style={{ color: "red" }}>{error}</p>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.2 }}
              onClick={handleAuth}
            >
              {formState === 0 ? "Login" : "Register"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Don&apos;t have an account? Sign up
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
