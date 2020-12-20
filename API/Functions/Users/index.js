const UserRepo = require('./../../../shared/database/repos/user.repo')
module.exports.getUserInformation = async ()=>{
    try {
        const UserInfo = await UserRepo.getUser({
            emails: process.env.EMAIL_USERNAME
        }, {banks: true})
        return {
            statusCode: "200",
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(
                UserInfo.length ? UserInfo[0] : [null]
            ),
          };
    } catch (error) {
        return {
            statusCode: "500",
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(error),
          };
    }
} 