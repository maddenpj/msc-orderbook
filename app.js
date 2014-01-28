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
// app.use(require('app-trie-router')(app))
app.use(views('./templates', 'jade'));


app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));

//listen port
server.listen(3001);
app.listen(3000);


io.sockets.on('connection', function(socket) {
  console.log('connected');

  socket.on("news", function() {
    console.log("ASD");
  });
});
