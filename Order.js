function SellOrder(txid, address, size, bitcoins) {
  this.txid = txid;
  this.address = address;
  this.size = parseFloat(size);
  this.bitcoin = parseFloat(bitcoins);
  this.price = bitcoins / size;
}

module.exports = SellOrder;
