import iota
from pprint import pprint

# Sender's side
# Sender's seed
seedSender = b"IYKIDVTZJEDOO9SMKSIALDTSXBYKIL99SOGRZSIN9QPEDWZNVKWXHQQCGOKTQWRZFEIJ9BNSKUBBLQAYA"

# Receiver's side
# Recipient's seed
seedReceiver = b"NHDMTKGDGXXFGVIWMQG9SXBTLOTGUZPRUFVQIBCYRKXWOJKCPLSPIYSBT9VSAHKXBEKBYFXGUBDBNNWZL"

# Define an address to which to send IOTA tokens 
addressReceiver = b"BGNNNVGFPQZWKCFZJAOIAYRJBODEWFVDRWALOQZZEUHPKAFWTQPMBCIAPSCSVIWOSTYICTNCZDGRIXHGC"

# Define an address where the IOTA tokens comes from
addressSender = b"OIQTF9DGHMDPIDCAFGNBB9I9OVWDRNXKDSEBHVBHBKFFEVFMWSQZYDCJIBRHTUBMVEGARQDTIOAFVUDD"


# Devnet node to connect to Tangle
devnetNode = "https://nodes.devnet.iota.org:443"

print("Seed, Devnet node and address initialized")

# Set-up the api
api = iota.Iota(devnetNode, seed = seedSender, testnet = True)

# Now let's find a first unused address that can be used as a destination address for unspent/new tokens

print("\nPlease note, this may take some time if many addresses has been used already...")
# Let's generate an address using default security level=2.
freeAddressSender = api.get_new_addresses(index=0, count=None, security_level=2) 

print("\nThis is the first unused address that can be used for new tokens or unspent tokens:")
pprint(freeAddressSender)

# Define an input transaction object that sends 1 i to the address
tx1 = iota.ProposedTransaction(address = iota.Address(addressReceiver), message = None, tag = iota.Tag(b'HRIBEK999IOTA999TOTORIAL'), value = 1)


# Sending IOTA tokens
print("Sending iotas .... please wait ...")

sentBundle = api.send_transfer(depth=3, transfers=[tx1], inputs=None, change_address=None, min_weight_magnitude=9, security_level=2)

print("\nIt has been sent. Now let's see transactions that were sent:")
# let's check transactions that were sent in fact

print("Here is the bundle hash: %s" % (sentBundle['bundle'].hash))
for tx in sentBundle['bundle']:
    print("\n")
    pprint(vars(tx))
