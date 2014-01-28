$(function() {

  var socket = io.connect("http://localhost:3001");

  socket.on("book-update", function(book) {
    console.log(book);
    $("#book").html("");
    for(var i = 0; i < book.length; i++) {
      var entry = book[i];
      $("#book").append(entry.price + " TMSC/BTC " +
                        entry.size + " TMSC available " +
                        entry.bitcoin + " BTC desired " +
                        entry.bookSum + " Total BTC <br/>")
    }
  });
});
