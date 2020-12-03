const Payments = require("../../models/payment.model");
const { getUser } = require('../repos/user.repo')
const { connect, destroy } = require("../mongo");

module.exports.createMultiple = async (PaymentBodies = []) => {
  try {
    await connect();
    for (const payment of PaymentBodies) {
      await Payments.create(payment);
    }
    await destroy();
  } catch (error) {
    console.log(error);
  }
};

module.exports.getActive = async (criteria) => {
  try {
    // This function open the mongo connection
    const user = await getUser(criteria)

    const result = await Payments.find({
      user: user._id,
      isAccepted: { $in: [false, null] },
      isHidden: { $in: [undefined, false] },
    });
    await destroy();
    return result.reverse();
  } catch (e) {
    console.error(e);
    return {};
  }
};
module.exports.updatePayment = async (Payment) => {
  if (!Payment.id) throw new Error("PaymentsRepo::missing id for Payment");
  return Payments.updateOne(
    { _id: Payment.id, user: Payment.user },
    {
      isAccepted: Payment.isAccepted,
      isHidden: Payment.isHidden,
      description: Payment.description,
      category: Payment.category

    }
  );
};

module.exports.getByCategories = async (userId) => {
  return await Payments.aggregate([
    {
      $match: {
        user: userId,
        type: "EXPENSE",
        isAccepted: true
      }
    },
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

module.exports.getByMonth = async (userId) => {

  return Payments.aggregate([
    {
      $match: {
        user: userId,
        type: "EXPENSE",
        isAccepted: true
      }
    },
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