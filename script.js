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
  const nav = document.getElementById('siteHeader'); // FIXED: was 'nav'

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
  const burger = document.getElementById('menuToggle') || document.getElementById('burger');
  const mobNav = document.getElementById('mobMenu') || document.getElementById('mobNav');
  const siteHeader = document.getElementById('siteHeader') || document.getElementById('nav');

  if (burger && mobNav) {
    const closeMenu = () => {
      mobNav.classList.remove('is-active', 'open');
      burger.classList.remove('is-active', 'open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      if (siteHeader) siteHeader.classList.remove('menu-active');
    };

    const openMenu = () => {
      mobNav.classList.add('is-active', 'open');
      burger.classList.add('is-active', 'open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      if (siteHeader) siteHeader.classList.add('menu-active');
    };

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mobNav.classList.contains('is-active') || mobNav.classList.contains('open');
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    const mobLinks = mobNav.querySelectorAll('.mob-nav__link, .mob-nav-links a');
    mobLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (mobNav.classList.contains('is-active') || mobNav.classList.contains('open'))) {
        closeMenu();
      }
    });
  }

  // 4. IntersectionObserver for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-fade-up, .editorial');
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


// Dynamically set active state on navigation links
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mob-nav__link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // LUXURY UPGRADES
  
  // 1. Smooth Page Transitions
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('fade-out');
  });

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Only transition on internal HTML links, not anchors or absolute external urls
      if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 350); // Wait for fade out
      }
    });
  });



  // 3. Magnetic Navigation Links
  const magneticLinks = document.querySelectorAll('.nav-link');
  magneticLinks.forEach(link => {
    link.addEventListener('mousemove', function(e) {
      const position = link.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      link.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    link.addEventListener('mouseout', function(e) {
      link.style.transform = 'translate(0px, 0px)';
    });
  });

  // 4. Line-by-Line Text Reveals (SplitText alternative)
  const editorialHeadings = document.querySelectorAll('.editorial');
  editorialHeadings.forEach(heading => {
    // Basic word split for demo purposes. In production, a proper line-splitter like GSAP SplitText is preferred.
    const text = heading.innerHTML;
    if(!text.includes('<span class="split-word">')) {
       // We only split if not already split
       const words = text.split(/(<[^>]+>|\s+)/).filter(Boolean);
       let newHTML = '';
       let delay = 0;
       words.forEach(word => {
         if(word.startsWith('<') || word.trim() === '') {
           newHTML += word;
         } else {
           newHTML += `<span class="split-line" style="display:inline-block;"><span class="split-word" style="transition-delay:${delay}s">${word}</span></span>`;
           delay += 0.04; // stagger delay
         }
       });
       heading.innerHTML = newHTML;
    }
  });

  // 5. Dark/Light Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Check local storage
    if (localStorage.getItem('theme-invert') === 'true') {
      document.body.setAttribute('data-theme', 'invert');
    }
    
    themeToggle.addEventListener('click', () => {
      const isInderted = document.body.getAttribute('data-theme') === 'invert';
      if (isInderted) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme-invert', 'false');
      } else {
        document.body.setAttribute('data-theme', 'invert');
        localStorage.setItem('theme-invert', 'true');
      }
    });
  }

  // 6. Table of Contents Scrollspy for Legal & Documentation Pages
  const tocLinks = document.querySelectorAll('.legal-toc-link');
  const legalSections = document.querySelectorAll('.legal-section');

  if (tocLinks.length > 0 && legalSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    legalSections.forEach(sec => sectionObserver.observe(sec));
  }
});
