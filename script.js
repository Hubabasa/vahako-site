/* Smart search suggestions (grows as you add more pages) */
const PAGES = [
  // Add more items as your site grows
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

function scoreMatch(query, item) {
  const q = normalize(query);
  if (!q) return 0;

  const hay = normalize(item.title + " " + item.keywords.join(" "));
  // Simple fast scoring:
  // - exact title contains -> big score
  // - startsWith -> extra
  // - keyword contains -> medium
  let score = 0;

  const title = normalize(item.title);
  if (title === q) score += 100;
  if (title.startsWith(q)) score += 60;
  if (title.includes(q)) score += 40;

  if (hay.includes(q)) score += 20;

  // bonus for word-by-word
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

  const ranked = PAGES
    .map(p => ({ ...p, _score: scoreMatch(q, p) }))
    .filter(p => p._score > 0)
    .sort((a,b) => b._score - a._score)
    .slice(0, 6);

  return ranked;
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

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wireSearch(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  if (!input || !results) return;

  let t = null;

  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value;
      const matches = buildResults(q);
      renderResults(results, matches);
    }, 80); // tiny debounce for speed
  });

  input.addEventListener("focus", () => {
    const matches = buildResults(input.value);
    if (input.value.trim()) renderResults(results, matches);
  });

  document.addEventListener("click", (e) => {
    const within = results.contains(e.target) || input.contains(e.target);
    if (!within) hideResults(results);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideResults(results);
  });
}

/* Mobile hamburger */
function wireHamburger() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.style.display === "block";
    menu.style.display = open ? "none" : "block";
    btn.setAttribute("aria-expanded", open ? "false" : "true");
  });
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  wireSearch("searchDesktop", "resultsDesktop");
  wireSearch("searchMobile", "resultsMobile");
  wireHamburger();
});

// Run after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // Auto update year
  const yearEl = document.getElementById("vvYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Back to top button
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});

