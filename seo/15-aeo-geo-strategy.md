# SIP & PLAY — ADVANCED AEO, GEO & AI SEARCH DISCOVERABILITY STRATEGY

**Production Domain:** `https://sipandplaylk.co/`  
**Business Entity:** Sip & Play (`https://sipandplaylk.co/#organization`)  
**Primary Market:** Sri Lanka (Colombo & Island-wide)  
**Secondary Regional Coverage:** Maldives & Thailand  
**Agency:** UCODE (`https://universalcode.site/`)  
**Strategy Date:** 2026-11-26

---

## 1. Strategic Objective & Realistic Scope

The goal of this Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) program is to maximize the probability that **Sip & Play** is accurately discovered, retrieved, understood, cited, and recommended when hospitality decision-makers (hotel General Managers, Executive Chefs, F&B Directors, MEP consultants, and café/bakery founders) query AI-powered search and answer engines:

- **Google AI Overviews & Google AI Mode** (grounded via Google Search / `Googlebot`)
- **ChatGPT Search** (indexed via `OAI-SearchBot` and retrieved live via `ChatGPT-User`)
- **Perplexity** (indexed via `PerplexityBot` and retrieved live via `Perplexity-User`)
- **Microsoft Copilot & Bing Search** (grounded via `Bingbot`)
- **Claude Web Search** (indexed via `Claude-SearchBot` and retrieved live via `Claude-User`)
- **Gemini** (grounded via Google Search index)

### Non-Negotiable Governance Principles
1. **No Guaranteed AI Citations or Rankings:** Generative answer engines synthesize variable responses conditioned on user location, conversation context, query fan-out, and live retrieval indices. No ethical engineering team can guarantee fixed rankings or citations.
2. **Search Grounding Enabled vs. Model Pre-Training Opted Out by Default:** Search indexers and user-initiated retrieval bots are explicitly allowed on all 36 public pages, whereas foundation model training scrapers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`) remain disallowed by default in `robots.txt` unless Sip & Play leadership grants explicit written approval.
3. **Zero Regressions to Verified Performance Benchmarks:** All markup, structured data, and answer-first improvements are static HTML/JSON-LD with zero heavy client-side dependencies, preserving the verified live homepage Lighthouse scores (**Desktop: 100 / 93 / 100 / 100**, **Mobile: 99 / 93 / 100 / 100**).

---

## 2. Official Platform Documentation Consulted (With Access Dates)

| Platform / Authority | Official Documentation Topic | Reference Source / URL | Access Date | Key Takeaway Applied to Sip & Play |
|---|---|---|---|---|
| **Google Search Central** | AI Overviews, AI Mode & Search Grounding | `https://developers.google.com/search/docs/appearance/ai-overviews` | 2026-11-26 | AI Overviews and AI Mode use Google's core Search index (`Googlebot`) and Query Fan-Out (RAG). No special meta tags or `llms.txt` are required by Google; static HTML crawlability, clear factual density, and valid JSON-LD entity consistency drive grounding. |
| **Google Search Central** | `Google-Extended` Crawler Control | `https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers` | 2026-11-26 | `Google-Extended` controls foundation model training and does not affect inclusion in Google Search or AI Overviews (which rely on `Googlebot`). |
| **Google Search Central** | Retirement of `FAQPage` Rich Results | `https://developers.google.com/search/blog/2023/08/howto-faq-changes` (and May/June 2026 retirement updates) | 2026-11-26 | `FAQPage` JSON-LD no longer generates expandable SERP rich results on commercial websites. Visible, accessible HTML Q&A sections (`<h4>` + `<p>`) remain highly effective for RAG extraction without bloating `<head>` with redundant `FAQPage` schema. |
| **OpenAI** | OpenAI Crawlers (`OAI-SearchBot`, `ChatGPT-User`, `GPTBot`) | `https://platform.openai.com/docs/bots` | 2026-11-26 | `OAI-SearchBot` indexes sites for ChatGPT Search citations and is separate from `GPTBot` (model training). `ChatGPT-User` performs live user-triggered fetches. |
| **Anthropic** | Anthropic Web Crawlers (`Claude-SearchBot`, `Claude-User`, `ClaudeBot`) | `https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler` | 2026-11-26 | `Claude-SearchBot` and `Claude-User` handle web search indexing and user-requested fetches; `ClaudeBot` is used for model training. |
| **Perplexity** | Perplexity Crawlers (`PerplexityBot`, `Perplexity-User`) | `https://docs.perplexity.ai/guides/bots` | 2026-11-26 | `PerplexityBot` builds Perplexity's search index and respects `robots.txt`; `Perplexity-User` handles live user-triggered fetches. |
| **Microsoft Bing** | Bing Webmaster Guidelines & Copilot Grounding | `https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a` | 2026-11-26 | Microsoft Copilot grounds responses directly in the Bing index crawled by `Bingbot`. Avoid `noarchive`, `nocache`, or `nosnippet` on public pages. |

---

## 3. Verified Recommendations vs. Experimental GEO Techniques

To maintain engineering rigor, our implementation separates **Verified Technical Standards** from **Experimental GEO Techniques**:

### A. Verified Technical Standards (Implemented & Proven)
1. **Static HTML Answer-First Architecture (Zero JS Dependency for Content):**
   - Many AI retrieval agents (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `ChatGPT-User`) fetch raw initial HTML responses and do not reliably execute complex client-side JavaScript filters.
   - All 6 commercial category landing pages (`/commercial-kitchen-design/`, `/commercial-coffee-machines/`, `/commercial-refrigeration/`, `/commercial-cooking-equipment/`, `/commercial-bakery-equipment/`, `/stainless-steel-kitchen-fabrication/`), all 20 engineering guides (`/blog/<slug>/`), and the `<noscript>` directory on `/equipment/` deliver complete technical tables, model numbers, utility loads, and direct Q&A blocks in the initial HTML payload.
2. **Granular `robots.txt` Search vs. Training Separation:**
   - Explicitly permits `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, and `Applebot` on public pages while disallowing `/portal/` and `/seo/`, and disallowing training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`).
3. **Unified JSON-LD Entity Graph (`https://sipandplaylk.co/#organization`):**
   - Every one of the 36 public pages now references the exact canonical `@id: "https://sipandplaylk.co/#organization"` (`Sip & Play`), eliminating fragmented anonymous organization nodes across `AboutPage`, `Service`, `CollectionPage`, `ContactPage`, `WebPage`, `Blog`, and `BlogPosting` schemas.
4. **High-Density Specification Tables & Self-Contained 40–80 Word Answer Blocks:**
   - RAG retrieval pipelines segment pages into passage chunks (typically 100–300 tokens). By placing a self-contained 40–80 word direct answer immediately beneath explicit question headings (`<h4>`), followed by structured HTML `<table>` comparisons (SKU, boiler size, wattage, voltage, dimensions, warranty), we ensure retrieved chunks contain complete, citable facts.

### B. Experimental GEO Techniques (Implemented with Documented Limitations)
1. **Root `/llms.txt` Markdown Directory (`https://sipandplaylk.co/llms.txt`):**
   - **What It Is:** A lightweight Markdown index proposed by `llmstxt.org` summarizing the verified business entity, leadership, contact details, 6 commercial landing pages, 3 verified project case studies, and 20 technical guides using canonical `https://sipandplaylk.co/` URLs.
   - **Limitation:** Google Search Central explicitly states that `llms.txt` is **not** used by Google AI Overviews or AI Mode. However, third-party AI coding/research agents and certain custom RAG fetchers check `/llms.txt` for rapid site orientation. It carries zero performance cost and zero SEO risk when restricted strictly to public canonical URLs.
2. **Passage-Level Entity Co-Occurrence (Brand + OEM + Territory + Specification):**
   - **What It Is:** Structuring key answer paragraphs so that the entity name (*Sip & Play*), territory (*Colombo, Sri Lanka, Maldives, Thailand*), OEM brand (*EVEBOT, INNOSONG, T&Z Galaxy, LEHEHE*), and technical standard (*AISI 304, 380–400V 3-phase, 1.0m rough-in*) appear in the same semantic passage.
   - **Limitation:** Improves vector-embedding similarity for multi-constraint prompts (e.g., *"Who supplies multi-boiler espresso machines with local warranty in Sri Lanka?"*), but still requires external domain authority and search indexation to surface consistently.

---

## 4. The 5 Pillars of Sip & Play's AEO/GEO Architecture

1. **Pillar 1 — Crawler & Index Accessibility (`seo/16-ai-crawler-accessibility-audit.md`):**
   - Clean `HTTP 200` static HTML, explicit search-bot allowlisting, training-bot opt-out, and exclusion of `/portal/` and `/seo/` (via `robots.txt` and `_config.yml`).
2. **Pillar 2 — Canonical Brand & Entity Knowledge Graph (`seo/17-brand-entity-knowledge-base.md`):**
   - Standardized NAP (`11A/1 Rathnawali Road, Dehiwela, Colombo, Sri Lanka`, `+94 702 700 500`, `info@sipandplay.lk`), verified leadership (`Isham Nayeem`, `Vivian Hu`, `Mohamed Mufthi`, `Ilham Nayeem`), authorized OEM agencies (`EVEBOT`, `INNOSONG`, `T&Z Galaxy`, `LEHEHE`), and accurate project statuses (*Under Build*, *Launching*, *Expanding*).
3. **Pillar 3 — 150-Question Commercial Intelligence Matrix (`seo/18-aeo-question-master-database.csv` & `seo/19-aeo-question-page-mapping.csv`):**
   - 150 decision-stage B2B questions across 15 hospitality engineering categories mapped 1-to-1 to existing canonical URLs without creating doorway pages.
4. **Pillar 4 — Evidence, Regulatory Distinction & Source Authority (`seo/21-geo-source-authority-register.csv`):**
   - Explicit distinction between international engineering guidance (ASHRAE, NFPA 96, HACCP, ISO 23953 Climate Class 4/5) and legally binding Sri Lankan statutory requirements (Food Act No. 26 of 1980, CEA EPL/grease trap rules, CEB/LECO 400V 3-phase codes, Municipal Fire Department LPG safety).
5. **Pillar 5 — Empirical AI Citation Benchmarking & GA4 Attribution (`seo/20-ai-competitor-citation-audit.md` & `seo/22-ai-search-visibility-tracker.csv`):**
   - 30-prompt empirical baseline audit and ongoing GA4 (`G-6J443GNZ4J`) + Google Search Console tracking framework separating inquiry intent clicks from confirmed leads.
