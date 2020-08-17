const prepaymentsRepo = require("../../../shared/database/repos/prePayment");
const boxFlowRepo = require("../../../shared/database/repos/boxFlow");
const { connect: connectToMongo, destroy: detroyMongoConnection, connectToMongoed } = require("../../../shared/database/mongo");

module.exports.get = async (event, context, callback) => {
  const { body } = event;
  let results = {};
  try {
    results = await prepaymentsRepo.getActive();
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

module.exports.put = async (event, context, callback) =>{
  const { body: bodyString } = event
  const {
    id,
    amount,
    createdAt, 
    description,
    category,
    hide = false,
    accepted
  } = JSON.parse(bodyString)
  console.log(JSON.parse(bodyString))
  try {
    if(!id || !amount || !createdAt || !description || !category) return { statusCode: 400, body: JSON.stringify({message: 'Bad request'})}
    await connectToMongo()
    const data = await prepaymentsRepo.updatePrepayment({
      id, 
      isHidden: hide,
      isAccepted: accepted
    })
    let resultBox = null
    if(accepted){
      resultBox = await boxFlowRepo.saveBoxFlow({
        amount, 
        createdAt, 
        description, 
        category, 
      })
    }
    const statusCode = (data.nModified > 0 && resultBox) ? 204 : 400
    await detroyMongoConnection()
    return {
      statusCode, 
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({success: statusCode === 204 })
    }
  } catch (error) {
    console.error(error)
    return context.done(error, 'Something goes wrong')
  }
}

