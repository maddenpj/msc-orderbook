function SellOrder(size,  price) {
  this.size = size;
  this.price = price;
}

function BuyOrder(size,  price) {
  this.size = size;
  this.price = price;
}

module.exports = { SellOrder: SellOrder, BuyOrder: BuyOrder }
