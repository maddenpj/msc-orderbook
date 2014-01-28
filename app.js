var serve = require('koa-static');
var compress = require('koa-compress');
var logger = require('koa-logger');
var views = require('koa-render');
var router = require('koa-route');
var koa = require('koa');
var app = koa();
var server = require('http').Server(app.callback());
var io = require('socket.io').listen(server);

var OrderScraper = require('./OrderScraper.js')
var OrderBook = require('./OrderBook.js')


app.use(logger());
app.use(compress());
app.use(serve('./public'));
app.use(views('./templates', 'jade'));


app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));

//listen port
server.listen(3001);
app.listen(3000);


var scraper = new OrderScraper(60000, 10);
scraper.start();

var lastBook = []
var book = new OrderBook(scraper);
book.on("update", function(book) {
  console.log("got new book");
  io.sockets.emit("book-update", book);
  lastBook = book;
});


io.sockets.on('connection', function(socket) {
  console.log('connected');
  socket.emit("book-update", lastBook);
});
