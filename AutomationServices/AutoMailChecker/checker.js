require('dotenv').config()
const imaps = require('imap-simple')
const utils = require('./utils')
const config = require('./configs')
const moment = require('moment')
const { createMultiple: createMultiplesPayments } = require('../../shared/database/repos/payment.repo')
const { getBanks } = require('../../shared/database/repos/bank.repo');
const { getUser } = require('../../shared/database/repos/user.repo');

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const {
    MINUTES_AGO_SEARCH = '10080'
} = process.env

const start = async (event, context) => {
    console.info('Getting User Config')
    // This function open the mongo connection
    const user = await getUser({ emails: config.imap.user })
    if(!user)
        throw new Error('Users are not configured yet, please create the user document')

    console.info('Getting Banks Config')
    const banks = await getBanks({ user: user._id });

    if(!banks)
        throw new Error('Banks are not configured yet, please create the bank documents')

    console.info('Connecting to email')
    const connection = await imaps.connect(config)

    for (let index = 0; index < banks.length; index++) {
        const bank = banks[index];
        console.info(`Openning ${bank.folder}`)
        await connection.openBox(bank.folder)
        const date = moment()
            .subtract(MINUTES_AGO_SEARCH, 'minutes')
            .toISOString()
        console.log('=== STARTING SOMETHING ===', {
            startDate: date,
            now: moment().toISOString()
        })
        const GranularData = []

        const searchValues = [
            // 'UNSEEN',
            ['SINCE', date],
            ['SUBJECT', bank.subject],
        ]
        const results = await connection.search(searchValues, {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true
        })

        // Close Box
        connection.closeBox()
        if (results.length) {
            const messages = await utils.readRawEmail(results)
            console.log('==== START ' + bank.name + ' with ' + messages.length + ' Messages');
            for (let index = 0; index < bank.filters.length; index++) {
                const filter = bank.filters[index];
                console.log('==== START FILTER ' + filter.phrase);
                for (let index = 0; index < messages.length; index++) {
                    const message = messages[index];

                    const res = utils.search(message.html, filter.phrase, filter.parser, bank.ignore_phrase, bank.name)
                    if (!res) continue;

                    const prePaymentObj = {
                        bank: bank.name,
                        source: res.TRANSACTION_SOURCE,
                        destination: res.TRANSACTION_DESTINATION,
                        amount: res.TRANSACTION_VALUE,
                        cardType: res.TRANSACTION_CARD_TYPE,
                        account: res.TRANSACTION_ACCOUNT,
                        category: res.TRANSACTION_TYPE,
                        text: res.description,
                        type: filter.type,
                        createdBy: 'AUTO_EMAIL_SERVICE',
                        createdAt: moment(message.date).format(),
                        user: user._id
                    }

                    if (GranularData.indexOf(prePaymentObj) === -1) { // Do not enter duplicated values.
                        GranularData.push(prePaymentObj)
                    }
                }
                console.log('==== FINISHED FILTER ' + filter.phrase);
            }
        }
        await createMultiplesPayments(GranularData)
        console.log('==== FINISHED ' + bank.name + ' with a total of ' + GranularData.length + ' Messages saved');
    }

    return context.done(null);
}

module.exports = {
    start
}
