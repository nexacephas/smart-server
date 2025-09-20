// firebase/admin.js
const admin = require("firebase-admin");

// Build service account object from env vars
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

// Pick whichever DB URL is available
const databaseURL =
  process.env.FIREBASE_DB_URL || process.env.FIREBASE_DATABASE_URL;

// Debug log (safe — doesn’t print secrets)
console.log("🔥 Firebase Admin initializing...");
console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
console.log("Database URL:", databaseURL);

if (!databaseURL) {
  throw new Error(
    "❌ Firebase Database URL is missing! Set FIREBASE_DB_URL or FIREBASE_DATABASE_URL in .env"
  );
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

// ✅ Export Realtime Database instance
const db = admin.database();

module.exports = db;
