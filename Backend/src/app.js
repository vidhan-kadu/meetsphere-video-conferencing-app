import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(
  cors({
    origin: "https://meetspherefrontend-no4f.onrender.com",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// API routes
app.use("/api/v1/users", userRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "Frontend/dist")));

//Express 5 SAFE fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist", "index.html"));
});

// socket
connectToSocket(server);

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  } catch (err) {
    console.error("Mongo connection failed", err.message);
    process.exit(1);
  }
};

start();