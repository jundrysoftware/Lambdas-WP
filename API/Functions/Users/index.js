const UserRepo = require("./../../../shared/database/repos/user.repo");
const { encrypt, decrypt } = require('../../../shared/utils/crypto')
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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

  try {
    const result = await UserRepo.createCategory(
      {
        emails: process.env.EMAIL_USERNAME,
      },
      { label: body.label, value: body.value }
    );
    return {
      statusCode: result ? 200 : 409,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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

module.exports.checkSecretKey = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};

  if (!body.secretKey) return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }

  const user = await UserRepo.getUser({
    emails: process.env.EMAIL_USERNAME,
  })

  if (!user.secretKey) return {
    statusCode: 409,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }

  const userKey = decrypt(user.secretKey)

  if (userKey !== body.secretKey) return {
    statusCode: 401,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }
}