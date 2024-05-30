const TonWeb = require('tonweb');
const { mnemonicToKeyPair } = require("tonweb-mnemonic");

async function sendTons(addressTo, amount) {
    const mnemonic = "school key empty ginger gasp account abuse hundred mango radar disease police more credit lady flame clock turkey science claw coral tunnel spot all".split(" ");
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {}));
    
    const {
        publicKey,
        secretKey
    } = await mnemonicToKeyPair(mnemonic);
    
    const WalletClass = tonweb.wallet.all.v4R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: publicKey,
        wc: 0
    });

    const seqno = (await wallet.methods.seqno().call()) || 0;

    const amountInNano = Math.floor(amount * Math.pow(10, 9));

    const transaction = await wallet.methods.transfer({
        secretKey,
        toAddress: addressTo, //"0QDIKJYGUiCYFQ812jtCHt5Pf2ApvSWPIr0a0gJumg8_x1w_"
        amount: amountInNano,
        seqno: seqno,
        sendMode: 3,
        payload: "TonWeb transaction",
        bounce: false
    }).send();

    console.log(transaction)
    if(transaction) {
        return {success: true}
    }
}

module.exports = sendTons
