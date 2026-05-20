/* =========================
   SMART SEARCH SUGGESTIONS
   ========================= */
const PAGES = [
  { title: "Home", url: "index.html", keywords: ["vahako", "fabricator", "metal fabrication near me"] },
  { title: "Services", url: "services.html", keywords: ["sheet metal fabrication", "metal work", "stainless steel", "custom woodworking"] },
  { title: "Projects", url: "projects.html", keywords: ["custom machines", "metal work", "fabrication projects"] },
  { title: "Contact", url: "contact.html", keywords: ["quote", "contact", "location"] },
  { title: "Custom Fence", url: "custom-fence.html", keywords: ["custom fence", "gate", "metal fence"] },
  { title: "Customized Sink", url: "customized-sink.html", keywords: ["customized sink", "stainless sink", "kitchen"] }
];

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scoreMatch(query, item) {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(item.title);
  const hay = normalize(item.title + " " + item.keywords.join(" "));

  let score = 0;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 60;
  if (title.includes(q)) score += 40;
  if (hay.includes(q)) score += 20;

  // Word-by-word bonus
  const parts = q.split(/\s+/).filter(Boolean);
  let hits = 0;
  for (const p of parts) {
    if (p.length < 2) continue;
    if (hay.includes(p)) hits += 1;
  }
  score += hits * 8;

  return score;
}

function buildResults(query) {
  const q = normalize(query);
  if (!q) return [];

  return PAGES
    .map(p => ({ ...p, _score: scoreMatch(q, p) }))
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 6);
}

function renderResults(container, results) {
  if (!container) return;

  if (!results.length) {
    container.innerHTML = `<div class="hint">No matches.</div>`;
    container.style.display = "block";
    return;
  }

  container.innerHTML = results
    .map(r => `<a href="${r.url}">${escapeHtml(r.title)}</a>`)
    .join("");

  container.style.display = "block";
}

function hideResults(container) {
  if (!container) return;
  container.style.display = "none";
  container.innerHTML = "";
}

function wireSearch(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  if (!input || !results) return;

  let t = null;

  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const matches = buildResults(input.value);
      renderResults(results, matches);
    }, 80);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) {
      const matches = buildResults(input.value);
      renderResults(results, matches);
    }
  });

  document.addEventListener("click", (e) => {
    const within = results.contains(e.target) || input.contains(e.target);
    if (!within) hideResults(results);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideResults(results);
  });
}

/* =========================
   MOBILE HAMBURGER MENU
   ========================= */
function wireHamburger() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  function openMenu() {
    menu.style.display = "block";
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return menu.style.display === "block";
  }

  // Toggle on hamburger click
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevents the outside-click handler from immediately closing it
    if (isOpen()) closeMenu();
    else openMenu();
  });

  // Close when user clicks a link inside the mobile menu
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // Close when clicking anywhere outside the menu/hamburger
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;

    const clickedInsideMenu = menu.contains(e.target);
    const clickedHamburger = btn.contains(e.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Optional: close if window is resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && isOpen()) closeMenu();
  });
}


/* =========================
   PREFILL CONTACT BUTTONS
   ========================= */
function wirePrefillMessages() {
  const pageTitle = document.title || "Vahako.com";
  const message = `Hello, I am contacting you from page "${pageTitle}" from vahako.com.`;
  const encodedMessage = encodeURIComponent(message);

  // SMS (your HTML has id="vvSmsBtn")
  const smsBtn = document.getElementById("vvSmsBtn");
  if (smsBtn) {
    smsBtn.href = `sms:+94703595448?body=${encodedMessage}`;
  }

  // WhatsApp (your HTML uses classes, not an id)
  const waButtons = document.querySelectorAll(".vv-fab--wa, .vv-waDesk");
  waButtons.forEach(btn => {
    btn.href = `https://wa.me/94703595448?text=${encodedMessage}`;
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener");
  });
}

/* =========================
   FOOTER YEAR + BACK TO TOP
   ========================= */
function wireYearAndBackToTop() {
  // Auto update year
  const yearEl = document.getElementById("vvYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Back to top button
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) backToTopBtn.classList.add("show");
    else backToTopBtn.classList.remove("show");
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   INIT (RUN ON PAGE LOAD)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  wireSearch("searchDesktop", "resultsDesktop");
  wireSearch("searchMobile", "resultsMobile");
  wireHamburger();
  wirePrefillMessages();
  wireYearAndBackToTop();
});
