const mongoose = require('mongoose')

const BankSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        filters: [
            {
                type: String,
            },
        ],
        folder: {
            type: String
        },
        subject: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);


/**
 * @typedef Bank
 */
const Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;