const { connect: connectToMongo, destroy: detroyMongoConnection, connectToMongoed } = require("../../../shared/database/mongo");
const PaymentRepo = require("../../../shared/database/repos/payment.repo");
const { getUser } = require("../../../shared/database/repos/user.repo");
const {
  PHONE_NUMBER
} = process.env

const _ = require('lodash')

const processMonthlyMetrics = async (userId) => {

  let results = await PaymentRepo.getByMonth(userId);
  if (!results || !results.length) results = []
  results = results.sort((a, b) => {
    if (a.month > b.month) return 1
    if (a.month < b.month) return -1
    return 0
  })
  return results
}
const processCategoryMetrics = async (userId) => {
  let results = await PaymentRepo.getByCategories(userId);
  if (!results || !results.length) results = []
  results = results.map(item => {
    const {
      category,
      purchases
    } = item
    const group = _.groupBy(purchases, i => {
      const date = `${i.date.toISOString()}`
      return date.substring(0, 7)
    })
    const parsed = Object.keys(group).map(month => {
      return {
        month,
        total: group[month].reduce((prev, curr) => prev + curr.amount, 0)
      }
    })
    return {
      category,
      monthly: parsed.sort((a, b) => {
        if (a.month > b.month) return 1
        if (a.month < b.month) return -1
        return 0
      })
    }
  })
  return results
}

module.exports.get = async (event, context, callback) => {
  let results = [];
  const { multiValueQueryStringParameters: queryParams } = event;

  const metricType = queryParams && queryParams.metricType ? queryParams.metricType[0] : 'month';
  try {
    // This function open the mongo connection
    const user = await getUser({ phones: PHONE_NUMBER })
    switch (metricType) {
      case 'month':
        results = await processMonthlyMetrics(user._id)
        break;
      case 'category':
        results = await processCategoryMetrics(user._id)
        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: "500",
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      message: JSON.stringify(error),
    };
  }
  return {
    statusCode: "200",
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(results),
  };
};