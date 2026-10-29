exports.handler = async function (event) {

  if (event.httpMethod !== "POST") {

    return {

      statusCode: 405,

      body: JSON.stringify({ error: "Method not allowed" })

    };

  }

  try {

    const { message } = JSON.parse(event.body || "{}");

    if (typeof message !== "string" || message.length > 2000) {

      return {

        statusCode: 400,

        body: JSON.stringify({ error: "Invalid message" })

      };

    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {

      return {

        statusCode: 500,

        body: JSON.stringify({ error: "Telegram not configured" })

      };

    }

    const response = await fetch(

      `https://api.telegram.org/bot${token}/sendMessage`,

      {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          chat_id: chatId,

          text: message

        })

      }

    );

    if (!response.ok) {

      return {

        statusCode: 502,

        body: JSON.stringify({ error: "Telegram delivery failed" })

      };

    }

    return {

      statusCode: 200,

      body: JSON.stringify({ success: true })

    };

  } catch (error) {

    return {

      statusCode: 400,

      body: JSON.stringify({ error: "Invalid request" })

    };

  }

};
