import httplib
import json

url = "mastercoin-explorer.com"
uri = "/api/v1/selling_offers.json?page="


total_data = []

conn = httplib.HTTPConnection(url)
for i in xrange(1, 10):
  conn.request("GET", uri+str(i))
  r1 = conn.getresponse()
  data = r1.read()
  parsed = json.loads(data)

  total_data = total_data + parsed

print total_data

with open('all_offers.json', 'w') as outfile:
  json.dump(total_data, outfile)
