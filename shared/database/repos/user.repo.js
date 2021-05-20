const { search } = require("../../../AutomationServices/AutoMailChecker/utils");
const userModel = require("../../models/user.model");
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
        
        const result = await Users.findOne(searchCriteria);
        return result; 
    } catch (e) {
        console.error(e);
        try {
            await destroy()
        } catch (error) {}
        return {};
    }
};

module.exports.getUsers = async (searchCriteria, configs = { }) => {
    try {
        await connect();
        const result = await Users.find(searchCriteria);
        return result; 
    } catch (e) {
        console.error(e);
        try {
            await destroy()
        } catch (error) {}
        return {};
    }
};

module.exports.updateUser = async (filter, newDocument) => {
    await connect()
    return userModel.updateMany(filter, newDocument); 
};

module.exports.createCategory = async (userCriteria, category) =>{
    if(!category.value || !category.label || !Object.keys(userCriteria).length) return null; 

    await connect()
    const result = await userModel.updateOne({ ...userCriteria }, {
        $push: {
            categories: { ...category }
        }
    })
    return result.nModified > 0 
}