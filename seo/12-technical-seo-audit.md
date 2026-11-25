# SIP & PLAY — COMPREHENSIVE TECHNICAL SEO & PERFORMANCE AUDIT

**Website:** `https://sipandplaylk.co/`  
**Hosting Architecture:** GitHub Pages (Custom Domain via `CNAME`)  
**GA4 Measurement ID:** `G-6J443GNZ4J` (Basic Consent Mode)  
**Total Public Indexable URLs:** 36 Static HTML Pages  
**Audit Date:** 2026-11-25

---

## 1. Repository & Information Architecture Audit

### 1.1 Complete URL Inventory (36 Canonical Public Pages + 1 Private Non-Indexed Portal)

| # | URL Path | Page Classification | Indexability | Canonical Tag | Structured Data (`application/ld+json`) |
|---|---|---|---|---|---|
| 1 | `/` | Homepage | `index, follow` | `https://sipandplaylk.co/` | `ProfessionalService`, `WebSite` |
| 2 | `/about/` | Corporate & Leadership | `index, follow` | `https://sipandplaylk.co/about/` | `AboutPage`, `BreadcrumbList` |
| 3 | `/services/` | Engineering Services Overview | `index, follow` | `https://sipandplaylk.co/services/` | `Service`, `BreadcrumbList` |
| 4 | `/projects/` | Case Study Portfolio | `index, follow` | `https://sipandplaylk.co/projects/` | `CollectionPage`, `BreadcrumbList` |
| 5 | `/equipment/` | Interactive 170+ SKU Schedule Builder | `index, follow` | `https://sipandplaylk.co/equipment/` | `CollectionPage`, `BreadcrumbList` |
| 6 | `/brands/` | Authorized OEM Brand Directory | `index, follow` | `https://sipandplaylk.co/brands/` | `CollectionPage`, `BreadcrumbList` |
| 7 | `/contact/` | Project Inquiry & RFQ Desk | `index, follow` | `https://sipandplaylk.co/contact/` | `ContactPage`, `BreadcrumbList` |
| 8 | `/commercial-kitchen-design/` | **New Commercial Service Landing Page** | `index, follow` | `https://sipandplaylk.co/commercial-kitchen-design/` | `Service`, `BreadcrumbList` |
| 9 | `/commercial-coffee-machines/` | **New Commercial Category Landing Page** | `index, follow` | `https://sipandplaylk.co/commercial-coffee-machines/` | `CollectionPage`, `Service`, `BreadcrumbList` |
| 10 | `/commercial-refrigeration/` | **New Commercial Category Landing Page** | `index, follow` | `https://sipandplaylk.co/commercial-refrigeration/` | `CollectionPage`, `Service`, `BreadcrumbList` |
| 11 | `/commercial-cooking-equipment/` | **New Commercial Category Landing Page** | `index, follow` | `https://sipandplaylk.co/commercial-cooking-equipment/` | `CollectionPage`, `Service`, `BreadcrumbList` |
| 12 | `/commercial-bakery-equipment/` | **New Commercial Category Landing Page** | `index, follow` | `https://sipandplaylk.co/commercial-bakery-equipment/` | `CollectionPage`, `Service`, `BreadcrumbList` |
| 13 | `/stainless-steel-kitchen-fabrication/` | **New Commercial Category Landing Page** | `index, follow` | `https://sipandplaylk.co/stainless-steel-kitchen-fabrication/` | `Service`, `BreadcrumbList` |
| 14 | `/blog/` | Culinary Engineering Insights Hub | `index, follow` | `https://sipandplaylk.co/blog/` | `Blog`, `BreadcrumbList` |
| 15–34 | `/blog/<20-article-slugs>/` | 5 Pillar Guides + 15 Cluster Articles | `index, follow` | `https://sipandplaylk.co/blog/<slug>/` | `BlogPosting`, `BreadcrumbList` |
| 35 | `/terms/` | Terms of Engagement | `index, follow` | `https://sipandplaylk.co/terms/` | `WebPage`, `BreadcrumbList` |
| 36 | `/privacy/` | Privacy Policy & Telemetry Controls | `index, follow` | `https://sipandplaylk.co/privacy/` | `WebPage`, `BreadcrumbList` |
| — | `/portal/` | Private Client Portal | `noindex, nofollow` | Excluded from `sitemap.xml` | Disallowed in `robots.txt` & GA4 blocked |

---

## 2. Resolution of Client-Side JavaScript Rendering Dependency

### Finding During Phase 1 Audit
- The interactive equipment catalogue (`/equipment/index.html`) loads 170+ verified SKUs dynamically via `brands_products_data.js`, `catalog_products_normalized.js`, and `catalogue.js`.
- Previously, footer category links used query parameters (`/equipment/?category=coffee`, `/equipment/?category=cooking`, `/equipment/?category=refrigeration`, `/equipment/?category=bakery`, `/equipment/?category=fabrication`). Because GitHub Pages serves static HTML and query parameters resolve to the same `/equipment/` canonical URL, search engines could not index distinct static landing pages for each major revenue category.

### Architectural Fix Implemented
- Created **6 static, crawlable HTML commercial landing pages** (`/commercial-kitchen-design/`, `/commercial-coffee-machines/`, `/commercial-refrigeration/`, `/commercial-cooking-equipment/`, `/commercial-bakery-equipment/`, `/stainless-steel-kitchen-fabrication/`).
- Each static landing page renders full HTML specifications, three-phase electrical/utility matrices, comparison tables, verified project references, and structured data directly in the initial HTTP payload—requiring zero JavaScript execution for Googlebot to index.
- Each landing page links directly into the interactive `/equipment/?category=...` schedule builder for users ready to compile a multi-SKU bill of quantities.
- All global footer navigation links across the website now point to these clean static canonical URLs instead of query parameter URLs.

---

## 3. Metadata, Heading Hierarchy & Structured Data Verification

1. **Unique `<title>` and `<meta name="description">` Tags:**
   - Verified across all 36 public pages. Every title targets a distinct primary keyword cluster without cannibalizing existing pages.
2. **Heading Hierarchy (`H1` → `H2` → `H3`):**
   - Strictly one `<h1>` per page across all 36 public URLs.
   - Logical `<h2>` section headings and `<h3>` specification subheadings.
3. **Canonical Consistency:**
   - Every public page declares `<link rel="canonical" href="https://sipandplaylk.co/...">` matching the `CNAME` production domain (`sipandplaylk.co`).
   - Zero outdated `not7pro.github.io` references remain in SEO metadata, Open Graph tags, JSON-LD schemas, `sitemap.xml`, or `robots.txt`.
4. **Honest Structured Data (`application/ld+json`):**
   - `ProfessionalService` / `Organization` schema uses verified contact data (`+94-77-779-9723`, `info@sipandplay.lk`, Colombo, Sri Lanka, and regional service coverage).
   - No fake `AggregateRating`, fake reviews, or unverified product prices are included anywhere in the schema markup.

---

## 4. Core Web Vitals & Frontend Performance Engineering

| Core Web Vital / Metric | Optimization Implemented | Technical Verification |
|---|---|---|
| **Largest Contentful Paint (LCP)** | Above-the-fold hero images use `fetchpriority="high"` and explicit `width` / `height` attributes; Google Fonts use `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com` with `display=swap`. | Prevents render-blocking font delays and prioritizes hero asset loading. |
| **Cumulative Layout Shift (CLS)** | All `<img>` tags specify intrinsic `width` and `height` attributes; no floating cookie banner or dynamic layout-shifting modal injects on page load. | Eliminates layout shift during image decode and initial script bootstrap. |
| **Interaction to Next Paint (INP)** | Vanilla ES6 JavaScript (`script.js`, `catalogue.js`, `analytics-init.js`) with zero heavy third-party framework bundles; passive scroll listeners and delegated click handlers. | Keeps main-thread blocking time minimal across mobile and desktop devices. |
| **Offscreen Image Deferral** | Below-the-fold project, brand, and article images use `loading="lazy"` and `decoding="async"`. | Reduces initial page weight and saves bandwidth on mobile networks. |

---

## 5. Privacy, Security & GA4 (`G-6J443GNZ4J`) Basic Consent Mode Audit

1. **Zero Pre-Consent GA4 Network Requests (Basic Consent Mode):**
   - Until a visitor explicitly clicks the inline footer toggle (`Analytics: Off (Opt In)`), `gtag/js` is **not** injected into the DOM and zero pings are sent to `google-analytics.com` or `googletagmanager.com`.
2. **Immediate Consent Withdrawal:**
   - Clicking `Analytics: On (Withdraw)` in the footer updates consent to `denied`, expires `_ga` and `_ga_6J443GNZ4J` cookies across domain/path combinations, sets `window['ga-disable-G-6J443GNZ4J'] = true`, and halts all subsequent tracking calls.
3. **PII Redaction & Taxonomy Classification:**
   - `allow_google_signals: false` and `allow_ad_personalization_signals: false`.
   - `cleanUrl()` strips query parameters (`?text=`, `?phone=`, `?email=`, `?name=`) and hashes before sending page locations.
   - `site_search` maps user queries to a fixed 14-topic commercial taxonomy (`coffee_espresso`, `refrigeration_cold_chain`, `cooking_thermal`, etc.) and never transmits raw user-typed strings.
4. **Confirmed Lead vs. Inquiry Intent Separation:**
   - `generate_lead` fires **only** inside the `fetch().then()` callback when an HTTP 2xx (`response.ok`) server response confirms form submission.
   - WhatsApp redirects, mailto links, tel links, and RFQ buttons fire inquiry intent events (`quote_request_click`, `whatsapp_click`, `phone_click`, `email_click`).
