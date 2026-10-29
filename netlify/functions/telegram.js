exports.handler = async function () {
  return {
    statusCode: 503,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: "Telegram delivery is not enabled yet"
    })
  };
};
