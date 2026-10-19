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
  ].join("\r\n") + "\r\n";

  const fileUrl = new URL(saveContact.getAttribute("href"), window.location.href).href;
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isAndroid) {
    const extras = [
      ["name", "Sumit Kukreja"],
      ["phone", "+18043014498"],
      ["email", "sumit@crestlinetax.com"],
      ["company", "Crestline Tax & Accounting"],
      ["job_title", "Tax Consultant"],
      ["postal", "5600 Roswell Rd Bldg C, Sandy Springs, GA 30342"],
      ["notes", "https://crestlinetax.com"],
    ].map(([key, value]) => `S.${key}=${encodeURIComponent(value)}`);
    saveContact.href = [
      "intent:#Intent",
      "action=android.intent.action.INSERT",
      "type=vnd.android.cursor.item/contact",
      ...extras,
      `S.browser_fallback_url=${encodeURIComponent(fileUrl)}`,
      "end",
    ].join(";");
  } else if (isIOS) {
    // A direct vCard link opens the same contact card the camera shows for the QR code.
    saveContact.href = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcard);
  }

  saveContact.addEventListener("click", async (event) => {
    if (isAndroid || isIOS) return;

    const file = new File([vcard], "Sumit-Kukreja.vcf", { type: "text/vcard" });
    if (!navigator.canShare || !navigator.canShare({ files: [file] })) return;

    event.preventDefault();
    try {
      await navigator.share({ files: [file], title: "Sumit Kukreja" });
    } catch (error) {
      if (error && error.name === "AbortError") return;
      window.location.href = fileUrl;
    }
  });
}
