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
        const result = await Users.find(searchCriteria); 
        return result[0] ? result[0] : {};
    } catch (e) {
        console.error(e);
        return {};
    }
};
module.exports.updateUser = async (User) => {
    throw new Error(`Not implemented Yet`)
};
