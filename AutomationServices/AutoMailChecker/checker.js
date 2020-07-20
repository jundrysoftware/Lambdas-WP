require('dotenv').config()
const imaps = require('imap-simple')
const utils = require('./utils')
const config = require('./configs')
const moment = require('moment')
const { create: createNewPrePay } = require('./src/controllers/prePayment')
const configs = require('./configs')
const {
    SUBJECT_SEARCHED
} = process.env

const start = async () =>{
    const connection = await imaps.connect(config)
    console.log('=== STARTING SOMETHING ===',new Date())
    await connection.openBox('INBOX')
    const date = moment()
    .subtract('10', 'minutes')
    .format()
    const GranularData = []
    const searchValues =  [
        'UNSEEN',
        ['SINCE', date] ,
        ['SUBJECT', SUBJECT_SEARCHED],
    ]
    const results = await connection.search(searchValues, {
        bodies: ['HEADER', 'TEXT'],
        markSeen: true
    })
    if(results.length){
        const messages = await utils.readRawEmail(results)
        for (const message of messages) {
            const res = utils.searchBancolombia(message.html)
            if(!res) break;
            let  thenum = res.replace(/\D/g, "")
            thenum = thenum.slice(0, thenum.length - 2)
            GranularData.push({
                amount: +thenum,
                text: res,
                createdBy: 'AUTO_EMAIL_SERVICE',
                createdAt: new Date()
            })
        }
    }
    await createNewPrePay(GranularData)
    console.log(new Date())
    console.log('==== FINISHED with ' + GranularData.length + ' Messages');

    return process.exit()
}
module.exports = {
    start
}
