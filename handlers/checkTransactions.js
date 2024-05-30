const User = require("../models/user");
const Transaction = require("./../models/transaction")

async function checkTransactions() {
    const request = await fetch(`https://testnet.tonapi.io/v2/accounts/0QD5AOe2-26MJ107y7IQGfziH3XR6IJHtXUyQ6hWqLIeOu73/events?initiator=false&subject_only=false&limit=20`, {})
    const transactions = await request.json();
    for (const transaction of transactions.events) {
        const optionTr = await Transaction.findOne({ transactionId: transaction.event_id })
        if(optionTr || transaction.in_progress) return
        for(const action of transaction.actions) {
            if(action.type === "TonTransfer" && action.status == "ok") {
                if(action.TonTransfer.comment && action.TonTransfer.comment !== "TonWeb transaction") {
                    try {
                        const user = await User.findById(action.TonTransfer.comment)
                        if(!user) return 
                        if(user) {
                            const newTr = await Transaction.create({ transactionId: transaction.event_id, type: "Replenishment", currency: "ton", addressFrom: action.TonTransfer.sender.address, addressTo: action.TonTransfer.recipient.address, amount: action.TonTransfer.amount / Math.pow(10, 9), owner: user.id, completed: true })
                            user.balanceTon += action.TonTransfer.amount / Math.pow(10, 9)
                            user.transactions.push(newTr.id)
                            await user.save()
                        }
                    } catch(e) {
                        return 
                    }
                }
            }
        }
    }
}

module.exports = checkTransactions
