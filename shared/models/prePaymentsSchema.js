const mongoose = require('mongoose')

const prePaymentSchema = mongoose.Schema(
    {
        bank: {
            type: String,
            ref: 'Bank',
            index: true,
            required: false,
            autopopulate: true,
        },
        createdBy: { type: String, required: true },
        amount: { type: Number, required: true },
        text: { type: String, required: true },
        isAccepted: { type: Boolean, default: false },
        isHidden: { type: Boolean, default: false },
        createdAt: { type: Date, },
    },
    {
        timestamps: true
    }
)

prePaymentSchema.plugin(require('mongoose-autopopulate'))


/**
 * @typedef prePayments
 */
module.exports = mongoose.model('prePayments', prePaymentSchema) 