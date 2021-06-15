const getUserInfo = require('../../controllers/getUserInfo')
const moment = require('moment')
const PaymentModel = require('../../../../../shared/models/payment.model')

module.exports = total = (bot) => {
    bot.command('total', async (ctx) => {

        let [command, category, timeNumber, long] = ctx.update.message.text.split(' ')

        if (!timeNumber || !long || !category) {
            return ctx.reply("Timming ago fails")
        } else {
            try {
                const { _id } = await getUserInfo(ctx.chat.id);
                if ([undefined, null, ""].includes(_id)) {
                    return ctx.reply("Por favor associa una cuenta /associate")
                }

                const fromAux = category

                if (category.indexOf('/') >= 0)
                    category = category.split('/').map(cat => new RegExp(cat, 'i'))
                else if (category === '*')
                    category = []
                else
                    category = [new RegExp(category, 'i')]

                let date = moment().subtract(timeNumber.toLowerCase(), long.toLowerCase())


                let query = {
                    user: _id,
                    isAccepted: true,
                    createdAt: {
                        $gte: new Date(date)
                    }
                }

                if (category.length)
                    query.category = { $in: category }
                else
                    query.category = { $nin: [null, undefined] }



                let result = await PaymentModel.find(query, { description: 1, amount: 1, category: 1 })

                if (!result || !result.length)
                    return ctx.reply("⚠ No encontré datos 🙅‍♀️")

                let data = "👽 *Resumen de " + fromAux + "*\n\n"
                data += result.reduce((prev, current, idx) => {
                    prev += `${idx + 1}-${current.description}: $${current.amount}\n`
                    return prev
                }, "")

                data += "\n*Total:* $" + result.reduce((prev, current, index) => {
                    prev += current.amount
                    return prev
                }, 0)

                return ctx.replyWithMarkdown(data)
            } catch (error) {
                console.log(error)
                return ctx.reply("Something fails with mongo")
            }
        }
    })
}