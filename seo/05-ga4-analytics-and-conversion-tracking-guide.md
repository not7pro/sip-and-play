# Sip & Play — Google Analytics 4 (`G-6J443GNZ4J`) & Advanced Conversion Tracking Documentation

**Production Website:** `https://sipandplaylk.co/`  
**GA4 Measurement ID:** `G-6J443GNZ4J`  
**Stream Name:** Sip & Play Production  
**Integration Architecture:** Direct `gtag.js` with Google Consent Mode v2 + Centralized `window.SipAnalytics` Engine  
**Agency:** UCODE  

---

## 1. Existing Tracking Audit & Installation Method

### 1.1 Pre-Implementation Audit Findings
- **Existing Scripts Audited:** Inspected all HTML and JS files across the repository. No prior Google Analytics (`G-`), Google Tag Manager (`GTM-`), Google Ads, or third-party tracking scripts were installed.
- **Why Direct `gtag.js` Was Selected Over GTM (`GTM-TCG8D663`):** Per Google and technical SEO best practices, because the `GTM-TCG8D663` container has not been verified as published or configured, installing both `gtag.js` and GTM would risk double-counting page views and loading redundant container JavaScript. Direct `gtag.js` integration (`G-6J443GNZ4J`) guarantees zero duplicate hits, minimal main-thread execution overhead, and deterministic source-controlled event logic in `script.js` and `catalogue.js`.

### 1.2 Public vs. Excluded Private Pages
- **Covered Public Pages (30 Total Pages):**
  - Core Commercial Pages (9): `/`, `/about/`, `/services/`, `/projects/`, `/equipment/`, `/brands/`, `/contact/`, `/terms/`, `/privacy/`
  - Blog Hub & Published Engineering Guides (21): `/blog/` and all 20 `/blog/<slug>/` articles
- **Excluded Private / Internal Pages (2 Pages):**
  - `/portal/index.html` and `/portal/login.html` (Enterprise Stock & Valuation Portal) have **no** GA4 script tags in their HTML and are explicitly excluded by a runtime path guard (`if (rawPath.includes('/portal')) return;`) in `script.js`.

---

## 2. Custom Events & Trigger Definitions (13 Production Events)

All 13 supported events are implemented in `script.js` and `catalogue.js` with automatic 600ms rapid-click deduplication, 3,000ms form-submission cooldowns, and `transport_type: 'beacon'` so events reliably dispatch before page transitions.

| # | Event Name | Exact Trigger Condition | Key Event Designation | Parameters Transmitted (Strictly Non-PII) |
|---|---|---|---|---|
| 01 | `generate_lead` | Fires **only** when a genuine inquiry form passes HTML5 validation with all required fields non-empty:<br>1. `#contactForm` on `/contact/`<br>2. `#customerRfqForm` on `/equipment/` (with `projectSchedule.length > 0`) | **Primary Key Event (Confirmed Inquiry Submission)** | `page_type`, `content_category` (selected project scope), `equipment_category`, `equipment_name`, `brand_name`, `cta_location`, `contact_method`, `scheduled_models_count`, `scheduled_units_count` |
| 02 | `whatsapp_click` | Visitor clicks any WhatsApp contact link (`a[href*="wa.me/"]` or `a[href*="whatsapp.com/"]`) | **Key Event (Direct Contact Intent)** | `page_type`, `content_category`, `article_title`, `cta_location`, `contact_method: 'whatsapp'`, `link_type: 'outbound_contact'` |
| 03 | `quote_request_click` | Visitor clicks any quotation request CTA (`a[href*="#quote"]`, quote/consultation buttons to `/contact/`, `#btnOpenCustomerModal` in schedule drawer, or `"Request Quotation for this Unit"` in spec modal) | **Key Event (High-Intent Funnel Entry)** | `page_type`, `content_category`, `article_title`, `equipment_name`, `brand_name`, `cta_location`, `contact_method`, `link_type: 'quote_cta'` |
| 04 | `phone_click` | Visitor clicks any telephone link (`a[href^="tel:"]`) | **Key Event (Direct Contact Intent)** | `page_type`, `content_category`, `article_title`, `cta_location`, `contact_method: 'phone'`, `link_type: 'telephone'` |
| 05 | `email_click` | Visitor clicks any email contact link (`a[href^="mailto:"]`) | Micro-Conversion | `page_type`, `content_category`, `article_title`, `cta_location`, `contact_method: 'email'`, `link_type: 'email'` |
| 06 | `catalogue_view` | Visitor opens the commercial equipment catalogue (`/equipment/`) | Engagement Event | `page_type: 'equipment_catalogue'`, `content_category`, `equipment_category` (initial `?category=` or `'all'`), `brand_name` (initial `?brand=` or `'all'`) |
| 07 | `equipment_view` | Visitor opens an individual equipment item's specification modal (`openSpecModal(product)` in `catalogue.js`) | High-Intent Product Engagement | `page_type: 'equipment_catalogue'`, `content_category: 'equipment_specification'`, `equipment_category`, `equipment_name` (`Name (SKU)`), `brand_name`, `cta_location: 'equipment_spec_modal'` |
| 08 | `brand_view` | Visitor views a specific brand via `/brands/` section viewport (`IntersectionObserver`), brand anchor/filter link (`#evebot`, `#innosong`, `#tz`, `#lehehe`, `?brand=`), or `#brandSelect` dropdown on `/equipment/` | Brand Engagement | `page_type`, `content_category`, `brand_name` (`EVEBOT`, `INNOSONG`, `T&Z Galaxy`, `LEHEHE`, etc.), `cta_location` |
| 09 | `project_view` | Visitor views a verified case study panel on `/projects/` (*The Chinese Mega Kitchen*, *The Mustard Gourmet*, *Oh Donuts Facility*) | Portfolio Engagement | `page_type: 'projects_portfolio'`, `content_category: 'case_study'`, `article_title` (project name), `cta_location: 'project_case_study_card'` |
| 10 | `blog_article_view` | Visitor opens any of the 20 blog engineering guides (`/blog/<slug>/`) | Content Authority Event | `page_type: 'blog_article'`, `content_category` (breadcrumb category), `article_title` (`<h1>` headline) |
| 11 | `blog_cta_click` | Visitor inside a blog article or on `/blog/` clicks an in-content CTA or link pointing to `/services/`, `/equipment/`, `/brands/`, `/projects/`, or `/contact/` | Content-to-Commercial Attribution | `page_type`, `content_category`, `article_title`, `cta_location` (`article_cta_box`, `sticky_sidebar`, `article_inline_prose`), `link_type` (`to_services`, `to_equipment`, `to_brands`, `to_projects`, `to_contact_quote`) |
| 12 | `catalogue_download` | Visitor clicks `"Print / Save PDF"` (`.btn-legal-action`) or any downloadable PDF/catalogue file link (`a[download]`, `a[href$=".pdf"]`) | Specification Export Intent | `page_type`, `content_category`, `article_title`, `cta_location`, `link_type: 'pdf_export'` |
| 13 | `site_search` | Visitor searches on `/equipment/` (`#catSearch`) or `/blog/` (`#blogSearchInput`), debounced 1000ms after typing stops (min 2 chars, PII-redacted) | Search Discovery | `page_type`, `content_category`, `cta_location`, `search_term`, `results_count` |

---

## 3. Distinguishing Contact Intent vs. Confirmed Inquiry Submissions

When analyzing leads in GA4 Reports, leadership must distinguish between **Contact Intent** and **Form Submission**:
1. **`generate_lead` (Confirmed Form Submission):** Fires only after a visitor completes all mandatory fields on the `/contact/#quote` RFQ form or `/equipment/` Schedule RFQ modal and submits the form to open the pre-formatted WhatsApp specification ticket.
2. **`whatsapp_click` & `phone_click` (Direct Contact Intent):** Fires when a visitor clicks a direct WhatsApp or `tel:+94702700500` link. Note that a click indicates high contact intent, not proof that the visitor pressed "Send" inside WhatsApp or completed a phone conversation.
3. **`quote_request_click` (Upper-Funnel CTA Intent):** Measures which pages, equipment cards, or blog articles successfully persuade visitors to navigate toward the quotation form.

---

## 4. Privacy, Consent Mode v2 & Zero-PII Safeguards

1. **Google Consent Mode v2 (`analytics_storage: 'denied'` by Default Prior to Consent):**
   - In `<head>`, `gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: c === 'granted' ? 'granted' : 'denied' })` executes before `gtag('config', 'G-6J443GNZ4J')`.
   - First-time visitors are presented with an accessible, zero-CLS consent banner (`#sipCookieBanner`) offering **"Accept Analytics"** and **"Essential Only"**.
   - Visitors can review or withdraw consent at any time via the **"Cookie Preferences"** button in the footer of every public page. Withdrawing consent sets `analytics_storage: 'denied'`, activates `window['ga-disable-G-6J443GNZ4J'] = true`, and purges `_ga` cookies.
2. **Multi-Layer PII Stripping:**
   - **URL Sanitizer in `<head>`:** Automatically removes sensitive query parameters (`name`, `email`, `phone`, `tel`, `whatsapp`, `msg`, `message`, `token`, `password`) from `window.location` via `history.replaceState` before `gtag('config')` executes.
   - **Payload Sanitizer in `script.js`:** Blocks forbidden PII parameter keys and runs regex redaction against email patterns (`[redacted_email]`) and phone number sequences (`[redacted_phone]`) on all string parameters.

---

## 5. Manual Configuration Steps inside Google Analytics 4 & GSC

### 5.1 Step 1: Mark the 4 Key Events (Conversions) in GA4
1. Open [Google Analytics](https://analytics.google.com/) and select the **Sip & Play Production** property (`G-6J443GNZ4J`).
2. Go to **Admin (Gear Icon) → Data display → Events** (or **Key events**).
3. Click **New key event** and add the following four exact event names (case-sensitive):
   - `generate_lead`
   - `whatsapp_click`
   - `quote_request_click`
   - `phone_click`
4. For `generate_lead`, set the Counting Method to **Once per session** (optional recommended B2B setting to prevent multiple form tweaks in one session from inflating lead counts).

### 5.2 Step 2: Register Custom Dimensions in GA4
To break down events by article title, equipment model, brand, and CTA placement in GA4 Explorations and Standard Reports:
1. Go to **Admin → Data display → Custom definitions → Create custom dimension**.
2. Register the following **Event-scoped** custom dimensions:

| Dimension Name | Scope | Event Parameter |
|---|---|---|
| Page Type | Event | `page_type` |
| Content Category | Event | `content_category` |
| Article or Project Title | Event | `article_title` |
| Equipment Category | Event | `equipment_category` |
| Equipment Name / SKU | Event | `equipment_name` |
| Brand Name | Event | `brand_name` |
| CTA Location | Event | `cta_location` |
| Contact Method | Event | `contact_method` |
| Link Type | Event | `link_type` |

### 5.3 Step 3: Link Google Search Console to GA4
1. In GA4, go to **Admin → Product links → Search Console links → Link**.
2. Click **Choose accounts** and select the verified DNS property `sipandplaylk.co`.
3. Click **Next**, select the **Sip & Play Production** web data stream (`G-6J443GNZ4J`), and click **Submit**.
4. Go to **Reports → Library**, locate the **Search Console** collection card, click the three dots (`⋮`), and click **Publish** so **Queries** and **Google Organic Search Traffic** appear permanently in the left navigation sidebar.

---

## 6. How to Verify in GA4 Realtime, DebugView & Tag Assistant

### 6.1 Local Developer Verification (`?ga_debug=1`)
By default, `localhost`, `127.0.0.1`, and `file://` traffic is blocked from sending hits to production GA4. To test locally:
1. Open any page with `?ga_debug=1` appended (e.g., `http://localhost:8080/equipment/?ga_debug=1`).
2. Click **"Accept Analytics"** on the consent banner.
3. Open Browser DevTools → **Console**. Every interaction prints a structured log:
   `[SipAnalytics GA4] Event: equipment_view { page_type: "equipment_catalogue", equipment_name: "...", debug_mode: true }`
4. In GA4, open **Admin → Data display → DebugView** to watch events arrive live with all custom parameters.

### 6.2 Live Production Verification (`https://sipandplaylk.co/`)
1. Open `https://sipandplaylk.co/` in a browser window or via [Google Tag Assistant](https://tagassistant.google.com/).
2. Click **"Accept Analytics"** on the consent banner.
3. In GA4, navigate to **Reports → Realtime**.
4. Verify that active user count increments by 1 and test clicking a WhatsApp link (`whatsapp_click`), opening an equipment specification modal (`equipment_view`), and reading a blog guide (`blog_article_view`).
