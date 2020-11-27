const boxFlowSchema = require("../../models/boxflow");

module.exports.saveBoxFlow = (boxFlow) => {
  return boxFlowSchema.create({
    phoneNumber: "whatsapp:+573008794497",
    ...boxFlow,
  });
};

module.exports.getByCategories = () => {
  return boxFlowSchema.aggregate([
    { $match: { phoneNumber: "whatsapp:+573008794497" } },
    {
        $group: {
            _id: {$toLower: '$category'},
            purchases: {$addToSet: {'amount': '$amount', date: '$createdAt'} }
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
    { $match: { phoneNumber: "whatsapp:+573008794497" } },
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
