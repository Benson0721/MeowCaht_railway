export default function inviteHandler(socket, io, userSocketMap) {
  socket.on("send group invite", (chatroom, sender, targetUser_id) => {
    const targetSocketId = userSocketMap.get(targetUser_id);
    if (!targetSocketId) return;
    io.to(targetSocketId).emit(
      "send group invite",
      chatroom,
      sender,
      targetUser_id
    );
  });

  socket.on("invite accepted", (chatroom, targetUser_id) => {
    io.emit("invite accepted", chatroom, targetUser_id);
  });
}
