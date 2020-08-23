const { connect: connectToMongo, destroy: detroyMongoConnection, connectToMongoed } = require("../../../shared/database/mongo");
const boxFlowRepo = require("../../../shared/database/repos/boxFlow");
const _ = require('lodash')
const toMonth = (date)=> `${date.toISOString()}`.substring(0,7)
const processMonthlyMetrics =async  ()=>{
    let results = await boxFlowRepo.getByMonth();
    if(!results || !results.length) results = [] 
    results = results.sort((a,b)=>{
        if(a.month > b.month) return 1
        if(a.month < b.month) return -1
        return 0
    })
    return results
}
const processCategoryMetrics =async  ()=>{
    let results = await boxFlowRepo.getByCategories();
    if(!results || !results.length) results = [] 
    results = results.map(item=>{
        const {
            category,
            purchases
        } = item
        const group = _.groupBy(purchases, i=>{
            const date = `${i.date.toISOString()}`
            return date.substring(0, 7)
        })
        const parsed = Object.keys(group).map(month=>{
            return {
                month,
                total: group[month].reduce((prev,curr)=>prev+curr.amount,0)
            }
        })
        return {
            category, 
            monthly: parsed.sort((a,b)=>{
                if(a.month > b.month) return 1
                if(a.month < b.month) return -1
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
    await connectToMongo()
    switch (metricType) {
        case 'month':
            results = await processMonthlyMetrics()
            break;
        case 'category':
            results = await processCategoryMetrics()
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