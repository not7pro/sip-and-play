/* ============================================================
   SIP & PLAY — ACTIVE CATALOG BRIDGE SHIM
   Source:  catalog_products_normalized.js  (622 OCR-derived records)
   Exposes: window.SIP_PRODUCTS  (consumed by catalogue.js)

   IMPORTANT: catalog_products_normalized.js MUST be loaded in the
   <script> tags BEFORE this file. See equipment.html.

   This file does not invent, fill, or guess any missing values.
   Empty fields in the source remain empty here. All sourcePage
   and confidence fields are passed through unchanged.

   The fictional demo dataset is archived in:
     products-data.demo-backup.js   (never loaded in production)
   ============================================================ */

(function () {
  'use strict';

  if (typeof catalogProducts === 'undefined' || !Array.isArray(catalogProducts)) {
    console.error(
      '[SIP] catalog_products_normalized.js must be loaded before products-data.js. ' +
      'catalogProducts is not defined — check <script> tag order in equipment.html.'
    );
    window.SIP_PRODUCTS = [];
    return;
  }

  /**
   * Resolve the display utility/power string.
   * The normalized catalog stores electrical specs in "voltage" and
   * general power info in "power".  We prefer "power" when non-empty,
   * fall back to "voltage", then return empty string.
   * We never invent a value.
   */
  function resolveUtility(p) {
    var pw = (p.power   || '').trim();
    var vt = (p.voltage || '').trim();
    if (pw) return pw;
    if (vt) return vt;
    return '';
  }

  /**
   * IMAGE STRATEGY — category-specific neutral placeholders only.
   *
   * Decision tree (per image workflow strategy):
   *   1. Verified manufacturer image URL for exact SKU → imageStatus: "manufacturer-verified"
   *      RESULT: 0 products qualify (no manufacturer URLs available in project).
   *   2. PDF crop with 100% certain SKU-to-page match → imageStatus: "pdf-crop-verified"
   *      RESULT: 0 products qualify (OCR quality too poor; 464 low-confidence, 53 failed pages).
   *   3. Category-specific neutral placeholder → imageStatus: "placeholder-category"
   *      RESULT: ALL 622 products receive this status.
   *
   * Placeholder files:
   *   images/placeholder-cooking.jpg      — Cooking Equipment
   *   images/bakery_prep.jpg              — Baking and Bakery  (pre-existing)
   *   images/warewashing.jpg              — Warewashing         (pre-existing)
   *   images/cold_storage.jpg             — Refrigeration and Cold Storage (pre-existing)
   *   images/placeholder-ice.jpg          — Ice Machines and Ice Storage
   *   images/stainless_fabrication.jpg    — Stainless Fabrication (pre-existing)
   *   images/placeholder-foodprep.jpg     — Food Preparation
   *   images/placeholder-commercial.jpg   — Other Commercial Equipment / unclassified
   *
   * None of these images are associated with any specific product SKU.
   * No Unsplash stock photos. No AI-generated product images.
   * No unrelated photographs.
   */
  var CATEGORY_PLACEHOLDERS = {
    'Cooking Equipment':              'images/placeholder-cooking.jpg',
    'Baking and Bakery':              'images/bakery_prep.jpg',
    'Warewashing':                    'images/warewashing.jpg',
    'Refrigeration and Cold Storage': 'images/cold_storage.jpg',
    'Ice Machines and Ice Storage':   'images/placeholder-ice.jpg',
    'Stainless Fabrication':          'images/stainless_fabrication.jpg',
    'Food Preparation':               'images/placeholder-foodprep.jpg',
    'Other Commercial Equipment':     'images/placeholder-commercial.jpg'
  };

  var FALLBACK_PLACEHOLDER = 'images/category-placeholder.jpg';

  function resolveImagePath(p) {
    var cat = (p.category || '').trim();
    return CATEGORY_PLACEHOLDERS[cat] || FALLBACK_PLACEHOLDER;
  }

  window.SIP_PRODUCTS = catalogProducts.map(function (p) {
    return {
      id:                  p.id                       || '',
      sku:                 (p.sku                     || '').trim(),
      name:                (p.name                    || '').trim(),
      brand:               (p.brand                   || '').trim(),
      category:            (p.category                || '').trim(),
      subCategory:         (p.subCategory             || '').trim(),
      power:               resolveUtility(p),
      powerKw:             (p.powerKw                 || '').trim(),
      voltage:             (p.voltage                 || '').trim(),
      dimensions:          (p.dimensions              || '').trim(),
      capacity:            (p.capacity                || '').trim(),
      origin:              (p.origin                  || '').trim(),
      material:            (p.material                || '').trim(),
      description:         (p.description             || '').trim(),
      otherSpecifications: (p.otherSpecifications     || '').trim(),
      sourcePage:          (p.sourcePage              != null ? p.sourcePage : null),
      confidence:          (p.confidence              || '').trim(),
      sourceLanguage:      (p.sourceLanguage          || '').trim(),
      featured:            Boolean(p.featured),
      // Image strategy fields
      image:               resolveImagePath(p),
      imageStatus:         'placeholder-category',
      imageSource:         'category-placeholder',
      imageVerified:       false
    };
  });

  console.log(
    '[SIP] Active catalog loaded: ' + window.SIP_PRODUCTS.length +
    ' records from catalog_products_normalized.js'
  );

  // Image status summary for audit / console verification
  var statusCounts = {};
  window.SIP_PRODUCTS.forEach(function (p) {
    statusCounts[p.imageStatus] = (statusCounts[p.imageStatus] || 0) + 1;
  });
  console.log('[SIP] Image status counts:', statusCounts);

  // Category placeholder usage summary
  var placeholderCounts = {};
  window.SIP_PRODUCTS.forEach(function (p) {
    placeholderCounts[p.image] = (placeholderCounts[p.image] || 0) + 1;
  });
  console.log('[SIP] Placeholder usage by file:', placeholderCounts);

})();
