const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/reportController");

// Manual email trigger
router.post("/send", (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // ✅ Pass values properly
  sendEmail({ to, subject, text }, res);
});

module.exports = router;
