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
