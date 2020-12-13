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

module.exports.getUser = async (searchCriteria) => {
    try {
        await connect();
        return await Users.findOne(searchCriteria); 
    } catch (e) {
        console.error(e);
        return {};
    }
};
module.exports.updateUser = async (User) => {
    throw new Error(`Not implemented Yet`)
};
