import string
import random
import json
from order_book import OrderBook
from orders import SellOrder

id = 0

def random_address():
  return ''.join([random.choice(string.ascii_uppercase) for x in range(32)])

def generate_sell(size, bitcoins):
  global id
  id = id + 1
  return SellOrder(id, random_address(), size, bitcoins)

json = json.load(open("./all_offers.json"))

raw_orders = []

ob = OrderBook()
for order in json:
  print order["amount"], order["amount_desired"]
  msc = float(order["amount"])
  btc = float(order["amount_desired"])

  if(msc > 0.0 and btc > 0.0):
    ob.place_sell_order(generate_sell(float(order["amount"]), float(order["amount_desired"])))

#ob = OrderBook()
#
#ob.place_sell_order(generate_sell(100, 1.0))
#ob.place_sell_order(generate_sell(100, 1.2))
#ob.place_sell_order(generate_sell(100, 1.201))
#ob.place_sell_order(generate_sell(50, 1.0))
#ob.place_sell_order(generate_sell(200, 1.4))
#
#so = ob.aggregate_sell_orders()
#
#for x in so:
#  print str(x)
#
b = ob.accumulate_book()

print "\n\n"
print "price\tsize\tbtc\tsum"
for x in b:
  print ("%.6f" % x.price), "\t", ("%.6f" % x.size), "\t", ("%.6f" % x.volume), "\t", x.book_sum

print "\n\n"

for x in ob.aggregate_sell_orders():
  print str(x)
