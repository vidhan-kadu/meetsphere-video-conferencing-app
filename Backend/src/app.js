import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  res.json({ hello: "World" });
});

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGO_URL);
   

    server.listen(app.get("port"), () => {
      console.log("Connected to the DB");
    });
  } catch (err) {
    console.error("Mongo connection failed ", err.message);
    process.exit(1);
  }
};

start();