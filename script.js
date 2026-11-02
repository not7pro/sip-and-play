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

  // 2. Scroll Progress Bar & Sticky Header (rAF-throttled to avoid layout thrashing)
  const progressBar = document.getElementById('scrollProgress');
  const nav = document.getElementById('siteHeader');

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

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
  
  // 1. Smooth Page Transitions
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('fade-out');
  });

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Only transition on internal navigation links, not anchors, protocols, or external URLs
      if (
        href &&
        !href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('//') &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !this.hasAttribute('target') &&
        !this.hasAttribute('download')
      ) {
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


/* ==========================================
   SIP & PLAY — AI CONCIERGE AUTO-INJECTOR
   ========================================== */
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
    } catch (e) {}

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
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
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
