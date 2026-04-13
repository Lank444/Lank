// ====== firebase.js ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB57soTjoHei3M535jE_00F2NSzRXXIKdo",
  authDomain: "kopi-nusantara-61658.firebaseapp.com",
  databaseURL: "https://kopi-nusantara-61658-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kopi-nusantara-61658",
  storageBucket: "kopi-nusantara-61658.firebasestorage.app",
  messagingSenderId: "20191939044",
  appId: "1:20191939044:web:aea22a05b5a556826d9ff1",
  measurementId: "G-KPDMB2FV00"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
