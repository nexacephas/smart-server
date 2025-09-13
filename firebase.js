// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCniD14L_jYPyhpZpAzfheddjMseT23fUw",
  authDomain: "smart-meter-2025-c7b32.firebaseapp.com",
  databaseURL: "https://smart-meter-2025-c7b32-default-rtdb.firebaseio.com",
  projectId: "smart-meter-2025-c7b32",
  storageBucket: "smart-meter-2025-c7b32.firebasestorage.app",
  messagingSenderId: "958202144045",
  appId: "1:958202144045:web:90240c1f4e525a8ede5fa4",
  measurementId: "G-NNLLT2TEZR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, push };
