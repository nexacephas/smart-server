// server/firebase/admin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-meter-2025-c7b32-default-rtdb.firebaseio.com", // your Realtime DB URL
});

const db = admin.database();

module.exports = db;
