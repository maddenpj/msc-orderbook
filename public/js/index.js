$(function() {

  var socket = io.connect("http://localhost:3001");
  console.log("connected");
  socket.emit("news");

});
