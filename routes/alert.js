import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Example user profile store (later you’ll fetch from DB)
let userSettings = {
  meterId: "MTR-001", // default
  name: "",
  phone: "",
  country: "",
  state: "",
  town: "",
  email: ""
};

// API to update settings from frontend (sync with Settings.js form)
router.post("/update-settings", (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ success: true, message: "Settings updated", data: userSettings });
});

// Theft detection alert
router.post("/send-telegram", async (req, res) => {
  try {
    const { status } = req.body; // e.g., "Tampering Detected"

    // Build location string
    const location = `${userSettings.town}, ${userSettings.state}, ${userSettings.country}`;

    // Alert message format 🚨
    const message = `
🚨 Theft Detection Alert!

📟 Meter ID: ${userSettings.meterId}
📍 Location: ${location}
⏰ Time: ${new Date().toLocaleString()}
⚡ Status: ${status}
`;

    // Send to Telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      }
    );

    res.json({ success: true, message: "Telegram alert sent!" });
  } catch (error) {
    console.error("Error sending Telegram alert:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
