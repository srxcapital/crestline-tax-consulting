const toggle = document.getElementById("menuToggle");
const links = document.getElementById("navLinks");
toggle?.addEventListener("click", () => {
  links.classList.toggle("open");
});
