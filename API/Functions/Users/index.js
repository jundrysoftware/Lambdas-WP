const UserRepo = require("./../../../shared/database/repos/user.repo");

module.exports.getUserInformation = async () => {
  try {
    const result = await UserRepo.getUser(
      {
        emails: process.env.EMAIL_USERNAME,
      },
      { banks: true }
    );
    const UserInfo = result.length ? result[0] : null;
    if (UserInfo) UserInfo.settings = undefined;

    return {
      statusCode: "200",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(UserInfo),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: "500",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(error),
    };
  }
};

module.exports.addNewCategory = async (event) => {

  const body = event.body ? JSON.parse(event.body) : {};

  if (!body.label || !body.value)
    return {
      statusCode: 400,
    };

  try {
    const result = await UserRepo.createCategory(
      {
        emails: process.env.EMAIL_USERNAME,
      },
      { label: body.label, value: body.value }
    );
    return {
      statusCode: result ? 200 : 409
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: "500",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(error),
    };
  }
};
