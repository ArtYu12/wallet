const { default: mongoose } = require("mongoose");


const Transaction = new mongoose.Schema({
    transactionId: {
        type: String
    }, 
    type: {
        type: String,
        enum: ["Withdraw", "Replenishment"]
    },
    currency: {
        type: String,
        enum: ["ton"]
    },
    addressFrom: {
        type: String,
        default: ""
    },
    addressTo: {
        type: String,
        default: ""
    },
    amount: {
        type: Number
    },
    owner: {type: mongoose.Types.ObjectId, ref:"User"},
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model("Transaction", Transaction)