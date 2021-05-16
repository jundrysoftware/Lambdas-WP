const Payments = require("../../models/payment.model");
const { getUser } = require("../repos/user.repo");
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

module.exports.getAllByDate = async ({ userId, date }) => {
  if (!userId) return [];
  await connect()
  const result = await Payments.find(
    {
      createdAt: { $gte: new Date(date) },
      user: userId,
      type: "EXPENSE",
    },
    { amount: 1, description: 1, createdAt: 1, category: 1, isAccepted: 1 }
  ).sort({ createdAt: -1 });
  return result; 
};

//get all prepayments without category
module.exports.getActive = async (criteria) => {
  try {
    await connect()
    // This function open the mongo connection
    const user = await getUser(criteria);
    if (!user) return [];
    const result = await Payments.find({
      user: user._id,
      isAccepted: { $in: [false, null] },
      isHidden: { $in: [undefined, false] },
    });
    return result.reverse();
  } catch (e) {
    console.error(e);
    return [];
  }
};
module.exports.updatePayment = async (Payment) => {
  if (!Payment.id) throw new Error("PaymentsRepo::missing id for Payment");
  await connect()
  const result = await Payments.updateOne(
    { _id: Payment.id, user: Payment.user },
    {
      isAccepted: Payment.isAccepted,
      isHidden: Payment.isHidden,
      description: Payment.description,
      category: Payment.category,
    }
  );
  await destroy()
};

module.exports.getByCategories = async (userId) => {
  await connect()
  const result =  await Payments.aggregate([
    {
      $match: {
        user: userId,
        type: "EXPENSE",
        isAccepted: true,
      },
    },
    {
      $group: {
        _id: { $toLower: "$category" },
        purchases: { $addToSet: { amount: "$amount", date: "$createdAt" } },
      },
    },
    {
      $project: {
        purchases: "$purchases",
        category: "$_id",
        _id: false,
      },
    },
  ]);
  return result
};

module.exports.getByMonth = async (userId) => {
  await connect()
  const result = await Payments.aggregate([
    {
      $match: {
        user: userId,
        type: "EXPENSE",
        isAccepted: true,
      },
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
    },
  ]);
  return result; 
};
