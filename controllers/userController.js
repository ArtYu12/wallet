const sendTons = require("../handlers/sendTons");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const qs = require("querystring");

class UserController {
    async getUser(req, res, next) {
        try {
            const authB64 = req.headers.authorization;
            if (!authB64) return next({ status: 400, message: "Not tg user" })
            const auth = Buffer.from(authB64, 'base64').toString('utf-8');
            const tgData = qs.parse(auth);
            const user = JSON.parse(tgData.user);
            const option = await User.findOne({ uid: user.id }).populate("transactions");
            if (option) {
                return res.status(200).json({
                    success: true,
                    user: option
                });
            } else {
                const { ref } = req.query
                if (ref) {
                    const refUser = await User.findById(ref)
                    if (refUser) {
                        const userInfo = await User.create({ uid: user.id, username: user.username });
                        refUser.referrals.push(userInfo.id)
                        await refUser.save()
                        return res.status(200).json({
                            success: true,
                            user: userInfo
                        });
                    } else {
                        const userInfo = await User.create({ uid: user.id, username: user.username });
                        return res.status(200).json({
                            success: true,
                            user: userInfo
                        });
                    }
                } else {
                    const userInfo = await User.create({ uid: user.id, username: user.username });
                    return res.status(200).json({
                        success: true,
                        user: userInfo
                    });
                }
            }
        } catch (e) {
            return next(e);
        }
    }
    async withdraw(req, res, next) {
        try {
            const { addressTo, amount } = req.body
            if (!addressTo || !amount) throw Error("Enter all data")
            if (isNaN(amount) || Number(amount) <= 0) throw Error("Enter correct amount")
            const authB64 = req.headers.authorization;
            const auth = Buffer.from(authB64, 'base64').toString('utf-8');
            const tgData = qs.parse(auth);
            const user = JSON.parse(tgData.user);
            const option = await User.findOne({ uid: user.id });
            if (!option) throw Error("User not found")
            if (option.balanceTon - Number(amount) <= 0) throw Error("Don't have enough ton balance")
            const transaction = await Transaction.create({ type: "Withdraw", currency: "ton", addressTo: addressTo, addressFrom: "0QD5AOe2-26MJ107y7IQGfziH3XR6IJHtXUyQ6hWqLIeOu73", amount: Number(amount), owner: option.id })
            option.transactions.push(transaction._id)
            option.balanceTon -= Number(transaction.amount)
            await option.save()
            return res.status(200).json({
                success: true,
                transaction
            })
        } catch (e) {
            return next(e);
        }
    }
    async getCourse(req, res, next) {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/the-open-network');
            const data = await response.json();

            return res.status(200).json({
                success: true,
                ton_to_usd: data.market_data.current_price.usd
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();
