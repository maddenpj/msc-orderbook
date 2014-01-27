
class BookEntry:
  def __init__(self, price, size, volume):
    self.price = price
    self.size = size
    self.volume = volume
    self.book_sum = 0

  def update(self, order):
    self.size += order.size
    self.volume += order.bitcoins_desired

  def __str__(self):
    return " ".join([str(self.price),
      str(self.size),
      str(self.volume),
      str(self.book_sum)])


class OrderBook:
  def __init__(self):
    self.bids = []
    self.offers = []
    self.eps = 0.00000001

  def place_sell_order(self, order):
    self.offers.append(order)

  def place_buy_order(self, order):
    self.bids.append(order)

  def aggregate_sell_orders(self):
    sorted_list = sorted(self.offers, key=lambda order: order.price)
    return sorted_list

  def accumulate_book(self):
    sorted_list = self.aggregate_sell_orders()
    book = []

    if len(sorted_list) == 0:
      return book

    i = 0
    order = sorted_list[i]
    be = BookEntry(order.price, order.size, order.bitcoins_desired)
    while True:
      if (i+1) >= len(sorted_list):
        book.append(be)
        break
      else:
        i += 1
        next_order = sorted_list[i]
        if next_order.price - order.price < self.eps:
          be.update(next_order)
        else:
          book.append(be)
          order = next_order
          be = BookEntry(order.price, order.size, order.bitcoins_desired)

    book[0].book_sum = sorted_list[0].bitcoins_desired
    for i in xrange(1, len(book)):
      book[i].book_sum = book[i-1].book_sum + book[i].volume

    return book




