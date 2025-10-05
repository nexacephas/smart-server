// notifications/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text, html = "") => {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Meter Reports" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };
