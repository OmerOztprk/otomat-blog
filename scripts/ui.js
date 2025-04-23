document.addEventListener('DOMContentLoaded', () => {
    // Mobil menü toggle
    setupMobileMenu();
    
    // Scroll event'ini dinle
    handleScroll();
    
    // Smooth scroll için link tıklamaları
    setupSmoothScroll();
  });
  
  // Mobil menü için
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav__list');
    const mobileNav = document.createElement('div');
    
    // Mobil menü oluştur
    mobileNav.classList.add('mobile-menu');
    mobileNav.appendChild(navList.cloneNode(true));
    document.body.appendChild(mobileNav);
    
    // Menü toggle butonu için olay dinleyici
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
    
    // Mobil menüdeki linklere tıklayınca menüyü kapat
    const mobileLinks = mobileNav.querySelectorAll('.nav__link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
  
  // Scroll olayı için
  function handleScroll() {
    const header = document.querySelector('.header');
    
    // Sayfa yüklendiğinde kontrol et
    checkScrollPosition();
    
    // Scroll olayını dinle
    window.addEventListener('scroll', checkScrollPosition);
    
    function checkScrollPosition() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
  
  // Smooth scroll için
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Header'ın yüksekliğini hesapla
          const headerHeight = document.querySelector('.header').offsetHeight;
          
          // Scroll pozisyonunu hesapla
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          // Scroll işlemini yap
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Sayfa yüklendiğinde animasyonlar
  window.addEventListener('load', () => {
    // Hero section'ı göster
    const hero = document.querySelector('.hero');
    hero.style.opacity = 0;
    
    setTimeout(() => {
      hero.style.transition = 'opacity 1s ease';
      hero.style.opacity = 1;
    }, 200);
    
    // Scroll reveal efekti için gözlemci
    setupScrollReveal();
  });
  
  // Scroll Reveal efekti
  function setupScrollReveal() {
    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('section:not(.hero)');
      
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
      });
      
      // Reveal CSS class
      document.head.insertAdjacentHTML('beforeend', `
        <style>
          .reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        </style>
      `);
    }
  }