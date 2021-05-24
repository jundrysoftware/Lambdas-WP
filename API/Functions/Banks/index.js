const bankrepo = require('../../../shared/database/repos/bank.repo'); 

module.exports.getBanks = async (event) => {
    const result = await bankrepo.getBanks({});
    return {
        statusCode: 200, headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({banks: result})
    }
}