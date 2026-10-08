// Small progressive enhancements. Everything is readable without JS.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal sections as they enter the viewport (hierarchy: draws the eye to each new block).
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");
    const revealer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));
  }

  // 8=1: the sticky phone shows the screen for whichever decision is in view (storytelling).
  const frame = document.querySelector(".pinned-frame");
  const steps = document.querySelectorAll(".pinned-steps li");
  if (frame && steps.length && "IntersectionObserver" in window) {
    const shots = frame.querySelectorAll("img");
    const activate = (name) => {
      shots.forEach((img) => img.classList.toggle("is-active", img.dataset.step === name));
      steps.forEach((li) => li.classList.toggle("is-active", li.dataset.step === name));
    };
    const stepper = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(entry.target.dataset.step);
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((li) => stepper.observe(li));
  }

  // Laminar: switch the same screen between wireframe, mid and high fidelity (state transition).
  const tabs = [...document.querySelectorAll('.seg [role="tab"]')];
  const panel = document.getElementById("fid-panel");
  const stageImg = panel && panel.querySelector("img");
  if (tabs.length && stageImg) {
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tab.id);
      if (focus) tab.focus();
      if (stageImg.getAttribute("src") === tab.dataset.src) return;
      stageImg.classList.add("is-swapping");
      setTimeout(() => {
        stageImg.src = tab.dataset.src;
        stageImg.alt = `Laminar home screen, ${tab.textContent.trim().toLowerCase()}`;
        stageImg.classList.remove("is-swapping");
      }, reduceMotion ? 0 : 200);
    };
    tabs.forEach((tab, i) => {
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        select(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
  }

  // While Figma exports are pending, show a labeled slot instead of a broken image.
  const markMissing = (img) => {
    if (!img.dataset.placeholder || img.classList.contains("is-missing")) return;
    img.classList.add("is-missing");
    const note = document.createElement("div");
    note.className = "missing-note";
    note.textContent = img.dataset.placeholder;
    img.after(note);
  };
  document.querySelectorAll("img[data-placeholder]").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    img.addEventListener("error", () => markMissing(img));
    img.addEventListener("load", () => {
      img.classList.remove("is-missing");
      if (img.nextElementSibling && img.nextElementSibling.classList.contains("missing-note")) img.nextElementSibling.remove();
    });
  });
})();
