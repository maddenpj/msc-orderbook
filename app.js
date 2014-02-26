var serve = require('koa-static');
var compress = require('koa-compress');
var logger = require('koa-logger');
var views = require('koa-render');
var router = require('koa-route');
var koa = require('koa');
var app = koa();
var server = require('http').Server(app.callback());
var io = require('socket.io').listen(server);

var MXOrderScraper = require('./MXOrderScraper.js')
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

var eps = 0.001;
var scraper = new MXOrderScraper(15*60000);
scraper.start();

var book = new OrderBook(scraper, eps);

var lastBuys = []
book.on("buys", function(book) {
  console.log("got buys");
  io.sockets.emit("book-update-buys", book);
  lastBuys = book;
});
var lastSells = []
book.on("sells", function(book) {
  console.log("got sells");
  io.sockets.emit("book-update-sells", book);
  lastSells = book;
});


io.sockets.on('connection', function(socket) {
  console.log('connected');
  socket.emit("book-update-buys", lastBuys);
  socket.emit("book-update-sells", lastSells);
});
