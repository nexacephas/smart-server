// routes/chart.js
const express = require("express");
const router = express.Router();
const db = require("../firebase/admin");

// GET /api/chart?type=energy
router.get("/", async (req, res) => {
  const type = req.query.type || "energy"; // could be voltage, current, etc.

  try {
    const snapshot = await db.ref(`hardwareData/chart/${type}`).once("value");
    const chartDataObj = snapshot.val() || {}; // { timestamp: value, ... }

    // Convert to array and sort
    const chartDataArray = Object.entries(chartDataObj).map(([time, value]) => ({
      time: new Date(parseFloat(time)).toLocaleTimeString(), // readable time
      [type]: value,
    }));

    chartDataArray.sort((a, b) => new Date(a.time) - new Date(b.time));

    // Keep only the last 50 points
    const last50 = chartDataArray.slice(-50);

    res.json(last50);
  } catch (err) {
    console.error("Error fetching chart data:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
