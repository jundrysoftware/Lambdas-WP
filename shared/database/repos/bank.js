const bankSchema = require('../../models/bank');
const { connect, destroy, isConnected } = require("../mongo");


module.exports.create = async (bankBody) => {
    try {
        await connect();
        await bankSchema.create(bankBody);
    } catch (error) {
        console.error(error)
    } finally {
        await destroy();
    }
}

module.exports.getBanks = async () => {
    let banks;
    try {
        await connect();
        banks = await bankSchema.find({})
    } catch (error) {
        console.error(error)
    } finally {
        await destroy();
    }
    return banks;
}
