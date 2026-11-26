/* ============================================================
   SIP & PLAY — ARCHITECTURAL & EDITORIAL MOTION SYSTEM
   Refined luxury animations, number counters, and scroll reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 0. Universal Ampersand Normalization
  // Normalizes the ampersand (&) in headings, display titles, and card headers
  // across all pages so it always renders with the clean standard modern ampersand.
  const ampersandTargets = document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, .arch-card__title, .legal-section-title, .brand-matrix__label, .cat-card__title, .section-tag, .headline-editorial'
  );
  ampersandTargets.forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && !node.parentElement.classList.contains('amp') && node.nodeValue && node.nodeValue.includes('&')) {
        nodesToReplace.push(node);
      }
    }
    nodesToReplace.forEach((textNode) => {
      const parts = textNode.nodeValue.split('&');
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (index > 0) {
          const span = document.createElement('span');
          span.className = 'amp';
          span.textContent = '&';
          fragment.appendChild(span);
        }
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  });

  // 1. Hero Entrance Animation Sequence
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    // Trigger loaded state for clip-path and subtle scale down
    setTimeout(() => {
      heroSection.classList.add('loaded');
    }, 100);
  }

  // 2. Scroll Progress Bar & Sticky Header (rAF-throttled & cached geometry to avoid layout thrashing)
  const progressBar = document.getElementById('scrollProgress');
  const nav = document.getElementById('siteHeader');

  let isScrolling = false;
  let isHeaderScrolled = false;
  let cachedMaxScroll = 0;

  const updateScrollHeight = () => {
    cachedMaxScroll = Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
  };

  updateScrollHeight();
  window.addEventListener('resize', updateScrollHeight, { passive: true });
  window.addEventListener('load', updateScrollHeight, { passive: true });

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;

        if (progressBar) {
          if (cachedMaxScroll <= 0) updateScrollHeight();
          const ratio = cachedMaxScroll > 0 ? Math.min(1, Math.max(0, winScroll / cachedMaxScroll)) : 0;
          progressBar.style.transform = `scaleX(${ratio})`;
        }

        if (nav) {
          const shouldBeScrolled = winScroll > 40;
          if (shouldBeScrolled !== isHeaderScrolled) {
            isHeaderScrolled = shouldBeScrolled;
            nav.classList.toggle('scrolled', shouldBeScrolled);
          }
        }
        isScrolling = false;
      });
      isScrolling = true;
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

  // Dynamically set active state on navigation links (supports clean URLs and root paths)
  const locHref = window.location.href.split('#')[0].split('?')[0].replace(/\/+$/, '');
  const navLinks = document.querySelectorAll('.nav-link, .mob-nav__link');

  navLinks.forEach(link => {
    const linkHref = (link.href || '').split('#')[0].split('?')[0].replace(/\/+$/, '');
    if (linkHref && linkHref === locHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // LUXURY UPGRADES

  // 1. Smooth Page Transitions (Delegated single event listener)
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('fade-out');
  });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Only transition on internal navigation links, not anchors, protocols, or external URLs
    if (
      href &&
      !href.startsWith('http://') &&
      !href.startsWith('https://') &&
      !href.startsWith('//') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !link.hasAttribute('target') &&
      !link.hasAttribute('download')
    ) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    }
  });



  // 3. Magnetic Navigation Links (Cached bounding rect on mouseenter + rAF)
  const magneticLinks = document.querySelectorAll('.nav-link');
  magneticLinks.forEach(link => {
    let rect = null;
    let rafId = null;
    link.addEventListener('mouseenter', () => {
      rect = link.getBoundingClientRect();
    }, { passive: true });
    link.addEventListener('mousemove', (e) => {
      if (!rect) rect = link.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        link.style.transform = `translate3d(${(x * 0.15).toFixed(2)}px, ${(y * 0.15).toFixed(2)}px, 0)`;
      });
    }, { passive: true });
    link.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rect = null;
      link.style.transform = 'translate3d(0px, 0px, 0)';
    }, { passive: true });
  });

  // 4. Line-by-Line Text Reveals (SplitText alternative)
  const editorialHeadings = document.querySelectorAll('.editorial');
  editorialHeadings.forEach(heading => {
    // Basic word split for demo purposes. In production, a proper line-splitter like GSAP SplitText is preferred.
    const text = heading.innerHTML;
    if (!text.includes('<span class="split-word">')) {
      // We only split if not already split
      const words = text.split(/(<[^>]+>|\s+)/).filter(Boolean);
      let newHTML = '';
      let delay = 0;
      words.forEach(word => {
        if (word.startsWith('<') || word.trim() === '') {
          newHTML += word;
        } else {
          newHTML += `<span class="split-line" style="display:inline-block;"><span class="split-word" style="transition-delay:${delay}s">${word}</span></span>`;
          delay += 0.04; // stagger delay
        }
      });
      heading.innerHTML = newHTML;
    }
  });

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

    // Sections are already visible now; clean up observer
    legalSections.forEach(sec => sectionObserver.observe(sec));
  }

  // 7. Contact / Project Quotation Form Conversion & URL Pre-fill Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = (urlParams.get('item') || '').trim();
    const brandParam = (urlParams.get('brand') || '').trim();
    const scopeSelect = contactForm.querySelector('select[name="scope"]');
    const detailsTextarea = contactForm.querySelector('textarea[name="details"]');

    if (brandParam && scopeSelect) {
      for (let i = 0; i < scopeSelect.options.length; i++) {
        if (scopeSelect.options[i].value.includes('Authorized Brand') || scopeSelect.options[i].text.includes('Authorized Brand')) {
          scopeSelect.selectedIndex = i;
          break;
        }
      }
      if (detailsTextarea && !detailsTextarea.value) {
        detailsTextarea.value = `Inquiring about Authorized Brand Equipment: ${brandParam}\n`;
      }
    } else if (itemParam && scopeSelect) {
      for (let i = 0; i < scopeSelect.options.length; i++) {
        if (scopeSelect.options[i].value.includes('Equipment Sourcing') || scopeSelect.options[i].text.includes('Equipment Sourcing')) {
          scopeSelect.selectedIndex = i;
          break;
        }
      }
      if (detailsTextarea && !detailsTextarea.value) {
        detailsTextarea.value = `Requesting commercial quotation & specification sheet for unit: ${itemParam}\n`;
      }
    }

    const ALLOWED_SCOPES = new Set([
      'Full Commercial Kitchen Turnkey Design & Build',
      'Commercial Kitchen Layout Planning (2D/3D CAD)',
      '500+ Item Equipment Sourcing & Procurement',
      'Authorized Brand Equipment (EVEBOT / INNOSONG / T&Z / LEHEHE)',
      'Restaurant Interiors & Front-of-House Pass',
      'Cloud Kitchen Expansion / Production Plant'
    ]);
    const safeToken = (val) => (/^[A-Za-z0-9\-_ ]{1,45}$/.test(val || '') && !/\d{7,}/.test(val || '')) ? val : undefined;

    let lastContactSubmitTs = 0;
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (typeof contactForm.checkValidity === 'function' && !contactForm.checkValidity()) {
        return;
      }
      const name = (contactForm.querySelector('[name="name"]')?.value || '').trim();
      const phone = (contactForm.querySelector('[name="phone"]')?.value || '').trim();
      const email = (contactForm.querySelector('[name="email"]')?.value || '').trim();
      const scope = (contactForm.querySelector('[name="scope"]')?.value || '').trim();
      const details = (contactForm.querySelector('[name="details"]')?.value || '').trim();

      if (!name || !phone || !email) {
        return;
      }

      const safeScope = ALLOWED_SCOPES.has(scope) ? scope : 'general_consultation';
      const safeItem = safeToken(itemParam);
      const safeBrand = safeToken(brandParam);
      const action = (contactForm.getAttribute('action') || '').trim();
      const isConfirmedBackendEndpoint = action.startsWith('https://') && !action.includes('placeholder');

      const nowTs = Date.now();
      if (isConfirmedBackendEndpoint) {
        // Confirmed HTTP backend submission mode: fire generate_lead ONLY after HTTP 2xx response.ok
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.innerHTML = 'Submitting Request...';
          submitBtn.disabled = true;
        }
        try {
          const response = await fetch(action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            if (nowTs - lastContactSubmitTs > 3000 && window.SipAnalytics) {
              lastContactSubmitTs = nowTs;
              window.SipAnalytics.track('generate_lead', {
                page_type: 'contact',
                content_category: safeScope,
                equipment_name: safeItem,
                brand_name: safeBrand,
                cta_location: 'contact_page_rfq_form',
                contact_method: 'confirmed_form_post'
              });
            }
            contactForm.reset();
            if (submitBtn) submitBtn.innerHTML = '✓ Inquiry Confirmed & Received';
          } else if (submitBtn) {
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
          }
        } catch (err) {
          if (submitBtn) {
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
          }
        }
        return;
      }

      // WhatsApp handoff mode (no confirmed server submission response):
      // Track strictly as inquiry intent (quote_request_click), NOT as a confirmed generate_lead
      if (nowTs - lastContactSubmitTs > 3000 && window.SipAnalytics) {
        lastContactSubmitTs = nowTs;
        window.SipAnalytics.track('quote_request_click', {
          page_type: 'contact',
          content_category: safeScope,
          equipment_name: safeItem,
          brand_name: safeBrand,
          cta_location: 'contact_page_rfq_form',
          contact_method: 'rfq_form_whatsapp_handoff',
          link_type: 'inquiry_intent'
        });
      }

      let msg = `*PROJECT QUOTATION & CONSULTATION REQUEST*\n`;
      msg += `*Sip & Play Commercial Culinary Engineering*\n`;
      msg += `────────────────────────────\n`;
      msg += `• *Client / Group:* ${name}\n`;
      msg += `• *Phone:* ${phone}\n`;
      msg += `• *Email:* ${email}\n`;
      msg += `• *Project Scope:* ${scope}\n`;
      if (details) {
        msg += `• *Project Details:* ${details}\n`;
      }
      msg += `────────────────────────────\n`;
      msg += `Please connect me with an engineering director regarding this project.`;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '✓ Opening Official WhatsApp Desk...';
        submitBtn.disabled = true;
      }

      const waUrl = `https://wa.me/94702700500?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
        }
      }, 2200);
    });
  }
});


/* ============================================================
   SIP & PLAY — GOOGLE ANALYTICS 4 (G-6J443GNZ4J) & BASIC CONSENT ENGINE
   Strict Basic Consent Mode (Zero GA4 Network Requests Before Opt-In)
   Zero Arbitrary User Text • Allowlisted Parameters • Confirmed Lead Separation
   ============================================================ */
(function initSipAndPlayAnalytics() {
  if (window.__SIP_ANALYTICS_INIT__) return;
  window.__SIP_ANALYTICS_INIT__ = true;

  const MEASUREMENT_ID = 'G-6J443GNZ4J';
  const CONSENT_KEY = 'sip_analytics_consent';

  // Exclude private administration / portal pages
  const rawPath = window.location.pathname || '/';
  if (rawPath.includes('/portal')) {
    return;
  }

  // Detect development / localhost environment vs explicit debug mode (?ga_debug=1)
  const isLocalEnv = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) || window.location.protocol === 'file:';
  if (/[?&]ga_debug=1/.test(window.location.search)) {
    try { sessionStorage.setItem('sip_ga_debug', '1'); } catch (e) { }
  }
  const isDebugMode = (() => {
    try { return sessionStorage.getItem('sip_ga_debug') === '1' || window.__SIP_GA_DEBUG__ === true; } catch (e) { return false; }
  })();

  function getConsentState() {
    try {
      return localStorage.getItem(CONSENT_KEY); // 'granted' | 'denied' | null
    } catch (e) {
      return null;
    }
  }

  function hasAnalyticsConsent() {
    return getConsentState() === 'granted';
  }

  function clearAnalyticsCookies() {
    const cookieNames = ['_ga', '_ga_' + MEASUREMENT_ID.replace('G-', ''), '_gid', '_gat'];
    const hostParts = (window.location.hostname || '').split('.');
    const domains = ['', window.location.hostname, '.' + window.location.hostname];
    if (hostParts.length >= 2) {
      domains.push('.' + hostParts.slice(-2).join('.'));
    }
    cookieNames.forEach((name) => {
      domains.forEach((dom) => {
        const domPart = dom ? `; domain=${dom}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domPart}`;
      });
    });
  }

  // Map any internal search query to a fixed, non-personal domain taxonomy (never transmits raw user text)
  function classifySearchTopic(rawQuery) {
    const q = String(rawQuery || '').toLowerCase().trim();
    if (!q) return 'empty_query';
    if (/evebot|printpen|eb-fc1|eb-pro|eb-ft4|eb-fm1|latte art|printer/.test(q)) return 'brand_evebot_printers';
    if (/innosong|zs3202|zs3201|zs3101|zs3105|zs3102/.test(q)) return 'brand_innosong_espresso';
    if (/t&z|tz|vk-1|vk-2|kt3-2a|u8-deck|tea brewer/.test(q)) return 'brand_tz_tea_espresso';
    if (/lehehe|dz23|steam/.test(q)) return 'brand_lehehe_steam';
    if (/coffee|espresso|barista|cafe|grinder/.test(q)) return 'category_coffee_beverage';
    if (/fridge|chiller|freezer|cold room|walk-in|ice|blast|refrigerat/.test(q)) return 'category_refrigeration';
    if (/oven|mixer|dough|sheeter|proofer|bakery|pastry|deck|rotary/.test(q)) return 'category_bakery';
    if (/wok|burner|range|fryer|griddle|combi|bratt|kettle|cook/.test(q)) return 'category_cooking';
    if (/dishwasher|warewash|glasswasher|sink|grease trap/.test(q)) return 'category_warewashing';
    if (/stainless|sus304|304|table|fabrication|hood|exhaust|mep|ventilation/.test(q)) return 'category_fabrication_mep';
    if (/hotel|resort|cloud kitchen|catering|industrial|layout|design/.test(q)) return 'topic_kitchen_design_projects';
    return 'catalog_keyword_query';
  }

  // Classify current page type and metadata without any PII
  function getPageContext() {
    const p = rawPath.toLowerCase();
    let pageType = 'page';
    let contentCategory = 'general';
    let articleTitle = undefined;

    if (p === '/' || p.endsWith('/sip-and-play/') || (p.endsWith('/index.html') && !p.includes('/about') && !p.includes('/services') && !p.includes('/projects') && !p.includes('/equipment') && !p.includes('/brands') && !p.includes('/contact') && !p.includes('/terms') && !p.includes('/privacy') && !p.includes('/blog'))) {
      pageType = 'homepage';
      contentCategory = 'commercial_kitchen_solutions';
    } else if (p.includes('/blog/')) {
      const afterBlog = p.split('/blog/')[1] || '';
      const slug = afterBlog.replace(/index\.html$/, '').replace(/\/+$/, '');
      if (!slug) {
        pageType = 'blog_hub';
        contentCategory = 'insights_index';
      } else {
        pageType = 'blog_article';
        const bcSpans = document.querySelectorAll('.article-breadcrumb span');
        const lastBc = bcSpans.length > 0 ? bcSpans[bcSpans.length - 1].textContent.trim() : '';
        contentCategory = lastBc || 'engineering_guide';
        const h1 = document.querySelector('h1');
        articleTitle = h1 ? h1.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : slug;
      }
    } else if (p.includes('/commercial-kitchen-design')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'commercial_kitchen_design';
    } else if (p.includes('/commercial-coffee-machines')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'commercial_coffee_machines';
    } else if (p.includes('/commercial-refrigeration')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'commercial_refrigeration';
    } else if (p.includes('/commercial-cooking-equipment')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'commercial_cooking_equipment';
    } else if (p.includes('/commercial-bakery-equipment')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'commercial_bakery_equipment';
    } else if (p.includes('/stainless-steel-kitchen-fabrication')) {
      pageType = 'commercial_landing_page';
      contentCategory = 'stainless_steel_fabrication';
    } else if (p.includes('/equipment')) {
      pageType = 'equipment_catalogue';
      contentCategory = 'commercial_equipment';
    } else if (p.includes('/brands')) {
      pageType = 'authorized_brands';
      contentCategory = 'beverage_and_printing_brands';
    } else if (p.includes('/services')) {
      pageType = 'services';
      contentCategory = 'kitchen_design_and_engineering';
    } else if (p.includes('/projects')) {
      pageType = 'projects_portfolio';
      contentCategory = 'hospitality_case_studies';
    } else if (p.includes('/contact')) {
      pageType = 'contact';
      contentCategory = 'project_quotation_desk';
    } else if (p.includes('/about')) {
      pageType = 'about';
      contentCategory = 'company_leadership';
    } else if (p.includes('/terms') || p.includes('/privacy')) {
      pageType = 'legal';
      contentCategory = 'compliance_and_governance';
    }

    return { pageType, contentCategory, articleTitle };
  }

  // Strict allowlist of permitted GA4 event parameter keys (blocks arbitrary user-entered fields)
  const ALLOWED_EVENT_PARAM_KEYS = new Set([
    'page_type',
    'content_category',
    'article_title',
    'equipment_category',
    'equipment_name',
    'brand_name',
    'cta_location',
    'contact_method',
    'link_type',
    'results_count',
    'scheduled_models_count',
    'scheduled_units_count'
  ]);

  function redactPIIString(val) {
    if (typeof val !== 'string') return val;
    let cleaned = val.trim();
    cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[redacted]');
    cleaned = cleaned.replace(/(?:\+?\d[\d\s\-().]{6,}\d)/g, '[redacted]');
    return cleaned.slice(0, 120);
  }

  function sanitizeParams(rawParams) {
    const ctx = getPageContext();
    const base = {
      page_type: ctx.pageType,
      content_category: ctx.contentCategory
    };
    if (ctx.articleTitle) {
      base.article_title = redactPIIString(ctx.articleTitle);
    }
    const merged = Object.assign(base, rawParams || {});
    const clean = {};

    // If caller passed search_term, classify it into content_category and discard raw search_term
    if (merged.search_term) {
      merged.content_category = classifySearchTopic(merged.search_term);
      delete merged.search_term;
    }

    Object.keys(merged).forEach((key) => {
      if (!ALLOWED_EVENT_PARAM_KEYS.has(key)) return;
      const v = merged[key];
      if (v === undefined || v === null || v === '') return;
      clean[key] = typeof v === 'string' ? redactPIIString(v) : v;
    });

    if (isDebugMode) {
      clean.debug_mode = true;
    }
    clean.transport_type = 'beacon';
    return clean;
  }

  // Deduplication cache for rapid identical events (e.g. double clicks within 600ms)
  let lastEventKey = '';
  let lastEventTime = 0;

  function trackEvent(eventName, params) {
    if (!eventName) return;
    const cleanPayload = sanitizeParams(params);
    const dedupeKey = `${eventName}:::${cleanPayload.cta_location || ''}:::${cleanPayload.equipment_name || ''}:::${cleanPayload.brand_name || ''}`;
    const now = Date.now();
    if (dedupeKey === lastEventKey && now - lastEventTime < 600) {
      return;
    }
    lastEventKey = dedupeKey;
    lastEventTime = now;

    if (isDebugMode) {
      console.info(`[SipAnalytics GA4] (Consent: ${getConsentState() || 'unset'}) Event: ${eventName}`, cleanPayload);
    }

    // Strict Basic Consent Mode: zero analytics dispatches unless consent === 'granted'
    if (!hasAnalyticsConsent()) {
      return;
    }

    if (isLocalEnv && !isDebugMode) {
      return;
    }

    if (typeof window.__loadSipGA4 === 'function' && !window.__sipGA4Loaded) {
      window.__loadSipGA4();
    }

    if (typeof window.gtag === 'function' && !window['ga-disable-' + MEASUREMENT_ID]) {
      window.gtag('event', eventName, cleanPayload);
    }
  }

  // Initial page-specific custom context events (catalogue_view & blog_article_view)
  let initialContextFired = false;
  function fireInitialPageContextEvents() {
    if (initialContextFired || !hasAnalyticsConsent()) return;
    initialContextFired = true;

    const ctx = getPageContext();
    const urlParams = new URLSearchParams(window.location.search);
    const safeParam = (val) => (/^[A-Za-z0-9\-_ ]{1,40}$/.test(val || '') && !/\d{7,}/.test(val || '')) ? val.trim() : 'all';

    if (ctx.pageType === 'equipment_catalogue') {
      const initCat = safeParam(urlParams.get('category'));
      const initBrand = safeParam(urlParams.get('brand'));
      trackEvent('catalogue_view', {
        page_type: 'equipment_catalogue',
        content_category: 'commercial_equipment',
        equipment_category: initCat,
        brand_name: initBrand
      });
    } else if (ctx.pageType === 'blog_article') {
      trackEvent('blog_article_view', {
        page_type: 'blog_article',
        content_category: ctx.contentCategory,
        article_title: ctx.articleTitle
      });
    }
  }

  function updateFooterConsentToggleUI() {
    const btns = document.querySelectorAll('[data-sip-consent-toggle]');
    const granted = hasAnalyticsConsent();
    btns.forEach((btn) => {
      btn.textContent = granted ? 'Analytics: On (Withdraw)' : 'Analytics: Off (Opt In)';
      btn.setAttribute('aria-pressed', granted ? 'true' : 'false');
    });
  }

  function applyConsentDecision(decision) {
    const normalized = decision === 'granted' ? 'granted' : 'denied';
    try {
      localStorage.setItem(CONSENT_KEY, normalized);
    } catch (e) { }

    if (normalized === 'granted') {
      window['ga-disable-' + MEASUREMENT_ID] = (isLocalEnv && !isDebugMode);
      if (typeof window.__loadSipGA4 === 'function') {
        window.__loadSipGA4();
      } else if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      fireInitialPageContextEvents();
    } else {
      // Strict withdrawal: immediately halt collection and purge all GA cookies
      window['ga-disable-' + MEASUREMENT_ID] = true;
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      clearAnalyticsCookies();
    }
    updateFooterConsentToggleUI();
  }

  // Expose Public API for catalogue.js, Privacy Policy controls, and QA verification
  window.SipAnalytics = {
    track: trackEvent,
    hasConsent: hasAnalyticsConsent,
    getConsentState: getConsentState,
    setConsent: applyConsentDecision,
    classifySearchTopic: classifySearchTopic,
    getPageContext: getPageContext
  };

  function detectCtaLocation(el) {
    if (!el) return 'page_body';
    if (el.closest('#siteHeader, .site-header')) return 'header_nav';
    if (el.closest('#mobMenu, .mob-menu')) return 'mobile_menu';
    if (el.closest('.article-cta-box')) return 'article_cta_box';
    if (el.closest('.legal-sidebar')) return 'sticky_sidebar';
    if (el.closest('.blog-featured-card')) return 'blog_featured_card';
    if (el.closest('.blog-card')) return 'blog_grid_card';
    if (el.closest('#specModal, .spec-modal')) return 'equipment_spec_modal';
    if (el.closest('#scheduleDrawer, .schedule-drawer')) return 'equipment_schedule_drawer';
    if (el.closest('#customerModalBackdrop, .customer-modal')) return 'equipment_schedule_modal';
    if (el.closest('#heroSection, .hero, .legal-header')) return 'hero_section';
    if (el.closest('footer, .site-footer')) return 'footer';
    if (el.closest('.legal-content, article')) return 'article_inline_prose';
    return 'page_body';
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Mount subtle inline footer consent toggle (Zero floating popup overlay covering content)
    const footerBottomP = document.querySelector('.footer-bottom p');
    if (footerBottomP && !footerBottomP.querySelector('[data-sip-consent-toggle]')) {
      const sep = document.createTextNode(' • ');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'footer-legal-link';
      btn.setAttribute('data-sip-consent-toggle', 'true');
      btn.style.cssText = 'background:none;border:none;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;';
      btn.addEventListener('click', () => {
        applyConsentDecision(hasAnalyticsConsent() ? 'denied' : 'granted');
      });
      footerBottomP.appendChild(sep);
      footerBottomP.appendChild(btn);
      updateFooterConsentToggleUI();
    }

    // 2. Fire initial page context events only if prior opt-in consent is granted
    if (hasAnalyticsConsent()) {
      fireInitialPageContextEvents();
    }

    // 3. Global Delegated Click Listener (Capture Phase)
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;

      // A. Verified Equipment Catalogue Download action ONLY (never triggered by window.print() or arbitrary PDFs)
      const dlTrigger = target.closest('[data-catalogue-download="true"]');
      if (dlTrigger && dlTrigger.id !== 'btnDownloadScheduleCsv') {
        trackEvent('catalogue_download', {
          cta_location: detectCtaLocation(dlTrigger),
          link_type: 'catalogue_file_download'
        });
        return;
      }

      // B. Schedule Drawer "Request Quote" button on /equipment/ -> quote_request_click
      const scheduleQuoteBtn = target.closest('#btnOpenCustomerModal');
      if (scheduleQuoteBtn) {
        trackEvent('quote_request_click', {
          page_type: 'equipment_catalogue',
          content_category: 'equipment_schedule_drawer',
          cta_location: 'equipment_schedule_drawer',
          contact_method: 'schedule_modal_trigger',
          link_type: 'internal_cta'
        });
        return;
      }

      const link = target.closest('a[href]');
      if (!link) return;

      const rawHref = (link.getAttribute('href') || '').trim();
      if (!rawHref) return;
      const lowerHref = rawHref.toLowerCase();
      const ctaLoc = detectCtaLocation(link);
      const ctx = getPageContext();

      // C. WhatsApp Contact Links -> whatsapp_click (Intercept & open via window.open with stripped link_url so GA4 Enhanced Measurement never logs ?text= parameters)
      if (lowerHref.includes('wa.me/') || lowerHref.includes('whatsapp.com/')) {
        e.preventDefault();
        trackEvent('whatsapp_click', {
          cta_location: ctaLoc,
          contact_method: 'whatsapp',
          link_type: 'outbound_contact'
        });
        window.open(rawHref, '_blank', 'noopener,noreferrer');
        return;
      }

      // D. Telephone Links -> phone_click
      if (lowerHref.startsWith('tel:')) {
        trackEvent('phone_click', {
          cta_location: ctaLoc,
          contact_method: 'phone',
          link_type: 'telephone'
        });
        return;
      }

      // E. Email Contact Links -> email_click
      if (lowerHref.startsWith('mailto:')) {
        trackEvent('email_click', {
          cta_location: ctaLoc,
          contact_method: 'email',
          link_type: 'email'
        });
        return;
      }

      // F. Brand Anchor / Filter Links -> brand_view
      if (lowerHref === '#evebot' || lowerHref === '#innosong' || lowerHref === '#tz' || lowerHref === '#lehehe' || lowerHref.includes('?brand=')) {
        let brandName = '';
        if (lowerHref === '#evebot') brandName = 'EVEBOT';
        else if (lowerHref === '#innosong') brandName = 'INNOSONG';
        else if (lowerHref === '#tz') brandName = 'T&Z Galaxy';
        else if (lowerHref === '#lehehe') brandName = 'LEHEHE';
        else {
          const match = rawHref.match(/[?&]brand=([A-Za-z0-9\-_]+)/i);
          if (match && match[1]) brandName = decodeURIComponent(match[1]);
        }
        if (brandName && !lowerHref.includes('#quote')) {
          trackEvent('brand_view', {
            brand_name: brandName,
            cta_location: ctaLoc,
            link_type: 'brand_navigation'
          });
        }
      }

      // G. Blog Article Commercial CTA Clicks -> blog_cta_click
      if (ctx.pageType === 'blog_article' || ctx.pageType === 'blog_hub') {
        let commercialLinkType = '';
        if (lowerHref.includes('commercial-kitchen-design/')) commercialLinkType = 'to_commercial_kitchen_design';
        else if (lowerHref.includes('commercial-coffee-machines/')) commercialLinkType = 'to_commercial_coffee_machines';
        else if (lowerHref.includes('commercial-refrigeration/')) commercialLinkType = 'to_commercial_refrigeration';
        else if (lowerHref.includes('commercial-cooking-equipment/')) commercialLinkType = 'to_commercial_cooking_equipment';
        else if (lowerHref.includes('commercial-bakery-equipment/')) commercialLinkType = 'to_commercial_bakery_equipment';
        else if (lowerHref.includes('stainless-steel-kitchen-fabrication/')) commercialLinkType = 'to_stainless_fabrication';
        else if (lowerHref.includes('services/')) commercialLinkType = 'to_services';
        else if (lowerHref.includes('equipment/')) commercialLinkType = 'to_equipment';
        else if (lowerHref.includes('brands/')) commercialLinkType = 'to_brands';
        else if (lowerHref.includes('projects/')) commercialLinkType = 'to_projects';
        else if (lowerHref.includes('contact/')) commercialLinkType = 'to_contact_quote';

        if (commercialLinkType && ctaLoc !== 'header_nav' && ctaLoc !== 'mobile_menu' && ctaLoc !== 'footer') {
          trackEvent('blog_cta_click', {
            cta_location: ctaLoc,
            link_type: commercialLinkType
          });
        }
      }

      // H. Quotation Request CTAs -> quote_request_click
      const linkText = (link.textContent || '').toLowerCase();
      const isQuoteHref = lowerHref.includes('#quote') || (lowerHref.includes('contact') && (link.classList.contains('btn') || link.classList.contains('btn-premium') || link.classList.contains('arch-card__action')));
      const isQuoteText = /quote|quotation|consult|walkthrough|site visit|proposal|tender|boq|schedule/.test(linkText);

      if (isQuoteHref || (lowerHref.includes('contact') && isQuoteText)) {
        let eqName = undefined;
        let brName = undefined;
        const itemMatch = rawHref.match(/[?&]item=([A-Za-z0-9\-_%]+)/i);
        const brandMatch = rawHref.match(/[?&]brand=([A-Za-z0-9\-_%]+)/i);
        if (itemMatch && itemMatch[1]) {
          const decoded = decodeURIComponent(itemMatch[1]);
          if (/^[A-Za-z0-9\-_ ]{1,45}$/.test(decoded) && !/\d{7,}/.test(decoded)) eqName = decoded;
        }
        if (brandMatch && brandMatch[1]) {
          const decodedB = decodeURIComponent(brandMatch[1]);
          if (/^[A-Za-z0-9\-_ ]{1,45}$/.test(decodedB) && !/\d{7,}/.test(decodedB)) brName = decodedB;
        }

        trackEvent('quote_request_click', {
          equipment_name: eqName,
          brand_name: brName,
          cta_location: ctaLoc,
          contact_method: 'online_quote_form',
          link_type: 'quote_cta'
        });
      }
    }, { capture: true });

    // 4. Viewport Tracking for Brand Showcase Sections on /brands/ -> brand_view
    const ctx = getPageContext();
    if (ctx.pageType === 'authorized_brands' && 'IntersectionObserver' in window) {
      const seenBrands = new Set();
      const brandMap = {
        'evebot': 'EVEBOT',
        'innosong': 'INNOSONG',
        'tz': 'T&Z Galaxy',
        'lehehe': 'LEHEHE'
      };
      const brandObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const bName = brandMap[id];
            if (bName && !seenBrands.has(bName)) {
              seenBrands.add(bName);
              trackEvent('brand_view', {
                page_type: 'authorized_brands',
                content_category: 'brand_showcase_section',
                brand_name: bName,
                cta_location: 'brand_section_viewport'
              });
            }
          }
        });
      }, { threshold: 0.35 });

      Object.keys(brandMap).forEach((id) => {
        const el = document.getElementById(id);
        if (el) brandObserver.observe(el);
      });
    }

    // 5. Viewport & Click Tracking for Project Case Studies on /projects/ -> project_view
    if (ctx.pageType === 'projects_portfolio' && 'IntersectionObserver' in window) {
      const seenProjects = new Set();
      const projectPanels = document.querySelectorAll('.arch-panel');
      const projObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const titleEl = entry.target.querySelector('.arch-card__title, h3');
            const projName = titleEl ? titleEl.textContent.trim() : '';
            if (projName && !seenProjects.has(projName)) {
              seenProjects.add(projName);
              trackEvent('project_view', {
                page_type: 'projects_portfolio',
                content_category: 'case_study',
                article_title: projName,
                cta_location: 'project_case_study_card'
              });
            }
          }
        });
      }, { threshold: 0.45 });

      projectPanels.forEach((panel) => projObserver.observe(panel));
    }

    // 6. Internal Site Search Tracking on Blog Hub (#blogSearchInput) -> site_search (Zero raw user text transmitted)
    const blogSearchInput = document.getElementById('blogSearchInput');
    if (blogSearchInput) {
      let blogSearchTimer = null;
      let lastBlogSearchTerm = '';
      blogSearchInput.addEventListener('input', () => {
        clearTimeout(blogSearchTimer);
        blogSearchTimer = setTimeout(() => {
          const term = (blogSearchInput.value || '').trim();
          if (term.length >= 2 && term.toLowerCase() !== lastBlogSearchTerm) {
            lastBlogSearchTerm = term.toLowerCase();
            const visibleCards = Array.from(document.querySelectorAll('#blogArticlesGrid .blog-card, #blogGrid .blog-card')).filter(c => c.style.display !== 'none').length;
            trackEvent('site_search', {
              page_type: 'blog_hub',
              content_category: classifySearchTopic(term),
              cta_location: 'blog_search_input',
              results_count: visibleCards
            });
          }
        }, 1000);
      });
    }
  });
})();


/* ==========================================
   SIP & PLAY — AI CONCIERGE AUTO-INJECTOR (DISABLED / COMMENTED OUT)
   ==========================================
(function initSipAndPlayChatbot() {
  function mountChatbot() {
    if (document.getElementById("snpChatRoot")) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <style>
        :root {
          --snp-paper: #FAF7F2;
          --snp-paper-alt: #F1ECE3;
          --snp-espresso: #1A1715;
          --snp-charcoal: #2C2724;
          --snp-bronze: #B87D4B;
          --snp-bronze-hover: #9E683B;
          --snp-border: rgba(26, 23, 21, 0.12);
          --snp-shadow: 0 20px 50px rgba(26, 23, 21, 0.18), 0 4px 12px rgba(26, 23, 21, 0.08);
        }
        .snp-chat-launcher {
          position: fixed; bottom: 24px; right: 24px; z-index: 99999;
          display: flex; align-items: center; gap: 10px;
          background: var(--snp-espresso); color: var(--snp-paper);
          border: 1px solid rgba(184, 125, 75, 0.4); border-radius: 999px;
          padding: 12px 20px 12px 16px; font-family: inherit; font-size: 14px;
          font-weight: 500; letter-spacing: 0.02em; cursor: pointer;
          box-shadow: var(--snp-shadow);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, border-color 0.2s ease;
        }
        .snp-chat-launcher:hover {
          transform: translateY(-2px); border-color: var(--snp-bronze); background: var(--snp-charcoal);
        }
        .snp-launcher-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #22C55E;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); animation: snpPulse 2s infinite;
        }
        @keyframes snpPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .snp-launcher-icon { width: 18px; height: 18px; stroke: var(--snp-bronze); flex-shrink: 0; }
        .snp-chat-window {
          position: fixed; bottom: 84px; right: 24px; width: 375px;
          max-width: calc(100vw - 32px); height: 530px; max-height: calc(100vh - 115px);
          background: var(--snp-paper); color: var(--snp-espresso);
          border: 1px solid var(--snp-border); border-radius: 16px;
          box-shadow: var(--snp-shadow); display: flex; flex-direction: column;
          overflow: hidden; z-index: 99999; opacity: 0; pointer-events: none;
          transform: translateY(14px) scale(0.98); transform-origin: bottom right;
          transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }
        .snp-chat-window.is-open { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
        .snp-chat-header {
          background: var(--snp-espresso); color: var(--snp-paper); padding: 16px 18px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(184, 125, 75, 0.25);
        }
        .snp-header-info { display: flex; align-items: center; gap: 11px; }
        .snp-header-badge {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(184, 125, 75, 0.16); border: 1px solid rgba(184, 125, 75, 0.4);
          display: flex; align-items: center; justify-content: center;
          color: var(--snp-bronze); font-weight: 600; font-size: 13px;
        }
        .snp-header-title { font-size: 14px; font-weight: 600; margin: 0; color: var(--snp-paper); }
        .snp-header-subtitle { font-size: 11.5px; color: rgba(250, 247, 242, 0.68); margin: 2px 0 0 0; }
        .snp-close-btn {
          background: transparent; border: none; color: rgba(250, 247, 242, 0.7);
          cursor: pointer; padding: 6px; border-radius: 6px; display: flex;
        }
        .snp-close-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.08); }
        .snp-chat-messages {
          flex: 1; padding: 16px; overflow-y: auto; display: flex;
          flex-direction: column; gap: 12px; scroll-behavior: smooth;
        }
        .snp-msg {
          max-width: 84%; padding: 11px 14px; border-radius: 13px;
          font-size: 13.5px; line-height: 1.5; word-wrap: break-word;
          animation: snpFadeIn 0.2s ease-out;
        }
        @keyframes snpFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .snp-msg-bot {
          align-self: flex-start; background: var(--snp-paper-alt);
          color: var(--snp-espresso); border: 1px solid var(--snp-border); border-bottom-left-radius: 4px;
        }
        .snp-msg-user {
          align-self: flex-end; background: var(--snp-espresso);
          color: var(--snp-paper); border-bottom-right-radius: 4px;
        }
        .snp-quick-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
        .snp-chip {
          background: #fff; color: var(--snp-espresso); border: 1px solid var(--snp-border);
          border-radius: 999px; padding: 6px 11px; font-size: 12px; font-family: inherit;
          cursor: pointer; transition: all 0.15s ease;
        }
        .snp-chip:hover { border-color: var(--snp-bronze); background: var(--snp-espresso); color: var(--snp-paper); }
        .snp-typing { display: inline-flex; align-items: center; gap: 4px; padding: 12px 15px; }
        .snp-typing span {
          width: 6px; height: 6px; background: var(--snp-bronze); border-radius: 50%;
          animation: snpBounce 1.2s infinite ease-in-out;
        }
        .snp-typing span:nth-child(2) { animation-delay: 0.15s; }
        .snp-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes snpBounce { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.45; } 40% { transform: scale(1.1); opacity: 1; } }
        .snp-chat-input-bar {
          padding: 12px 14px; background: #fff; border-top: 1px solid var(--snp-border);
          display: flex; align-items: center; gap: 8px;
        }
        .snp-chat-input {
          flex: 1; border: 1px solid var(--snp-border); background: var(--snp-paper);
          color: var(--snp-espresso); border-radius: 999px; padding: 10px 15px;
          font-size: 13.5px; font-family: inherit; outline: none;
        }
        .snp-chat-input:focus { border-color: var(--snp-bronze); }
        .snp-send-btn {
          width: 38px; height: 38px; border-radius: 50%; background: var(--snp-bronze);
          color: #fff; border: none; display: flex; align-items: center;
          justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .snp-send-btn:hover:not(:disabled) { background: var(--snp-bronze-hover); }
        .snp-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 480px) {
          .snp-chat-window { right: 12px; bottom: 78px; width: calc(100vw - 24px); height: 72vh; }
          .snp-chat-launcher { right: 16px; bottom: 16px; padding: 11px 16px; }
        }
      </style>

      <div id="snpChatRoot">
        <button class="snp-chat-launcher" id="snpChatToggle" aria-label="Open Equipment & Kitchen Design Specialist">
          <span class="snp-launcher-dot"></span>
          <svg class="snp-launcher-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>Ask Specialist</span>
        </button>

        <div class="snp-chat-window" id="snpChatWindow" role="dialog" aria-label="Sip & Play AI Concierge">
          <div class="snp-chat-header">
            <div class="snp-header-info">
              <div class="snp-header-badge">S&P</div>
              <div>
                <h4 class="snp-header-title">Sip & Play Specialist</h4>
                <p class="snp-header-subtitle">Kitchen Design & Commercial Equipment</p>
              </div>
            </div>
            <button class="snp-close-btn" id="snpChatClose" aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="snp-chat-messages" id="snpChatMessages">
            <div class="snp-msg snp-msg-bot">
              Welcome to Sip & Play. Looking for commercial kitchen design, restaurant equipment, or espresso machines?
            </div>
            <div class="snp-quick-chips" id="snpQuickChips">
              <button class="snp-chip" data-prompt="Tell me about your Commercial Kitchen Design services.">Kitchen Design</button>
              <button class="snp-chip" data-prompt="What commercial espresso machines do you offer?">Espresso Machines</button>
              <button class="snp-chip" data-prompt="What partner brands (Evobot, Insong, T&Z) do you carry?">Partner Brands</button>
              <button class="snp-chip" data-prompt="How can I request a quote or consultation?">Get a Quote</button>
            </div>
          </div>

          <form class="snp-chat-input-bar" id="snpChatForm">
            <input type="text" class="snp-chat-input" id="snpChatInput" placeholder="Ask about equipment, layout design, brands..." autocomplete="off" required />
            <button type="submit" class="snp-send-btn" id="snpSendBtn" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    const API_URL = "https://sip-and-play-chat-api.ucodelk26.workers.dev";
    const STORAGE_KEY = "snp_chat_history_v1";

    const toggleBtn = document.getElementById("snpChatToggle");
    const closeBtn = document.getElementById("snpChatClose");
    const chatWindow = document.getElementById("snpChatWindow");
    const messagesEl = document.getElementById("snpChatMessages");
    const chatForm = document.getElementById("snpChatForm");
    const chatInput = document.getElementById("snpChatInput");
    const sendBtn = document.getElementById("snpSendBtn");
    const quickChips = document.getElementById("snpQuickChips");

    let history = [];
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) history = JSON.parse(saved);
    } catch (e) { }

    function appendMessage(text, sender, scroll = true) {
      const div = document.createElement("div");
      div.className = "snp-msg " + (sender === "user" ? "snp-msg-user" : "snp-msg-bot");
      div.textContent = text;
      messagesEl.appendChild(div);
      if (scroll) messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function showTyping() {
      const div = document.createElement("div");
      div.className = "snp-msg snp-msg-bot snp-typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    if (history.length) {
      if (quickChips) quickChips.style.display = "none";
      history.forEach(item => {
        const text = item?.parts?.[0]?.text;
        if (text) appendMessage(text, item.role === "user" ? "user" : "bot", false);
      });
    }

    async function sendMessage(userText) {
      const trimmed = (userText || "").trim();
      if (!trimmed) return;

      if (quickChips) quickChips.style.display = "none";
      appendMessage(trimmed, "user");
      chatInput.value = "";
      sendBtn.disabled = true;

      history.push({ role: "user", parts: [{ text: trimmed }] });
      if (history.length > 6) history = history.slice(-6);

      const typingEl = showTyping();

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history })
        });
        const data = await res.json();
        typingEl.remove();

        const reply = data?.reply || "Please reach out via our Contact page for direct assistance.";
        appendMessage(reply, "bot");

        history.push({ role: "model", parts: [{ text: reply }] });
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) { }
      } catch (err) {
        typingEl.remove();
        appendMessage("Connection hiccup—please try again or visit our Contact page.", "bot");
      } finally {
        sendBtn.disabled = false;
        chatInput.focus();
      }
    }

    toggleBtn.addEventListener("click", () => {
      chatWindow.classList.toggle("is-open");
      if (chatWindow.classList.contains("is-open")) chatInput.focus();
    });

    closeBtn.addEventListener("click", () => chatWindow.classList.remove("is-open"));

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage(chatInput.value);
    });

    if (quickChips) {
      quickChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".snp-chip");
        if (chip) sendMessage(chip.getAttribute("data-prompt"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountChatbot);
  } else {
    mountChatbot();
  }
})();
*/
