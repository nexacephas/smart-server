// routes/alertRoutes.js
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { sendSMS } = require("../utils/sms");

dotenv.config();
const router = express.Router();

// Example user profile store (for Telegram alerts)
let userSettings = {
  meterId: "MTR-001",
  name: "",
  phone: "",
  country: "",
  state: "",
  town: "",
  email: "",
};

// Route to send SMS alerts
router.post("/send-sms", async (req, res) => {
  try {
    const { phone, text } = req.body;
    if (!phone || !text) {
      return res
        .status(400)
        .json({ success: false, error: "Phone and text required" });
    }

    await sendSMS(phone, text);
    res.json({ success: true, message: "SMS sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to update user settings (used by frontend Settings page)
router.post("/update-settings", (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ success: true, message: "Settings updated", data: userSettings });
});

// Route to send theft detection alerts to Telegram
router.post("/send-telegram", async (req, res) => {
  try {
    const { status } = req.body;
    const location = `${userSettings.town}, ${userSettings.state}, ${userSettings.country}`;

    const message = `
🚨 Theft Detection Alert!

📟 Meter ID: ${userSettings.meterId}
📍 Location: ${location}
⏰ Time: ${new Date().toLocaleString()}
⚡ Status: ${status}
`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );

    res.json({ success: true, message: "Telegram alert sent!" });
  } catch (error) {
    console.error("Error sending Telegram alert:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
