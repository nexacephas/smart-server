// routes/alertRoutes.js
const express = require("express");
const { sendSMS } = require("../utils/sms");

const router = express.Router();

router.post("/send-sms", async (req, res) => {
  try {
    const { phone, text } = req.body;
    if (!phone || !text) {
      return res.status(400).json({ success: false, error: "Phone and text required" });
    }

    await sendSMS(phone, text);
    res.json({ success: true, message: "SMS sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
