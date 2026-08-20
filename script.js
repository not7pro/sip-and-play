/* ============================================================
   SIP & PLAY — ARCHITECTURAL & EDITORIAL MOTION SYSTEM
   Refined luxury animations, number counters, and scroll reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Hero Entrance Animation Sequence
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    // Trigger loaded state for clip-path and subtle scale down
    setTimeout(() => {
      heroSection.classList.add('loaded');
    }, 100);
  }

  // 2. Scroll Progress Bar & Sticky Header
  const progressBar = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (nav) {
      if (winScroll > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Fullscreen Luxury Mobile Navigation
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

  // 4. IntersectionObserver for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 5. Animated Number Counter for Verified Statistics
  const countElements = document.querySelectorAll('.count-up, .stat-card__num, .stat-matrix__num span');
  if ('IntersectionObserver' in window && countElements.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          let targetAttr = el.getAttribute('data-target');
          let target = 0;

          if (targetAttr) {
            target = parseInt(targetAttr, 10);
          } else {
            // Extract from text content (e.g. "33,000" or "10+")
            let text = el.textContent.replace(/,/g, '').replace(/\+/g, '').trim();
            target = parseInt(text, 10);

            // Store original format if it has a plus sign
            if (el.textContent.includes('+')) {
              el.setAttribute('data-suffix', '+');
            }
          }

          if (!isNaN(target)) {
            animateNumber(el, target, 1600);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    countElements.forEach(el => countObserver.observe(el));
  }

  function animateNumber(element, target, duration) {
    let startTimestamp = null;
    const isLarge = target >= 1000;
    const suffix = element.getAttribute('data-suffix') || '';

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      element.textContent = (isLarge ? current.toLocaleString() : current) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = (isLarge ? target.toLocaleString() : target) + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

});

// 6. Advanced Hero Word Reveal
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-cinematic__title');
  if (heroTitle) {
    // Check if it hasn't been processed yet
    if (!heroTitle.classList.contains('word-reveal')) {
      const text = heroTitle.innerHTML;
      // Simple split by space, keeping HTML tags intact as much as possible 
      // (For robust HTML preservation, we'd use a textNode walker, but regex works for this specific case with one <em>)
      const words = text.split(/(<[^>]*>|\s+)/).filter(Boolean);
      let newHtml = '';
      let delay = 0.2;
      words.forEach(word => {
        if (word.startsWith('<') || word.trim() === '') {
          newHtml += word;
        } else {
          newHtml += `<span style="transition-delay: ${delay}s">${word}</span>`;
          delay += 0.08;
        }
      });
      heroTitle.innerHTML = newHtml;
      heroTitle.classList.add('word-reveal');

      // Trigger reveal after a short delay
      setTimeout(() => {
        heroTitle.classList.add('is-visible');
      }, 300);
    }
  }
});

// 7. Methodology Timeline Progress
document.addEventListener('DOMContentLoaded', () => {
  const roadmapGrid = document.getElementById('roadmapGrid');
  const roadmapProgress = document.getElementById('roadmapProgress');
  const steps = document.querySelectorAll('.roadmap-step');

  if (roadmapGrid && roadmapProgress && steps.length > 0) {

    // Set up observer for each step
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-step');

          // Calculate progress height based on the lowest active step
          let activeIndex = -1;
          steps.forEach((step, idx) => {
            if (step.classList.contains('active-step')) activeIndex = idx;
          });

          if (activeIndex >= 0) {
            // Calculate percentage or absolute height
            const stepElement = steps[activeIndex];
            // offsetTop of the step + some padding to reach the circle
            const progressHeight = stepElement.offsetTop + 20;
            roadmapProgress.style.height = progressHeight + 'px';
          }
        }
      });
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });

    steps.forEach(step => stepObserver.observe(step));
  }
});

// 8. Scroll Indicator Fade Out
window.addEventListener('scroll', () => {
  const indicator = document.getElementById('scrollIndicator');
  if (indicator) {
    if (window.scrollY > 50) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }
}, { passive: true });
