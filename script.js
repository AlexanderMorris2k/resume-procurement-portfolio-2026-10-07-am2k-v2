(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const order = ["home", "impact", "experience", "expertise", "resume"];
  const labels = {
    home: "Home",
    impact: "Impact",
    experience: "Experience",
    expertise: "Expertise",
    resume: "Résumé"
  };

  const tabs = [...document.querySelectorAll("[data-blade]")];
  const panels = [...document.querySelectorAll("[data-panel]")];
  const jumps = [...document.querySelectorAll("[data-jump]")];
  const progress = [...document.querySelectorAll(".screen-progress i")];
  const route = document.querySelector("[data-route]");
  const liveRegion = document.querySelector("[data-live-region]");
  const clock = document.querySelector("[data-clock]");
  const year = document.querySelector("[data-year]");
  const nextButton = document.querySelector("[data-next]");
  const previousButton = document.querySelector("[data-prev]");
  const stack = document.querySelector("[data-panel-stack]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = "home";
  let touchStartX = null;

  const validName = (name) => order.includes(name) ? name : "home";
  const fromHash = () => validName(window.location.hash.replace(/^#/, "").toLowerCase());

  const setClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  };

  const activate = (name, options = {}) => {
    const target = validName(name);
    const previousIndex = order.indexOf(active);
    const nextIndex = order.indexOf(target);
    const direction = nextIndex >= previousIndex ? "next" : "prev";

    tabs.forEach((tab) => {
      const selected = tab.dataset.blade === target;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.dataset.panel === target;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
      panel.classList.remove("is-entering-next", "is-entering-prev");
      if (selected && !reducedMotion && target !== active) {
        panel.classList.add(direction === "next" ? "is-entering-next" : "is-entering-prev");
      }
      if (selected) panel.scrollTop = 0;
    });

    progress.forEach((item, index) => item.classList.toggle("is-active", index === nextIndex));
    if (route) route.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${labels[target]}`;
    if (liveRegion) liveRegion.textContent = `${labels[target]} section selected`;

    active = target;
    document.body.dataset.active = target;

    if (options.updateHash !== false) {
      history.replaceState(null, "", `#${target}`);
    }
    if (options.focusTab) {
      tabs[nextIndex]?.focus();
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.blade));
    tab.addEventListener("keydown", (event) => {
      const current = order.indexOf(tab.dataset.blade);
      let destination = null;
      if (event.key === "ArrowRight") destination = (current + 1) % order.length;
      if (event.key === "ArrowLeft") destination = (current - 1 + order.length) % order.length;
      if (event.key === "Home") destination = 0;
      if (event.key === "End") destination = order.length - 1;
      if (destination === null) return;
      event.preventDefault();
      activate(order[destination], { focusTab: true });
    });
  });

  jumps.forEach((control) => {
    control.addEventListener("click", (event) => {
      if (control.tagName === "A") event.preventDefault();
      activate(control.dataset.jump);
    });
  });

  nextButton?.addEventListener("click", () => {
    const nextIndex = (order.indexOf(active) + 1) % order.length;
    activate(order[nextIndex]);
  });

  previousButton?.addEventListener("click", () => {
    const previousIndex = (order.indexOf(active) - 1 + order.length) % order.length;
    activate(order[previousIndex]);
  });

  window.addEventListener("hashchange", () => activate(fromHash(), { updateHash: false }));

  stack?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });

  stack?.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 70) return;
    const current = order.indexOf(active);
    const next = delta < 0
      ? (current + 1) % order.length
      : (current - 1 + order.length) % order.length;
    activate(order[next]);
  }, { passive: true });

  if (!reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--pointer-x", `${x * 7}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y * 7}px`);
    }, { passive: true });
  }

  if (year) year.textContent = new Date().getFullYear();
  setClock();
  window.setInterval(setClock, 30_000);
  activate(fromHash(), { updateHash: false });
})();
