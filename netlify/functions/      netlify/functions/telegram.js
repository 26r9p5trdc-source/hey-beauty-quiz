// HEY BEAUTY — Telegram notifications
// Secure preparation: sending remains disabled.

const TELEGRAM_ENABLED = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === "true";

const questions = [
  {
    title: "The Very First Message 💌",
    opts: [
      "Hey gorgeous! I just had to tell you how beautiful you are! 😘",
      "Hé Beauty! Just wanna say I love your nice pics! Really nice! 😘",
      "Wow! Those pictures definitely caught my attention! 🔥",
      "Hi beautiful! I don't usually message strangers, but for you I'll make an exception! 😉"
    ]
  },
  {
    title: "Your First Reply 🥰",
    opts: [
      "Hey handsome! Thank you so much! 😘❤️",
      "Hello 🤗 Thank you ☺️ you are nice ♥️",
      "Hi! Haha, you're making me blush! 🥰",
      "Hello stranger! That's very sweet of you! 😉"
    ]
  },
  {
    title: "My Gentleman Era 😇",
    opts: ["3rd sentence", "5th sentence", "8th sentence", "12th sentence"]
  },
  {
    title: "The Piercing Conversation 😈",
    opts: [
      "Nipples 🙃☺️",
      "That's a secret… maybe I'll tell you later. 😉",
      "Pussy 🙃☺️",
      "Haha! Wouldn't you like to know? 😈"
    ]
  },
  {
    title: "My Very Subtle Reaction 😂",
    opts: [
      "Wow… now that's something I'd love to see! 😏🔥",
      "Are you serious? That sounds pretty exciting! 😘",
      "🙏\nLet it happen\nThat would be so hot",
      "OMG Beauty! You're really full of surprises! 😈"
    ]
  },
  {
    title: "The Piercing Prediction 💎",
    opts: ["Within 3 months", "Within 6 months", "Within 2.5 years", "Never"]
  },
  {
    title: "Our Next Special Evening 🌙",
    opts: [
      "A romantic dinner, wine and eye contact",
      "A playful, flirty adventure",
      "A luxury hotel and wellness evening",
      "A mystery date with surprises"
    ]
  },
  {
    title: "A Weekend Together 🥂",
    opts: [
      "Sweet & Romantic — dinner, a walk and cuddles",
      "Naughty & Playful — a flirty game and lots of laughter",
      "Luxury & Pleasure — wellness and a beautiful hotel",
      "Surprise Me — a mystery weekend"
    ]
  },
  {
    title: "Beauty’s Secret Wish 💋",
    opts: [
      "The Romantic Escape — a hotel weekend",
      "The Naughty Adventure — playful, flirty fun",
      "The Unexpected Kiss — our first kiss",
      "The Mystery Fantasy — something you haven’t revealed"
    ]
  },
  {
    title: "Truth or Dare, Beauty? 🎲",
    opts: [
      "The Kiss Challenge — tell me where you would like a kiss",
      "The Flirt Challenge — send a flirty message",
      "The Secret Truth — share one cheeky thought",
      "The Surprise Challenge — let me plan something romantic"
    ]
  },
  {
    title: "One Night, Five Possibilities 🌹",
    opts: [
      "The Romantic Dinner",
      "The Private Spa",
      "The Naughty Game Night",
      "The Mystery Adventure",
      "The Piercing Adventure — visiting a professional studio, only if YOU want to"
    ]
  },
  {
    title: "The Chemistry Test ⚡",
    opts: [
      "Sweet Connection — friendship and warmth",
      "Flirty Butterflies — that little spark",
      "Dangerous Chemistry — attraction and curiosity",
      "You Have No Idea… — thoughts I haven’t shared"
    ]
  },
  {
    title: "Beauty’s Naughty Bucket List 🔥",
    opts: [
      "The Midnight Escape — a spontaneous hotel night",
      "The Sensual Challenge — massages and flirting",
      "The Daring Adventure — trying something new",
      "The Secret Fantasy — a wish I haven’t revealed"
    ]
  },
  {
    title: "Behind the Flirting & the Smiles ❤️",
    opts: [
      "MY SAFE PLACE — You're someone I feel comfortable talking to, even when life gets difficult.",
      "MY SPECIAL CONNECTION — You're more than someone I flirt with. I value our honesty and support.",
      "MY SMILE ON A DIFFICULT DAY — You somehow make me smile, even on hard days.",
      "A LITTLE BIT OF EVERYTHING — I can laugh, flirt and be vulnerable with you."
    ]
  },
  {
    title: "Our Next Chapter ❤️",
    opts: [
      "ALWAYS MY SPECIAL FRIEND — keep sharing, supporting and laughing",
      "MORE FLIRTING, MORE FUN — teasing and surprises",
      "LET’S EXPLORE OUR CHEMISTRY — see where feelings take us, no pressure",
      "LET’S MAKE SOME MEMORIES — meet and create adventures",
      "OUR STORY, OUR WAY — discover it together, one step at a time"
    ]
  }
];

function reply(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(data)
  };
}

function validChoice(question, choice) {
  return (
    Number.isInteger(question) &&
    question >= 1 &&
    question <= questions.length &&
    Number.isInteger(choice) &&
    choice >= 0 &&
    choice < questions[question - 1].opts.length
  );
}

function validHint(hint) {
  return (
    typeof hint === "string" &&
    hint.trim().length > 0 &&
    hint.length <= 600
  );
}

function validSession(id) {
  return (
    typeof id === "string" &&
    id.length >= 10 &&
    id.length <= 64 &&
    /^[a-zA-Z0-9-]+$/.test(id)
  );
}

function buildMessage(data) {
  if (data.event === "answer") {
    if (!validChoice(data.question, data.choice)) return null;

    const q = questions[data.question - 1];

    return (
      `💋 BEAUTY — ANSWER ${data.question}/15\n\n` +
      `${q.title}\n\n` +
      `❤️ ${String.fromCharCode(65 + data.choice)}. ${q.opts[data.choice]}`
    );
  }

  if (data.event === "hint") {
    if (
      ![9, 13].includes(data.question) ||
      !validHint(data.hint)
    ) {
      return null;
    }

    const q = questions[data.question - 1];

    return (
      `💌 BEAUTY — OPTIONAL HINT\n\n` +
      `Question ${data.question}: ${q.title}\n\n` +
      data.hint.trim()
    );
  }

  if (data.event === "final") {
    if (
      !Array.isArray(data.answers) ||
      data.answers.length !== 15 ||
      !Number.isInteger(data.score) ||
      data.score < 0 ||
      data.score > 5 ||
      data.total !== 5
    ) {
      return null;
    }

    const lines = [];

    for (let i = 0; i < 15; i++) {
      const item = data.answers[i];

      if (
        !item ||
        item.question !== i + 1 ||
        !validChoice(item.question, item.choice)
      ) {
        return null;
      }

      if (
        item.hint !== undefined &&
        (
          ![9, 13].includes(item.question) ||
          !validHint(item.hint)
        )
      ) {
        return null;
      }

      const q = questions[i];

      lines.push(
        `${i + 1}. ${q.title}\n` +
        `${q.opts[item.choice]}` +
        (item.hint ? `\n💌 Hint: ${item.hint.trim()}` : "")
      );
    }

    const calculatedScore = [1, 1, 1, 2, 2].reduce(
      (score, correct, i) =>
        score + (data.answers[i].choice === correct ? 1 : 0),
      0
    );

    if (data.score !== calculatedScore) return null;

    return (
      `❤️ BEAUTY'S FINAL CONFESSIONS ❤️\n\n` +
      `Memory score: ${calculatedScore}/5\n\n` +
      lines.join("\n\n")
    );
  }

  return null;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  if (!event.body || event.body.length > 12000) {
    return reply(413, { error: "Invalid request size" });
  }

  let data;

  try {
    data = JSON.parse(event.body);
  } catch {
    return reply(400, { error: "Invalid JSON" });
  }

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !validSession(data.sessionId)
  ) {
    return reply(400, { error: "Invalid session" });
  }

  const message = buildMessage(data);

  if (!message) {
    return reply(400, { error: "Invalid quiz data" });
  }

  // Keep Telegram disabled until abuse protection is configured.
  if (!TELEGRAM_ENABLED) {
    return reply(503, {
      error: "Telegram notifications are temporarily disabled"
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  return reply(503, {
    error: "Telegram configuration is missing"
  });
}

try {
  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    }
  );

  if (!telegramResponse.ok) {
    console.error("Telegram delivery failed:", telegramResponse.status);

    return reply(502, {
      error: "Telegram delivery failed"
    });
  }

  return reply(200, {
    ok: true
  });

} catch (error) {
  console.error("Telegram connection error:", error.message);

  return reply(502, {
    error: "Telegram connection failed"
  });
}
};
// Limit requests to this function by IP address.
exports.config = {
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip"]
  }
};
