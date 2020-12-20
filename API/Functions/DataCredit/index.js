const DataCreditRepo = require("../../../shared/database/repos/datacredito.repo");

const {
    PHONE_NUMBER
} = process.env

module.exports.get = async (event, context, callback) => {
    const { body } = event;
    let results = {};
    const date = new Date()

    try {
        results = await DataCreditRepo.getdataCreditos({ user: { phones: PHONE_NUMBER }, datacredit: { date: { month: date.getMonth().toString() + 1, year: date.getFullYear().toString() } } });
    } catch (error) {
        return {
            statusCode: "500",
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            message: JSON.stringify(error),
        };
    }
    return context.done(null, {
        statusCode: "200",
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(results),
    });
};