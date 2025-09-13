const express = require("express");
const cors = require("cors");

// Import other routes
const statsRoutes = require("./routes/stats");
const chartRoutes = require("./routes/chart");
const aiChatRoutes = require("./routes/aiChat");
const billingRoutes = require("./routes/billing");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/stats", statsRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/ai-chat", aiChatRoutes);
app.use("/api/billing", billingRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Smart Meter API is running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
