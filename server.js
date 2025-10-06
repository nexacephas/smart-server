// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { sendDailyReport } = require("./controllers/reportController");
const { sendSMS } = require("./utils/sms");
const { sendTheftAlert } = require("./utils/theftAlert.js");

// --- Firebase Admin ---
const admin = require("firebase-admin");

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  console.log("🔥 Initializing Firebase Admin...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
}

const db = admin.database();
const app = express();
app.use(cors());
app.use(express.json());

// --- Import Routes ---
const statsRoutes = require("./routes/stats");
const chartRoutes = require("./routes/chart");
const billingRoutes = require("./routes/billing");
const reportRoutes = require("./routes/report");
const alertRoutes = require("./routes/alert");
const chatRoutes = require("./routes/aiChat.js"); // your OpenAI route

// --- Mount Routes ---
app.use("/api/stats", statsRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/chat", chatRoutes);

// --- In-memory user settings store ---
let userSettings = {
  meterId: "MTR-001",
  name: "",
  phone: "",
  country: "",
  state: "",
  town: "",
  email: "",
};

// --- Helper: fetch last 24h stats ---
async function getDailyStats() {
  try {
    const energyRef = db.ref("hardwareData/chart/energy");
    const snapshot = await energyRef.once("value");
    const data = snapshot.val() || {};

    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    let totalEnergy = 0,
      totalVoltage = 0,
      totalCurrent = 0,
      peakPower = 0;
    let count = 0;

    Object.values(data).forEach((point) => {
      if (point.timestamp >= last24h) {
        totalEnergy += point.energy || 0;
        totalVoltage += point.voltage || 0;
        totalCurrent += point.current || 0;
        if (point.power && point.power > peakPower) peakPower = point.power;
        count++;
      }
    });

    return {
      totalEnergy: totalEnergy.toFixed(2),
      avgVoltage: count ? (totalVoltage / count).toFixed(2) : 0,
      avgCurrent: count ? (totalCurrent / count).toFixed(2) : 0,
      peakPower,
      records: count,
    };
  } catch (err) {
    console.error("❌ Error fetching daily stats:", err);
    return null;
  }
}

// --- Cron: daily report at 8AM ---
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Generating daily report...");
  const stats = await getDailyStats();
  if (stats) await sendDailyReport(stats);
});

// --- Default route ---
app.get("/", (req, res) => {
  res.send("✅ Smart Meter Backend Running!");
});

// --- Manual test report ---
app.get("/test-report", async (req, res) => {
  try {
    const stats = await getDailyStats();
    if (!stats) throw new Error("No stats available");
    await sendDailyReport(stats);
    res.json({ success: true, message: "Report sent to email!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
