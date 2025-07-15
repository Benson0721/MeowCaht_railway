export default function chatHandler(socket, io) {
  socket.on("chat message", (msg, room_id, callback) => {
    try {
      io.to(room_id).emit("chat message", msg, room_id);
      callback({ status: "ok" });
    } catch (err) {
      callback({
        status: "error",
        error: "failed to send message, please try again.",
      });
    }
  });

  socket.on("update message", (message_id, user_id) => {
    io.emit("update message", message_id, user_id);
  });

  socket.on("update unread", (chatroom_id) => {
    io.emit("update unread", chatroom_id);
  });
  socket.on("update last_read_time", (chatroom_id, user_id) => {
    io.to(chatroom_id).emit("update last_read_time", chatroom_id, user_id);
  });
  socket.on("update read count", (messages, chatroom) => {
    io.to(chatroom?._id).emit("update read count", messages, chatroom);
  });
}
