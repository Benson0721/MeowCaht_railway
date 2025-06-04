import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
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
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
