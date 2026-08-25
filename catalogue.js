/* ============================================================
   SIP & PLAY — COMMERCIAL CATALOGUE ENGINE
   Data source: catalog_products_normalized.js (622 OCR-derived records)
   via products-data.js shim → window.SIP_PRODUCTS

   Features:
   - Dynamic category tabs generated from real catalog data
   - Dynamic brand filter from real non-empty brand values
   - Dynamic power/utility filter from real data values
   - Filters with zero matching products are not displayed
   - 24-products-per-page pagination
   - Spec modal shows only non-empty fields (no invented fallback values)
   - "Add to Schedule" / "Request Quotation" flow preserved
   - WhatsApp / contact behavior preserved
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.SIP_PRODUCTS || !Array.isArray(window.SIP_PRODUCTS)) {
    console.error('[SIP] SIP_PRODUCTS dataset not loaded. Check script tag order in equipment.html.');
    return;
  }

  /* ----------------------------------------------------------
     IMAGE HELPER
     All records from the normalized catalog use the category
     placeholder.  We never assign Unsplash or stock photos.
  ---------------------------------------------------------- */
  function getProductImage(product) {
    if (product && product.image && product.image.trim() !== '') {
      return product.image;
    }
    return 'images/category-placeholder.jpg';
  }

  /* ----------------------------------------------------------
     LOAD BASE PRODUCTS + LOCAL ADMIN OVERRIDES
  ---------------------------------------------------------- */
  const baseProducts   = window.SIP_PRODUCTS;
  const customProducts = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
  const deletedIds     = JSON.parse(localStorage.getItem('sip_deleted_ids')     || '[]');

  let allProducts = baseProducts.filter(p => !deletedIds.includes(p.id));
  customProducts.forEach(c => {
    const idx = allProducts.findIndex(p => p.id === c.id);
    if (idx > -1) { allProducts[idx] = c; } else { allProducts.unshift(c); }
  });

  // Resolve image for every product (normalise placeholder)
  allProducts.forEach(p => { p.image = getProductImage(p); });

  /* ----------------------------------------------------------
     OPTIONAL SUPABASE CLOUD SYNC (unchanged from original)
  ---------------------------------------------------------- */
  if (window.SipSupabase && window.SipSupabase.isConfigured()) {
    const client = window.SipSupabase.getClient();
    if (client) {
      try {
        const { data, error } = await client.from('products').select('*').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          allProducts = data.map(d => ({
            id:          d.id,
            sku:         d.sku,
            name:        d.name,
            brand:       d.brand,
            category:    d.category,
            subCategory: d.sub_category || d.category,
            power:       d.power,
            powerKw:     d.power_kw,
            dimensions:  d.dimensions,
            origin:      d.origin,
            material:    d.material || '',
            description: d.description,
            image:       d.image || getProductImage(d),
            featured:    Boolean(d.featured)
          }));
        }
      } catch (err) {
        console.warn('[SIP] Supabase sync notice, using local cache:', err);
      }
    }
  }

  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  let filteredProducts = [...allProducts];
  let currentPage     = 1;
  const itemsPerPage  = 24;

  let currentCategory = 'all';
  let currentBrand    = 'all';
  let currentPower    = 'all';
  let currentSort     = 'featured';
  let searchQuery     = '';

  /* ----------------------------------------------------------
     DOM REFERENCES
  ---------------------------------------------------------- */
  const searchInput      = document.getElementById('catSearch');
  const catGrid          = document.getElementById('catGrid');
  const catPagination    = document.getElementById('catPagination');
  const catResultCount   = document.getElementById('catResultCount');
  const catFiltersWrap   = document.getElementById('catFilters');
  const brandSelect      = document.getElementById('brandSelect');
  const powerSelect      = document.getElementById('powerSelect');
  const sortSelect       = document.getElementById('sortSelect');
  const specModal        = document.getElementById('specModal');
  const specModalBody    = document.getElementById('specModalBody');
  const specModalClose   = document.getElementById('specModalClose');

  // Schedule / enquiry drawer
  let projectSchedule      = JSON.parse(localStorage.getItem('sip_project_schedule') || '[]');
  const enquiryBar         = document.getElementById('enquiryBar');
  const enquiryCountTop    = document.getElementById('enquiryCountTop');
  const enquiryDrawer      = document.getElementById('enquiryDrawer');
  const enquiryItemsList   = document.getElementById('enquiryItemsList');
  const enquiryDrawerClose = document.getElementById('enquiryDrawerClose');
  const enquiryForm        = document.getElementById('enquiryForm');

  /* ----------------------------------------------------------
     DYNAMIC BRAND SELECT
     Only include non-empty brand values. Sort alphabetically.
  ---------------------------------------------------------- */
  if (brandSelect) {
    // Remove any options added by static HTML (except the first "All" option)
    while (brandSelect.options.length > 1) { brandSelect.remove(1); }

    const brands = Array.from(
      new Set(allProducts.map(p => (p.brand || '').trim()).filter(b => b !== ''))
    ).sort((a, b) => a.localeCompare(b));

    brands.forEach(b => {
      const count = allProducts.filter(p => p.brand === b).length;
      if (count === 0) return; // no zero-count entries
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = `${b} (${count})`;
      brandSelect.appendChild(opt);
    });
  }

  /* ----------------------------------------------------------
     DYNAMIC POWER / UTILITY SELECT
     Derive meaningful utility labels from real data values.
     We look for substrings in the resolved "power" field to
     group into labelled buckets. Only show buckets that match
     at least one product.
  ---------------------------------------------------------- */
  const UTILITY_BUCKETS = [
    { value: 'GAS',  label: 'Gas (Natural / LPG)',       test: v => /gas|GAS|lpg|LPG/i.test(v) },
    { value: '220V', label: '220V / 230V (Single Phase)', test: v => /22[0-9]V|23[0-9]V/i.test(v) },
    { value: '380V', label: '380V / 400V (3-Phase)',       test: v => /38[0-9]V|39[0-9]V|40[0-9]V/i.test(v) },
    { value: '110V', label: '110V / 120V',                 test: v => /11[0-9]V|12[0-9]V/i.test(v) }
  ];

  if (powerSelect) {
    // Remove hard-coded static options (keep only "All" at index 0)
    while (powerSelect.options.length > 1) { powerSelect.remove(1); }

    UTILITY_BUCKETS.forEach(bucket => {
      const count = allProducts.filter(p => bucket.test(p.power)).length;
      if (count === 0) return; // omit zero-count buckets
      const opt = document.createElement('option');
      opt.value = bucket.value;
      opt.textContent = `${bucket.label} (${count})`;
      powerSelect.appendChild(opt);
    });

    // Edge case: products with a non-empty power that doesn't match any bucket
    const otherCount = allProducts.filter(p => {
      if (!p.power) return false;
      return !UTILITY_BUCKETS.some(b => b.test(p.power));
    }).length;
    if (otherCount > 0) {
      const opt = document.createElement('option');
      opt.value = 'OTHER';
      opt.textContent = `Other specified utility (${otherCount})`;
      powerSelect.appendChild(opt);
    }
  }

  /* ----------------------------------------------------------
     DYNAMIC CATEGORY TABS
     Build from real category values. Never show a tab with 0
     matching products. "All Equipment" always comes first.
  ---------------------------------------------------------- */
  function renderCategoryButtons() {
    if (!catFiltersWrap) return;
    catFiltersWrap.innerHTML = '';

    // Derive unique categories from actual data
    const categoryCounts = {};
    allProducts.forEach(p => {
      const cat = (p.category || '').trim();
      if (!cat) return;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const sortedCategories = Object.keys(categoryCounts).sort((a, b) => a.localeCompare(b));

    // Helper to create a pill button
    function makePill(id, label, count) {
      const btn = document.createElement('button');
      btn.className = `cat-pill ${id === currentCategory ? 'active' : ''}`;
      btn.dataset.category = id;
      btn.innerHTML = `${label} <span class="cat-pill__count">(${count})</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = id;
        currentPage = 1;
        applyFilters();
      });
      return btn;
    }

    // "All Equipment" pill first
    catFiltersWrap.appendChild(makePill('all', 'All Equipment', allProducts.length));

    // One pill per real category (skip zero-count, already excluded by construction)
    sortedCategories.forEach(cat => {
      catFiltersWrap.appendChild(makePill(cat, cat, categoryCounts[cat]));
    });
  }

  /* ----------------------------------------------------------
     FILTER & SORT ENGINE
  ---------------------------------------------------------- */
  function applyFilters() {
    const q = searchQuery.toLowerCase().trim();

    filteredProducts = allProducts.filter(p => {
      // Category
      if (currentCategory !== 'all' && p.category !== currentCategory) return false;

      // Brand
      if (currentBrand !== 'all' && p.brand !== currentBrand) return false;

      // Power / Utility bucket
      if (currentPower !== 'all') {
        if (currentPower === 'OTHER') {
          // Match products with a power value that doesn't fit known buckets
          if (!p.power) return false;
          if (UTILITY_BUCKETS.some(b => b.test(p.power))) return false;
        } else {
          const bucket = UTILITY_BUCKETS.find(b => b.value === currentPower);
          if (!bucket || !bucket.test(p.power)) return false;
        }
      }

      // Text search
      if (q) {
        const haystack = [
          p.name, p.sku, p.brand, p.category, p.subCategory,
          p.origin, p.power, p.description, p.otherSpecifications
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    if (currentSort === 'featured') {
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (currentSort === 'name-asc') {
      filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (currentSort === 'brand-asc') {
      filteredProducts.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
    }

    renderGrid();
    renderPagination();
    updateResultCount();
  }

  /* ----------------------------------------------------------
     PRODUCT GRID
     Spec rows are only rendered when the value is non-empty.
  ---------------------------------------------------------- */
  function specRow(label, value) {
    if (!value || value.trim() === '') return '';
    return `
      <div class="cat-card__spec-item" style="display:flex; justify-content:space-between; font-size:0.85rem; font-family:var(--font-sans); border-bottom:1px dashed var(--border-dark); padding-bottom:0.2rem;">
        <span class="cat-card__spec-label" style="color:var(--stone-light); font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.1em;">${label}</span>
        <span class="cat-card__spec-val" style="font-weight:500;">${value}</span>
      </div>`;
  }

  function renderGrid() {
    if (!catGrid) return;
    catGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      catGrid.innerHTML = `
        <div class="cat-empty">
          <span class="cat-empty__icon">∅</span>
          <h3 class="cat-empty__title">NO COMMERCIAL EQUIPMENT FOUND</h3>
          <p class="cat-empty__desc">Try adjusting your search keywords or resetting category filters.</p>
          <button class="btn btn--outline" id="resetFiltersBtn" style="margin-top:1.5rem;">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentBrand    = 'all';
          currentPower    = 'all';
          searchQuery     = '';
          if (searchInput)  searchInput.value  = '';
          if (brandSelect)  brandSelect.value  = 'all';
          if (powerSelect)  powerSelect.value  = 'all';
          renderCategoryButtons();
          applyFilters();
        });
      }
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex   = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const pageItems  = filteredProducts.slice(startIndex, endIndex);

    pageItems.forEach(p => {
      const isScheduled = projectSchedule.some(item => item.id === p.id);
      const card = document.createElement('article');
      card.className = 'cat-card';
      const imgSrc = getProductImage(p);

      // Derive a display label for brand / subcategory meta line
      const brandDisplay = (p.brand || '').trim();
      const subCatDisplay = (p.subCategory || p.category || '').trim();

      // Name fallback: if name is empty, show SKU as a description stub
      const displayName = (p.name || '').trim() || `SKU ${p.sku}`;

      card.innerHTML = `
        <div class="cat-card__img-wrap" style="position:relative; width:100%; aspect-ratio:4/3; overflow:hidden; background:var(--ink-charcoal);">
          <img class="cat-card__img" src="${imgSrc}" alt="${displayName}" loading="lazy" onerror="this.onerror=null; this.src='images/category-placeholder.jpg';" style="width:100%; height:100%; object-fit:cover; transition:transform var(--slow) var(--ease-editorial);" />
          <span class="cat-card__sku" style="position:absolute; top:1rem; left:1rem; background:var(--ink-pure); color:var(--paper-ivory); font-family:var(--font-mono); font-size:0.7rem; padding:0.2rem 0.5rem; letter-spacing:0.1em;">${p.sku}</span>
          ${p.confidence === 'low' ? '<span style="position:absolute; bottom:0.5rem; right:0.5rem; background:rgba(0,0,0,0.6); color:#f0a500; font-family:var(--font-mono); font-size:0.6rem; padding:0.15rem 0.4rem; letter-spacing:0.08em;">REVIEW</span>' : ''}
          ${p.featured ? '<span class="cat-card__featured" style="position:absolute; top:1rem; right:1rem; background:var(--stone-light); color:var(--ink-pure); font-family:var(--font-mono); font-size:0.7rem; padding:0.2rem 0.5rem; letter-spacing:0.1em; font-weight:700;">FEATURED</span>' : ''}
        </div>
        <div class="cat-card__body" style="padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; flex-grow:1; background:var(--ink-deep); color:var(--paper-ivory);">
          <div>
            <div class="cat-card__meta" style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.1em; color:var(--stone-light); text-transform:uppercase; margin-bottom:1rem; border-bottom:1px solid var(--border-dark); padding-bottom:0.5rem;">
              <span class="cat-card__brand" style="color:var(--paper-ivory); font-weight:600;">${brandDisplay}</span>
              <span class="cat-card__cat">${subCatDisplay}</span>
            </div>
            <h3 class="cat-card__title" style="font-family:var(--font-display); font-size:1.1rem; font-weight:600; letter-spacing:-0.02em; color:var(--paper-ivory); margin-bottom:1.5rem; line-height:1.3;">${displayName}</h3>

            <div class="cat-card__specs" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
              ${specRow('POWER', p.power)}
              ${specRow('DIMENSIONS', p.dimensions)}
              ${specRow('CAPACITY', p.capacity)}
              ${specRow('ORIGIN', p.origin)}
            </div>
          </div>

          <div class="cat-card__actions" style="display:grid; grid-template-columns:1fr; gap:0.5rem; margin-top:auto;">
            <button class="cat-card__btn-spec" data-id="${p.id}" style="width:100%; background:transparent; border:1px solid var(--border-dark); color:var(--paper-ivory); padding:0.75rem; font-family:var(--font-sans); font-size:0.8rem; font-weight:600; cursor:pointer; transition:all var(--fast);">View Specifications ↗</button>
            <button class="cat-card__btn-add ${isScheduled ? 'added' : ''}" data-id="${p.id}" style="width:100%; background:${isScheduled ? 'var(--paper-ivory)' : 'transparent'}; border:1px solid var(--paper-ivory); color:${isScheduled ? 'var(--ink-pure)' : 'var(--paper-ivory)'}; padding:0.75rem; font-family:var(--font-sans); font-size:0.8rem; font-weight:600; cursor:pointer; transition:all var(--fast);">
              ${isScheduled ? '✓ Scheduled' : '+ Add to Schedule'}
            </button>
          </div>
        </div>
      `;

      card.querySelector('.cat-card__btn-spec').addEventListener('click', () => { openSpecModal(p); });
      card.querySelector('.cat-card__btn-add').addEventListener('click', e => { toggleScheduleItem(p, e.currentTarget); });

      catGrid.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     PAGINATION (unchanged logic, updated comment)
  ---------------------------------------------------------- */
  function renderPagination() {
    if (!catPagination) return;
    catPagination.innerHTML = '';

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = `cat-page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '← Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; renderGrid(); renderPagination(); updateResultCount(); scrollToCatalogue(); }
    });
    catPagination.appendChild(prevBtn);

    let pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    pages.forEach(pg => {
      if (pg === '...') {
        const dot = document.createElement('span');
        dot.className = 'cat-page-ellipsis';
        dot.textContent = '...';
        catPagination.appendChild(dot);
      } else {
        const numBtn = document.createElement('button');
        numBtn.className = `cat-page-btn ${pg === currentPage ? 'active' : ''}`;
        numBtn.textContent = pg;
        numBtn.addEventListener('click', () => {
          currentPage = pg;
          renderGrid(); renderPagination(); updateResultCount(); scrollToCatalogue();
        });
        catPagination.appendChild(numBtn);
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = `cat-page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) { currentPage++; renderGrid(); renderPagination(); updateResultCount(); scrollToCatalogue(); }
    });
    catPagination.appendChild(nextBtn);
  }

  function updateResultCount() {
    if (!catResultCount) return;
    const total = filteredProducts.length;
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, total);
    catResultCount.textContent = `Showing ${start}–${end} of ${total} commercial units`;
  }

  function scrollToCatalogue() {
    const el = document.getElementById('catalogueView');
    if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }); }
  }

  /* ----------------------------------------------------------
     SPECIFICATION MODAL
     Only rows with a real, non-empty value are rendered.
     No invented fallback values for certifications, warranty,
     utility inlets, operational ratings, or construction.
  ---------------------------------------------------------- */
  function modalRow(label, value, mono) {
    if (!value || String(value).trim() === '') return '';
    const cls = mono ? ' font-mono' : '';
    return `
      <div class="modal-spec-row">
        <span class="modal-spec-th">${label}</span>
        <span class="modal-spec-td${cls}">${value}</span>
      </div>`;
  }

  function openSpecModal(product) {
    if (!specModal || !specModalBody) return;

    const p           = product || {};
    const sku         = (p.sku         || '').trim();
    const brand       = (p.brand       || '').trim();
    const category    = (p.category    || '').trim();
    const name        = (p.name        || '').trim() || `SKU ${sku}`;
    const description = (p.description || '').trim();
    const image       = getProductImage(p);
    const isScheduled = projectSchedule.some(i => i.id === p.id);

    // Only non-empty spec rows are included
    const specRows = [
      modalRow('MODEL / SKU',       sku,         true),
      modalRow('MANUFACTURER',      brand +      (p.origin ? ` — ${p.origin}` : ''), false),
      modalRow('PRODUCT NAME',      name,        false),
      modalRow('CATEGORY',          category,    false),
      modalRow('SUB-CATEGORY',      p.subCategory, false),
      modalRow('POWER / ELECTRICAL',p.power,     true),
      modalRow('VOLTAGE',           p.voltage,   true),
      modalRow('POWER (kW)',        p.powerKw,   true),
      modalRow('DIMENSIONS',        p.dimensions, true),
      modalRow('CAPACITY',          p.capacity,  false),
      modalRow('CONSTRUCTION',      p.material,  false),
      modalRow('ORIGIN',            p.origin,    false),
      modalRow('SOURCE PAGE',       p.sourcePage != null ? `Page ${p.sourcePage}` : '', true),
      modalRow('CONFIDENCE',        p.confidence, false),
      modalRow('IMAGE STATUS',      p.imageStatus || '', false),
      modalRow('IMAGE SOURCE',      p.imageSource || '', false),
      modalRow('IMAGE VERIFIED',    p.imageVerified !== undefined ? (p.imageVerified ? 'Yes (Verified PDF Crop)' : 'No (Category Placeholder)') : '', false)
    ].join('');

    // otherSpecifications is shown separately if non-empty
    const otherSpecs = (p.otherSpecifications || '').trim();

    specModalBody.innerHTML = `
      <div class="modal-spec-layout">
        <div class="modal-spec-header">
          <div class="modal-spec-tags">
            ${brand ? `<span class="modal-spec-tag">${brand}</span>` : ''}
            ${category ? `<span class="modal-spec-tag accent">${category}</span>` : ''}
          </div>
          <h2 class="modal-spec-title">${name}</h2>
          ${description ? `<p class="modal-spec-desc">${description}</p>` : ''}
        </div>

        <div class="modal-spec-grid">
          <div class="modal-spec-media">
            <img src="${image}" alt="${name}" class="modal-spec-img" onerror="this.onerror=null; this.src='images/category-placeholder.jpg';" />
            ${sku ? `<div class="modal-spec-badge">SKU: ${sku}</div>` : ''}
          </div>

          <div class="modal-spec-details">
            <h4 class="modal-spec-subtitle">SPECIFICATION SHEET</h4>
            <div class="modal-spec-table">
              ${specRows || '<div class="modal-spec-row"><span class="modal-spec-th">STATUS</span><span class="modal-spec-td">Awaiting source-page verification (see Catalog count report)</span></div>'}
            </div>
            ${otherSpecs ? `
            <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-dark);">
              <h5 style="font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--stone-light); margin-bottom:0.75rem;">OCR CONTEXT / ADDITIONAL NOTES</h5>
              <p style="font-family:var(--font-mono); font-size:0.75rem; color:var(--stone-light); line-height:1.5; word-break:break-word;">${otherSpecs}</p>
            </div>` : ''}
          </div>
        </div>

        <div class="modal-spec-ctas">
          <a class="btn btn--primary" href="contact.html?item=${encodeURIComponent(sku || name)}#quote">
            Request Quotation for this Unit <span class="arrow">→</span>
          </a>
          <button class="btn btn--outline" id="modalAddScheduleBtn">
            ${isScheduled ? '✓ In Project Schedule' : '+ Add to Schedule'}
          </button>
        </div>
      </div>
    `;

    const modalAddBtn = document.getElementById('modalAddScheduleBtn');
    if (modalAddBtn && product) {
      modalAddBtn.addEventListener('click', () => {
        toggleScheduleItem(product);
        const nowScheduled = projectSchedule.some(i => i.id === product.id);
        modalAddBtn.textContent = nowScheduled ? '✓ In Project Schedule' : '+ Add to Schedule';
        renderGrid();
      });
    }

    specModal.classList.add('active');
    specModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSpecModal() {
    if (!specModal) return;
    specModal.classList.remove('active');
    specModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (specModalClose) { specModalClose.addEventListener('click', closeSpecModal); }
  if (specModal) { specModal.addEventListener('click', e => { if (e.target === specModal) closeSpecModal(); }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSpecModal(); });

  /* ----------------------------------------------------------
     PROJECT SCHEDULE (QUOTE BASKET)
     Duplicate-prevention: a product can only appear once.
  ---------------------------------------------------------- */
  function toggleScheduleItem(product, btnElement) {
    const index = projectSchedule.findIndex(i => i.id === product.id);
    if (index > -1) {
      projectSchedule.splice(index, 1);
      if (btnElement) { btnElement.classList.remove('added'); btnElement.textContent = '+ Add to Schedule'; }
    } else {
      projectSchedule.push(product);
      if (btnElement) { btnElement.classList.add('added');    btnElement.textContent = '✓ Scheduled'; }
    }
    localStorage.setItem('sip_project_schedule', JSON.stringify(projectSchedule));
    updateScheduleUI();
  }

  function updateScheduleUI() {
    if (!enquiryBar || !enquiryCountTop) return;
    const count = projectSchedule.length;
    enquiryCountTop.textContent = count;
    if (count > 0) {
      enquiryBar.classList.add('visible');
    } else {
      enquiryBar.classList.remove('visible');
      if (enquiryDrawer) enquiryDrawer.classList.remove('open');
    }
    renderScheduleDrawerItems();
  }

  function renderScheduleDrawerItems() {
    if (!enquiryItemsList) return;
    enquiryItemsList.innerHTML = '';
    if (projectSchedule.length === 0) {
      enquiryItemsList.innerHTML = '<p class="schedule-empty">No equipment items in project schedule.</p>';
      return;
    }
    projectSchedule.forEach(item => {
      const li = document.createElement('div');
      li.className = 'schedule-item';
      li.innerHTML = `
        <div class="schedule-item__info">
          <span class="schedule-item__sku">${item.sku || ''}</span>
          <h4 class="schedule-item__name">${(item.name || '').trim() || `SKU ${item.sku}`}</h4>
          <span class="schedule-item__meta">${[item.brand, item.power].filter(Boolean).join(' • ')}</span>
        </div>
        <button class="schedule-item__remove" data-id="${item.id}" title="Remove Item">✕</button>
      `;
      li.querySelector('.schedule-item__remove').addEventListener('click', () => {
        toggleScheduleItem(item);
        renderGrid();
      });
      enquiryItemsList.appendChild(li);
    });
  }

  if (enquiryBar)         { enquiryBar.addEventListener('click', () => { if (enquiryDrawer) enquiryDrawer.classList.toggle('open'); }); }
  if (enquiryDrawerClose) { enquiryDrawerClose.addEventListener('click', () => { if (enquiryDrawer) enquiryDrawer.classList.remove('open'); }); }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('[type="submit"]');
      if (!submitBtn) return;
      submitBtn.innerHTML = 'PROCESSING RFQ <span class="arrow">→</span>';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = '✓ SCHEDULE SUBMITTED — WE\'LL BE IN TOUCH';
        submitBtn.style.background = '#FFFFFF';
        submitBtn.style.color = '#000000';
        projectSchedule = [];
        localStorage.removeItem('sip_project_schedule');
        updateScheduleUI();
        renderGrid();
        setTimeout(() => {
          if (enquiryDrawer) enquiryDrawer.classList.remove('open');
          submitBtn.innerHTML = 'Complete Quotation Request <span class="arrow">→</span>';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     SEARCH INPUT (debounced)
  ---------------------------------------------------------- */
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchQuery = searchInput.value;
        currentPage = 1;
        applyFilters();
      }, 150);
    });

    // Update placeholder to show actual count
    searchInput.placeholder = `Search ${allProducts.length} products…`;
  }

  /* ----------------------------------------------------------
     SELECT FILTER LISTENERS
  ---------------------------------------------------------- */
  if (brandSelect) {
    brandSelect.addEventListener('change', () => {
      currentBrand = brandSelect.value;
      currentPage  = 1;
      applyFilters();
    });
  }

  if (powerSelect) {
    powerSelect.addEventListener('change', () => {
      currentPower = powerSelect.value;
      currentPage  = 1;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      applyFilters();
    });
  }

  /* ----------------------------------------------------------
     URL PARAM: ?category=xxx  auto-selects a tab on load
  ---------------------------------------------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat = (urlParams.get('category') || '').trim().toLowerCase();
  if (urlCat) {
    // Find the first real category whose label matches the URL param (case-insensitive)
    const match = allProducts
      .map(p => p.category)
      .find(cat => cat && cat.toLowerCase().includes(urlCat));
    if (match) { currentCategory = match; }
  }

  /* ----------------------------------------------------------
     INITIAL BOOT
  ---------------------------------------------------------- */
  renderCategoryButtons();
  applyFilters();
  updateScheduleUI();

  // Handle "View [Brand] Inventory →" buttons from the authorized brands section
  document.querySelectorAll('[data-brand-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const brand = btn.dataset.brandFilter;
      if (brandSelect) { brandSelect.value = brand; brandSelect.dispatchEvent(new Event('change')); }
      const catalogueView = document.getElementById('catalogueView');
      if (catalogueView) { catalogueView.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});
