const mailparser = require('mailparser').simpleParser
const _ = require('lodash')
const cheerio = require('cheerio');
const { filter } = require('lodash');

const {
    SUBJECT_SEARCHED,
    BODY_BASE_SEARCHED,
    BODY_SKIPPED_PHRASE
} = process.env

module.exports.readRawEmail = async (emails=[]) =>{
    const parsed = []
    for (const mail of emails) {
        const all = _.find(mail.parts, { "which": "TEXT" })
        const result = await mailparser(all.body);
        const subject = mail.parts.filter(part=>part.which==='HEADER')[0].body.subject[0]

        parsed.push({
            subject: subject,
            html: result.textAsHtml
        })
    }
    return parsed
}

module.exports.searchBancolombia = (html) =>{
    const $ = cheerio.load(html)
    const res = $('p')
    const value = res.text().trim()
    if(value.indexOf(BODY_BASE_SEARCHED) > 0){
        if(value.indexOf(BODY_SKIPPED_PHRASE) < 0){
            const first = value.indexOf(BODY_BASE_SEARCHED)
            const end = value.indexOf('*', first + 1)
            const newValue = value.substring(first, end)
            return newValue
        }
    }
    return undefined
}