var serve = require('koa-static');
var compress = require('koa-compress');
var logger = require('koa-logger');
var views = require('koa-render');
var router = require('koa-route');
var koa = require('koa');
var app = koa();
// var server = require('http').Server(koa.callback());
// var io = require('socket.io').listen(server);


app.use(logger());
app.use(compress());
app.use(serve('./public'));
// app.use(require('app-trie-router')(app))
app.use(views('./templates', 'jade'));


app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));


// //backend API
// app.get('/transactions', function* (next) {
//   //gets all mastercoin transactions
// });
// 
// app.get('/balance', function* (next) {
//   //gets balance in MSC of a particular address
// });
// 
// app.get('/mastercoin/verify/addresses',function* (next) {
//   // expect this.qs = { currency_id: 1 }
// 
// });
// app.get('/mastercoin/verify/transactions', function* (next) {
//   // expect this.qs = { address: x, currency_id: 1 }
// });

//listen port
app.listen(3000);

// io.on('connection', function(socket) { console.log('connected'); });
