const Transaction = require("../models/transaction")
const User = require("../models/user")
const sendTons = require("./sendTons")

async function checkWithdraws() {
    const transactions = await Transaction.find({ completed: false, type: 'Withdraw' }).limit(1)
    for (const transaction of transactions) {
        if (transaction.currency == 'ton') {
            const userInfo = await User.findById(transaction.owner)
            if (userInfo) {
                const tr = await sendTons(transaction.addressTo, transaction.amount)
                if (tr) {
                    transaction.completed = true
                    await transaction.save()
                    console.log({
                        success: true,
                        transaction
                    })
                }
            }
        }
    }
}

module.exports = checkWithdraws
