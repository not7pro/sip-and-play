/* ============================================================
   SIP & PLAY — COMMERCIAL KITCHEN SOLUTIONS
   Ultra-Premium Monochromatic Interaction Engine
   Precision • Motion • Architecture • Performance
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     01 — ARCHITECTURAL PRELOADER SEQUENCE
     ============================================================ */
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloaderCounter');
  const preloaderFill = document.getElementById('preloaderFill');

  if (preloader && preloaderCounter && preloaderFill) {
    let count = 0;
    const duration = 600; // ms fast & smooth
    const startTime = performance.now();

    function updatePreloader(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      count = Math.round(eased * 100);

      preloaderCounter.textContent = String(count).padStart(3, '0') + '%';
      preloaderFill.style.width = count + '%';

      if (progress < 1) {
        requestAnimationFrame(updatePreloader);
      } else {
        setTimeout(() => {
          preloader.classList.add('done');
          runHeroAnimation();
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 800);
        }, 100);
      }
    }

    requestAnimationFrame(updatePreloader);
  } else {
    runHeroAnimation();
  }

  /* ============================================================
     02 — NAVIGATION SCROLL DYNAMICS
     ============================================================ */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ============================================================
     03 — FULLSCREEN MOBILE MENU
     ============================================================ */
  const burger = document.getElementById('burger');
  const mobNav = document.getElementById('mobNav');

  if (burger && mobNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobNav.classList.contains('open')) {
        mobNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     04 — HERO ENTRANCE ANIMATION
     ============================================================ */
  function runHeroAnimation() {
    const eyebrow = document.querySelector('.hero__eyebrow');
    if (eyebrow) setTimeout(() => eyebrow.classList.add('go'), 50);

    const titleLines = document.querySelectorAll('.hero__title .line-inner');
    titleLines.forEach((line, idx) => {
      setTimeout(() => line.classList.add('go'), 100 + (idx * 120));
    });

    const desc = document.querySelector('.hero__desc');
    if (desc) setTimeout(() => desc.classList.add('go'), 450);

    const ctas = document.querySelector('.hero__ctas');
    if (ctas) setTimeout(() => ctas.classList.add('go'), 600);

    const imgWrap = document.querySelector('.hero__img-wrap');
    if (imgWrap) setTimeout(() => imgWrap.classList.add('go'), 100);

    const anns = document.querySelectorAll('.hero__ann');
    anns.forEach((ann, idx) => {
      setTimeout(() => ann.classList.add('go'), 700 + (idx * 100));
    });

    const scroll = document.querySelector('.hero__scroll');
    if (scroll) setTimeout(() => scroll.classList.add('go'), 900);
  }

  /* ============================================================
     05 — SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     06 — "FROM CONCEPT TO KITCHEN" PROGRESS TRACKER
     ============================================================ */
  const processTimeline = document.querySelector('.process-timeline');
  const processNodes = document.querySelectorAll('.process-node');
  const processFill = document.querySelector('.process-timeline__fill');

  if (processTimeline && processNodes.length > 0 && processFill) {
    window.addEventListener('scroll', () => {
      const rect = processTimeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (windowHeight * 0.85 - rect.top) / (rect.height + windowHeight * 0.3)));
        processFill.style.width = (progress * 100) + '%';

        const activeIndex = Math.floor(progress * processNodes.length);
        processNodes.forEach((node, idx) => {
          if (idx <= activeIndex) {
            node.classList.add('active');
          } else {
            node.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }

  /* ============================================================
     07 — LUXURY FORM HANDLING & VALIDATION
     ============================================================ */
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('[type="submit"]');
      if (!submitBtn) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'PROCESSING REQUEST <span class="arrow">→</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ SPECIFICATION REQUEST SUBMITTED';
        submitBtn.style.background = '#FFFFFF';
        submitBtn.style.color = '#000000';
        enquiryForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4500);
      }, 1000);
    });
  }

});
