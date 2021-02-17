const PaymentRepo = require("../../../shared/database/repos/payment.repo");
const { getUser } = require("../../../shared/database/repos/user.repo");
const _ = require('lodash')
const moment = require('moment')

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

module.exports.processHomeMetrics = async (userId, date) => {

  const result = await PaymentRepo.getAllByDate({ userId, date })
  let latestPayments = [], expensivePayments = [], totalByCategory = [], acceptedPayments = [], prepayments = []

  //Split types
  result.forEach(item => {
    if (item.isAccepted)
      acceptedPayments.push(item)
    else
      prepayments.push(item)
  })

  //prepayments 
  prepayments = prepayments.slice(0, 10)

  //Latest payments 
  latestPayments = acceptedPayments.slice(0, 10)

  //expensivePayments 
  expensivePayments = _.orderBy(acceptedPayments, 'amount', ['desc']).slice(0, 10)

  // Group by category
  totalByCategory = _.groupBy(acceptedPayments, 'category')
  return {
    latestPayments,
    expensivePayments,
    totalByCategory,
    prepayments
  }
}

//stats endpoint 
module.exports.get = async (event, context, callback) => {
  let results = [];

  const { query: queryParams, cognitoPoolClaims } = event;
  const { sub } = cognitoPoolClaims

  const metricType = queryParams && queryParams.metricType ? queryParams.metricType : 'month';
  const date = queryParams && queryParams.date ? queryParams.date[0] : moment().subtract(1, 'month').toString()

  try {
    // This function open the mongo connection
    const user = await getUser({ sub })
    switch (metricType) {
      case 'month':
        results = await processMonthlyMetrics(user._id)
        break;
      case 'category':
        results = await processCategoryMetrics(user._id)
        break;
      case 'home':
        results = await processHomeMetrics(user._id, date)
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