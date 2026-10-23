(async function init() {
  try {
    const profile = await requireAdmin();
    if (!profile) return;

    const coursesCard = document.getElementById("courses-card");
    if (coursesCard) {
      coursesCard.hidden = false;
    }

    const form = document.getElementById("course-form");
    const button = document.getElementById("save-button");
    const message = document.getElementById("message");

    function show(text, kind) {
      message.textContent = text;
      message.className = `message ${kind}`;
      message.hidden = false;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const courseCode = form.course_code.value.trim();
      const courseTitle = form.course_title.value.trim();
      const department = form.department.value.trim();

      if (!courseCode || !courseTitle || !department) {
        show("Please fill in every field.", "error");
        return;
      }

      if (!db) {
        show("The app is not connected to the database yet: js/config.js still has placeholder keys.", "error");
        return;
      }

      button.disabled = true;
      try {
        const { error } = await db.from("courses").insert({
          course_code: courseCode,
          course_title: courseTitle,
          department: department,
        });

        if (error) {
          if (String(error.code) === "23505" || (error.message && error.message.includes("23505"))) {
            show("A course with this code already exists.", "error");
          } else {
            show(error.message || "Failed to save course.", "error");
          }
          return;
        }

        show("Course saved.", "success");
        form.reset();
      } catch (err) {
        console.error(err);
        show(err.message || "Could not reach the server. Check your connection and try again.", "error");
      } finally {
        button.disabled = false;
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
