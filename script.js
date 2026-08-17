/* ============================================================
   SIP & PLAY — EDITORIAL & CINEMATIC UX INTERACTIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Nav background blur shift
    const nav = document.getElementById('nav');
    if (nav) {
      if (winScroll > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 2. Fullscreen Mobile Navigation
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');

  if (burger && mobNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    const mobLinks = mobNav.querySelectorAll('.mob-nav__link');
    mobLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Smooth Hero Reveal
  const heroTitle = document.querySelector('.hero-cinematic__title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(24px)';
    heroTitle.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 150);
  }
});
