// ==============================================
// AUTH MODULE — Login, Logout, Auto-Logout, Privacy Pin
// ==============================================

let currentUser = null;
let inactivityTimer = null;
let pinCheckTimer = null;
const PIN_TIMEOUT = 2 * 60 * 1000; // ⏱️ 2 minutes idle logout
const PIN_IDLE_TIMEOUT = 30 * 1000; // Require Pin after 30s background/idle

const DEFAULT_PASS = {
  admin: "8888",
  sp: "19970407chan"
};

// === PRIVACY PIN CHECK ===
async function checkPrivacyPin() {
  // Get Pin from SP settings in Firestore
  let pin = "1234"; // Default until SP sets custom
  try {
    const snap = await db.collection("settings").doc("privacyPin").get();
    if (snap.exists && snap.data().pin) pin = snap.data().pin;
  } catch (e) { /* use default */ }

  const entered = prompt("🔒 Enter Privacy Pin:");
  if (entered === null) { doLogout(); return false; }
  if (entered !== pin) {
    alert("❌ Wrong Pin!");
    return checkPrivacyPin(); // Ask again
  }
  return true;
}

// === APP GOES TO BACKGROUND / INACTIVE ===
function onAppBackground() {
  if (!currentUser) return;
  // Show Pin when returning — don't logout yet
  window.pendingPinCheck = true;
}

// === APP COMES BACK TO FOREGROUND ===
async function onAppForeground() {
  if (!currentUser || !window.pendingPinCheck) return;
  window.pendingPinCheck = false;
  const ok = await checkPrivacyPin();
  if (!ok) doLogout();
}

// === AUTO-LOGOUT TIMER ===
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    alert("⏰ Auto-logout: 2 minutes idle! Please log in again.");
    doLogout();
  }, PIN_TIMEOUT);
}

// === CLEAR PIN TIMER ===
function resetPinTimer() {
  window.pendingPinCheck = false;
}

// === LOGOUT ===
function doLogout() {
  currentUser = null;
  if (inactivityTimer) clearTimeout(inactivityTimer);
  window.pendingPinCheck = false;

  // Clear all fields
  const role = document.getElementById("user-role");
  const pass = document.getElementById("user-password");
  const error = document.getElementById("login-error");
  if (role) role.value = "";
  if (pass) pass.value = "";
  if (error) error.textContent = "";

  // Show login screen
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
  const loginScreen = document.getElementById("login-screen");
  if (loginScreen) loginScreen.classList.remove("hidden");
}

// === LOGIN ===
async function login() {
  if (!db) {
    alert("⏳ Connecting... Try again in 3 seconds.");
    return;
  }

  const role = document.getElementById("user-role").value;
  const pass = document.getElementById("user-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  if (!role) {
    errorEl.textContent = "⚠️ Select a role first!";
    return;
  }

  // Admin Login
  if (role === "admin") {
    try {
      const doc = await db.collection("credentials").doc("admin").get();
      const adminPass = doc.exists && doc.data()?.password || DEFAULT_PASS.admin;
      if (pass === adminPass) {
        currentUser = { role, id: "admin", name: "Admin" };
        showScreen("screen-admin");
        resetInactivityTimer();
        return;
      }
    } catch {
      if (pass === DEFAULT_PASS.admin) {
        currentUser = { role, id: "admin", name: "Admin" };
        showScreen("screen-admin");
        resetInactivityTimer();
        return;
      }
    }
    errorEl.textContent = "❌ Wrong password!";
    return;
  }

  // SP Login
  if (role === "sp") {
    try {
      const doc = await db.collection("credentials").doc("sp").get();
      const spPass = doc.exists && doc.data()?.password || DEFAULT_PASS.sp;
      if (pass === spPass) {
        currentUser = { role, id: "sp", name: "Service Provider" };
        showScreen("screen-sp");
        resetInactivityTimer();
        return;
      }
    } catch {
      if (pass === DEFAULT_PASS.sp) {
        currentUser = { role, id: "sp", name: "Service Provider" };
        showScreen("screen-sp");
        resetInactivityTimer();
        return;
      }
    }
    errorEl.textContent = "❌ Wrong password!";
    return;
  }

  // Cashier Login
  if (role === "cashier") {
    // Load cashiers first
    let cashiers = [];
    try {
      const snap = await db.collection("cashiers").get();
      cashiers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      cashiers = [];
    }

    const found = cashiers.find(c => c.password === pass);
    if (found) {
      currentUser = { role, id: found.id, name: found.name };
      showScreen("cashier-select-store");
      resetInactivityTimer();
      return;
    }
    errorEl.textContent = "❌ Cashier not found or wrong password!";
  }
}

// === SCREEN NAVIGATION ===
function showScreen(screenId) {
  document.getElementById("login-screen").classList.add("hidden");
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
  const el = document.getElementById(screenId);
  if (el) el.classList.remove("hidden");
}

// === LISTENERS — Reset timer on activity ===
document.addEventListener("click", () => {
  resetInactivityTimer();
  resetPinTimer();
});
document.addEventListener("keydown", () => {
  resetInactivityTimer();
  resetPinTimer();
});

// Detect tab/app switch
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    onAppBackground();
  } else {
    onAppForeground();
  }
});
