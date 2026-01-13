import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://meetspherefrontend-no4f.onrender.com",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED", socket.id);

    socket.on("join-call", (roomId) => {
      console.log("Join call:", roomId, socket.id);
      socket.join(roomId);

      if (!connections[roomId]) connections[roomId] = [];
      if (!connections[roomId].includes(socket.id)) {
        connections[roomId].push(socket.id);
      }

      timeOnline[socket.id] = new Date();

      // connections[path].forEach(elem => {
      //     io.to(elem)
      // })

      connections[roomId].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[roomId]);
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
      let roomId = null;

      for (const [key, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          roomId = key;
          break;
        }
      }

      if (!roomId) return;

      if (!messages[roomId]) messages[roomId] = [];

      messages[roomId].push({ sender, data, socketId: socket.id });

      connections[roomId].forEach((id) => {
        io.to(id).emit("chat-message", data, sender, socket.id);
      });
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [roomId, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          connections[roomId] = users.filter((id) => id !== socket.id);

          connections[roomId].forEach((id) => {
            io.to(id).emit("user-left", socket.id);
          });

          if (connections[roomId].length === 0) {
            delete connections[roomId];
            delete messages[roomId];
          }
          break;
        }
      }
      delete timeOnline[socket.id];
    });
  });
};
