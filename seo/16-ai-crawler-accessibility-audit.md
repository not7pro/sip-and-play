# SIP & PLAY — AI CRAWLER ACCESSIBILITY & ROBOTS.TXT TECHNICAL AUDIT

**Website:** `https://sipandplaylk.co/`  
**Robots.txt URL:** `https://sipandplaylk.co/robots.txt`  
**Sitemap URL:** `https://sipandplaylk.co/sitemap.xml`  
**Experimental LLMs Index:** `https://sipandplaylk.co/llms.txt`  
**Audit Date:** 2026-11-26

---

## 1. AI Crawler Taxonomy: Search Indexing vs. User Retrieval vs. Model Training

Modern AI companies operate up to three distinct classes of web user agents. Conflating them leads either to **accidental invisibility in AI search** (when webmasters block all AI bots indiscriminately) or **unauthorized model training scraping** (when webmasters allow all bots).

| User-Agent Token | Operator | Crawler Classification | Official Purpose | Respects `robots.txt`? | Sip & Play Policy (`robots.txt`) |
|---|---|---|---|---|---|
| `Googlebot` | Google | **Search Indexer & RAG Grounding** | Indexes web pages for Google Search, Google AI Overviews, Google AI Mode, and Gemini Search grounding. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `Bingbot` | Microsoft | **Search Indexer & RAG Grounding** | Indexes web pages for Bing Search and Microsoft Copilot answers. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `OAI-SearchBot` | OpenAI | **AI Search Indexer** | Crawls and indexes websites specifically to surface and cite links in ChatGPT Search. Explicitly **not** used for foundation model training. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `ChatGPT-User` | OpenAI | **User-Initiated Live Fetcher** | Fetches a web page on-demand when a human user asks ChatGPT to read or check a live URL/topic. Not used for model training. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `PerplexityBot` | Perplexity AI | **AI Search Indexer** | Indexes public web pages to power Perplexity answer citations. Not used for LLM pre-training. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `Perplexity-User` | Perplexity AI | **User-Initiated Live Fetcher** | Fetches live web pages on behalf of an active Perplexity user query. | Generally acts as user agent; listed in `robots.txt` for path clarity | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `Claude-SearchBot` | Anthropic | **AI Search Indexer** | Indexes web content to improve search result relevance and citations in Claude web search. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `Claude-User` | Anthropic | **User-Initiated Live Fetcher** | Retrieves live web pages on-demand when a user prompts Claude with a search or URL query. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `Applebot` | Apple | **Search Indexer** | Indexes web pages for Siri, Spotlight, and Safari search suggestions. | Yes | **ALLOWED** (Public pages) / Disallowed on `/portal/` & `/seo/` |
| `GPTBot` | OpenAI | **Foundation Model Training Crawler** | Scrapes public web text to train OpenAI generative foundation models (e.g., GPT series). | Yes | **DISALLOWED (`Disallow: /`)** pending client approval |
| `ClaudeBot` | Anthropic | **Foundation Model Training Crawler** | Scrapes public web text to train Anthropic Claude foundation models. | Yes | **DISALLOWED (`Disallow: /`)** pending client approval |
| `Google-Extended` | Google | **Foundation Model Training Control** | Controls whether Google may use site content to train future Gemini foundation models (does not impact Google Search or AI Overviews). | Yes | **DISALLOWED (`Disallow: /`)** pending client approval |
| `CCBot` | Common Crawl | **Open Corpus Training Scraper** | Builds open-source web dumps widely used to pre-train third-party LLMs. | Yes | **DISALLOWED (`Disallow: /`)** pending client approval |
| `Applebot-Extended` | Apple | **Foundation Model Training Control** | Controls whether Apple may use web content to train Apple Intelligence foundation models. | Yes | **DISALLOWED (`Disallow: /`)** pending client approval |
| `Bytespider` | ByteDance | **AI Training & Scraping Crawler** | High-frequency scraper used for ByteDance LLM training datasets. | Variable | **DISALLOWED (`Disallow: /`)** |
| `meta-externalagent` | Meta | **AI Training Crawler** | Crawls public web data for Meta AI model training. | Yes | **DISALLOWED (`Disallow: /`)** |

---

## 2. Verification of `robots.txt` Group Precedence & Path Protection

### Critical RFC 9309 Precedence Rule
Under the Robots Exclusion Protocol (RFC 9309), **a crawler that matches a specific `User-agent:` group ignores the wildcard `User-agent: *` group completely**.
- *Common Fatal Error Avoided:* If a site writes:
  ```text
  User-agent: OAI-SearchBot
  Allow: /

  User-agent: *
  Disallow: /portal/
  ```
  Then `OAI-SearchBot` matches only its specific group and **loses** the `Disallow: /portal/` restriction!
- *How Sip & Play's `robots.txt` Prevents This:* Every allowed search/retrieval bot group explicitly includes all private path exclusions inside its own group block:
  ```text
  User-agent: Googlebot
  User-agent: Bingbot
  User-agent: OAI-SearchBot
  User-agent: ChatGPT-User
  User-agent: PerplexityBot
  User-agent: Perplexity-User
  User-agent: Claude-SearchBot
  User-agent: Claude-User
  User-agent: Applebot
  Allow: /
  Disallow: /portal/
  Disallow: /seo/
  Disallow: /admin.html
  Disallow: /login.html
  Disallow: /audit_tool.html
  ```

---

## 3. Private Resource & Internal Documentation Exclusion Audit

1. **`robots.txt` Is Not a Security Mechanism — Defense-in-Depth Applied:**
   - `/portal/index.html` and `/portal/login.html` carry `<meta name="robots" content="noindex, nofollow" />` in `<head>`, are excluded from `sitemap.xml` and `llms.txt`, are disallowed in `robots.txt`, and are blocked from firing GA4 telemetry (`if (rawPath.includes('/portal')) return;`).
2. **Exclusion of Internal `seo/` Strategy Deliverables from GitHub Pages Publishing:**
   - Created `_config.yml` at the repository root with:
     ```yaml
     exclude:
       - seo/
       - seo
       - README.md
     ```
   - This instructs GitHub Pages' Jekyll build pipeline not to copy the internal `seo/` directory or `README.md` into the deployed public `_site` artifact, while `Disallow: /seo/` in `robots.txt` provides a secondary safeguard.

---

## 4. HTML Response, Snippet Directives & No-JS Crawlability Audit

| Technical Requirement | Audit Verification | Result |
|---|---|---|
| **Static HTML Availability** | All 36 public URLs exist as static `index.html` files in clean directory paths (`/about/index.html`, `/commercial-kitchen-design/index.html`, `/blog/<slug>/index.html`). | **PASS (36/36)** |
| **Zero Restrictive Snippet Tags** | Checked all 36 public pages for `nosnippet`, `max-snippet:0`, `noarchive`, `nocache`, or `data-nosnippet`. Every public page uses `<meta name="robots" content="index, follow" />` with unrestricted snippet extraction. | **PASS (36/36)** |
| **Canonical URL Alignment** | Every public page has a self-referencing `<link rel="canonical" href="https://sipandplaylk.co/..." />` matching `sitemap.xml` and `llms.txt`. | **PASS (36/36)** |
| **No-JavaScript Content Crawlability** | While `/equipment/` uses `catalogue.js` for interactive 170+ SKU filtering, it includes a `<noscript>` static HTML category directory linking to the 6 static commercial landing pages (`/commercial-kitchen-design/`, `/commercial-coffee-machines/`, `/commercial-refrigeration/`, `/commercial-cooking-equipment/`, `/commercial-bakery-equipment/`, `/stainless-steel-kitchen-fabrication/`) and `/brands/`, where full specification tables render in pure HTML. | **PASS** |
