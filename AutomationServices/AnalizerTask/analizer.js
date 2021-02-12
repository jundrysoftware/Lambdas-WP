const paymentRepo = require('../../shared/database/repos/payment.repo')
const moment = require('moment')
const twilio = require('twilio')

const ACCOUNT_SID = process.env.TWILIO_ACCESS_TOKEN 
const AUTH_TOKEN = process.env.TWILIO_SECTRET_KEY 

const NUMBER_FROM = 'whatsapp:+14155238886'
const NUMBER_TO = 'whatsapp:+3000000' 
const transformNumber = (number) => Intl.NumberFormat('es-co').format(number)

module.exports.start = async (event) => {
    const {
        ExecutionType = 'MONTHLY'
    } = event || {}

    const date = ExecutionType === 'WEEKLY' 
        ? moment().subtract(1, 'week')
        : moment().subtract(1, 'month')
    const DayCalcualtion = await paymentRepo.getMostSpensiveDay(date)

    if(!DayCalcualtion.length) 
        throw new Error('Analitics Query doesnot response data')
    
    const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

    const BodyToWhatsApp = DayCalcualtion.reduce((prev, curr, idx )=>{
        if(idx==0) return prev + `💥 Most Expensive: *${curr.dayOfWeek}* with: $${transformNumber(curr.total)} 💸\n`
        return prev + `👉🏼 ${curr.dayOfWeek} with: $${transformNumber(curr.total)}\n`
    },`🎉 Your ${ExecutionType.toLowerCase()} Report is here! \n`)

    await client.messages.create({
        body: BodyToWhatsApp,
        from: NUMBER_FROM,
        to: NUMBER_TO
    })
    
    return; 
    /** TODO
     * In Monthly execution, check the average or prediction for category
     */
}