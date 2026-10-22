(async function init() {
  try {
    const profile = await requireAdmin();
    if (!profile) return;

    const adminInfo = document.getElementById("admin-info");
    if (adminInfo) {
      adminInfo.textContent = `Signed in as ${profile.full_name} (admin)`;
    }

    const adminCard = document.getElementById("admin-card");
    if (adminCard) {
      adminCard.hidden = false;
    }
  } catch (err) {
    console.error(err);
  }
})();
