var SellOrder = require('./Order.js');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function TestOrderSource(period, file) {
  this.period = period;
  this.file = file || "./test_data/all_offers.20140128.json"
}
TestOrderSource.prototype = Object.create(EventEmitter.prototype);

TestOrderSource.prototype.start = function() {
  var book = this.cleanOrders(JSON.parse(fs.readFileSync(this.file)))
  var self = this;
  self.emit("update", book)
  setInterval(function() {
    self.emit("update", book)
  }, this.period);
}

TestOrderSource.prototype.cleanOrders = function(orders) {
  cleaned = [];
  for(var i = 0; i < orders.length; i++) {
    var order = orders[i];
    if(order.amount_desired == 0) continue;
    var sellOrder = new SellOrder(order.tx_id, order.address, order.amount, order.amount_desired);
    cleaned.push(sellOrder);
  }
  return cleaned;
}

module.exports = TestOrderSource;
