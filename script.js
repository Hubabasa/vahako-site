(() => {
  const $ = (s, r = document) => r.querySelector(s);

  // Year in footer
  const year = $("#vh-year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const burger = $(".vh-burger");
  const nav = $(".vh-nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // "AJAX-like" search suggestions (fast, client-side)
  const input = $("#vh-search-input");
  const box = $("#vh-search-suggestions");

  if (input && box) {
    const PAGES = [
      { title: "Services", desc: "All fabrication categories", href: "#services" },
      { title: "Stainless Steel Fabrications", desc: "Custom stainless fabrication work", href: "#services" },
      { title: "Iron Work", desc: "Iron fabrication services", href: "#services" },
      { title: "Wood Work", desc: "Wood fabrication services", href: "#services" },
      { title: "Customized Machinery", desc: "Purpose-built machines & fixtures", href: "#services" },
      { title: "Conveyor Systems", desc: "Design and manufacture conveyors", href: "#services" },
      { title: "Powder Coating", desc: "Durable coating and finishing", href: "#services" },
      { title: "Maintenance & Repair", desc: "Preventive and corrective support", href: "#services" },
      { title: "Contact", desc: "sales@vahako.com", href: "#contact" },
      { title: "About", desc: "Vahako brand & company info", href: "#about" }
    ];

    const openBox = () => box.classList.add("is-open");
    const closeBox = () => box.classList.remove("is-open");

    const esc = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    let t = null;
    input.addEventListener("input", () => {
      clearTimeout(t);
      const q = input.value.trim().toLowerCase();
      if (!q) return closeBox();

      t = setTimeout(() => {
        const results = PAGES.filter(p => (p.title + " " + p.desc).toLowerCase().includes(q)).slice(0, 6);

        box.innerHTML = results.length
          ? results.map(p => `<a class="vh-suggest" href="${p.href}"><strong>${esc(p.title)}</strong><small>${esc(p.desc)}</small></a>`).join("")
          : `<div class="vh-suggest"><strong>No results</strong><smallTry a different keyword.</small></div>`;

        openBox();
      }, 60);
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) openBox();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".vh-search")) closeBox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeBox();
    });
  }
})();
