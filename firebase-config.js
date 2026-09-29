// ==============================================
// NhacTrade POS — Firebase Config
// ==============================================

const firebaseConfig = {
  // I-PALIT MO SA TUNAY MO NA VALUES MULA SA FIREBASE!
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nhactrade-pos.firebaseapp.com",
  projectId: "nhactrade-pos",
  storageBucket: "nhactrade-pos.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl01"
};

// Initialize Firebase — shared across all pages
if (!window.nhacTrade) {
  window.nhacTrade = {};
  
  // Load Firebase SDK
  const app = firebase.initializeApp(firebaseConfig);
  window.nhacTrade.db = firebase.firestore();
  
  console.log("✅ Firebase connected");

  // Offline support
  window.nhacTrade.db.enablePersistence({ synchronizeTabs: true })
    .then(() => console.log("✅ Offline mode ready"))
    .catch(err => {
      console.warn("⚠️ Offline mode note:", err.code);
    });
}

// Shortcut para madaling tawagin sa lahat ng pages
const db = window.nhacTrade.db;
