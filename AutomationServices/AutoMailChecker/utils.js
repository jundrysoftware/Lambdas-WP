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

module.exports.search = (html, filter, skipped_phrase = 'Bancolombia le informa que su factura inscrita', bank_name = "BANCOLOMBIA") => {
    const $ = cheerio.load(html)
    const res = $('p')
    const value = res.text().trim().toLowerCase()
    filter = filter.toLocaleLowerCase()
    if (value.includes(filter)) {
        if (skipped_phrase === null || skipped_phrase === undefined || !value.includes(skipped_phrase.toLocaleLowerCase())) { // If the phrase do not includes the skipped phrase
            let description, textWithValue;

            // The fisrt coincidence for the filter phrase
            const first = value.indexOf(filter)


            switch (bank_name) {
                case "BANCOLOMBIA": {
                    const end = value.indexOf('*', first + 1)
                    description = value.substring(first, end)
                    textWithValue = description
                    break;
                }
                case "PSE": {
                    /**
                     * I want to keep on the description the company name where the payment was made
                     * This value is before the value of the transaction, but some transaction at the first match value
                     * has a CUS (like a uuid) of the transaction, that's why I need to look for the value 'Valor de la Transacción'
                     */
                    const end = value.indexOf('[http://www.jlnsoftware.com.br', first + 1)
                    description = value.substring(first, end).toLowerCase()
                    const valuePhraseToSearch = 'Valor de la Transacción:'.toLocaleLowerCase()
                    if (description.includes(valuePhraseToSearch)) {
                        textWithValue = description.substring(description.indexOf(valuePhraseToSearch))
                    }
                    break;
                }
                default:
                    break;
            }

            return {
                description,
                textWithValue
            }
        }
    }
    return undefined
}