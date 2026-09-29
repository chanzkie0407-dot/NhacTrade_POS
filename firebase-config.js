// ==============================================
// NhacTrade POS — Firebase Config
// ==============================================

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD3sZ9z-9z9z9z9z9z9z9z9z9z9z9z9z9z9z9",
  authDomain: "nhactrade-pos.firebaseapp.com",
  projectId: "nhactrade-pos",
  storageBucket: "nhactrade-pos.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl01"
};

// Initialize only once
if (!window.firebaseApp) {
  window.firebaseApp = firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  console.log("✅ Firebase connected");
}

// Offline persistence
if (window.db) {
  db.enablePersistence({ synchronizeTabs: true })
    .then(() => console.log("✅ Offline mode ready"))
    .catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn("⚠️ Multiple tabs open — offline mode limited");
      } else if (err.code === 'unimplemented') {
        console.warn("⚠️ Browser does not support offline persistence");
      }
    });
}
