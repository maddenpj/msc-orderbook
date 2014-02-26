var http = require("https");
var SellOrder = require('./Order.js').SellOrder;
var BuyOrder = require('./Order.js').BuyOrder;
var EventEmitter = require('events').EventEmitter;

function MXOrderScraper(period, pages) {
  this.url = "https://masterxchange.com";
  this.uri = "/api/orderbook.php";
  this.period = period;
}
MXOrderScraper.prototype = Object.create(EventEmitter.prototype);

MXOrderScraper.prototype.start = function() {
  var self = this;
  var emitter = function () {
      self.scrape(function(orders) {
        cleaned = self.cleanOrders(orders);
        self.emit("buys", cleaned.buys);
        self.emit("sells", cleaned.sells);
    })
  }
  emitter();
  setInterval(emitter, this.period);
}

MXOrderScraper.prototype.scrape = function (cb) {
  var self = this;
  var url = this.url + this.uri;
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

MXOrderScraper.prototype.cleanOrders = function(orders) {
  var cleaned  = {
    buys : [],
    sells : []
  };
  for(var i = 0; i < orders.length; i++) {
    var order = orders[i];
    if(order.type == "sell") {
      var sellOrder = new SellOrder(parseFloat(order.amount), parseFloat(order.price));
      cleaned.sells.push(sellOrder);
    } else if(order.type == "buy") {
      var buyOrder = new BuyOrder(parseFloat(order.amount), parseFloat(order.price));
      cleaned.buys.push(buyOrder);
    }
  }
  return cleaned;
}

module.exports = MXOrderScraper;
