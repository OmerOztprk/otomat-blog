/* ------------------------------------------------------------------
 *  Main bootstrap – run once DOM is ready
 * ------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScrollEffect();
  initSmoothAnchorScroll();
  initActiveLinkHighlighting();
});

window.addEventListener("load", () => {
  fadeInHeroSection();
  initScrollReveal();
});

/* ------------------------------------------------------------------
 *  Constants & helpers
 * ------------------------------------------------------------------*/
const SELECTORS = {
  header: ".header",
  menuToggle: ".menu-toggle",
  navList: ".nav__list",
  navLink: ".nav__link",
  hero: ".hero",
};
const SCROLL_OFFSET = 200; // Aktif link tetik mesafesi
const HEADER_SHRINK_POINT = 50; // Header küçültme eşiği

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/* ------------------------------------------------------------------
 *  1. Mobil Menü
 * ------------------------------------------------------------------*/
function initMobileMenu() {
  const toggleBtn = $(SELECTORS.menuToggle);
  const navList = $(SELECTORS.navList);
  const mobileNav = document.createElement("div");

  mobileNav.className = "mobile-menu";
  mobileNav.append(navList.cloneNode(true));
  document.body.append(mobileNav);

  // Menü aç / kapat
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Dışarı-tıkla dinleyicisini engelle
    toggleBtn.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  // Menü linkine tıklandığında kapat
  $$(SELECTORS.navLink, mobileNav).forEach((link) =>
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      toggleBtn.classList.remove("active");
    })
  );

  // Sayfanın geri kalanına tıklandığında kapat
  document.addEventListener("click", (e) => {
    if (
      mobileNav.classList.contains("active") && // Menü açık mı?
      !mobileNav.contains(e.target) && // Tıklama menünün içinde mi?
      !toggleBtn.contains(e.target) // veya toggle butonunda mı?
    ) {
      mobileNav.classList.remove("active");
      toggleBtn.classList.remove("active");
    }
  });
}

/* ------------------------------------------------------------------
 *  2. Header küçültme & “to-top” gibi scroll tabanlı görsel efektler
 * ------------------------------------------------------------------*/
function initHeaderScrollEffect() {
  const header = $(SELECTORS.header);

  const applyScrollState = () => {
    header.classList.toggle("scrolled", window.scrollY > HEADER_SHRINK_POINT);
  };

  applyScrollState(); // Sayfa ilk yüklendiğinde
  window.addEventListener("scroll", applyScrollState);
}

/* ------------------------------------------------------------------
 *  3. Dahili anchor’lar için “smooth scroll”
 * ------------------------------------------------------------------*/
function initSmoothAnchorScroll() {
  $$('a[href^="#"]').forEach((link) =>
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return; // “en üste git” linki ise varsayılan davran

      e.preventDefault();
      const targetEl = $(targetId);
      if (!targetEl) return;

      const headerHeight = $(SELECTORS.header).offsetHeight;
      const position =
        targetEl.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: position, behavior: "smooth" });
    })
  );
}

/* ------------------------------------------------------------------
 *  4. Aktif menü linkini vurgulama
 * ------------------------------------------------------------------*/
function initActiveLinkHighlighting() {
  const sections = $$("section[id]");
  const links = $$(SELECTORS.navLink);

  const setActiveLink = () => {
    const ypos = window.pageYOffset + SCROLL_OFFSET;

    const activeSection = sections.find(
      (s) => ypos >= s.offsetTop && ypos < s.offsetTop + s.offsetHeight
    );

    links.forEach((link) =>
      link.classList.toggle(
        "active",
        activeSection && link.getAttribute("href") === `#${activeSection.id}`
      )
    );
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink);
}

/* ------------------------------------------------------------------
 *  5. Sayfa yüklendiğinde hero fade-in
 * ------------------------------------------------------------------*/
function fadeInHeroSection() {
  const hero = $(SELECTORS.hero);
  if (!hero) return;

  hero.style.opacity = 0;
  requestAnimationFrame(() =>
    setTimeout(() => {
      hero.style.transition = "opacity 1s ease";
      hero.style.opacity = 1;
    }, 200)
  );
}

/* ------------------------------------------------------------------
 *  6. Intersection-Observer ile Scroll-Reveal
 * ------------------------------------------------------------------*/
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;

  const sections = $$("section:not(.hero)");
  const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.1,
  });

  sections.forEach((sec) => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(30px)";
    sec.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(sec);
  });

  // Görünür olunca aktif hâle getir
  function handleIntersect(entries, obs) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        obs.unobserve(entry.target);
      }
    });
  }

  // Tek seferlik CSS kuralı
  if (!$("#reveal-style")) {
    const style = document.createElement("style");
    style.id = "reveal-style";
    style.textContent = `
      .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.append(style);
  }
}
