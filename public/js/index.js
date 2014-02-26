$(function() {

  var socket = io.connect("http://localhost:3001");

  socket.on("book-update-buys", function(buys) {
    console.log(buys);
  });

  socket.on("book-update-sells", function(sells) {
    console.log(sells);
  });
});
