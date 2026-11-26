# SIP & PLAY — CANONICAL BRAND ENTITY & KNOWLEDGE GRAPH MASTER RECORD

**Canonical Entity Identifier (`@id`):** `https://sipandplaylk.co/#organization`  
**Canonical Website Identifier (`@id`):** `https://sipandplaylk.co/#website`  
**Audit & Standardization Date:** 2026-11-26

---

## 1. Verified Master Entity Attributes (Single Source of Truth)

Every public page, JSON-LD graph, external directory listing, and OEM distributor citation must use these exact verified entity attributes without deviation:

| Entity Attribute | Verified Value | Schema.org Property | Verification Source |
|---|---|---|---|
| **Brand Name** | `Sip & Play` | `name` | `index.html`, `CNAME`, Global Header/Footer |
| **Legal / Contractual Operating Name** | `Sip & Play Commercial Culinary Engineering` (also referenced in catalogue RFQ as `Sip & Play Kitchen Systems (Pvt) Ltd`) | `legalName` | `terms/index.html` (Clause 01), `index.html` JSON-LD |
| **Primary Schema Type** | `ProfessionalService` (Subtype of `LocalBusiness` & `Organization`) | `@type` | `index.html`, `about/index.html`, `services/index.html`, `contact/index.html` |
| **Canonical Entity `@id`** | `https://sipandplaylk.co/#organization` | `@id` | Unified across all 36 public HTML pages |
| **Official Production URL** | `https://sipandplaylk.co/` | `url` | `CNAME` (`sipandplaylk.co`), `sitemap.xml` |
| **Headquarters Street Address** | `11A/1 Rathnawali Road, Dehiwela` | `address.streetAddress` | `contact/index.html`, `terms/index.html`, `privacy/index.html`, Global Footer |
| **Locality / City** | `Colombo` | `address.addressLocality` | `index.html` JSON-LD |
| **Country Code** | `LK` (Sri Lanka) | `address.addressCountry` | `index.html` JSON-LD |
| **Primary Telephone & WhatsApp** | `+94 702 700 500` (`+94702700500`) | `telephone` | `contact/index.html`, Global Footer |
| **General Inquiries Email** | `info@sipandplay.lk` | `email` | Global Footer, `index.html` JSON-LD |
| **Legal & Contractual Desk Email** | `legal@sipandplay.lk` | `contactPoint` | `terms/index.html` (Clause 12) |
| **Data Protection Officer (DPO) Email** | `privacy@sipandplay.lk` | `contactPoint` | `privacy/index.html` (Section 08 & 10) |
| **Business Operating Hours** | `Monday – Saturday, 10:00 AM – 7:00 PM (GMT+5:30)` | `openingHours` (`Mo-Sa 10:00-19:00`) | `contact/index.html`, `terms/index.html` |
| **Operating Territories (`areaServed`)** | `Sri Lanka` (Primary Hub), `Maldives` (Resort Network), `Thailand` (Regional Sourcing Desk) | `areaServed` | `index.html`, `about/index.html`, `brands/index.html`, `contact/index.html` |
| **Official Social Media Profiles (`sameAs`)** | `https://instagram.com/sipandplay`, `https://facebook.com/sipandplay`, `https://linkedin.com/company/sipandplay` | `sameAs` | `index.html` JSON-LD & Global Footer |
| **Digital Development Agency Partner** | `UCODE` (`https://universalcode.site/`) | Footer Attribution (`rel="noopener sponsored nofollow"`) | Global `.footer-bottom` across all 36 public pages |

---

## 2. Verified Leadership & Engineering Personnel (Human E-E-A-T Entities)

Never invent fictional authors or external reviewers. Only the following four verified team members from `about/index.html` are attributed across the website:

1. **Isham Nayeem — CEO & Co-Founder**
   - **Verified Experience:** Over 20 years of global culinary experience working as a professional chef across the **Middle East, Maldives, and Sri Lanka**.
   - **Core Domain Authority:** High-performance commercial kitchen design, functional layout planning, brigade workflow optimization ("engineered from the pass backward"), and culinary ergonomics.
2. **Vivian Hu — Supply Chain**
   - **Verified Experience:** Originally from China; specializes in sourcing commercial kitchen equipment, factory quality control (QA), procurement, and international freight logistics from China to Sri Lanka.
   - **Core Domain Authority:** Direct OEM factory procurement, pre-shipment QA inspection, and full-container-load (FCL) consolidation.
3. **Mohamed Mufthi — General Manager**
   - **Verified Experience:** Brings enterprise software sales experience into the commercial kitchen industry.
   - **Core Domain Authority:** Translating client culinary concepts and hospitality business objectives into practical, high-performance commercial kitchen solutions.
4. **Ilham Nayeem — Engineer**
   - **Verified Experience:** Over 10 years of technical engineering expertise from the automobile industry.
   - **Core Domain Authority:** Mechanical and electrical equipment performance, MEP utility coordination, reliability testing, troubleshooting, and on-site live-fire commissioning.

---

## 3. Verified Authorized Manufacturer (OEM) Relationships

Sip & Play is the official regional partner across **Sri Lanka, the Maldives, and Thailand** for four specialized commercial equipment brands (`/brands/` and `/commercial-coffee-machines/`):

| Authorized OEM Brand | Manufacturer Origin | Core Equipment Category | Flagship Verified Models / SKUs | Warranty & Support Standard |
|---|---|---|---|---|
| **EVEBOT** (亿瓦科技) | Shenzhen, China | Commercial Edible Beverage, Latte Art & Food Surface Inkjet Printers | `EB-FC1` (Full-Color CMYK, 600 DPI), `EB-Pro` (High-Speed Coffee Brown, 5–15s/cup), `EB-FT4` (All-Steel Chassis), `EB-FM1`, `PrintPen` (Bluetooth 4.2 Handheld) | 12-Month Commercial Warranty + FDA/SGS Certified FB2/FB3 Ink Cartridges Stocked |
| **INNOSONG** (智松科技) | China | Saturated Multi-Boiler & Dual-Boiler Commercial Espresso Machines & Grinders | `ZS3202` (2-Group Multi-Boiler, 4200W, 9.5L + 2×0.55L), `ZS3201` (2-Group, 10.5L + 2×0.55L), `ZS3105` (1-Group Saturated Pro, 2400W), `ZS3101` (1-Group Dual Boiler), `ZS3102` (Matte Black 1-Group) | 12-Month Commercial Warranty (Parts & On-Site Labor) + 100% OEM Spare Parts Stock |
| **T&Z Galaxy** (Dazheng Coffee Group / 大正咖啡集团) | China | Under-Counter Segmented Pulse Tea Brewers, Flagship Multi-Boiler Espresso & Flush Drainage Decks | `KT3-2A` (Flagship 2-Group T3 Multi-Boiler, 6200W, 12L Copper Steam + 2×1L Brew, 240 cups/hr), `Galaxy U8 VK-1` (Single-Head Under-Counter Tea Brewer, 3500W), `Galaxy U8 VK-2` (Dual-Head Under-Counter Tea System, 6200W), `U8-DECK` (AISI 304 Flush Drip Deck) | 12-Month Commercial Warranty (Parts & On-Site Labor) + CAD Counter Cut-Out Schematics |
| **LEHEHE** (乐呵呵 / Dazheng Technology) | China | Embedded Under-Counter Continuous Auto-Stop Steam & Hot Water Stations | `DZ23-2Y` (Dual-Head Embedded Steam & Water Station, 3000W, 8.0L Stainless Boiler), `DZ23-1Y` (Single-Head Embedded Steam Station, 2200W, 5.0L Boiler, Ø25mm Cut-Out) | 12-Month Commercial Warranty + In-Wand Digital Probe Calibration |

*(In addition, the homepage partner marquee notes direct supply chains with **Zhong Qun Kitchenware** and **Western Kitchen Series**, and the interactive `/equipment/` catalogue contains 170+ verified SKUs across commercial cooking, refrigeration, bakery, warewashing, and stainless steel fabrication.)*

---

## 4. Verified Engineering Project Portfolio & Status Discipline

To maintain absolute factual accuracy for AI answer engines and prospective B2B clients, the following three verified project case studies on `/projects/` must always preserve their exact verified status and distinguish **design/planned capacity** from completed history:

1. **The Chinese Mega Kitchen (Colombo, Sri Lanka)**
   - **Verified Status:** `UNDER BUILD` (Ongoing construction and engineering — never describe as completed).
   - **Facility Footprint:** `33,000 sq ft`
   - **Planned Design Capacity:** `6,000 meals / day`
   - **Engineering & Equipment Scope:** Turnkey 2D/3D CAD & MEP engineering, custom multi-station island cooking suites, automated walk-in refrigeration corridors, and heavy-duty SUS304 exhaust ventilation manifolds.
2. **The Mustard Gourmet (Central Colombo, Sri Lanka)**
   - **Verified Status:** `LAUNCHING`
   - **Facility Footprint:** `2,500 sq ft`
   - **Planned Design Capacity:** `2,000 pax capacity`
   - **Engineering & Equipment Scope:** Unidirectional HACCP 2D AutoCAD zoning, 3D spatial modeling, and direct factory equipment procurement for hot cooking lines, point-of-use under-counter refrigeration, and AISI 304 prep stations.
3. **Oh Donuts Facility (Dehiwela, Colombo, Sri Lanka)**
   - **Verified Status:** `EXPANDING`
   - **Facility Footprint:** `2,000 sq ft`
   - **Planned Design Capacity:** Up to `10,000 donuts / day`
   - **Engineering & Equipment Scope:** Cloud kitchen and central bakery production hub expansion featuring linear raw-to-dispatch assembly (spiral mixers, dough sheeters, humidity proofers, high-recovery fryers under Type-I exhaust, SUS304 glazing/finishing tables, and delivery rider handoff separation).

---

## 5. JSON-LD Entity Graph Standardization Completed Across All 36 Pages

During Phase 3, we audited and standardized the `application/ld+json` blocks across all 36 public pages:
- **Homepage (`index.html`):** Defines the master `ProfessionalService` node with `@id: "https://sipandplaylk.co/#organization"`, `legalName: "Sip & Play Commercial Culinary Engineering"`, `telephone: "+94702700500"`, `email: "info@sipandplay.lk"`, `address`, `areaServed`, `knowsAbout` (9 core culinary engineering disciplines), and `sameAs` links, plus the master `WebSite` node (`@id: "https://sipandplaylk.co/#website"`).
- **All 35 Subpages (`/about/`, `/services/`, `/projects/`, `/equipment/`, `/brands/`, `/contact/`, `/terms/`, `/privacy/`, 6 Commercial Landing Pages, `/blog/`, and 20 Blog Articles):** Every page's `about`, `provider`, `publisher`, or `mainEntity` property now explicitly includes `"@id": "https://sipandplaylk.co/#organization"`, binding all 36 pages into a single cohesive Knowledge Graph entity.
