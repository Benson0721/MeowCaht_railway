export default function connectHandler(socket, userId, userSocketMap) {
  let hasLoggedOut = false;
  socket.on("ping", () => {
    console.log("I am alive");
  });

  socket.on("user online", () => {
    console.log("user online", userId);
    userSocketMap.get(userId).status = "online";
    const currentState = "online";
    socket.broadcast.emit("user-status-online", userId, currentState);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    if (!hasLoggedOut) {
      console.log("user is away", userId);
      userSocketMap.get(userId).status = "away";
      const currentState = "away";
      socket.broadcast.emit("user-status-away", userId, currentState);
    }
  });
  socket.on("logout", () => {
    console.log("user logged out", userId);
    hasLoggedOut = true;
    userSocketMap.get(userId).status = "offline";
    console.log("userSocketMap", userSocketMap);
    const currentState = "offline";
    socket.broadcast.emit("user-status-offline", userId, currentState);
    //setTimeout(() => userSocketMap.delete(userId), 5000);
  });
}
