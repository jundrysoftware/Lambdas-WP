const { amountParser } = require('../utils')

module.exports.paymentsParser = (text) => {
    const TRANSACTION_VALUE = amountParser(text.substring((text.lastIndexOf('$')+1),text.indexOf(' fecha de transacción:')))
    const TRANSACTION_DESTINATION = text.substring((text.indexOf('empresa:') + 8 ),(text.indexOf('descripción:') - 1))

    return {
        TRANSACTION_VALUE,
        TRANSACTION_DESTINATION,
        TRANSACTION_CARD_TYPE: null,
        TRANSACTION_ACCOUNT: null
    }
}