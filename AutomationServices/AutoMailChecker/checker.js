require('dotenv').config()
const imaps = require('imap-simple')
const utils = require('./utils')
const config = require('./configs')
const moment = require('moment')
const { create: createNewPrePay } = require('../../shared/database/repos/prePayment')
const { getBanks } = require('../../shared/database/repos/bank');

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

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
            .toISOString()
        console.log('=== STARTING SOMETHING ===', {
            startDate: date,
            now: moment().toISOString()
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
            console.log('==== START ' + bank.name + ' with ' + messages.length + ' Messages');
            for (const filter of bank.filters) {
                console.log('==== START ' + filter.phrase + ' with ' + messages.length + ' Messages');
                for (const message of messages) {
                    const res = utils.search(message.html, filter.phrase)
                    if (!res) continue;
                    let thenum = res.textWithValue.match(/(\b\d+(?:[\.,]\d+)*)/g, "")
                    thenum = thenum[bank.index_value]
                    if (thenum.includes(',') && thenum.substring(thenum.indexOf(',') + 1).length === 2) {
                        const start = thenum.indexOf(',')
                        thenum = thenum.replace(/\D/g, "").splice(start - 1, start, '.' + thenum.substring(thenum.indexOf(',') + 1))
                    } else {
                        thenum = thenum.replace(/\D/g, "")
                    }

                    GranularData.push({
                        bank: bank.name,
                        amount: parseFloat(thenum),
                        text: res.description,
                        type: filter.type,
                        createdBy: 'AUTO_EMAIL_SERVICE',
                        createdAt: moment(message.date).format()
                    })
                }
            }
        }
        await createNewPrePay(GranularData)
        console.log('==== FINISHED ' + bank.name + ' with ' + GranularData.length + ' Messages ' + results.length);
    }

    return context.done(null);
}
module.exports = {
    start
}
