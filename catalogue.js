/* ============================================================
   SIP & PLAY — 500-PRODUCT COMMERCIAL CATALOGUE ENGINE
   Fast Search • Multi-Faceted Filters • Pagination • Schedule Builder
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SIP_PRODUCTS || !Array.isArray(window.SIP_PRODUCTS)) {
    console.error('SIP_PRODUCTS dataset not loaded.');
    return;
  }

  const allProducts = window.SIP_PRODUCTS;
  let filteredProducts = [...allProducts];
  let currentPage = 1;
  const itemsPerPage = 24;

  // Active filter state
  let currentCategory = 'all';
  let currentBrand = 'all';
  let currentPower = 'all';
  let currentSort = 'featured';
  let searchQuery = '';

  // DOM Elements
  const searchInput = document.getElementById('catSearch');
  const catGrid = document.getElementById('catGrid');
  const catPagination = document.getElementById('catPagination');
  const catResultCount = document.getElementById('catResultCount');
  const catFiltersWrap = document.getElementById('catFilters');
  const brandSelect = document.getElementById('brandSelect');
  const powerSelect = document.getElementById('powerSelect');
  const sortSelect = document.getElementById('sortSelect');

  // Spec Modal Elements
  const specModal = document.getElementById('specModal');
  const specModalBody = document.getElementById('specModalBody');
  const specModalClose = document.getElementById('specModalClose');

  // Project Schedule (Quote Basket)
  let projectSchedule = JSON.parse(localStorage.getItem('sip_project_schedule') || '[]');
  const scheduleBar = document.getElementById('scheduleBar');
  const scheduleCount = document.getElementById('scheduleCount');
  const scheduleDrawer = document.getElementById('scheduleDrawer');
  const scheduleItemsList = document.getElementById('scheduleItemsList');
  const scheduleDrawerClose = document.getElementById('scheduleDrawerClose');
  const scheduleForm = document.getElementById('scheduleForm');

  // Populate Brand Select options
  if (brandSelect) {
    const brands = Array.from(new Set(allProducts.map(p => p.brand))).sort();
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });
  }

  // Populate Category Filter Buttons with dynamic counts
  function renderCategoryButtons() {
    if (!catFiltersWrap) return;
    const categories = [
      { id: 'all', label: 'All Equipment' },
      { id: 'Coffee & Beverage', label: 'Coffee & Beverage' },
      { id: 'Cold Storage & Refrigeration', label: 'Cold Storage' },
      { id: 'Thermal Processing & Cooking', label: 'Thermal Cooking' },
      { id: 'Warewashing Systems', label: 'Warewashing' },
      { id: 'Food Preparation & Bakery', label: 'Food Prep & Bakery' },
      { id: 'Commercial Ice Systems', label: 'Ice Systems' },
      { id: 'Heated Holding & Servery', label: 'Heated Holding' },
      { id: 'Stainless Modular Fabrication', label: 'Fabrication' }
    ];

    catFiltersWrap.innerHTML = '';
    categories.forEach(c => {
      const count = c.id === 'all' 
        ? allProducts.length 
        : allProducts.filter(p => p.category === c.id).length;

      const btn = document.createElement('button');
      btn.className = `cat-pill ${c.id === currentCategory ? 'active' : ''}`;
      btn.dataset.category = c.id;
      btn.innerHTML = `${c.label} <span class="cat-pill__count">(${count})</span>`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = c.id;
        currentPage = 1;
        applyFilters();
      });

      catFiltersWrap.appendChild(btn);
    });
  }

  // Filter and Sort Engine
  function applyFilters() {
    const q = searchQuery.toLowerCase().trim();

    filteredProducts = allProducts.filter(p => {
      // Category
      if (currentCategory !== 'all' && p.category !== currentCategory) return false;

      // Brand
      if (currentBrand !== 'all' && p.brand !== currentBrand) return false;

      // Power
      if (currentPower !== 'all' && !p.power.includes(currentPower)) return false;

      // Search
      if (q) {
        const matchText = `${p.name} ${p.sku} ${p.brand} ${p.category} ${p.subCategory} ${p.origin} ${p.power} ${p.description}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    if (currentSort === 'featured') {
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (currentSort === 'name-asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'brand-asc') {
      filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    renderGrid();
    renderPagination();
    updateResultCount();
  }

  // Render Product Grid
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
          currentBrand = 'all';
          currentPower = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (brandSelect) brandSelect.value = 'all';
          if (powerSelect) powerSelect.value = 'all';
          renderCategoryButtons();
          applyFilters();
        });
      }
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const pageItems = filteredProducts.slice(startIndex, endIndex);

    pageItems.forEach((p, idx) => {
      const isScheduled = projectSchedule.some(item => item.id === p.id);
      const card = document.createElement('article');
      card.className = 'cat-card';
      card.innerHTML = `
        <div class="cat-card__img-wrap">
          <img class="cat-card__img" src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="cat-card__sku">${p.sku}</span>
          ${p.featured ? '<span class="cat-card__featured">FEATURED SPEC</span>' : ''}
        </div>
        <div class="cat-card__body">
          <div class="cat-card__meta">
            <span class="cat-card__brand">${p.brand}</span>
            <span class="cat-card__cat">${p.subCategory}</span>
          </div>
          <h3 class="cat-card__title">${p.name}</h3>
          <div class="cat-card__specs">
            <div class="cat-card__spec-item">
              <span class="cat-card__spec-label">POWER</span>
              <span class="cat-card__spec-val">${p.power}</span>
            </div>
            <div class="cat-card__spec-item">
              <span class="cat-card__spec-label">DIMENSIONS</span>
              <span class="cat-card__spec-val">${p.dimensions}</span>
            </div>
            <div class="cat-card__spec-item">
              <span class="cat-card__spec-label">ORIGIN</span>
              <span class="cat-card__spec-val">${p.origin}</span>
            </div>
          </div>
          <div class="cat-card__actions">
            <button class="cat-card__btn-spec" data-id="${p.id}">View Specifications ↗</button>
            <button class="cat-card__btn-add ${isScheduled ? 'added' : ''}" data-id="${p.id}">
              ${isScheduled ? '✓ Scheduled' : '+ Add to Schedule'}
            </button>
          </div>
        </div>
      `;

      // Spec modal trigger
      card.querySelector('.cat-card__btn-spec').addEventListener('click', () => {
        openSpecModal(p);
      });

      // Add to schedule trigger
      card.querySelector('.cat-card__btn-add').addEventListener('click', (e) => {
        toggleScheduleItem(p, e.currentTarget);
      });

      catGrid.appendChild(card);
    });
  }

  // Render Pagination
  function renderPagination() {
    if (!catPagination) return;
    catPagination.innerHTML = '';

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = `cat-page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '← Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderGrid();
        renderPagination();
        updateResultCount();
        scrollToCatalogue();
      }
    });
    catPagination.appendChild(prevBtn);

    // Page Number generation (with ellipsis for 500 items)
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
          renderGrid();
          renderPagination();
          updateResultCount();
          scrollToCatalogue();
        });
        catPagination.appendChild(numBtn);
      }
    });

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = `cat-page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderGrid();
        renderPagination();
        updateResultCount();
        scrollToCatalogue();
      }
    });
    catPagination.appendChild(nextBtn);
  }

  function updateResultCount() {
    if (!catResultCount) return;
    const total = filteredProducts.length;
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    catResultCount.textContent = `Showing ${start}–${end} of ${total} commercial units`;
  }

  function scrollToCatalogue() {
    const el = document.getElementById('catalogueView');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Spec Modal Logic
  function openSpecModal(product) {
    if (!specModal || !specModalBody) return;

    specModalBody.innerHTML = `
      <div class="modal-spec-layout">
        <div class="modal-spec-media">
          <img src="${product.image}" alt="${product.name}" class="modal-spec-img" />
          <div class="modal-spec-badge">${product.sku}</div>
        </div>
        <div class="modal-spec-content">
          <div class="modal-spec-header">
            <span class="modal-spec-brand">${product.brand} • ${product.category}</span>
            <h2 class="modal-spec-title">${product.name}</h2>
            <p class="modal-spec-desc">${product.description}</p>
          </div>

          <div class="modal-spec-table">
            <div class="modal-spec-row">
              <span class="modal-spec-th">MODEL SKU</span>
              <span class="modal-spec-td font-mono">${product.sku}</span>
            </div>
            <div class="modal-spec-row">
              <span class="modal-spec-th">MANUFACTURER</span>
              <span class="modal-spec-td">${product.brand} (${product.origin})</span>
            </div>
            <div class="modal-spec-row">
              <span class="modal-spec-th">POWER / UTILITY</span>
              <span class="modal-spec-td">${product.power} (${product.powerKw})</span>
            </div>
            <div class="modal-spec-row">
              <span class="modal-spec-th">DIMENSIONS</span>
              <span class="modal-spec-td font-mono">${product.dimensions}</span>
            </div>
            <div class="modal-spec-row">
              <span class="modal-spec-th">CONSTRUCTION</span>
              <span class="modal-spec-td">${product.material}</span>
            </div>
            <div class="modal-spec-row">
              <span class="modal-spec-th">CERTIFICATIONS</span>
              <span class="modal-spec-td">CE / NSF / ISO 9001 Commercial Grade</span>
            </div>
          </div>

          <div class="modal-spec-ctas">
            <a class="btn btn--primary" href="contact.html?item=${encodeURIComponent(product.sku)}#quote">
              Request Quotation for this Unit <span class="arrow">→</span>
            </a>
            <button class="btn btn--outline" id="modalAddScheduleBtn">
              ${projectSchedule.some(i => i.id === product.id) ? '✓ In Project Schedule' : '+ Add to Schedule'}
            </button>
          </div>
        </div>
      </div>
    `;

    const modalAddBtn = document.getElementById('modalAddScheduleBtn');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        toggleScheduleItem(product);
        modalAddBtn.textContent = projectSchedule.some(i => i.id === product.id) 
          ? '✓ In Project Schedule' 
          : '+ Add to Schedule';
        renderGrid();
      });
    }

    specModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSpecModal() {
    if (!specModal) return;
    specModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (specModalClose) {
    specModalClose.addEventListener('click', closeSpecModal);
  }

  if (specModal) {
    specModal.addEventListener('click', (e) => {
      if (e.target === specModal) closeSpecModal();
    });
  }

  // Project Schedule (Cart/Tray) Functions
  function toggleScheduleItem(product, btnElement) {
    const index = projectSchedule.findIndex(i => i.id === product.id);
    if (index > -1) {
      projectSchedule.splice(index, 1);
      if (btnElement) {
        btnElement.classList.remove('added');
        btnElement.textContent = '+ Add to Schedule';
      }
    } else {
      projectSchedule.push(product);
      if (btnElement) {
        btnElement.classList.add('added');
        btnElement.textContent = '✓ Scheduled';
      }
    }

    localStorage.setItem('sip_project_schedule', JSON.stringify(projectSchedule));
    updateScheduleUI();
  }

  function updateScheduleUI() {
    if (!scheduleBar || !scheduleCount) return;
    const count = projectSchedule.length;
    scheduleCount.textContent = count;

    if (count > 0) {
      scheduleBar.classList.add('visible');
    } else {
      scheduleBar.classList.remove('visible');
      if (scheduleDrawer) scheduleDrawer.classList.remove('open');
    }

    renderScheduleDrawerItems();
  }

  function renderScheduleDrawerItems() {
    if (!scheduleItemsList) return;
    scheduleItemsList.innerHTML = '';

    if (projectSchedule.length === 0) {
      scheduleItemsList.innerHTML = '<p class="schedule-empty">No equipment items in project schedule.</p>';
      return;
    }

    projectSchedule.forEach((item, idx) => {
      const li = document.createElement('div');
      li.className = 'schedule-item';
      li.innerHTML = `
        <div class="schedule-item__info">
          <span class="schedule-item__sku">${item.sku}</span>
          <h4 class="schedule-item__name">${item.name}</h4>
          <span class="schedule-item__meta">${item.brand} • ${item.power}</span>
        </div>
        <button class="schedule-item__remove" data-id="${item.id}" title="Remove Item">✕</button>
      `;

      li.querySelector('.schedule-item__remove').addEventListener('click', () => {
        toggleScheduleItem(item);
        renderGrid();
      });

      scheduleItemsList.appendChild(li);
    });
  }

  if (scheduleBar) {
    scheduleBar.addEventListener('click', () => {
      if (scheduleDrawer) scheduleDrawer.classList.toggle('open');
    });
  }

  if (scheduleDrawerClose) {
    scheduleDrawerClose.addEventListener('click', () => {
      if (scheduleDrawer) scheduleDrawer.classList.remove('open');
    });
  }

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = scheduleForm.querySelector('[type="submit"]');
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
          if (scheduleDrawer) scheduleDrawer.classList.remove('open');
          submitBtn.innerHTML = 'Submit Multi-Item RFQ <span class="arrow">→</span>';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  // Search input with debounce
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
  }

  // Select Filters
  if (brandSelect) {
    brandSelect.addEventListener('change', () => {
      currentBrand = brandSelect.value;
      currentPage = 1;
      applyFilters();
    });
  }

  if (powerSelect) {
    powerSelect.addEventListener('change', () => {
      currentPower = powerSelect.value;
      currentPage = 1;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      applyFilters();
    });
  }

  // Initial Boot
  renderCategoryButtons();
  applyFilters();
  updateScheduleUI();
});
