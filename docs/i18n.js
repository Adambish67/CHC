(function () {
  const LANGS = {
    en: { label: "🇺🇸 EN", name: "English" },
    es: { label: "🇲🇽 ES", name: "Español" },
    ar: { label: "🇮🇶 AR", name: "العربية" }
  };

  function applyLanguage(lang) {
    if (!chcT[lang]) return;
    const t = chcT[lang];

    // Direction
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", lang === "ar");

    // Translate all data-i18n elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Translate nav items by href
    const navMap = {
      "./index.html":     "nav-home",
      "./about.html":     "nav-about",
      "./Contact.html":   "nav-contact",
      "./Resources.html": "nav-resources",
      "./Donate.html":    "nav-donate"
    };
    Object.entries(navMap).forEach(([href, key]) => {
      const el = document.querySelector(`.navbar a[href="${href}"] .menu-text`);
      if (el && t[key]) el.textContent = t[key];
    });

    // Update dropdown button label
    const btn = document.getElementById("chc-lang-btn");
    if (btn) btn.textContent = LANGS[lang].label + " ▾";

    localStorage.setItem("chc-lang", lang);
  }

  function injectDropdown() {
    const tools = document.querySelector(".quarto-navbar-tools");
    if (!tools) return;

    const wrapper = document.createElement("div");
    wrapper.className = "chc-lang-switcher";
    wrapper.innerHTML = `
      <button id="chc-lang-btn" class="chc-lang-btn" aria-label="Select language">🇺🇸 EN ▾</button>
      <div class="chc-lang-menu" id="chc-lang-menu">
        <a href="#" data-lang="en">🇺🇸 English</a>
        <a href="#" data-lang="es">🇲🇽 Español</a>
        <a href="#" data-lang="ar">🇮🇶 العربية</a>
      </div>
    `;
    tools.prepend(wrapper);

    // Toggle dropdown
    document.getElementById("chc-lang-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      document.getElementById("chc-lang-menu").classList.toggle("open");
    });

    // Language selection
    wrapper.querySelectorAll("[data-lang]").forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        applyLanguage(this.getAttribute("data-lang"));
        document.getElementById("chc-lang-menu").classList.remove("open");
      });
    });

    // Close on outside click
    document.addEventListener("click", function () {
      const menu = document.getElementById("chc-lang-menu");
      if (menu) menu.classList.remove("open");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectDropdown();
    const saved = localStorage.getItem("chc-lang") || "en";
    applyLanguage(saved);
  });
})();
