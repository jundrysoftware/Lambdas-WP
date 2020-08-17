const { Schema, model } = require('mongoose')

const schema = {
    createdBy: { type: String, required: true },
    amount: { type: Number, required: true },
    text: {type: String, required: true}, 
    isAccepted: { type: Boolean, default: false},
    isHidden: { type: Boolean, default: false},
    createdAt: { type: Date, },
}

const options = {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
}

module.exports = model('prePayments', new Schema(schema, options)) 