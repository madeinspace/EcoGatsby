const AWS = require("aws-sdk");
const Lambda = new AWS.Lambda();

exports.apiHandler = async event => {
  try {
    return Lambda.invoke({
      FunctionName:
        "economy-exp-datagen-lambd-WorkersFieldOfQualificat-1MG4SK02L5MM0",
      InvocationType: "Event",
      LogType: "None",
      Payload: JSON.stringify({
        ClientID: event.multiValueQueryStringParameters.ClientID
      })
    })
      .promise()
      .then(
        data => ({ statusCode: data.StatusCode, body: JSON.stringify(data) }),
        err => ({ statusCode: 400, body: JSON.stringify(err) })
      );
  } catch (err) {
    console.log(err);
    return err;
  }
};
