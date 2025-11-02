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

    // PAKAI RELATIF, bukan diawali '/'
    const HEADER_URL = "./partials/header.html";
    const FOOTER_URL = "./partials/footer.html";

    if (headerHost) await inject(headerHost, HEADER_URL);
    if (footerHost) await inject(footerHost, FOOTER_URL);

    if (window.lucide?.createIcons) window.lucide.createIcons();

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

    function setActiveNav() {
      const path = window.location.pathname;
      const isPersonal = /personal-counseling\.html$/.test(path);
      const isAssess = /assessment\.html$/.test(path);

      if (isPersonal || isAssess) {
        document.querySelectorAll(".nav-link").forEach((a) => {
          a.classList.toggle(
            "text-primary",
            a.getAttribute("data-nav") === "layanan"
          );
        });
        return;
      }
      const hash = window.location.hash.slice(1) || "beranda";
      document.querySelectorAll(".nav-link").forEach((a) => {
        a.classList.toggle("text-primary", a.getAttribute("data-nav") === hash);
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
