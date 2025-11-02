(function initPartialsAndPage() {
  // Fetch & inject partials
  async function inject(el, url) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Gagal fetch ${url} (${res.status})`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error("[include] inject error:", err);
    }
  }

  async function run() {
    const headerHost = document.querySelector('[data-include="header"]');
    const footerHost = document.querySelector('[data-include="footer"]');

    // Jika situs di subfolder, ubah ke "./partials/header.html" dan "./partials/footer.html"
    const HEADER_URL = "/partials/header.html";
    const FOOTER_URL = "/partials/footer.html";

    if (headerHost) await inject(headerHost, HEADER_URL);
    if (footerHost) await inject(footerHost, FOOTER_URL);

    // Inisialisasi ikon lucide setelah partials ter-inject
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

    // Reveal on scroll
    const revealElements = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((el) => io.observe(el));

    // Highlight nav aktif
    function setActiveNav() {
      const path = window.location.pathname;
      const isPersonalCounseling =
        path.endsWith("/personal-counseling.html") ||
        path.endsWith("personal-counseling.html");
      const isAssessment =
        path.endsWith("/assessment.html") || path.endsWith("assessment.html");

      // Jika sedang di halaman layanan terpisah, aktifkan tab "layanan"
      if (isPersonalCounseling || isAssessment) {
        document.querySelectorAll(".nav-link").forEach((a) => {
          const k = a.getAttribute("data-nav");
          a.classList.toggle("text-primary", k === "layanan");
        });
        return;
      }

      // Selain itu (landing): gunakan hash (#tentang, #team, dll); default "beranda"
      const hash = window.location.hash ? window.location.hash.slice(1) : "";
      const currentKey = hash || "beranda";
      document.querySelectorAll(".nav-link").forEach((a) => {
        const k = a.getAttribute("data-nav");
        a.classList.toggle("text-primary", k === currentKey);
      });
    }

    setActiveNav();
    window.addEventListener("hashchange", setActiveNav);
  }

  // Jalankan saat DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
