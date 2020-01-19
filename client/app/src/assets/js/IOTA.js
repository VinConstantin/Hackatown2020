var iotalib = require('@iota/core');

export const sendTransaction = (price)=>{
    var usedadr;
    
    const SeedSender = "IYKIDVTZJEDOO9SMKSIALDTSXBYKIL99SOGRZSIN9QPEDWZNVKWXHQQCGOKTQWRZFEIJ9BNSKUBBLQAYA"
    const SeedReceiver = "NHDMTKGDGXXFGVIWMQG9SXBTLOTGUZPRUFVQIBCYRKXWOJKCPLSPIYSBT9VSAHKXBEKBYFXGUBDBNNWZL"

    const AddressReceiver = "BGNNNVGFPQZWKCFZJAOIAYRJBODEWFVDRWALOQZZEUHPKAFWTQPMBCIAPSCSVIWOSTYICTNCZDGRIXHGC"

    const DevnetNode = "https://nodes.devnet.iota.org:443"

    var iota = iotalib.composeAPI({
        'provider': DevnetNode
    });

    var promise = iota.getAccountData(//Get the total available balance for the given seed and all related used addresses
        SeedSender, // Sender's seed - library will do all hard work based on the seed
        {
            "start": 29, // Library will start from the address at index 0. please note I increased it to start from index 29 to save time
            "security": 2 // Default security level
        })
        .then(accountData => {
            usedadr = accountData;
            console.log(accountData);
            if (accountData["balance"]) {
                console.log("\nYes, there are some tokens available! hurray");
                // there are quite usefull info returned - all addresses used plus first unused address. See latestAddress
            }
        })
        .catch(err => {
            console.log("Something went wrong: %s", err);
        })

    promise = iota.getNewAddress(SeedSender, { index: 29, total: null} ) //If null is specified, then it identifies a first non-used address
        .then(address => {
            console.log("This is the first unused address that can be used for new tokens or unspent tokens:");
            console.log(address); //returned addresses are printed out    
        })
        .catch(error => {
            console.log("Something went wrong: %s", error);
        });

    

    // only if there is any used addresses from the previous steps

    if (usedadr['addresses'].length > 0){
        // it returns the balances as a list in the same order as the addresses were provided as input.       
        var promise = iota.getBalances(
                        usedadr['addresses'], // list of addresses
                        100, // Confirmation threshold; official docs recommend to set it to 100
                        )
                        .then(({ balances }) => {
                                console.log("Some positive balance identified. Individual confirmed balances per used addresses:");
                                console.log(balances);
                        })
                        .catch(err => {
                                console.log("Something went wrong: %s", err);
                        })           
    }          
    else
    {
        console.log("\nNo positive balance identified.");
    }

    var tx1 = {
        'address': AddressReceiver, //81 trytes long address
        'value': 1,    
        'tag': 'HRIBEK999IOTA999TUTORIAL' //Up to 27 trytes
    };
    
    // Sending the iotas
    console.log("\nSending iotas... Please wait...");
    
    promise = iota.prepareTransfers(SeedSender, [tx1]) //let's prepare a bundle first. If you do not add any other options then everything is taken care by library
        .then(trytes => {
            console.log("Bundle was created. Sending it...")
            return iota.sendTrytes(trytes,
                                    3, //trytes
                                    9) // MWM; in case of Devnet it is 9
        })
        .then(response => {
            console.log("It has been sent. Now let's see all transaction(s) that were sent:");
            console.log(response);
        })
        .catch(err=>{
            console.log("Something went wrong: %s", err);
        })

}