# Website implementation prompt: replace demo equipment catalog with the real PDF catalog

You are modifying the existing Sip & Play equipment catalog at `equipment.html`. Remove every fictional, synthetic, placeholder, and demo product currently loaded from `products-data.js`. Replace the product dataset with the real products extracted from the supplied catalog PDF `2023年中群厨具产品图册(1)(1).pdf`. The PDF is the sole source of truth for product names, model numbers, dimensions, electrical specifications, capacities, materials, and other technical values.

Do not use any photographs or embedded images from the PDF as product images. Keep the existing visual treatment only if it is clearly a generic category visual. Otherwise use one consistent neutral placeholder image per category, or render the image area as a clean non-photographic placeholder. Never associate an unrelated stock photograph with a real product.

## Required data migration

Create a normalized product record for each distinct sellable model or model variant shown in the catalog. A different model number, dimension, power rating, capacity, or configuration must be a separate record. Do not merge variants merely because they share a product-family heading. Do not invent prices, origin, certifications, warranty terms, descriptions, brands, or technical values. When a catalog field is not present, store an empty value or `null` and hide that row in the UI.

Use this schema:

```json
{
  "id": "stable-slug-or-sequential-id",
  "sku": "catalog-model-number",
  "name": "concise English product name",
  "brand": "manufacturer or catalog brand, if printed",
  "category": "normalized website category",
  "subCategory": "specific equipment type",
  "power": "printed power or fuel requirement",
  "powerKw": "printed kW value, if available",
  "voltage": "printed voltage, if available",
  "dimensions": "printed W × D × H measurement",
  "capacity": "printed capacity or output, if available",
  "origin": "only if printed",
  "material": "only if printed",
  "description": "short factual description based only on catalog text",
  "otherSpecifications": "remaining printed specifications",
  "sourcePage": 0,
  "featured": false,
  "image": "generic category placeholder only"
}
```

Retain the original model number exactly where legible. Add `sourcePage` to every record for auditing. Preserve Chinese text in a hidden/source field when an English translation is uncertain. Mark low-confidence OCR records for review instead of silently guessing.

## Category and filter behavior

Replace the current hard-coded fictional category counts with counts calculated from the loaded dataset. Keep the existing category-tab layout but use real categories derived from the catalog. Normalize similar source sections into these website categories unless the real catalog clearly requires another category: **Cooking Equipment**, **Food Preparation**, **Baking and Bakery**, **Refrigeration and Cold Storage**, **Ice Machines and Ice Storage**, **Warewashing**, **Holding and Serving**, **Beverage and Coffee**, **Stainless Fabrication**, and **Accessories and Utensils**.

The category filter must be based on exact normalized category values. The manufacturer filter must be generated from unique non-empty `brand` values in the real dataset, sorted alphabetically. The power/utility filter must be generated from normalized values found in the real records, including electric single-phase, electric three-phase, gas, steam, water, manual/non-powered, and other values when present. Do not show fabricated filters that have zero matching products.

Keep search across product name, SKU/model number, brand, category, subcategory, power, voltage, dimensions, capacity, and description. Keep sorting by featured, name A–Z, and manufacturer A–Z, but make featured false by default unless the catalog or client explicitly identifies a product as featured. Keep pagination at 24 items per page and calculate “Showing X–Y of Z” from the filtered results. The page title and counts must never claim 500 products unless the real normalized dataset contains exactly 500 records.

## Product cards and detail modal

Preserve the current dark product-card style and responsive layout. Product cards must show the real SKU, real product name, manufacturer, subcategory, dimensions, and power/utility when available. The specification modal must show the real source-derived values for model SKU, manufacturer, power/electrical, voltage, dimensions, capacity/output, construction/material, utility requirements, certifications, warranty/service, and other specifications. Hide empty fields rather than displaying “N/A” everywhere.

Keep **View Specifications**, **Add to Schedule**, and **Request Quotation for this Unit**. The schedule must store stable product IDs, prevent duplicates, show the real SKU and name, and carry the selected products into the quotation request. Do not fabricate inventory status or pricing. Use “Request quotation” rather than “Buy” or “In stock” unless a separate verified source provides those facts.

## Data quality and acceptance checks

Before replacing the live data, validate that every record has a non-empty product name and SKU/model number where the catalog shows one, that all SKUs are unique or explicitly marked as variants, that no demo SKU remains, that no old synthetic brand/product name remains, that every product has a valid normalized category, and that filter counts equal the actual filtered record counts. Run a duplicate check by normalized SKU and a missing-field report. Review low-confidence OCR records against their source pages.

The final implementation must include the normalized product data file, the updated catalog code, a short migration/QA note, and a report containing total records, records by category, records by manufacturer, records by utility, duplicate SKUs, and low-confidence records. Do not delete the original demo data until the replacement passes validation; keep it in a clearly labeled backup file outside the active data import path.

## Existing website behavior to preserve

The current page uses `products-data.js` and `catalogue.js`; it exposes search, manufacturer, power/utility, sort, category tabs, 24-item pagination, specifications, and an equipment schedule/quotation drawer. Make the smallest safe changes needed to replace the active data source and make the filters data-driven. Do not redesign unrelated pages.

## Source and extraction note

The supplied PDF is scanned and has no selectable text. Use OCR and visual verification of the catalog pages to extract the records. The PDF images are for extraction and verification only and must not be used as website product imagery. Treat OCR output as provisional until model numbers and variants are checked against the page image.
