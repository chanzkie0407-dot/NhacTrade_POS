// ==============================================
// FIREBASE CONFIG — BPOS System
// ==============================================
const firebaseConfig = {
  apiKey: "AIzaSyAxuB4gacmWIf3U4Ic5TsOxSHCaynR0vhw",
  authDomain: "bpos-pos.firebaseapp.com",
  projectId: "bpos-pos",
  storageBucket: "bpos-pos.firebasestorage.app",
  messagingSenderId: "1024558399693",
  appId: "1:1024558399693:web:569e4e8207d5a75f32a984",
  measurementId: "G-9LLPPB482N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Enable Offline Mode
db.enablePersistence({ synchronizeTabs: true })
  .then(() => console.log("✅ Offline mode ready"))
  .catch(err => console.log("Offline note:", err.code));
