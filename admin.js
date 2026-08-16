/* ============================================================
   SIP & PLAY — ADMIN BACKEND ENGINE
   Upload New Products • Edit • Delete • Live Sync • Export
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Load base products
  const baseProducts = window.SIP_PRODUCTS || [];
  
  // Load custom products from localStorage
  function getCustomProducts() {
    return JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
  }

  function saveCustomProducts(customList) {
    localStorage.setItem('sip_custom_products', JSON.stringify(customList));
  }

  function getAllMergedProducts() {
    const custom = getCustomProducts();
    const deletedIds = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
    
    // Filter out deleted base items
    let list = baseProducts.filter(p => !deletedIds.includes(p.id));
    
    // Merge or replace updated custom items
    custom.forEach(c => {
      const idx = list.findIndex(p => p.id === c.id);
      if (idx > -1) {
        list[idx] = c;
      } else {
        list.unshift(c);
      }
    });

    return list;
  }

  // DOM Elements
  const productForm = document.getElementById('productForm');
  const formTitle = document.getElementById('formTitle');
  const editIndicator = document.getElementById('editIndicator');
  const editProductId = document.getElementById('editProductId');
  const btnSaveProduct = document.getElementById('btnSaveProduct');
  const btnCancelEdit = document.getElementById('btnCancelEdit');

  // Input Fields for Live Preview
  const prodName = document.getElementById('prodName');
  const prodSku = document.getElementById('prodSku');
  const prodBrand = document.getElementById('prodBrand');
  const prodCategory = document.getElementById('prodCategory');
  const prodSubCategory = document.getElementById('prodSubCategory');
  const prodPower = document.getElementById('prodPower');
  const prodPowerKw = document.getElementById('prodPowerKw');
  const prodDimensions = document.getElementById('prodDimensions');
  const prodOrigin = document.getElementById('prodOrigin');
  const prodImage = document.getElementById('prodImage');
  const prodDescription = document.getElementById('prodDescription');
  const prodFeatured = document.getElementById('prodFeatured');

  // Preview Elements
  const previewImg = document.getElementById('previewImg');
  const previewSku = document.getElementById('previewSku');
  const previewBrand = document.getElementById('previewBrand');
  const previewSubCat = document.getElementById('previewSubCat');
  const previewName = document.getElementById('previewName');
  const previewPower = document.getElementById('previewPower');
  const previewDimensions = document.getElementById('previewDimensions');
  const previewOrigin = document.getElementById('previewOrigin');
  const previewFeaturedBadge = document.getElementById('previewFeaturedBadge');

  // Table Elements
  const adminTableBody = document.getElementById('adminTableBody');
  const tableSearch = document.getElementById('tableSearch');
  const tableCountInfo = document.getElementById('tableCountInfo');
  const tablePagination = document.getElementById('tablePagination');
  const statTotalCount = document.getElementById('statTotalCount');
  const statCustomCount = document.getElementById('statCustomCount');
  const btnExportData = document.getElementById('btnExportData');
  const btnResetData = document.getElementById('btnResetData');

  let tablePage = 1;
  const tablePerPage = 15;
  let tableFilterQuery = '';

  // Default Image mapping per category
  const defaultImages = {
    'Coffee & Beverage': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    'Cold Storage & Refrigeration': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'Thermal Processing & Cooking': 'https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=800&q=80',
    'Warewashing Systems': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    'Food Preparation & Bakery': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    'Commercial Ice Systems': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    'Heated Holding & Servery': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    'Stainless Modular Fabrication': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
  };

  // Update Live Preview as admin types
  function updateLivePreview() {
    previewName.textContent = prodName.value.trim() || 'Equipment Name Sample';
    previewSku.textContent = prodSku.value.trim() || 'SP-SKU-CODE';
    previewBrand.textContent = (prodBrand.value.trim() || 'MANUFACTURER').toUpperCase();
    previewSubCat.textContent = (prodSubCategory.value.trim() || prodCategory.value).toUpperCase();
    previewPower.textContent = prodPower.value + (prodPowerKw.value.trim() ? ` (${prodPowerKw.value.trim()})` : '');
    previewDimensions.textContent = prodDimensions.value.trim() || 'Standard Commercial Dimensions';
    previewOrigin.textContent = prodOrigin.value.trim() || 'Global Origin';
    previewFeaturedBadge.style.display = prodFeatured.checked ? 'block' : 'none';

    const catImg = defaultImages[prodCategory.value] || defaultImages['Coffee & Beverage'];
    previewImg.src = prodImage.value.trim() || catImg;
  }

  // Attach live preview listeners
  [prodName, prodSku, prodBrand, prodCategory, prodSubCategory, prodPower, prodPowerKw, prodDimensions, prodOrigin, prodImage, prodFeatured].forEach(el => {
    if (el) el.addEventListener('input', updateLivePreview);
  });

  // Handle Form Submission (Create or Edit)
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEdit = Boolean(editProductId.value);
    const id = isEdit ? parseInt(editProductId.value) : Date.now();
    const catImg = defaultImages[prodCategory.value] || defaultImages['Coffee & Beverage'];

    const newProduct = {
      id: id,
      sku: prodSku.value.trim().toUpperCase(),
      name: prodName.value.trim(),
      brand: prodBrand.value.trim(),
      category: prodCategory.value,
      subCategory: prodSubCategory.value.trim() || prodCategory.value,
      power: prodPower.value,
      powerKw: prodPowerKw.value.trim() || 'Commercial Standard',
      dimensions: prodDimensions.value.trim() || 'Standard GN Dimensions',
      origin: prodOrigin.value.trim() || 'European Union',
      material: 'AISI 304 High-Tensile Stainless Steel',
      description: prodDescription.value.trim() || `Industrial-grade commercial ${prodName.value.trim()} engineered by ${prodBrand.value.trim()} for high-volume hospitality.`,
      image: prodImage.value.trim() || catImg,
      featured: prodFeatured.checked
    };

    let customList = getCustomProducts();
    if (isEdit) {
      const idx = customList.findIndex(p => p.id === id);
      if (idx > -1) {
        customList[idx] = newProduct;
      } else {
        customList.push(newProduct);
      }
    } else {
      customList.unshift(newProduct);
    }

    saveCustomProducts(customList);
    resetForm();
    renderTable();
    updateStats();

    alert(isEdit ? '✓ Equipment specification updated successfully!' : '✓ New commercial unit uploaded and added to live catalogue!');
  });

  function resetForm() {
    productForm.reset();
    editProductId.value = '';
    formTitle.textContent = 'Upload New Equipment';
    editIndicator.textContent = 'NEW SPECIFICATION';
    btnSaveProduct.innerHTML = 'Save Product to Catalogue <span class="arrow">→</span>';
    btnCancelEdit.style.display = 'none';
    updateLivePreview();
  }

  btnCancelEdit.addEventListener('click', resetForm);

  // Render Table
  function renderTable() {
    const allProducts = getAllMergedProducts();
    const q = tableFilterQuery.toLowerCase().trim();

    const filtered = allProducts.filter(p => {
      if (!q) return true;
      return `${p.sku} ${p.name} ${p.brand} ${p.category} ${p.origin} ${p.power}`.toLowerCase().includes(q);
    });

    statTotalCount.textContent = allProducts.length;
    statCustomCount.textContent = getCustomProducts().length;

    adminTableBody.innerHTML = '';

    if (filtered.length === 0) {
      adminTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#888;">No equipment matching your search.</td></tr>';
      tableCountInfo.textContent = '0 items found';
      tablePagination.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(filtered.length / tablePerPage);
    if (tablePage > totalPages) tablePage = totalPages;

    const start = (tablePage - 1) * tablePerPage;
    const pageItems = filtered.slice(start, start + tablePerPage);

    pageItems.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700;">${p.sku}</td>
        <td><strong>${p.name}</strong> ${p.featured ? '<span style="font-size:0.55rem; background:#000; color:#fff; padding:1px 4px; font-family:var(--font-mono);">FEATURED</span>' : ''}</td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td><span style="font-family:var(--font-mono); font-size:0.72rem;">${p.power}</span></td>
        <td>${p.origin}</td>
        <td>
          <div class="admin-actions">
            <button class="admin-btn-action admin-btn-edit" data-id="${p.id}" title="Edit Unit">Edit</button>
            <button class="admin-btn-action admin-btn-dup" data-id="${p.id}" title="Duplicate Unit">Clone</button>
            <button class="admin-btn-action admin-btn-del" data-id="${p.id}" title="Delete Unit">Delete</button>
          </div>
        </td>
      `;

      tr.querySelector('.admin-btn-edit').addEventListener('click', () => editProduct(p));
      tr.querySelector('.admin-btn-dup').addEventListener('click', () => duplicateProduct(p));
      tr.querySelector('.admin-btn-del').addEventListener('click', () => deleteProduct(p.id, p.name));

      adminTableBody.appendChild(tr);
    });

    tableCountInfo.textContent = `Showing ${start + 1}–${Math.min(start + tablePerPage, filtered.length)} of ${filtered.length} units`;

    // Render Table Pagination
    tablePagination.innerHTML = '';
    if (totalPages > 1) {
      for (let i = 1; i <= Math.min(totalPages, 10); i++) {
        const btn = document.createElement('button');
        btn.className = `admin-btn-action ${i === tablePage ? 'style="background:#000; color:#fff;"' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
          tablePage = i;
          renderTable();
        });
        tablePagination.appendChild(btn);
      }
    }
  }

  function editProduct(p) {
    editProductId.value = p.id;
    prodName.value = p.name;
    prodSku.value = p.sku;
    prodBrand.value = p.brand;
    prodCategory.value = p.category;
    prodSubCategory.value = p.subCategory || '';
    prodPower.value = p.power;
    prodPowerKw.value = p.powerKw || '';
    prodDimensions.value = p.dimensions || '';
    prodOrigin.value = p.origin || '';
    prodImage.value = p.image || '';
    prodDescription.value = p.description || '';
    prodFeatured.checked = Boolean(p.featured);

    formTitle.textContent = 'Edit Equipment Spec';
    editIndicator.textContent = `EDITING ID #${p.id}`;
    btnSaveProduct.innerHTML = 'Update Specification <span class="arrow">→</span>';
    btnCancelEdit.style.display = 'inline-flex';

    updateLivePreview();
    window.scrollTo({ top: productForm.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }

  function duplicateProduct(p) {
    prodName.value = p.name + ' (Copy)';
    prodSku.value = p.sku + '-COPY';
    prodBrand.value = p.brand;
    prodCategory.value = p.category;
    prodSubCategory.value = p.subCategory || '';
    prodPower.value = p.power;
    prodPowerKw.value = p.powerKw || '';
    prodDimensions.value = p.dimensions || '';
    prodOrigin.value = p.origin || '';
    prodImage.value = p.image || '';
    prodDescription.value = p.description || '';
    prodFeatured.checked = false;
    editProductId.value = '';

    formTitle.textContent = 'Upload Cloned Equipment';
    editIndicator.textContent = 'CLONED SPEC';
    btnSaveProduct.innerHTML = 'Save Cloned Product <span class="arrow">→</span>';
    btnCancelEdit.style.display = 'inline-flex';

    updateLivePreview();
    window.scrollTo({ top: productForm.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }

  function deleteProduct(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) return;

    let customList = getCustomProducts();
    const customIdx = customList.findIndex(p => p.id === id);
    if (customIdx > -1) {
      customList.splice(customIdx, 1);
      saveCustomProducts(customList);
    } else {
      let deletedIds = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
      deletedIds.push(id);
      localStorage.setItem('sip_deleted_ids', JSON.stringify(deletedIds));
    }

    renderTable();
    updateStats();
  }

  function updateStats() {
    const all = getAllMergedProducts();
    statTotalCount.textContent = all.length;
    statCustomCount.textContent = getCustomProducts().length;
  }

  // Export products-data.js for repository sync
  btnExportData.addEventListener('click', () => {
    const all = getAllMergedProducts();
    const jsContent = "/* Sip & Play — 500+ Commercial Equipment Dataset */\nwindow.SIP_PRODUCTS = " + JSON.stringify(all, null, 2) + ";\n";
    
    const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-data.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // Reset to original 500 dataset
  btnResetData.addEventListener('click', () => {
    if (confirm('Reset catalogue to the default 500 items? All custom uploads and edits will be cleared.')) {
      localStorage.removeItem('sip_custom_products');
      localStorage.removeItem('sip_deleted_ids');
      renderTable();
      updateStats();
      alert('✓ Catalogue reset to default 500 units.');
    }
  });

  // Table Search input
  tableSearch.addEventListener('input', () => {
    tableFilterQuery = tableSearch.value;
    tablePage = 1;
    renderTable();
  });

  // Init
  updateLivePreview();
  renderTable();
});
