const prePaymentsSchema = require('../mongoose/prePaymentsSchema')
const {connect, destroy,  db } = require('../mongoose/mongoose')

module.exports.create = async (prePayment=[]) =>{
    try {
        await connect()
        // await db.collection('prePayments').insertMany(prePayment)
        for (const payment of prePayment) {
            await prePaymentsSchema.create(payment)
        }
        await destroy()
    } catch (error) {
        console.log(error)
    }
}