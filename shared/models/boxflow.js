const mongoose = require('mongoose')

const boxFlowsSchema = mongoose.Schema(
    {
        phoneNumber: { type: String, index: true, required: true },
        type: { type: String, index: true, required: true },
        category: { type: String, index: true, required: true },
        secondCategory: { type: String, required: false },
        description: { type: String, required: false },
        amount: { type: Number, required: true },
    },
    {
        timestamps: true
    }
)



/**
 * @typedef boxFlows
 */
module.exports = mongoose.model('boxflows', boxFlowsSchema) 