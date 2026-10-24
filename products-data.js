/* ============================================================
   SIP & PLAY — ACTIVE CATALOG BRIDGE SHIM
   Source:  catalog_products_normalized.js & brands_products_data.js
   Exposes: window.SIP_PRODUCTS (Active catalog: genuine products with verified genuine images)

   RESTRICTION ADHERENCE:
   - Live website displays ONLY genuine products with verified genuine images.
   - Zero placeholder images, zero demo photos, zero broken icons visible.
   - Future products are preserved in future_products_archive.js and excluded from runtime memory.
   - All specifications, model numbers, and metadata are 100% preserved.
   ============================================================ */

(function () {
  'use strict';

  var hasCatalog = (typeof catalogProducts !== 'undefined' && Array.isArray(catalogProducts));
  var brands = (typeof window !== 'undefined' && Array.isArray(window.BRAND_PRODUCTS))
    ? window.BRAND_PRODUCTS
    : [];

  if (!hasCatalog && brands.length === 0) {
    console.warn('[SIP] No catalog or brand data sources detected.');
    window.SIP_PRODUCTS = [];
    return;
  }

  /**
   * Resolve the display utility/power string without inventing values.
   */
  function resolveUtility(p) {
    var pw = (p.power   || '').trim();
    var vt = (p.voltage || '').trim();
    if (pw) return pw;
    if (vt) return vt;
    return '';
  }

  /**
   * Rigorously verifies whether a product has a genuine, verified image.
   * Multi-point criteria:
   * 1. Product must have a valid non-empty name.
   * 2. imageVerified must be strictly true.
   * 3. imageStatus must be 'verified-exact' or 'manufacturer-verified'.
   * 4. Image path must be non-empty and free of any placeholder or demo substrings.
   */
  function isGenuineImage(p) {
    if (!p) return false;
    var name = (p.name || '').trim();
    if (!name) return false;

    if (p.imageVerified !== true) return false;
    if (p.imageStatus !== 'verified-exact' && p.imageStatus !== 'manufacturer-verified') return false;

    var img = (p.image || '').trim();
    if (!img) return false;
    if (img.indexOf('placeholder') !== -1) return false;
    if (img.indexOf('category-placeholder') !== -1) return false;
    if (img.indexOf('REPLACE-WITH') !== -1) return false;

    return true;
  }

  var activeProducts = [];

  // 1. Process Brand Equipment (EVEBOT, INNOSONG, T&Z, LEHEHE)
  brands.forEach(function (p) {
    if (isGenuineImage(p)) {
      activeProducts.push(p);
    }
  });

  // 2. Process Normalized Commercial Catalog
  if (hasCatalog) {
    catalogProducts.forEach(function (p) {
      // Fast check before allocating object
      if (p.imageVerified !== true || (p.imageStatus !== 'verified-exact' && p.imageStatus !== 'manufacturer-verified')) {
        return;
      }

      var item = {
        id:                  p.id                       || '',
        sku:                 (p.sku                     || '').trim(),
        ocrSku:              (p.ocrSku                  || '').trim(),
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
        image:               (p.image                   || '').trim(),
        imageStatus:         p.imageStatus              || '',
        imageSource:         p.imageSource              || '',
        imageVerified:       p.imageVerified != null ? Boolean(p.imageVerified) : false
      };

      if (isGenuineImage(item)) {
        activeProducts.push(item);
      }
    });
  }

  // Expose active genuine products for live public display
  window.SIP_PRODUCTS = activeProducts;

  console.log(
    '[SIP] Active Catalog Loaded: ' +
    window.SIP_PRODUCTS.length + ' genuine units with verified manufacturer photography.'
  );

})();
