
class Order(object):
  def __init__(self, id, address):
    self.id = id
    self.address = address

class SellOrder(Order):
  def __init__(self, id, address, size, bitcoins_desired):
    super(SellOrder, self).__init__(id, address)
    self.currency_id = 1
    self.size = size
    self.bitcoins_desired = bitcoins_desired
    self.price = bitcoins_desired / size
    self.time_limit = 10
    self.minimum_fee = 0

  def __str__(self):
    return "Sell " + str(self.size) + " @ " + str(self.price) + " for " + str(self.bitcoins_desired) + " total"

class BuyOrder(Order):
  def __init__(self):
    self.currency_id = 1
    self.size = 0
    self.sellers_address = 0

