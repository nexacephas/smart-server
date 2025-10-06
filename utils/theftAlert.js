const axios = require("axios");
require("dotenv").config();

if (!process.env.TELEGRAM_TOKENS || !process.env.CHAT_IDS) {
  throw new Error("❌ TELEGRAM_TOKENS or CHAT_IDS not set in .env file");
}

const TELEGRAM_TOKENS = process.env.TELEGRAM_TOKENS.split(",");
const CHAT_IDS = process.env.CHAT_IDS.split(",");

if (TELEGRAM_TOKENS.length !== CHAT_IDS.length) {
  throw new Error("❌ TELEGRAM_TOKENS and CHAT_IDS count mismatch");
}

async function sendTheftAlert(details) {
  const meterId = "MT-001"; // 🔒 Hardcoded Meter ID

  const message = `🚨 Theft Detection Alert!
  
📟 Meter ID: ${meterId}
📍 Location: ${details.location}
⏰ Time: ${details.time}
⚡ Status: ${details.status}`;

  try {
    await Promise.all(
      TELEGRAM_TOKENS.map((token, i) =>
        axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: CHAT_IDS[i],
          text: message,
          parse_mode: "Markdown",
        })
      )
    );
    console.log("✅ Alerts sent to all configured bots");
  } catch (error) {
    console.error("❌ Failed to send alert", error.response?.data || error.message);
  }
}

module.exports = { sendTheftAlert };
