import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import axios from "axios";
const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const join = path.join;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("a user connected:", userId);
  io.emit("user-status-online", userId);

  socket.on("join room", (room_id) => {
    console.log("join room: " + room_id);
    socket.join(room_id);
  });

  socket.on("leave room", (room_id) => {
    console.log("leave room: " + room_id);
    socket.leave(room_id);
  });

  socket.on("chat message", (msg, room_id) => {
    io.to(room_id).emit("chat message", msg);
  });

  socket.on("update message", (message_id, user_id) => {
    console.log("update message: " + message_id);
    io.emit("update message", message_id, user_id);
  });

  socket.on("disconnect", () => {
    io.emit("user-status-offline", userId);
    console.log("user disconnected", userId);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
