var http = require("http");
var SellOrder = require('./Order.js');
var EventEmitter = require('events').EventEmitter;

function OrderScraper(period, pages) {
  this.url = "http://mastercoin-explorer.com";
  this.uri = "/api/v1/selling_offers.json?page=";
  this.period = period;
  this.pages = 10;
}
OrderScraper.prototype = Object.create(EventEmitter.prototype);

OrderScraper.prototype.start = function() {
  var self = this;
  setInterval(function () {
      self.scrape(function(orders) {
        cleaned = self.cleanOrders(orders);
        self.emit("update", cleaned);
    })
  }, this.period);
}

OrderScraper.prototype._scrape = function (curr_page, total_orders, cb) {
  var self = this;
  if(curr_page < this.pages) {
    this.scrape_page(curr_page, function(json) {
        self._scrape(curr_page+1, total_orders.concat(json), cb);
    });
  } else {
    cb(total_orders);
  }
}

OrderScraper.prototype.scrape = function(cb) {
  this._scrape(1, [], cb);
}

OrderScraper.prototype.scrape_page = function(page, cb) {
  var url = this.url + this.uri + page
  http.get(url, function(res) {
    var total_data = "";
    res.on("data", function(chunk) {
      total_data += chunk
    });
    res.on("end", function() {
      var json = JSON.parse(total_data);
      cb(json);
    });
  });
}

OrderScraper.prototype.cleanOrders = function(orders) {
  cleaned = [];
  for(var i = 0; i < orders.length; i++) {
    var order = orders[i];
    if(order.amount_desired == 0) continue;
    var sellOrder = new SellOrder(order.tx_id, order.address, order.amount, order.amount_desired);
    cleaned.push(sellOrder);
  }
  return cleaned;
}

module.exports = OrderScraper;
