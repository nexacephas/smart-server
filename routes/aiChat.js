const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ✅ switched from gpt-3.5-turbo
        messages: [{ role: "user", content: message }],
        max_tokens: 500, // optional: controls response length
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (err) {
    console.error("AI Chat error:", err.response?.status, err.response?.data);

    if (err.response?.status === 429) {
      return res.status(429).json({
        error: "Rate limit reached. Please wait a bit and try again.",
      });
    }

    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

module.exports = router;
