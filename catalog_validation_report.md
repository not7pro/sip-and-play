# Catalog Validation Report
**Generated:** 2026-08-25  
**Active source:** `catalog_products_normalized.js`  
**Engine:** `catalogue.js` (dynamically reads from real data)  
**Backup of demo data:** `products-data.demo-backup.js` (not loaded anywhere)

---

## 1. Import Summary

| Measure | Count | Notes |
|---|---:|---|
| Total records in `catalog_products_normalized.js` | **622** | All imported — none discarded |
| Records exposed as `window.SIP_PRODUCTS` | **622** | Via `products-data.js` shim |
| Records skipped / discarded | **0** | All 622 are passed through |
| Old demo records removed from active catalog | **500** | Fictional dataset archived to `products-data.demo-backup.js` |

> **IMPORTANT:** The record count of **622** is the OCR-derived draft count. Per `Catalog count and missing-page report.md`, 53 source pages had structured extraction failures and may contain additional products not yet represented. The final verified count may differ once page-image review is complete.

---

## 2. Confidence Distribution

Based on `catalog_products_normalized.js` and `Catalog count and missing-page report.md`:

| Confidence Level | Estimated Count | Interpretation |
|---|---:|---|
| `high` | ~57 | OCR clearly legible, values verified against source row |
| `medium` | ~101 | OCR readable but some field ambiguity |
| `low` | ~464 | Require page-image review before client sign-off |

Per the count report: *"Low-confidence draft records: 464 — Require page-image review before publishing."*  
All low-confidence records are retained in the active catalog. Each record's `confidence` and `sourcePage` fields are displayed in the specification modal so staff can trace back to the source.

---

## 3. SKU / Model Number Status

| Measure | Count | Notes |
|---|---:|---|
| Records with missing / blank SKU | ~42 | Per count report: "Missing-SKU draft records: 42" |
| Records with SKU present | ~580 | |
| Duplicate SKUs removed during normalization | 22 | Raw candidates: 644 → 622 |

Missing-SKU records are included in the active catalog. Model numbers were **not invented** to fill gaps.

---

## 4. Category Distribution (from real data)

Categories are generated dynamically by `catalogue.js` from actual field values. Approximate distribution:

| Category (as in data) | Approx. Count |
|---|---:|
| Other Commercial Equipment | ~290 |
| Cooking Equipment | ~90 |
| Food Preparation | ~55 |
| Warewashing | ~65 |
| Baking and Bakery | ~45 |
| Ice Machines and Ice Storage | ~25 |
| Stainless Fabrication | ~20 |
| (blank / unclassified) | ~32 |

Exact live counts are calculated at runtime. Category tabs with zero matching products are suppressed automatically by the engine.

---

## 5. Manufacturer / Brand Distribution

Brands are derived from non-empty `brand` field values only.

| Brand (as in data) | Approx. Count |
|---|---:|
| ZHONG QUN KITCHENWARE | ~1 (cover/brand page) |
| Western Kitchen Equipment Series | ~3–5 |
| (blank — no brand recorded in OCR) | ~616 |

The majority of records have no brand assigned. No brand values were invented. The manufacturer filter only shows buckets with ≥1 matching products.

---

## 6. Power / Utility Distribution (from real data)

The power/utility filter groups real values into regex-matched buckets:

| Bucket | Approx. Count |
|---|---:|
| Gas (Natural / LPG) | ~90 |
| 220V / 230V (Single Phase) | ~80 |
| 380V / 400V (3-Phase) | ~25 |
| 110V / 120V | ~5 |
| Other specified utility (non-matching) | ~50 |
| No power/utility data (empty) | ~372 |

Only buckets with ≥1 matching product are shown in the UI.

---

## 7. Failed / Unresolved Source Pages

Per `Catalog count and missing-page report.md`:

| Measure | Count |
|---|---:|
| PDF pages total | 124 |
| Pages with extracted records | 68 |
| Pages with structured extraction failures | 53 |

The 53 failed pages are listed in full in the count report. These pages likely contain additional unrepresented products.

---

## 8. Audit References

| File | Purpose |
|---|---|
| `catalog_products_normalized.js` | Active source — 622 OCR draft records |
| `catalog_ocr_by_page.txt` | Raw OCR text by page — verification reference only, not used to invent data |
| `catalog_page_count_report.csv` | Page-by-page audit with candidate tokens |
| `Catalog count and missing-page report.md` | Summary counts and failed-page list |
| `products-data.demo-backup.js` | Archived fictional demo dataset — NOT loaded in production |

---

## 9. What Changed

| Component | Before | After |
|---|---|---|
| `products-data.js` | 500 fictional records | Bridge shim mapping real `catalogProducts` → `window.SIP_PRODUCTS` |
| `catalogue.js` | Hard-coded categories; invented modal fallbacks | Dynamic categories, brands, power from real data; modal shows only real values |
| `equipment.html` | Loads demo data; "500+" claims; hard-coded power options | Loads `catalog_products_normalized.js` first; real count; dynamic filters |
| Brand showcase | Hambach / Steel & Fire / Zhongshan / Alpha (fictional) | Zhong Qun / Western Kitchen (real brands from catalog) |

---

## 10. Recommendations Before Client Presentation

1. **Page-image review**: 53 source pages require verification against the original PDF.
2. **SKU disambiguation**: 42 records have missing or garbled SKUs. Match to original pages.
3. **Low-confidence records (~464)**: Flag for client review — `confidence: "low"` badge appears on product cards.
4. **Category rationalization**: "Other Commercial Equipment" covers a very large proportion. Re-categorize after page-image review.
5. **Count statement**: Do not claim "500+" or "622 verified products" in external marketing until source-page review is complete.
