// routes/stats.js
const express = require("express");
const router = express.Router();
const db = require("../firebase/admin"); // exports admin.database()

// GET /api/stats
router.get("/", async (req, res) => {
  try {
    // Fetch data from the correct Firebase path
    const snapshot = await db.ref("energy_monitor/live_data").once("value");
    const stats = snapshot.val();

    if (!stats) {
      return res.status(404).json({ error: "No live data found" });
    }

    // Map fields to match frontend expectations
    const mappedStats = {
      voltage: stats.voltage || 0,
      current: stats.current || stats.avg_pzem_current || 0,
      ct_current: stats.ct_current || stats.avg_ct_current || 0,
      power: stats.power || 0,
      frequency: stats.frequency || 0,
      energy: stats.energy || 0,
      load: stats.load || 0,
      power_factor: stats.power_factor || 0,
      reed_switch_state: stats.reed_switch_state || false,
      relay_triggered: stats.relay_triggered || false,
      tamper_detected: stats.tamper_detected || false,
      theft_detected: stats.theft_detected || false,
      second_pzem_connected: stats.second_pzem_connected || false,
    };

    res.json(mappedStats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
