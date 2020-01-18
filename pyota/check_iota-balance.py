import iota
from pprint import pprint

# Seed for the webserver. 
seedSender = 'NHDMTKGDGXXFGVIWMQG9SXBTLOTGUZPRUFVQIBCYRKXWOJKCPLSPIYSBT9VSAHKXBEKBYFXGUBDBNNWZL'

# Devnet node to connect to Tangle network
devnetNode = "https://nodes.devnet.iota.org:443"

# Initializing api
api = iota.Iota(devnetNode, seed = seedSender)

print("Checking for total balance. This may take some time...")

senderBalance = api.get_account_data(start = 0, stop = None)

print("It may take a while if there are multiple addresses")
pprint(senderBalance)

print("The balance of IOTA tokens in the webserver is : " + str(senderBalance['balance']))