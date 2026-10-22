async function requireAuth() {
  if (!db) {
    window.location.href = "login.html";
    return null;
  }

  const { data: { session }, error: sessionError } = await db.auth.getSession();
  if (sessionError || !session || !session.user) {
    window.location.href = "login.html";
    return null;
  }

  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    window.location.href = "login.html";
    return null;
  }

  window.currentUser = profile;
  return profile;
}

window.requireAuth = requireAuth;

async function requireAdmin() {
  try {
    const profile = await requireAuth();
    if (!profile) return null;

    if (profile.role !== "admin") {
      const refusalHtml = `
        <main class="card">
          <p class="message error">This page is for library staff only.</p>
          <p><a href="home.html">Back to home</a></p>
        </main>
      `;
      if (document.body) {
        document.body.innerHTML = refusalHtml;
      } else {
        window.addEventListener("DOMContentLoaded", () => {
          document.body.innerHTML = refusalHtml;
        });
      }
      return null;
    }

    return profile;
  } catch (err) {
    console.error(err);
    window.location.href = "login.html";
    return null;
  }
}

window.requireAdmin = requireAdmin;
