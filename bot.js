const { Bot, InlineKeyboard } = require("grammy");


const bot = new Bot("7303207963:AAGbL2_yEKlkH2q7ariJo-um5y_CmpYP9wM")

bot.on("message", (ctx) => {
    const inlineButton = new InlineKeyboard().webApp("Wallet", "https://google.com")
    return ctx.reply("Open your wallet", {
        reply_markup: inlineButton
    })
})

module.exports = bot