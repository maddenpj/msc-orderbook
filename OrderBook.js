var EventEmitter = require('events').EventEmitter;
var MXOrderScraper = require('./MXOrderScraper.js');

function BookEntry(price, size) {
  this.price = price;
  this.size = size;
  this.bookSum = 0;
}

BookEntry.prototype.update = function(other) {
  this.size += other.size;
}

function compareOrdersAsc(a,b) {
  if(a.price < b.price) return -1;
  if(a.price > b.price) return 1;
  return 0;
}

function aggregateBuys(book) {
  var len = book.length;
  book[len-1].bookSum = book[len-1].size
  for(var i = len - 2; i >= 0; i--) {
    book[i].bookSum = book[i+1].bookSum + book[i].size;
  }
  return book;
}

function aggregateSells(book) {
  book[0].bookSum = book[0].size;
  for(var i = 1; i < book.length; i++) {
    book[i].bookSum = book[i-1].bookSum + book[i].size;
  }
  return book;
}

function OrderBook(source) {
  this.eps = 0.001;

  var self = this;
  source.on("buys", function(orders) {
    var buyBook = aggregateBuys(self.aggregateBook(orders));
    self.emit("buys", buyBook);
  });
  source.on("sells", function(orders) {
    var sellBook = aggregateSells(self.aggregateBook(orders));
    self.emit("sells", sellBook);
  });
}
OrderBook.prototype = Object.create(EventEmitter.prototype);


OrderBook.prototype.aggregateBook = function(orders) {
  orders.sort(compareOrdersAsc);
  var book = [];
  if(orders.length == 0) return book;

  var i = 0;
  var order = orders[i];
  var be = new BookEntry(order.price, order.size);
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
        be = new BookEntry(order.price, order.size);
      }
    }
  }
  return book;
}


module.exports = OrderBook;
