// Keep JS minimal for speed.

(() => {
  const $ = (s, r = document) => r.querySelector(s);

  // Footer year
  const yearEl = $("#vh-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const burger = $(".vh-burger");
  const nav = $(".vh-nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close nav on link click (mobile)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (window.matchMedia("(max-width: 760px)").matches) {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Floating contact panel
  const fab = $("#vh-fab");
  const fabPanel = $("#vh-fab-panel");
  if (fab && fabPanel) {
    const closeFab = () => {
      fabPanel.classList.remove("is-open");
      fabPanel.setAttribute("aria-hidden", "true");
      fab.setAttribute("aria-expanded", "false");
    };

    fab.addEventListener("click", () => {
      const isOpen = fabPanel.classList.toggle("is-open");
      fabPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      fab.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      const inside = e.target.closest("#vh-fab, #vh-fab-panel");
      if (!inside) closeFab();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFab();
    });
  }

  // Search (client-side "AJAX-like" suggestions)
  const input = $("#vh-search-input");
  const box = $("#vh-search-suggestions");
  if (input && box) {
    // Later: replace hrefs with real pages (when you add 30-50 pages)
    const PAGES = [
      { title: "Conveyor Systems", desc: "Design, build, install conveyors", href: "#services" },
      { title: "Stainless Steel Fabrications", desc: "Custom stainless fabrication work", href: "#services" },
      { title: "Customized Machinery", desc: "Purpose-built machines & fixtures", href: "#services" },
      { title: "Powder Coating", desc: "Durable industrial finishes", href: "#services" },
      { title: "Maintenance & Repair", desc: "Reduce downtime, extend lifespan", href: "#services" },
      { title: "Iron Work", desc: "Industrial iron fabrication", href: "#services" },
      { title: "Wood Work", desc: "Woodwork components & builds", href: "#services" },
      { title: "Contact", desc: "Email sales@vahako.com", href: "#contact" }
    ];

    const openBox = () => box.classList.add("is-open");
    const closeBox = () => box.classList.remove("is-open");

    const render = (items) => {
      if (!items.length) {
        box.innerHTML = `<div class="vh-suggest"><strong>No results</strong><small>Try “conveyor”, “powder coating”, “stainless”.</small></div>`;
        openBox();
        return;
      }
      box.innerHTML = items
        .slice(0, 6)
        .map(
          (p) => `
          <a class="vh-suggest" href="${p.href}">
            <strong>${escapeHtml(p.title)}</strong>
            <small>${escapeHtml(p.desc)}</small>
          </a>`
        )
        .join("");
      openBox();
    };

    const escapeHtml = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    let t = null;
    input.addEventListener("input", () => {
      clearTimeout(t);
      const q = input.value.trim().toLowerCase();
      if (!q) return closeBox();

      // tiny debounce to feel "AJAX"
      t = setTimeout(() => {
        const results = PAGES.filter((p) => {
          const hay = (p.title + " " + p.desc).toLowerCase();
          return hay.includes(q);
        });
        render(results);
      }, 60);
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) openBox();
    });

    document.addEventListener("click", (e) => {
      const inside = e.target.closest(".vh-search");
      if (!inside) closeBox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeBox();
    });
  }
})();
