/* ============================================================
   SIP & PLAY — FUTURE PRODUCTS ARCHIVE
   STATUS: INACTIVE / NON-RUNTIME ARCHIVE
   
   IMPORTANT:
   This file is an archival repository. It is NOT loaded, imported,
   or referenced by public-facing HTML pages (index.html, equipment.html,
   brands.html, etc.), preventing unnecessary runtime bundle overhead.

   RESTORATION INSTRUCTIONS:
   When genuine manufacturer photography or high-resolution photo-shoot
   assets become available for any listed model:
   1. Place the verified image asset in the appropriate /images or /brands folder.
   2. Update the `image` field with the verified path.
   3. Set `imageVerified: true` and `imageStatus: "manufacturer-verified"` (or "verified-exact").
   4. Move the product object into `brands_products_data.js` or `catalog_products_normalized.js`.
   ============================================================ */

/**
 * ARCHIVE PART 1: BRAND SPECIALTY EQUIPMENT
 * Pending authentic photography from official brand channels.
 */
const FUTURE_BRAND_PRODUCTS = [
  {
    id: "brand-innosong-8",
    sku: "ZS9001",
    name: "INNOSONG ZS9001 Commercial On-Demand Coffee Grinder (1kg Hopper)",
    brand: "INNOSONG",
    category: "Commercial Coffee Systems",
    subCategory: "Coffee Grinders",
    power: "350W (220V / 50Hz)",
    powerKw: "0.35",
    voltage: "220V",
    dimensions: "150 × 150 × 510 mm",
    capacity: "1000g Large Bean Hopper",
    origin: "China",
    material: "Die-Cast Aluminum & SUS420 Hardened Steel Flat Burrs",
    description: "High-throughput commercial on-demand espresso grinder with 64mm SUS420 hardened stainless steel flat burrs, 1000g large hopper, 18-step micrometric collar, and touch digital dose timer.",
    otherSpecifications: "Burr Size: 64mm SUS420 Flat Burrs | Speed: 3500 RPM | Hopper Capacity: 1.0 kg | Adjustment: 18-Step Precision | Net Weight: 9.0 kg",
    sourcePage: null,
    confidence: "high",
    sourceLanguage: "en",
    featured: false,
    image: "",
    imageStatus: "pending-genuine-image",
    imageSource: "catalog-spec",
    imageVerified: false,
    notes: "Requires official high-res studio photography of ZS9001 unit with 1kg hopper."
  },
  {
    id: "brand-innosong-9",
    sku: "ZS9002",
    name: "INNOSONG ZS9002 Commercial On-Demand Precision Coffee Grinder (Titanium Burrs)",
    brand: "INNOSONG",
    category: "Commercial Coffee Systems",
    subCategory: "Coffee Grinders",
    power: "350W (220V / 50Hz)",
    powerKw: "0.35",
    voltage: "220V",
    dimensions: "252 × 210 × 420 mm",
    capacity: "500g Bean Hopper",
    origin: "China",
    material: "Die-Cast Aluminum & Titanium Coated Flat Burrs",
    description: "Commercial on-demand espresso grinder equipped with 64mm Titanium flat burrs, 18-step precision grind adjustment dial, LED/LCD touch display for programmable single and double dose timing.",
    otherSpecifications: "Burr Diameter: 64mm Titanium Flat Burrs | Motor Speed: 3500 RPM | Grinding Speed: 1.8–2.5 g/s | Hopper: 500g UV-resistant | Display: LCD Touchscreen Dose Timer | Net Weight: 8.5 kg",
    sourcePage: null,
    confidence: "high",
    sourceLanguage: "en",
    featured: false,
    image: "",
    imageStatus: "pending-genuine-image",
    imageSource: "catalog-spec",
    imageVerified: false,
    notes: "Requires official photography of ZS9002 unit with Titanium burr assembly."
  },
  {
    id: "brand-innosong-10",
    sku: "ZS9003",
    name: "INNOSONG ZS9003 Compact Commercial Precision Coffee Grinder",
    brand: "INNOSONG",
    category: "Commercial Coffee Systems",
    subCategory: "Coffee Grinders",
    power: "350W (220V / 50Hz)",
    powerKw: "0.35",
    voltage: "220V",
    dimensions: "200 × 130 × 350 mm",
    capacity: "250g / 500g Bean Hopper",
    origin: "China",
    material: "Compact Aluminum Alloy & SUS402 Flat Burrs",
    description: "Space-efficient on-demand commercial grinder featuring 64mm SUS402 flat burrs, 9-gear stepped grind dial, and precise digital timed dispensing for specialty café decaf/single-origin stations.",
    otherSpecifications: "Burr Size: 64mm SUS402 Flat Burrs | Speed: 2800 RPM | Hopper: 250g/500g | Settings: 9 Gear Steps | Weight: 7.5 kg",
    sourcePage: null,
    confidence: "high",
    sourceLanguage: "en",
    featured: false,
    image: "",
    imageStatus: "pending-genuine-image",
    imageSource: "catalog-spec",
    imageVerified: false,
    notes: "Requires official photography of compact ZS9003 unit."
  }
];

/**
 * ARCHIVE PART 2: CATALOG OCR RECORDS AWAITING AUTHENTIC PRODUCT PHOTOGRAPHY
 * Total records: 266 items from the 124-page commercial catalog.
 * These items possess verified OCR technical specifications, but lack confirmed
 * individual cutouts or photographic crops in /images subfolders.
 * 
 * They are preserved in `catalog_products_normalized.js` with `imageVerified: false`
 * and `imageStatus: "placeholder-category"` / "needs-image-review".
 * 
 * Filtered out automatically by `products-data.js` and `catalogue.js` so they
 * never render as empty cards or placeholder boxes on the live website.
 */
const FUTURE_CATALOG_OVERVIEW = {
  totalAwaitingPhotography: 266,
  sourceCatalog: "2023年中群厨具产品图册(1)(1).pdf",
  categoriesAwaitingImages: [
    { category: "Warewashing", count: 28, status: "Awaiting factory product photos" },
    { category: "Refrigeration", count: 42, status: "Awaiting compressor/cabinet crops" },
    { category: "Food Machinery", count: 64, status: "Awaiting motor/cutter crops" },
    { category: "Stainless Steel Fabrication", count: 86, status: "Awaiting table/sink renders" },
    { category: "Western Cooking Series", count: 46, status: "Awaiting burner/griddle photos" }
  ]
};

// Export for Node/CommonJS environments if used in validation scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FUTURE_BRAND_PRODUCTS,
    FUTURE_CATALOG_OVERVIEW
  };
}
