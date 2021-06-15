module.exports = associate = (bot) => {
    bot.command('associate', (ctx) => {
        return ctx.reply('Send me your number please', {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{
                        text: "Share Phone Number",
                        request_contact: true
                    },
                    {
                        text: "Cancel"
                    }],
                ],
                force_reply: true
            }
        }
        )
    })
}