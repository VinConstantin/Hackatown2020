

export const sendTransaction = (value)=>{
    // Sender's side
    // Sender's seed
    var fs = require('browserify-fs');

    let price = parseInt(value)
    var seedSender = "IYKIDVTZJEDOO9SMKSIALDTSXBYKIL99SOGRZSIN9QPEDWZNVKWXHQQCGOKTQWRZFEIJ9BNSKUBBLQAYA"

    // Webserver address to receive IOTA tokens
    var addressReceiver = "BGNNNVGFPQZWKCFZJAOIAYRJBODEWFVDRWALOQZZEUHPKAFWTQPMBCIAPSCSVIWOSTYICTNCZDGRIXHGC"

    // Set-up the Devnet Node to access the Tangle
    var devnetNode = "https://nodes.devnet.iota.org:443"

    console.log("Seed, address and Devnet Node initialized")

    var iotalib= require('@iota/core');
    var newAddress;
    var iota = iotalib.composeAPI({'provider': devnetNode});

    console.log("Please note, this may take some time if many addresses have been used already...");

    //please note the index below starts from 29 to save some time. If you woudl like to start from beginning it should be 0
    var promise = iota.getNewAddress(seedSender, { index: 10, total: null} ) //If null is specified, then it identifies a first non-used address
                    .then(address => {
                        console.log("This is the first unused address that can be used for new tokens or unspent tokens:");
                        console.log(address); //returned addresses are printed out    
                        newAddress = address;

                        
                    })
                    .catch(error => {
                        console.log("Something went wrong: %s", error);
                    });

    // Prepare the transaction with the value and custom tag
    var tx1 = {
        'address': addressReceiver, //81 trytes long address
        'value': price,    
        'tag': 'HRIBEK999IOTA999TUTORIAL' //Up to 27 trytes
    };

    // Sending the iotas
    console.log("\nSending iotas... Please wait...");

    var promise = iota.prepareTransfers(seedSender, [tx1]) //let's prepare a bundle first. If you do not add any other options then everything is taken care by library
    .then(trytes => {
        console.log("Bundle was created. Sending it...")
        return iota.sendTrytes(trytes,
                                3, //trytes
                                9) // MWM; in case of Devnet it is 9
    })
    .then(response => {
        console.log("It has been sent. Now let's see all transaction(s) that were sent:");
        let balance = response[3].value;

        console.log("new adresse : " + balance);
        console.log(response);

        fs.writeFile("./address.json", response[3].address, (err) => {
            if (err) {
                console.error("File error : "+ err);
                return;
            };
            console.log("File has been created");
        });
        window.dashboard.updateBalance(balance);

        //add sql
        //addToSQL(price, newAddress, addressReceiver)
    })
    .catch(err=>{
        console.log("Something went wrong: %s", err);
    })
}
export function getBalance(){
    var fs = require('browserify-fs');
    // Set-up the Devnet Node to access the Tangle
    var devnetNode = "https://nodes.devnet.iota.org:443"

    console.log("Seed, address and Devnet Node initialized")

    var iotalib= require('@iota/core');
    var iota = iotalib.composeAPI({'provider': devnetNode});
    var address;
    
    console.log("first")
    fs.readFile("./address.json", (err, address) => {
        if (err) {
            //throw err;
        }
        address = address.toString("utf8");
        console.log(address)

        address = "BGNNNVGFPQZWKCFZJAOIAYRJBODEWFVDRWALOQZZEUHPKAFWTQPMBCIAPSCSVIWOSTYICTNCZDGRIXHGC"
        iota.getBalances([address], 50)
        .then(({ balance }) => {
            console.log(balance)
            window.dashboard.updateBalance(parseInt(balance));
            
            // ...
        })
        .catch(err => {
            // ...
            console.log(err)
        })
    })
}
function addToSQL(amount, newAddress, receiverAddress){
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host     : 'sql9.freesqldatabase.com',
        user     : 'sql9319637',
        password : 'sDuuqmlqIZ',
        database : 'sql9319637'
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO 'transactions' ( id', 'date', 'newAddress', 'amount', 'receiverAddress')
        VALUES (NULL, ${new Date()}, '${newAddress}', '${amount}', '${receiverAddress}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
}