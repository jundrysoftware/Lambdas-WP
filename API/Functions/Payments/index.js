const PaymentRepo = require("../../../shared/database/repos/payment.repo");
const { getUser } = require("../../../shared/database/repos/user.repo");
const { destroy: detroyMongoConnection } = require("../../../shared/database/mongo");

module.exports.get = async (event, context, callback) => {
  let results = {};
  const { cognitoPoolClaims } = event
  const {
    sub
  } = cognitoPoolClaims
  try {
    results = await PaymentRepo.getActive({ sub });
  } catch (error) {
    return {
      statusCode: "500",
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error),
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

module.exports.put = async (event, context, callback) => {
  const { body: bodyString, cognitoPoolClaims } = event
  const {
    id,
    description,
    category,
    hide = false,
    accepted = true
  } = bodyString

  const {
    sub
  } = cognitoPoolClaims

  try {
    if (!id || !description || !category) return { statusCode: 400, body: JSON.stringify({ message: 'Bad request' }) }
    const user = await getUser({ sub })
    const data = await PaymentRepo.updatePayment({
      id,
      user: user._id,
      isHidden: hide,
      isAccepted: accepted,
      description: description,
      category: category
    })
    const statusCode = (data.nModified > 0) ? 204 : 400
    await detroyMongoConnection()
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: statusCode === 204 })
    }
  } catch (error) {
    console.error(error)
    return context.done(error, 'Something goes wrong')
  }
}

