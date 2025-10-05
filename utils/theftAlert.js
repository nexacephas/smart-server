const axios = require("axios");
require("dotenv").config();

const TELEGRAM_TOKENS = process.env.TELEGRAM_TOKENS.split(",");
const CHAT_IDS = process.env.CHAT_IDS.split(",");

async function sendTheftAlert(details) {
  const message = `🚨 Theft Detection Alert!
  
📟 Meter ID: ${details.meterId}
📍 Location: ${details.location}
⏰ Time: ${details.time}
⚡ Status: ${details.status}`;

  try {
    for (let i = 0; i < TELEGRAM_TOKENS.length; i++) {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKENS[i]}/sendMessage`,
        {
          chat_id: CHAT_IDS[i],
          text: message,
          parse_mode: "Markdown",
        }
      );
      console.log(`✅ Alert sent to bot ${i + 1}`);
    }
  } catch (error) {
    console.error("❌ Failed to send alert", error.response?.data || error.message);
  }
}

module.exports = { sendTheftAlert };
