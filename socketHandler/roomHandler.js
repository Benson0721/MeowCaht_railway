export default function roomHandler(socket, io) {
  socket.on("join room", (room_id) => {
    //console.log("join room", room_id);
    socket.join(room_id);
  });

  socket.on("leave room", (room_id) => {
    //console.log("leave room", room_id);
    socket.leave(room_id);
  });
}
