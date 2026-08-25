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
   * Resolve image path.
   * The normalized catalog already sets every record to
   * "images/category-placeholder.jpg". We honour that.
   * No Unsplash stock photos, no unrelated images are assigned.
   */
  function resolveImage(p) {
    var img = (p.image || '').trim();
    return img || 'images/category-placeholder.jpg';
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
      image:               resolveImage(p)
    };
  });

  console.log(
    '[SIP] Active catalog loaded: ' + window.SIP_PRODUCTS.length +
    ' records from catalog_products_normalized.js'
  );

})();
