var EventEmitter = require('events').EventEmitter;
var OrderScraper = require('./OrderScraper.js');

function BookEntry(price, size, bitcoin) {
  this.price = price;
  this.size = size;
  this.bitcoin = bitcoin;
  this.bookSum = 0;
}

BookEntry.prototype.update = function(other) {
  this.size += other.size;
  this.bitcoin += other.bitcoin;
}

function OrderBook(source) {
  this.eps = 0.0001;

  var self = this;
  source.on("update", function(orders) {
    var book = self.aggregateBook(orders);
    self.emit("update", book);
  });
}
OrderBook.prototype = Object.create(EventEmitter.prototype);


function compareOrders(a,b) {
  if(a.price < b.price) return -1;
  if(a.price > b.price) return 1;
  return 0;
}

OrderBook.prototype.aggregateBook = function(orders) {
  orders.sort(compareOrders);
  var book = [];
  if(orders.length == 0) return book;

  var i = 0;
  var order = orders[i];
  var be = new BookEntry(order.price, order.size, order.bitcoin);
  while(true) {
    if((i+1) >= orders.length) {
      book.push(be);
      break;
    } else {
      i++;
      next = orders[i];
      if(next.price - order.price < this.eps) {
        be.update(next);
      } else {
        book.push(be);
        order = next;
        be = new BookEntry(order.price, order.size, order.bitcoin);
      }
    }
  }
  book[0].bookSum = orders[0].bitcoin;
  for(var i = 1; i < book.length; i++) {
    book[i].bookSum = book[i-1].bookSum + book[i].bitcoin;
  }
  return book;
}

module.exports = OrderBook;


var os = new OrderScraper(10000, 10);
os.start();
os.on("update", function (b) { console.log(b.length) });
// var ob = new OrderBook(os);
// ob.on("update", function(json) {
//   console.log(json);
// });

