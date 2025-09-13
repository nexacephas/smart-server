const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    meterId: { type: String, required: true, unique: true }, // ⚡ Added meter ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
