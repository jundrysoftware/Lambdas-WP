const mailparser = require('mailparser').simpleParser
const _ = require('lodash')
const cheerio = require('cheerio');
const { htmlToText } = require('html-to-text');


function isBase64(str) {
    return Buffer.from(str, 'base64').toString('base64') === str
}

module.exports.readRawEmail = async (emails = []) => {
    const parsed = []
    for (const mail of emails) {
        let all = _.find(mail.parts, { "which": "TEXT" })
        const subject = mail.parts.filter(part => part.which === 'HEADER')[0].body.subject[0]
        let textAsHtml = null;

        if (all.body !== null && isBase64(all.body.replace(/\r?\n|\r/g, ""))) {
            all.body = Buffer.from(all.body.replace(/\r?\n|\r/g, ""), 'base64').toString()
            textAsHtml = '<p>' + htmlToText(all.body).replace(/\r?\n|\r|\t/g, " ") + '</p>'
        } else {
            const result = await mailparser(all.body);
            textAsHtml = result.textAsHtml
        }


        parsed.push({
            date: mail.attributes.date,
            subject: subject,
            html: textAsHtml
        })

    }
    return parsed
}

module.exports.search = (html, filter, skipped_phrase = 'Bancolombia le informa que su factura inscrita') => {
    const $ = cheerio.load(html)
    const res = $('p')
    const value = res.text().trim()
    if (value.indexOf(filter) > 0) {
        if (value.indexOf(skipped_phrase) < 0) {
            let description, textWithValue;
            const first = value.indexOf(filter)

            if (value.indexOf('*', first + 1) > 0) {
                //BANCOLOMBIA
                const end = value.indexOf('*', first + 1)
                description = value.substring(first, end)
                textWithValue = description
            } else {
                // PSE
                const end = value.indexOf('[http://www.jlnsoftware.com.br', first + 1)
                description = value.substring(first, end)
                if (value.toLowerCase().includes('Valor de la Transacción:'.toLocaleLowerCase())){
                    textWithValue = description.substring(description.toLocaleLowerCase().indexOf('Valor de la Transacción:'.toLocaleLowerCase()))                  
                } else {
                    textWithValue = description
                }
            }
            return {
                description,
                textWithValue
            }
        }
    }
    return undefined
}