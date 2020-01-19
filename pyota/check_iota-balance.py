import iota
import json
from pprint import pprint

# Seed for the webserver. 
seedReceiver = 'NHDMTKGDGXXFGVIWMQG9SXBTLOTGUZPRUFVQIBCYRKXWOJKCPLSPIYSBT9VSAHKXBEKBYFXGUBDBNNWZL'

# Devnet node to connect to Tangle network
devnetNode = "https://nodes.devnet.iota.org:443"

# Initializing api
api = iota.Iota(devnetNode, seed = seedReceiver)

senderBalance = api.get_account_data(start = 0, stop = None)

for key, value in senderBalance.items():
    if key == 'addresses' or key == 'bundles':
        for i in range(len(value)):
            value[i] = str(value[i])

senderBalance_json = json.dumps(senderBalance)