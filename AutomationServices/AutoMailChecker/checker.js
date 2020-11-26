require('dotenv').config()
const imaps = require('imap-simple')
const utils = require('./utils')
const config = require('./configs')
const moment = require('moment')
const { create: createNewPrePay } = require('../../shared/database/repos/prePayment')
const { getBanks } = require('../../shared/database/repos/bank');

const {
    MINUTES_AGO_SEARCH = '10080'
} = process.env

const start = async (event, context) => {
    console.info('Getting Banks Config')
    const banks = await getBanks();

    console.info('Connecting to email')
    const connection = await imaps.connect(config)
    console.info('Openning Inbox')

    for (const bank of banks) {

        await connection.openBox(bank.folder)

        const date = moment()
            .subtract(MINUTES_AGO_SEARCH, 'minutes')
            .format()
        console.log('=== STARTING SOMETHING ===', {
            startDate: date,
            now: moment().format()
        })
        const GranularData = []

        const searchValues = [
            'UNSEEN',
            ['SINCE', date],
            ['SUBJECT', bank.subject],
        ]
        const results = await connection.search(searchValues, {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true
        })

        if (results.length) {
            const messages = await utils.readRawEmail(results)
            for (const message of messages) {
                for (const filter of bank.filters) {
                    const res = utils.search(message.html, filter)
                    if (!res) break;
                    let thenum = res.match(/(\b\d+(?:[\.,]\d+)?\b)/g, "")
                    thenum = thenum[0].replace(/\D/g, "")
                    GranularData.push({
                        bank: bank.name,
                        amount: +thenum,
                        text: res,
                        createdBy: 'AUTO_EMAIL_SERVICE',
                        createdAt: new Date()
                    })
                }
            }
        }
        await createNewPrePay(GranularData)
        console.log('==== FINISHED with ' + GranularData.length + ' Messages');
    }

    return context.done(null);
}
module.exports = {
    start
}
