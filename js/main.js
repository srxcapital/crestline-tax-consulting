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

  const androidContactUrl = [
    "intent:#Intent",
    "action=android.intent.action.INSERT",
    "type=vnd.android.cursor.dir/contact",
    "S.name=" + encodeURIComponent("Sumit Kukreja"),
    "S.phone=" + encodeURIComponent("+18043014498"),
    "S.email=" + encodeURIComponent("sumit@crestlinetax.com"),
    "S.company=" + encodeURIComponent("Crestline Tax & Accounting"),
    "S.job_title=" + encodeURIComponent("Tax Consultant"),
    "S.postal=" + encodeURIComponent("5600 Roswell Rd Bldg C, Sandy Springs, GA 30342"),
    "S.notes=" + encodeURIComponent("https://crestlinetax.com"),
    "end",
  ].join(";");

  const isMobile = isAndroid || isIOS;
  // A real tap has to open the contact. Cancelling it in script does nothing on a phone.
  if (isAndroid) saveContact.href = androidContactUrl;
  else if (isIOS) saveContact.href = contactUrl;

  saveContact.addEventListener("click", async (event) => {
    if (isMobile) return;

    event.preventDefault();

    const file = new File([vcard], "Sumit Kukreja.vcf", { type: "text/vcard" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Sumit Kukreja" });
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
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

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "Sumit Kukreja.vcf",
          types: [{ description: "Contact card", accept: { "text/vcard": [".vcf"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(vcard);
        await writable.close();
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    link.download = "Sumit Kukreja.vcf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}
