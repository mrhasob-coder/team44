const form = document.getElementById("login-form");
const button = document.getElementById("login-button");
const message = document.getElementById("message");

function show(text, kind) {
  message.textContent = text;
  message.className = `message ${kind}`;
  message.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    show("Please enter both email and password.", "error");
    return;
  }
  if (!db) {
    show("The app is not connected to the database yet: js/config.js still has placeholder keys.", "error");
    return;
  }

  button.disabled = true;
  try {
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      show(error.message || "Invalid login credentials.", "error");
      return;
    }

    if (data && data.session) {
      window.location.href = "home.html";
    } else {
      show("Log in failed: no session was created.", "error");
    }
  } catch (err) {
    show("Could not reach the server. Check your connection and try again.", "error");
  } finally {
    button.disabled = false;
  }
});
