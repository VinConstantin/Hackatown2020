import iota
import json
from pprint import pprint

# Seed for the webserver. 
seedReceiver = 'NHDMTKGDGXXFGVIWMQG9SXBTLOTGUZPRUFVQIBCYRKXWOJKCPLSPIYSBT9VSAHKXBEKBYFXGUBDBNNWZL'

# Devnet node to connect to Tangle network
devnetNode = "https://nodes.devnet.iota.org:443"

# Initializing api
api = iota.Iota(devnetNode, seed = seedReceiver)

receiverBalance = api.get_balances(addresses=['BGNNNVGFPQZWKCFZJAOIAYRJBODEWFVDRWALOQZZEUHPKAFWTQPMBCIAPSCSVIWOSTYICTNCZDGRIXHGC'], threshold=100)

for key, value in receiverBalance.items():
    if key == 'references':
        for i in range(len(value)):
            value[i] = str(value[i])

receiverBalance_json = json.dumps(receiverBalance)
print(receiverBalance_json)