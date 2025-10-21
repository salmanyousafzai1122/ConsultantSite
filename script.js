// ===== Footer Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== EmailJS Initialization =====
(function() {
  emailjs.init("v6D4G99xKjSmb1lZD"); // Replace with your EmailJS public key
})();

// ===== Contact Form =====
document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.send("service_ro1tdvs", "template_z9qwi6a", {
    title: "Contact Us",
    name: this.name.value,
    email: this.email.value,
    message: this.message.value
  })
  .then(() => {
    showToast("✅ Message sent successfully!", "success");
    this.reset();
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    showToast("❌ Failed to send message. Please try again.", "error");
  });
});

// ===== Toast Notification =====
function showToast(message, type) {
  const toastContainer = document.getElementById("toast");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? "✅" : "❌"}</span> ${message}`;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
