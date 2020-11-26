const mailparser = require('mailparser').simpleParser
const _ = require('lodash')
const cheerio = require('cheerio');


module.exports.readRawEmail = async (emails=[]) =>{
    const parsed = []
    for (const mail of emails) {
        const all = _.find(mail.parts, { "which": "TEXT" })
        const result = await mailparser(all.body);
        const subject = mail.parts.filter(part=>part.which==='HEADER')[0].body.subject[0]

        parsed.push({
            date: mail.attributes.date,
            subject: subject,
            html: result.textAsHtml
        })
    }
    return parsed
}

module.exports.search = (html, filter, skipped_phrase = 'Bancolombia le informa que su factura inscrita') =>{
    const $ = cheerio.load(html)
    const res = $('p')
    const value = res.text().trim()
    if(value.indexOf(filter) > 0){
        if(value.indexOf(skipped_phrase) < 0){
            const first = value.indexOf(filter)
            const end = value.indexOf('*', first + 1)
            const newValue = value.substring(first, end)
            return newValue
        }
    }
    return undefined
}