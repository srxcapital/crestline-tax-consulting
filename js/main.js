const toggle = document.getElementById("menuToggle");
const links = document.getElementById("navLinks");
toggle?.addEventListener("click", () => {
  links.classList.toggle("open");
});

function closeNavDropdowns() {
  document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const dropdown = button.closest(".nav-dropdown");
    const willOpen = !dropdown.classList.contains("open");
    closeNavDropdowns();
    if (willOpen) {
      dropdown.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", closeNavDropdowns);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavDropdowns();
});

const saveContact = document.querySelector(".sc-save");
if (saveContact) {
  const contactUrl = new URL(saveContact.getAttribute("href"), window.location.href).href;
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  saveContact.removeAttribute("download");
  saveContact.removeAttribute("target");

  // Android opens the system Add Contact screen. A .vcf link only saves a file.
  const androidContactUrl = isAndroid
    ? [
        "intent:#Intent",
        "action=android.intent.action.INSERT",
        "type=vnd.android.cursor.item/contact",
        "S.name=" + encodeURIComponent("Sumit Kukreja"),
        "S.phone=" + encodeURIComponent("+18043014498"),
        "S.email=" + encodeURIComponent("sumit@crestlinetax.com"),
        "S.company=" + encodeURIComponent("Crestline Tax & Accounting"),
        "S.job_title=" + encodeURIComponent("Tax Consultant"),
        "S.postal=" + encodeURIComponent("5600 Roswell Rd Bldg C, Sandy Springs, GA 30342"),
        "S.notes=" + encodeURIComponent("https://crestlinetax.com"),
        "end",
      ].join(";")
    : "";

  if (isAndroid) saveContact.href = androidContactUrl;

  saveContact.addEventListener("click", (event) => {
    if (!isAndroid && !isIOS) return;
    event.preventDefault();
    window.location.href = isAndroid ? androidContactUrl : contactUrl;
  });
}
