const express = require("express")
const { default: mongoose } = require("mongoose")
const bot = require("./bot")
const userRouter = require("./routes/userRouter")
const checkTransactions = require("./handlers/checkTransactions")
const cors = require("cors")
const checkWithdraws = require("./handlers/checkWithdraws")

mongoose.connect("mongodb+srv://korzaevmatvej:gDHnWjjREm1g12dv@wallet.xtqpwpr.mongodb.net/?retryWrites=true&w=majority&appName=wallet").then(() => console.log("bd connected")).catch((e) => console.log(e))

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get("/", (req,res) => {
    try {
        return res.status(200).json({
            success: true
        })
    } catch (e) {
        console.log(e)
    }
})

app.use("/api", userRouter)

app.use((error, req, res, next) => {
    console.log(error);
    if (!error) return next();
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal server error",
    });
});
  

app.listen(5000, () => {
    bot.start()
    console.log("Server start")
})

setInterval(() => {
    console.log("Transactions checking")
    checkTransactions()
}, 50000)

setInterval(async () => {
    console.log("Processing withdrawals")
    checkWithdraws()
}, 50000)