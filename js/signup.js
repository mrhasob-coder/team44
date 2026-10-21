const form = document.getElementById("signup-form");
const button = document.getElementById("signup-button");
const message = document.getElementById("message");

// The same rule is enforced in handle_new_user (db/schema.sql); this check only gives a clear message first.
function isUniversityEmail(email) {
  const domain = (email.split("@")[1] || "").toLowerCase();
  return domain === "ku.edu.kw" || domain.endsWith(".ku.edu.kw");
}

function show(text, kind) {
  message.textContent = text;
  message.className = `message ${kind}`;
  message.hidden = false;
}

// Supabase reports a failed profiles insert (e.g. a duplicate student_id) only as a generic database error.
function explain(error) {
  const text = (error && error.message) || "";
  if (/already registered/i.test(text)) return "An account with this email already exists.";
  if (/database error saving new user/i.test(text)) {
    return "Sign-up was refused: this student ID is already registered, or the email is not a university address.";
  }
  if (/password/i.test(text)) return `Password problem: ${text}`;
  return `Sign-up failed: ${text || "unknown error"}.`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullName = form.full_name.value.trim();
  const studentId = form.student_id.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!fullName || !studentId || !email || !password) {
    show("Please fill in every field.", "error");
    return;
  }
  if (!isUniversityEmail(email)) {
    show("Only university email addresses (ending in ku.edu.kw) can sign up.", "error");
    return;
  }
  if (password.length < 6) {
    show("The password must be at least 6 characters.", "error");
    return;
  }
  if (!db) {
    show("The app is not connected to the database yet: js/config.js still has placeholder keys.", "error");
    return;
  }

  button.disabled = true;
  try {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, student_id: studentId },
        emailRedirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) {
      show(explain(error), "error");
    } else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      // With email confirmation on, Supabase answers a repeated email with an empty identities list instead of an error.
      show("An account with this email already exists.", "error");
    } else if (data.session) {
      show("Account created. You are signed in.", "success");
      form.reset();
    } else {
      show("Account created. Check your university email to confirm it.", "success");
      form.reset();
    }
  } catch (err) {
    show("Could not reach the server. Check your connection and try again.", "error");
  } finally {
    button.disabled = false;
  }
});
