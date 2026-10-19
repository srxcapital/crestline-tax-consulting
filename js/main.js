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
  const isIPad = navigator.platform === "MacIntel"
    && navigator.maxTouchPoints > 1
    && window.matchMedia("(pointer: coarse)").matches;
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || isIPad;
  const isWindows = /Windows/i.test(ua);
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

  saveContact.removeAttribute("download");
  saveContact.removeAttribute("target");
  // Same contact card the QR code contains. Keep this as a real link so the
  // tap itself opens it. Chrome ignores an Android intent: URL, so that tap
  // did nothing.
  saveContact.href = contactUrl;

  const contactFile = new File([vcard], "Sumit Kukreja.vcf", { type: "text/vcard" });
  const isChromium = /Chrome|Chromium|Edg|OPR/i.test(ua);
  const phoneLayout = () => window.matchMedia("(max-width: 768px)").matches;

  saveContact.addEventListener("click", (event) => {
    // iPhone opens this .vcf as the contact card, the same card a vCard QR shows.
    if (isIOS) return;

    if (isAndroid) {
      if (navigator.canShare && navigator.canShare({ files: [contactFile] })) {
        event.preventDefault();
        navigator.share({ files: [contactFile], title: "Sumit Kukreja" }).catch((error) => {
          if (error && error.name === "AbortError") return;
          window.location.href = contactUrl;
        });
      }
      return;
    }

    // Phone layout in a desktop browser: follow the contact card. A data: URL
    // is blocked there, which made this button do nothing.
    if (phoneLayout()) return;

    if (!isChromium && !isWindows) return;

    event.preventDefault();

    if (navigator.canShare && navigator.canShare({ files: [contactFile] })) {
      navigator.share({ files: [contactFile], title: "Sumit Kukreja" }).catch((error) => {
        if (error && error.name === "AbortError") return;
        window.location.href = contactUrl;
      });
      return;
    }

    if (isWindows) {
      const params = new URLSearchParams({
        PhoneNumber: "+18043014498",
        Email: "sumit@crestlinetax.com",
        ContactName: "Sumit Kukreja",
      });
      window.location.href = "ms-people:savetocontact?" + params.toString();
      return;
    }

    window.location.href = "data:text/x-vcard;charset=utf-8," + encodeURIComponent(vcard);
  });
}
