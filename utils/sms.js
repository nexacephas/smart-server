// utils/sms.js
const axios = require("axios");
require("dotenv").config();

const sendSMS = async (to, message) => {
  try {
    const payload = {
      to: +2349060477002,// must be +234... format
      from: process.env.TERMII_SENDER_ID || "Termii",
      sms: message,
      type: "plain",
      channel: "generic", // or "dnd"
      api_key: process.env.TERMII_API_KEY,
    };

    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Termii SMS sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Termii SMS error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { sendSMS };
