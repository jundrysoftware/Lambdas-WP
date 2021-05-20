const userRepo = require('../../shared/database/repos/user.repo'); 
const paymentRepo = require('../../shared/database/repos/payment.repo')
const AWS = require('aws-sdk'); 

const SQS_CONFIGS = {
    region: 'us-east-1',
}

const SQS = new AWS.SQS(SQS_CONFIGS)

module.exports.start = async ()=>{
    const usersToSchedule = await userRepo.getUsers({}); 
    if(!usersToSchedule || !usersToSchedule.length)
    throw Error('No users found in schema'); 
    
    const userIds = usersToSchedule.map(user=>user._id); 
    const BankUserInformation = await paymentRepo.usersHavePayments(userIds); 
    
    const messagesToQueue = userIds.map(id=>({
        MessageBody: JSON.stringify({
            createdAt: (new Date()).toISOString(), 
            data: {
                userId: id,
                checkAllDates: !BankUserInformation.find(user=>user.id == id)
            }
        }),
        Id: id + '_event'
    }));

    const sqsResult = await SQS.sendMessageBatch({
        QueueUrl: process.env.USER_SCHEDULE_SQS_URL,
        Entries: messagesToQueue,
    }).promise()

    return sqsResult; 
}