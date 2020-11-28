const mongoose = require('mongoose')

const prePaymentSchema = mongoose.Schema(
    {
        bank: {
            type: String,
            index: true,
            required: false,
        },
        type: { type: String, required: false},
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



/**
 * @typedef prePayments
 */
module.exports = mongoose.model('prePayments', prePaymentSchema) 