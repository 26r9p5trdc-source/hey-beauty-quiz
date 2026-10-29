exports.handler = async function () {

  return {

    statusCode: 503,

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify({

      error: "Telegram notifications are temporarily disabled"

    })

  };

};
