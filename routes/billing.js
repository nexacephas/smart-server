const express = require("express");
const router = express.Router();
const db = require("../firebase/admin"); // your Firebase admin setup

// ================================
// 1️⃣ Save a new billing transaction
// ================================
router.post("/", async (req, res) => {
  try {
    const { id, date, email, units, tariff, amount, status, reference } = req.body;

    // Validate required fields
    if (!id || !email || amount === undefined || amount === null) {
      return res.status(400).json({ error: "Missing required billing fields" });
    }

    // Ensure numeric fields
    const unitsNum = Number(units) || 0;
    const tariffNum = Number(tariff) || 0;
    const amountNum = Number(amount);

    if (isNaN(unitsNum) || isNaN(tariffNum) || isNaN(amountNum)) {
      return res.status(400).json({ error: "Units, tariff, and amount must be numbers" });
    }

    // Save billing under /billing/{id}
    await db.ref("billing").child(id).set({
      date: date || new Date().toISOString().split("T")[0],
      email,
      units: unitsNum,
      tariff: tariffNum,
      amount: amountNum,
      status: status || "Pending",
      reference: reference || "",
    });

    res.json({ message: "Billing record saved ✅" });
  } catch (err) {
    console.error("Billing save error:", err);
    res.status(500).json({ error: "Failed to save billing record" });
  }
});

// ================================
// 2️⃣ Get all billing records
// ================================
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref("billing").once("value");
    const data = snapshot.val() || {};
    res.json(data);
  } catch (err) {
    console.error("Fetch all billing error:", err);
    res.status(500).json({ error: "Failed to fetch billing records" });
  }
});

// ================================
// 3️⃣ Get latest billing record
// ================================
router.get("/latest", async (req, res) => {
  try {
    const snapshot = await db.ref("billing").orderByKey().limitToLast(1).once("value");
    const data = snapshot.val();
    const latest = data ? Object.values(data)[0] : null;
    res.json(latest);
  } catch (err) {
    console.error("Fetch latest billing error:", err);
    res.status(500).json({ error: "Failed to fetch latest billing record" });
  }
});

module.exports = router;
