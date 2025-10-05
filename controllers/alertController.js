// controllers/alertController.js
const axios = require("axios");

const sendSms = async (req, res) => {
  try {
    const { phone, meterId, location, status } = req.body;

    if (!phone || !meterId || !location || !status) {
      return res.status(400).json({ 
        success: false, 
        error: "Phone, meterId, location, and status are required" 
      });
    }

    // Format theft alert message
    const alertMessage = `🚨 Theft Detection Alert!\n\n📟 Meter ID: ${meterId}\n📍 Location: ${location}\n⏰ Time: ${new Date().toLocaleString()}\n⚡ Status: ${status}`;

    const payload = {
      to: phone, // must be in +234... format
      from: process.env.TERMII_SENDER_ID || "Termii",
      sms: alertMessage,
      type: "plain",
      channel: "generic",
      api_key: process.env.TERMII_API_KEY,
    };

    const response = await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Termii SMS sent:", response.data);

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("❌ Error sending SMS:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
};

module.exports = { sendSms };
