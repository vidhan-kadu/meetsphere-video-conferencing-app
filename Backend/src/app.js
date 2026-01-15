import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "https://meetspherefrontend-no4f.onrender.com",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);


app.get("/", (req, res) => {
  res.send("MeetSphere Backend Running 🚀");
});

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
    console.error(err.message);
    process.exit(1);
  }
};

start();