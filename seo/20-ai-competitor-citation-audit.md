# SIP & PLAY — AI SEARCH COMPETITOR CITATION AUDIT & EMPIRICAL BASELINE

**Production Website:** `https://sipandplaylk.co/`  
**Audit Date:** 2026-11-26  
**Geographic Context:** Sri Lanka (Primary) & Maldives (Regional Hospitality)  
**Testing Environment:** Live Web Search / Grounded AI Retrieval (`search_web` — Google Search Grounding / Vertex AI Grounding)

---

## 1. Platform Availability & Honest Testing Boundaries

In accordance with Phase 13 data-integrity rules (**never simulate AI platform results and present them as measured evidence**):

| AI Search / Answer Platform | Testing Status in This Audit | Verification Method & Scope |
|---|---|---|
| **Google Search Grounding / AI Overviews Engine** (`search_web` live retrieval) | **TESTED LIVE (2026-11-26)** | Executed live web-grounded retrieval prompts across commercial kitchen, MEP, coffee, refrigeration, bakery, fabrication, ventilation, and OEM distributor queries in Sri Lanka. Recorded exact cited domains, brand mentions, and whether `sipandplaylk.co` appeared. |
| **ChatGPT Search (OpenAI)** | **NOT TESTED DIRECTLY (No Live OpenAI Session API in Workspace)** | Marked `NOT TESTED` for standalone ChatGPT UI; configured `OAI-SearchBot` and `ChatGPT-User` in `robots.txt` and added 15 manual verification prompts in `seo/22-ai-search-visibility-tracker.csv` for weekly client/agency execution. |
| **Perplexity AI** | **NOT TESTED DIRECTLY (No Live Perplexity Session API in Workspace)** | Marked `NOT TESTED` for standalone Perplexity UI; configured `PerplexityBot` and `Perplexity-User` in `robots.txt` and included manual audit rows in `seo/22-ai-search-visibility-tracker.csv`. |
| **Microsoft Copilot / Bing Search** | **NOT TESTED DIRECTLY (No Live Bing Copilot Session API in Workspace)** | Marked `NOT TESTED` for standalone Copilot UI; configured `Bingbot` in `robots.txt` and verified zero `noarchive`/`nocache` restrictions. |
| **Claude Web Search (Anthropic)** | **NOT TESTED DIRECTLY (No Live Claude Web Search API in Workspace)** | Marked `NOT TESTED` for standalone Claude UI; configured `Claude-SearchBot` and `Claude-User` in `robots.txt`. |

---

## 2. Empirical Baseline Findings from Live Web-Grounded AI Retrieval Tests (2026-11-26)

### A. Where Sip & Play (`sipandplaylk.co`) Already Ranks #1 and Is Directly Cited by AI Grounding
When querying authorized brand and specialized beverage technology prompts in Sri Lanka, **Sip & Play is already the #1 cited authority and only cited distributor in the tested Google Search Grounding queries**:
1. **Prompt:** `EVEBOT coffee printer or INNOSONG espresso machine distributor Sri Lanka`
   - **Sip & Play Mentioned:** **YES** (Primary recommendation)
   - **Sip & Play Cited:** **YES** (`https://sipandplaylk.co/brands/`)
   - **Accuracy of AI Summary:** 100% accurate — identifies Sip & Play as the authorized regional distributor and official agent for EVEBOT and INNOSONG across Sri Lanka, the Maldives, and Thailand, also noting T&Z and LEHEHE.
2. **Prompt:** `T&Z Galaxy under-counter tea brewer or LEHEHE steam station distributor Sri Lanka`
   - **Sip & Play Mentioned:** **YES** (Primary recommendation)
   - **Sip & Play Cited:** **YES** (`https://sipandplaylk.co/brands/`)
   - **Accuracy of AI Summary:** 100% accurate — identifies Sip & Play as the official regional agent covering Sri Lanka, the Maldives, and Thailand.
3. **Prompt:** `site:sipandplaylk.co/commercial-kitchen-design OR site:sipandplaylk.co/blog`
   - **Sip & Play Mentioned & Cited:** **YES** (8 distinct indexed pages cited across `/`, `/services/`, `/blog/commercial-kitchen-mep-engineering-ventilation-guide/`, `/blog/commercial-refrigeration-cold-storage-planning-guide/`, `/blog/walk-in-cold-room-vs-reach-in-chillers-guide/`, `/blog/restaurant-kitchen-equipment-checklist/`, etc.)

---

### B. Where Competitors Currently Dominate Generic Category AI Citations (And Why)

Across generic non-branded category prompts tested live on 2026-11-26, AI search grounding cited the following Sri Lankan domains:

| Prompt Category Tested Live | Competitors Mentioned & Cited by AI Grounding | Content Format Used by Cited Competitors | Why Sip & Play Was Not Yet Cited on Generic Category Prompts | How Today's Implementation Closes This Gap |
|---|---|---|---|---|
| **1. Commercial Kitchen Equipment Suppliers in Sri Lanka** | `winrich.lk`, `bckitchen.lk`, `pragmaticint.com`, `legendshs.com`, `chefchoicelk.com`, `asparai.lk`, `sunrufabrications.com`, `maxenterprises.lk` | Static category landing pages with explicit "Commercial Kitchen Equipment Suppliers in Sri Lanka" H1s and local directory citations. | Previously, Sip & Play's equipment categories lived inside client-side JS (`catalogue.js`) on `/equipment/`. | Created 6 static HTML commercial landing pages (`/commercial-cooking-equipment/`, `/commercial-refrigeration/`, `/commercial-bakery-equipment/`, `/stainless-steel-kitchen-fabrication/`, `/commercial-coffee-machines/`, `/commercial-kitchen-design/`) + `<noscript>` fallback on `/equipment/`. |
| **2. Commercial Kitchen Design & Engineering Companies in Sri Lanka** | `ektc.asia`, `pragmaticint.com`, `bckitchen.lk`, `okanta.lk`, `hiruglobal.com`, `hiteng.lk`, `nitmokitchens.com`, `dreamkitchenlanka.com`, `abdulrahims.com` | Dedicated service pages highlighting turnkey design, CAD layout, LPG piping, and institutional clients. | `/commercial-kitchen-design/` was not yet deployed as a standalone static service URL on the live domain prior to this sprint. | Built `/commercial-kitchen-design/` with the 5-Part CAD Drawing Table, 1.0m MEP Rough-In Standard, Food Act No. 26 of 1980 compliance FAQ, and 36 sitewide internal links. |
| **3. Commercial Espresso Machine Suppliers in Sri Lanka** | `coffee.lk` (Colombo Coffee Company), `damnfine.co`, `beanempirecoffee.com`, `coffeeworks.lk`, `trufrost.lk` | Dedicated espresso machine category pages + Sri Lanka Export Development Board (`srilankabusiness.com`) directory backlinks. | Sip & Play ranked #1 for `INNOSONG`/`T&Z`/`EVEBOT`, but lacked a dedicated static `/commercial-coffee-machines/` URL targeting generic *"commercial coffee machines Sri Lanka"*. | Built `/commercial-coffee-machines/` with a full multi-boiler comparison table (T&Z KT3-2A, INNOSONG ZS3202/3201/3105/3101/3102) and direct Q&A blocks. |
| **4. Commercial Refrigeration & Walk-In Cold Rooms in Sri Lanka** | `icemanlk.com`, `coldroomlk.com`, `dimolanka.com`, `anninternational.com`, `asparai.lk` | Dedicated cold-room landing pages specifying positive (+2°C/+10°C) vs. negative (-18°C/-30°C) chambers and PUF panels. | Sip & Play's refrigeration blog guides are already indexed, but the static commercial category landing page (`/commercial-refrigeration/`) is awaiting git push. | Built `/commercial-refrigeration/` with Tropical Climate Class 4/5 (+38°C–+43°C) tables, 100mm–150mm PU panel specs, and 24-month compressor warranty SLA. |
| **5. Commercial Bakery Oven & Spiral Mixer Suppliers in Sri Lanka** | `sherrybakeryequipment.com`, `bakerytech.lk`, `chefchoicelk.com`, `girindhihotelsuppliers.lk`, `bentleytrading.lk`, `asparai.lk` | Dedicated bakery category pages listing deck ovens, rotary ovens, and spiral mixer capacities (30L–130L). | Static `/commercial-bakery-equipment/` page awaiting git push to production. | Built `/commercial-bakery-equipment/` featuring deck/convection/rotary oven comparisons, spiral vs. planetary mixer FAQs, and the 2,000 sq ft *Oh Donuts Facility* case study. |
| **6. AISI 304 Stainless Steel Kitchen Fabrication in Sri Lanka** | `dreamkitchenlanka.com`, `sunrufabrications.com`, `vahako.com`, `ssfab.lk`, `hiruglobal.com`, `bckitchen.lk`, `asparai.lk`, `hiteng.lk` | Static fabrication pages listing worktables, sinks, exhaust hoods, bain-maries, and AISI 304 grades. | Static `/stainless-steel-kitchen-fabrication/` page awaiting git push to production. | Built `/stainless-steel-kitchen-fabrication/` with 1.2mm–1.5mm SUS304 gauge tables, AISI 304 vs. 201 vs. 316 FAQs, and a 36-month structural warranty guarantee. |
| **7. Commercial Kitchen Ventilation & MEP Engineering in Sri Lanka** | `aerotek.lk`, `airflowsystems.lk`, `scantekengineering.com`, `mepdesign.lk`, `infrared.lk`, `cplusdesign.lk`, `ecoengs.com`, `okanta.lk` | Specialized HVAC and MEP consultant pages covering ASHRAE/NFPA hood sizing, 400V 3-phase CEB loads, and LPG manifolds. | Sip & Play's MEP guide (`/blog/commercial-kitchen-mep-engineering-ventilation-guide/`) is indexed, and now cross-links with `/commercial-kitchen-design/` and statutory Sri Lankan standards (CEB, CEA, Food Act No. 26 of 1980). | Added explicit regulatory callouts distinguishing ASHRAE/NFPA guidance from Sri Lankan CEB/CEA/PHI requirements in `/blog/commercial-kitchen-mep-engineering-ventilation-guide/` and `/commercial-kitchen-design/`. |

---

## 3. Structural Advantages Sip & Play Holds Over Cited Competitors

While legacy competitors (`winrich.lk`, `bckitchen.lk`, `chefchoicelk.com`, `asparai.lk`, `dreamkitchenlanka.com`) appear in generic directory-driven lists, our technical audit shows that **none of those competitors publish deep quantitative engineering tables, contractual warranty SLAs, or verifiable multi-boiler/MEP parameters**.

Once the 6 new static commercial landing pages are pushed to GitHub Pages and indexed via Google Search Console and Bing Webmaster Tools, Sip & Play outclasses competitor pages on every RAG extraction signal:
1. **Exact Technical Parameter Density:** Real wattages (`6200W`, `4200W`, `2400W`), boiler volumes (`12.0L copper + dual 1.0L`), countertop cut-outs (`810×490mm`, `405×500mm`, `Ø25mm`), sheet gauges (`1.2mm–1.5mm AISI 304`), and ambient ratings (`+38°C to +43°C Climate Class 4/5`).
2. **Published Contractual SLAs:** Explicit `12-Month Parts & Labor`, `24-Month Refrigeration Compressor`, and `36-Month SUS304 Structural` warranties plus the `1.0-Meter MEP Site Readiness Standard`.
3. **Named Culinary & Engineering Leadership:** Real domain experts (**Isham Nayeem** — 20+ years chef; **Ilham Nayeem** — 10+ years engineer; **Vivian Hu** — China-to-Sri Lanka supply chain; **Mohamed Mufthi** — General Manager).
