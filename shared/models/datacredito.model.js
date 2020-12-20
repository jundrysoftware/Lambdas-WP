const mongoose = require('mongoose')

const DataCreditoSchema = mongoose.Schema(
    {
        comportamiento: {
            type: String
        },
        score: {
            type: Number
        },
        amountOfProducts: {
            type: Number
        },
        arrears30daysLastYear: {
            type: Number
        },
        arrears60daysLast2Year: {
            type: Number
        },
        arrearsAmount: {
            type: Number
        },
        date: {
            year: {
                type: String
            },
            month: {
                type: String
            }
        },
        user: { type: mongoose.Types.ObjectId, required: true }
    },
    {
        timestamps: true,
    }
);


/**
 * @typedef DataCredito
 */
const DataCredito = mongoose.model('DataCredito', DataCreditoSchema);

module.exports = DataCredito;