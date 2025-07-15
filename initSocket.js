import { Server } from "socket.io";
import inviteHandler from "./socketHandler/inviteHandler.js";
import chatHandler from "./socketHandler/chatHandler.js";
import roomHandler from "./socketHandler/roomHandler.js";
import connectHandler from "./socketHandler/connectHandler.js";
export default function initSocket(server) {
  const io = new Server(server, {
    pingInterval: 5000,
    pingTimeout: 60000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 60000,
    cors: {
      origin: ["https://meow-chat-vercel.vercel.app", "http://localhost:5173"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    userSocketMap?.set(userId, { socketId: socket.id, status: "online" });
    connectHandler(socket, userId, userSocketMap);

    inviteHandler(socket, io, userSocketMap);

    chatHandler(socket, io);

    roomHandler(socket, io);
  });
}
