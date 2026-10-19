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

const fitProbe = document.createElement("span");
fitProbe.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;pointer-events:none;";
document.body.appendChild(fitProbe);

function textBeforeBreak(el, br) {
  let text = "";
  for (let node = el.firstChild; node && node !== br; node = node.nextSibling) {
    text += node.textContent;
  }
  return text.replace(/\s+/g, " ").trim();
}

function measureText(source, text, fontSize) {
  const style = getComputedStyle(source);
  fitProbe.style.font = style.font;
  fitProbe.style.letterSpacing = style.letterSpacing;
  fitProbe.style.fontSize = fontSize;
  fitProbe.textContent = text;
  return fitProbe.getBoundingClientRect().width;
}

function availableWidth(el) {
  const parent = el.parentElement;
  if (!parent) return el.clientWidth;
  const parentStyle = getComputedStyle(parent);
  const display = parentStyle.display;
  if (display !== "flex" && display !== "inline-flex") return el.clientWidth;

  let taken = 0;
  for (const child of parent.children) {
    if (child === el) continue;
    const childStyle = getComputedStyle(child);
    taken += child.getBoundingClientRect().width;
    taken += parseFloat(childStyle.marginLeft) + parseFloat(childStyle.marginRight);
  }
  const gapValue = parentStyle.columnGap && parentStyle.columnGap !== "normal" ? parentStyle.columnGap : parentStyle.gap;
  const gap = parseFloat(gapValue) || 0;
  const gaps = Math.max(0, parent.children.length - 1) * gap;
  const pad = parseFloat(parentStyle.paddingLeft) + parseFloat(parentStyle.paddingRight);
  return Math.max(0, parent.clientWidth - pad - taken - gaps);
}

function layoutServiceLabels() {
  document.querySelectorAll(".sc-services").forEach((list) => {
    const items = [...list.querySelectorAll(":scope > li")];
    if (!items.length || list.clientWidth === 0) return;

    const base = parseFloat(getComputedStyle(items[0]).fontSize);
    const minSize = 9.5;

    items.forEach((item) => {
      const label = item.querySelector("span");
      if (!label || label.clientWidth === 0) return;
      const br = label.querySelector("br");
      const head = br ? textBeforeBreak(label, br) : label.textContent.replace(/\s+/g, " ").trim();
      const available = availableWidth(label);
      let needed = measureText(item, head, base + "px");
      let size = base;

      if (needed > available + 0.5) {
        size = Math.max(minSize, base * ((available - 1) / needed));
        while (size > minSize && measureText(item, head, size + "px") > available + 0.5) {
          size = Math.max(minSize, Math.round((size - 0.1) * 100) / 100);
        }
        needed = measureText(item, head, size + "px");
      }

      if (needed <= available + 0.5) {
        const sizeValue = size < base - 0.05 ? size.toFixed(2) + "px" : "";
        if (label.style.fontSize !== sizeValue) label.style.fontSize = sizeValue;
        br?.classList.remove("is-flow");
        return;
      }

      if (label.style.fontSize) label.style.fontSize = "";
      br?.classList.add("is-flow");
    });
  });
}

function layoutFitLines() {
  document.querySelectorAll(".fit-line").forEach((el) => {
    if (el.clientWidth === 0) return;
    const parentSize = parseFloat(getComputedStyle(el.parentElement).fontSize);
    const minSize = Math.min(parentSize, 9.5);
    const br = el.querySelector("br");
    const head = br ? textBeforeBreak(el, br) : el.textContent.replace(/\s+/g, " ").trim();
    let needed = measureText(el.parentElement, head, parentSize + "px");
    const available = availableWidth(el);

    if (!available) return;

    let size = parentSize;
    if (needed > available + 0.5) {
      size = Math.max(minSize, parentSize * ((available - 1) / needed));
      while (size > minSize && measureText(el.parentElement, head, size + "px") > available + 0.5) {
        size = Math.max(minSize, Math.round((size - 0.1) * 100) / 100);
      }
      needed = measureText(el.parentElement, head, size + "px");
    }

    if (needed <= available + 0.5) {
      const sizeValue = size < parentSize - 0.05 ? size.toFixed(2) + "px" : "";
      if (el.style.fontSize !== sizeValue) el.style.fontSize = sizeValue;
      br?.classList.remove("is-flow");
      return;
    }

    const fallback = minSize.toFixed(2) + "px";
    if (el.style.fontSize !== fallback) el.style.fontSize = fallback;
    br?.classList.add("is-flow");
  });
}

let fitFrame = 0;
function layoutFittingText() {
  cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(() => {
    layoutServiceLabels();
    layoutFitLines();
  });
}

if (document.querySelector(".sc-services, .fit-line")) {
  const fitObserver = new ResizeObserver(layoutFittingText);
  document.querySelectorAll(".sc-services, .fit-line").forEach((el) => fitObserver.observe(el));
  document.fonts?.ready.then(layoutFittingText);
  document.fonts?.addEventListener?.("loadingdone", layoutFittingText);
  layoutFittingText();
}
