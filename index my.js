const { getHttpEndpoint } = require("@orbs-network/ton-access")
const { WalletContractV4, TonClient, internal } = require("ton")
const { mnemonicToWalletKey } = require("ton-crypto")


async function main() {
    const mnemonic = "school key empty ginger gasp account abuse hundred mango radar disease police more credit lady flame clock turkey science claw coral tunnel spot all"
    const keys = await mnemonicToWalletKey(mnemonic.split(" "))

    const wallet = WalletContractV4.create({publicKey:keys.publicKey,workchain:0})
    const endpoint = await getHttpEndpoint({network:"testnet"})
    const client = new TonClient({endpoint})
    const clientWallet = client.open(wallet)

    //console.log(await clientWallet.getBalance())

    const seqno = await clientWallet.getSeqno()

    await clientWallet.sendTransfer({
        secretKey:keys.secretKey,
        seqno:seqno,
        messages:[
            internal({
                to:"EQDUwKXiDXnc2AQtDsvYwGllAzmmCY5oP8othEOfQkAzRubL",
                value:"0.001",
                body:"First",
                bounce:false
            })
        ]
    })
    console.log("Successfully")
}

main()







/*

async function main() {
    const mnemonic = "school key empty ginger gasp account abuse hundred mango radar disease police more credit lady flame clock turkey science claw coral tunnel spot all"
    const key = await mnemonicToWalletKey(mnemonic.split(" "))

    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 })

    const endpoint = await getHttpEndpoint({ network: "testnet" })
    const client = new TonClient({ endpoint: endpoint })
    const walletContract = client.open(wallet)
    //const bal = fromNano(await client.getBalance(wallet.address))

    console.log(await walletContract.getBalance())
    const seqno = await walletContract.getSeqno()
    console.log(seqno)

    let currentSeqno = seqno

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
            internal({
                to: "EQDUwKXiDXnc2AQtDsvYwGllAzmmCY5oP8othEOfQkAzRubL",
                value: "0.001",
                body: "Hello",
                bounce: false
            })
        ]
    })

    while (currentSeqno == seqno) {
        console.log("waiting for transfer")
        await sleep(1500)
        currentSeqno = await walletContract.getSeqno()
    }

    console.log("transfer complited")
}

main()*/