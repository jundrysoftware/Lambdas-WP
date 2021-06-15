const associateChat = require('../../controllers/associateChat')

module.exports = contact = (bot) => {
    bot.on('contact', async ctx => {
        const result = await associateChat({ phones: `+${ctx.message.contact.phone_number}` }, { type: 'TELEGRAM', id: ctx.chat.id })
        if (ctx.message.contact.user_id !== ctx.from.id) {
            return ctx.reply('Por favor envia tu contacto.')
        }
        if (result) {
            return ctx.reply('Hemos asociado tu cuenta.')
        } else {
            return ctx.reply('No hemos podido localizar una cuenta con este contacto.')
        }
    })
}