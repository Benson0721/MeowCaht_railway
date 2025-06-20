import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

export default function wsServer(app) {
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  app.use(cors());

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    // console.log("a user connected:", userId);
    io.emit("user-status-online", userId);

    socket.on("join room", (room_id) => {
      //console.log("join room: " + room_id);
      socket.join(room_id);
    });

    socket.on("leave room", (room_id) => {
      // console.log("leave room: " + room_id);
      socket.leave(room_id);
    });

    socket.on("chat message", (msg, room_id) => {
      io.to(room_id).emit("chat message", msg);
    });

    socket.on("update message", (message_id, user_id) => {
      //console.log("update message: " + message_id);
      io.emit("update message", message_id, user_id);
    });

    socket.on("update unread", (chatroom_id) => {
      // console.log("update unread: " + chatroom_id);
      io.emit("update unread", chatroom_id);
    });

    socket.on("send group invite", (chatroom, sender, targetUser_id) => {
      /* console.log(
      "send group invite: " +
        chatroom.name +
        "from" +
        sender.username +
        "to" +
        targetUser_id
    );*/
      io.emit("send group invite", chatroom, sender, targetUser_id);
    });

    socket.on("invite accepted", (chatroom_id, targetUser_id) => {
      console.log("invite accepted: " + chatroom_id);
      io.emit("invite accepted", chatroom_id, targetUser_id);
    });

    socket.on("update last_read_time", (chatroom_id, user_id) => {
      // console.log("我有接收到!!!");
      //console.log("update last_read_time: " + chatroom_id);
      //console.log("user_id: " + user_id);
      io.emit("update last_read_time", chatroom_id, user_id);
    });
    socket.on("disconnect", () => {
      io.emit("user-status-offline", userId);
      //console.log("user disconnected", userId);
    });
  });

  server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
  });
}
