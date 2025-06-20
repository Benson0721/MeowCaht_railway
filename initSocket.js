import { Server } from "socket.io";

export default function initSocket(server) {
  const io = new Server(server, {
    pingInterval: 5000,
    pingTimeout: 60000,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    cors: {
      origin: ["https://meow-chat-vercel.vercel.app", "http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    io.emit("user-status-online", userId);

    socket.on("join room", (room_id) => {
      socket.join(room_id);
    });

    socket.on("leave room", (room_id) => {
      socket.leave(room_id);
    });

    socket.on("chat message", (msg, room_id) => {
      io.to(room_id).emit("chat message", msg);
    });

    socket.on("update message", (message_id, user_id) => {
      io.emit("update message", message_id, user_id);
    });

    socket.on("update unread", (chatroom_id) => {
      io.emit("update unread", chatroom_id);
    });

    socket.on("send group invite", (chatroom, sender, targetUser_id) => {
      io.emit("send group invite", chatroom, sender, targetUser_id);
    });

    socket.on("invite accepted", (chatroom_id, targetUser_id) => {
      io.emit("invite accepted", chatroom_id, targetUser_id);
    });

    socket.on("update last_read_time", (chatroom_id, user_id) => {
      io.emit("update last_read_time", chatroom_id, user_id);
    });
    socket.on("disconnect", () => {
      io.emit("user-status-offline", userId);
    });
  });
}
