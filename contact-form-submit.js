(() => {
  const DEFAULT_SHEET_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbwLiX_5vcog0m4zlCipfVuXfLrxbYPHMcmprdN5NFABePf3wzOAIfQE1r3G8BocXvOh/exec";

  const form = document.getElementById("contactLeadForm");
  if (!form) return;

  const statusEl = document.getElementById("contactFormStatus");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (message, type = "") => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const endpoint =
      form.getAttribute("data-sheet-endpoint") ||
      form.dataset.sheetEndpoint ||
      window.CONTACT_SHEET_ENDPOINT ||
      DEFAULT_SHEET_ENDPOINT ||
      "";

    if (!endpoint) {
      setStatus(
        "Set your Google Sheet endpoint in contact form data-sheet-endpoint.",
        "is-error"
      );
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }
    setStatus("Submitting...");

    const payload = new URLSearchParams(new FormData(form));
    payload.append("page", window.location.pathname);
    payload.append("submitted_at", new Date().toISOString());

    try {
      await fetch(endpoint, {
        method: "POST",
        body: payload,
        mode: "no-cors",
      });
      setStatus("Thank you. Your details were submitted successfully.", "is-success");
      form.reset();
    } catch (error) {
      setStatus("Submission failed. Please try again.", "is-error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
})();




