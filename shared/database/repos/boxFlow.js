const boxFlowSchema = require("../../models/boxflow");
const {
  PHONE_NUMBER
} = process.env

module.exports.saveBoxFlow = (boxFlow) => {
  return boxFlowSchema.create({
    phoneNumber: `whatsapp:${PHONE_NUMBER}`,
    ...boxFlow,
  });
};

module.exports.getByCategories = () => {
  return boxFlowSchema.aggregate([
    { $match: { phoneNumber: `whatsapp:${PHONE_NUMBER}`, type: "EXPENSE" } },
    {
      $group: {
        _id: { $toLower: '$category' },
        purchases: { $addToSet: { 'amount': '$amount', date: '$createdAt' } }
      }
    },
    {
      $project: {
        purchases: "$purchases",
        category: "$_id",
        _id: false,
      },
    }
  ]);
};

module.exports.getByMonth = () => {
  return boxFlowSchema.aggregate([
    { $match: { phoneNumber: `whatsapp:${PHONE_NUMBER}`, type: "EXPENSE" } },
    {
      $group: {
        _id: { $substr: ["$createdAt", 0, 7] },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        total: "$total",
        month: "$_id",
        _id: false,
      },
    }
  ]);
};
