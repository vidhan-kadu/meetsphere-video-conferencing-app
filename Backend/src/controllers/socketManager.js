import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const messages = {};

export const connectToSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://meetspherefrontend-no4f.onrender.com",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  if (process.env.REDIS_URL) {
    try {
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      io.adapter(createAdapter(pubClient, subClient));
      console.log("Redis adapter connected for Socket.IO");
    } catch (err) {
      console.warn("Redis adapter setup failed, using in-memory adapter:", err.message);
    }
  }

  io.on("connection", (socket) => {
    console.log("CONNECTED:", socket.id);

    socket.on("join-call", (roomId) => {
      console.log(`Socket ${socket.id} joining room: ${roomId}`);
      socket.join(roomId);

      const clients = Array.from(
        io.sockets.adapter.rooms.get(roomId) || []
      );

      console.log(`Room ${roomId} now has ${clients.length} clients:`, clients);

      clients.forEach((id) => {
        if (id !== socket.id) {
          console.log(`Notifying ${id} about new user ${socket.id}`);
          io.to(id).emit("user-joined", socket.id, clients);
        }
      });

      if (messages[roomId]) {
        messages[roomId].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg.socketId
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const rooms = [...socket.rooms].filter((r) => r !== socket.id);
      const roomId = rooms[0];
      if (!roomId) return;

      if (!messages[roomId]) messages[roomId] = [];
      messages[roomId].push({ sender, data, socketId: socket.id });

      io.to(roomId).emit("chat-message", data, sender, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("DISCONNECTED:", socket.id);

      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-left", socket.id);
      });
    });
  });
};
