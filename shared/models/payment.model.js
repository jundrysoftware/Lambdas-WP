const mongoose = require('mongoose')

const PaymentSchema = mongoose.Schema(
    {
        bank: {
            type: String,
            index: true,
            required: false,
        },
        type: { type: String, required: false },
        createdBy: { type: String, required: true },
        amount: { type: Number, required: true },
        text: { type: String, required: true },
        description: { type: String, require: false },
        isAccepted: { type: Boolean, default: false },
        isHidden: { type: Boolean, default: false },
        createdAt: { type: Date, },
        category: { type: String, default: null},
        secondCategory: { type: String, default: null },
        user: { type: mongoose.Types.ObjectId, require: true }
    },
    {
        timestamps: true
    }
)



/**
 * @typedef Payments
 */
module.exports = mongoose.model('Payments', PaymentSchema) 