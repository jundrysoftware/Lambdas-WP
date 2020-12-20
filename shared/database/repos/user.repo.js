const { search } = require("../../../AutomationServices/AutoMailChecker/utils");
const Users = require("../../models/user.model");
const { connect, destroy, isConnected } = require("../mongo");

module.exports.create = async (UserBody = []) => {
    try {
        await connect();
        await Users.create(UserBody);
        await destroy();
    } catch (error) {
        console.log(error);
    }
};

module.exports.getUser = async (searchCriteria, configs = { }) => {
    try {
        await connect();
        if(configs.banks) 
            return Users.aggregate([{
                $match: {
                    ...searchCriteria
                }
            }, {
                $lookup: {
                    from: 'banks',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'banks'
                  }
            }])
        
        return await Users.findOne(searchCriteria); 
    } catch (e) {
        console.error(e);
        return {};
    }
};

module.exports.updateUser = async (User) => {
    throw new Error(`Not implemented Yet`)
};
