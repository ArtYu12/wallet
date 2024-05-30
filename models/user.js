const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    balanceTon: {
        type: Number,
        default: 0
    },
    transactions: [{ type: mongoose.Types.ObjectId, ref: "Transaction" }],
    referrals: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("User", UserSchema);
