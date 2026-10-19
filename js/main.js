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
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIPad = navigator.platform === "MacIntel"
    && navigator.maxTouchPoints > 1
    && window.matchMedia("(pointer: coarse)").matches;
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || isIPad;
  const isWindows = /Windows/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS|Android/i.test(ua);
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Kukreja;Sumit;;;",
    "FN:Sumit Kukreja",
    "ORG:Crestline Tax & Accounting",
    "TITLE:Tax Consultant",
    "TEL:+18043014498",
    "EMAIL:sumit@crestlinetax.com",
    "URL:https://crestlinetax.com",
    "ADR:;;5600 Roswell Rd Bldg C;Sandy Springs;GA;30342;USA",
    "END:VCARD",
    "",
  ].join("\r\n");
  const contactFile = new File([vcard], "Sumit Kukreja.vcf", { type: "text/vcard" });

  saveContact.removeAttribute("download");
  saveContact.removeAttribute("target");

  saveContact.addEventListener("click", (event) => {
    // iPhone and desktop Safari open this vCard as the contact card.
    if (isIOS || isSafari) return;

    if (isAndroid && !(navigator.canShare && navigator.canShare({ files: [contactFile] }))) return;

    event.preventDefault();

    if (navigator.canShare && navigator.canShare({ files: [contactFile] })) {
      navigator.share({ files: [contactFile], title: "Sumit Kukreja" }).catch(() => {});
      return;
    }

    if (isWindows) {
      const params = new URLSearchParams({
        PhoneNumber: "+18043014498",
        Email: "sumit@crestlinetax.com",
        ContactName: "Sumit Kukreja",
      });
      window.location.href = "ms-people:savetocontact?" + params.toString();
    }
  });
}
