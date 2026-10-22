(async function init() {
  try {
    const profile = await requireAuth();
    if (!profile) return;

    const userInfo = document.getElementById("user-info");
    if (userInfo) {
      userInfo.textContent = `Signed in as ${profile.full_name} (${profile.role})`;
    }

    if (profile.role === "admin") {
      const adminMenu = document.getElementById("admin-menu");
      if (adminMenu) {
        adminMenu.hidden = false;
      }
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        try {
          if (db) {
            await db.auth.signOut();
          }
        } finally {
          window.location.href = "login.html";
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
})();
