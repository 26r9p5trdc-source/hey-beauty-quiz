// HEY BEAUTY — Telegram function

// Preparation version: notifications remain disabled.

const MAX_BODY_SIZE = 12000;

const MAX_HINT_LENGTH = 600;

const TOTAL_QUESTIONS = 15;

function response(statusCode, data) {

  return {

    statusCode,

    headers: {

      "Content-Type": "application/json",

      "Cache-Control": "no-store"

    },

    body: JSON.stringify(data)

  };

}

exports.handler = async function (event) {

  // Telegram stays disabled until rate limiting

  // and the remaining security checks are ready.

  const TELEGRAM_ENABLED = false;

  if (event.httpMethod !== "POST") {

    return response(405, {

      error: "Method not allowed"

    });

  }

  const body = event.body || "";

  if (body.length > MAX_BODY_SIZE) {

    return response(413, {

      error: "Request too large"

    });

  }

  let data;

  try {

    data = JSON.parse(body);

  } catch {

    return response(400, {

      error: "Invalid JSON"

    });

  }

  if (!data || typeof data !== "object") {

    return response(400, {

      error: "Invalid request"

    });

  }

  if (!["answer", "hint", "final"].includes(data.event)) {

    return response(400, {

      error: "Invalid event"

    });

  }

  if (

    typeof data.sessionId !== "string" ||

    data.sessionId.length < 10 ||

    data.sessionId.length > 64

  ) {

    return response(400, {

      error: "Invalid session"

    });

  }

  if (data.event === "answer" || data.event === "hint") {

    if (

      !Number.isInteger(data.question) ||

      data.question < 1 ||

      data.question > TOTAL_QUESTIONS

    ) {

      return response(400, {

        error: "Invalid question"

      });

    }

  }

  if (data.event === "answer") {

    if (

      typeof data.answer !== "string" ||

      data.answer.length > 500

    ) {

      return response(400, {

        error: "Invalid answer"

      });

    }

  }

  if (data.event === "hint") {

    if (

      typeof data.hint !== "string" ||

      data.hint.length > MAX_HINT_LENGTH

    ) {

      return response(400, {

        error: "Invalid hint"

      });

    }

  }

  if (data.event === "final") {

    if (

      !Array.isArray(data.answers) ||

      data.answers.length !== TOTAL_QUESTIONS

    ) {

      return response(400, {

        error: "Invalid summary"

      });

    }

  }

  if (!TELEGRAM_ENABLED) {

    return response(503, {

      error: "Telegram notifications are temporarily disabled"

    });

  }

  // Telegram sending will be added after

  // server-side rate limiting is implemented.

  return response(503, {

    error: "Telegram sending is not configured"

  });

};
