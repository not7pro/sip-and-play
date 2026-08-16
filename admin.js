/* ============================================================
   SIP & PLAY — ADMIN BACKEND ENGINE (SUPABASE DATABASE)
   Upload New Products • Edit • Delete • Live Cloud Sync • Seeding
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const baseProducts = window.SIP_PRODUCTS || [];
  let currentProducts = [];

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

  // Table & Stats Elements
  const adminTableBody = document.getElementById('adminTableBody');
  const tableSearch = document.getElementById('tableSearch');
  const tableCountInfo = document.getElementById('tableCountInfo');
  const tablePagination = document.getElementById('tablePagination');
  const statTotalCount = document.getElementById('statTotalCount');
  const statEngineBadge = document.getElementById('statEngineBadge');
  const supaStatusBadge = document.getElementById('supaStatusBadge');
  const supaUrlDisplay = document.getElementById('supaUrlDisplay');
  const btnExportData = document.getElementById('btnExportData');
  const btnSeedSupabase = document.getElementById('btnSeedSupabase');

  // Supabase Settings Modal Elements
  const supaModal = document.getElementById('supaModal');
  const btnOpenSupaSettings = document.getElementById('btnOpenSupaSettings');
  const btnCloseSupaModal = document.getElementById('btnCloseSupaModal');
  const supaConfigForm = document.getElementById('supaConfigForm');
  const cfgSupaUrl = document.getElementById('cfgSupaUrl');
  const cfgSupaKey = document.getElementById('cfgSupaKey');
  const btnDisconnectSupa = document.getElementById('btnDisconnectSupa');

  let tablePage = 1;
  const tablePerPage = 15;
  let tableFilterQuery = '';

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

  // Check Supabase Cloud Connection Status
  async function refreshConnectionStatus() {
    const creds = window.SipSupabase.getCredentials();
    if (cfgSupaUrl) cfgSupaUrl.value = creds.url;
    if (cfgSupaKey) cfgSupaKey.value = creds.anonKey;

    if (!window.SipSupabase.isConfigured()) {
      supaStatusBadge.textContent = '○ SUPABASE NOT CONFIGURED';
      supaStatusBadge.className = 'badge-status offline';
      supaUrlDisplay.textContent = 'Using Local Storage Fallback';
      statEngineBadge.textContent = 'LOCAL STORAGE';
      statEngineBadge.className = 'badge-status offline';
      return false;
    }

    const test = await window.SipSupabase.testConnection();
    if (test.success) {
      supaStatusBadge.textContent = '● SUPABASE CLOUD CONNECTED';
      supaStatusBadge.className = 'badge-status';
      supaUrlDisplay.textContent = `Connected: ${creds.url.replace(/^https?:\/\//, '').split('.')[0]}.supabase.co`;
      statEngineBadge.textContent = 'SUPABASE CLOUD';
      statEngineBadge.className = 'badge-status';
      return true;
    } else {
      supaStatusBadge.textContent = '⚠ CONNECTION ERROR';
      supaStatusBadge.className = 'badge-status offline';
      supaUrlDisplay.textContent = test.message;
      statEngineBadge.textContent = 'OFFLINE FALLBACK';
      statEngineBadge.className = 'badge-status offline';
      return false;
    }
  }

  // Fetch all products (From Supabase if connected, else fallback to localStorage / dataset)
  async function loadProducts() {
    const isCloud = window.SipSupabase.isConfigured();
    const client = window.SipSupabase.getClient();

    if (isCloud && client) {
      try {
        const { data, error } = await client.from('products').select('*').order('id', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          currentProducts = data.map(d => ({
            id: d.id,
            sku: d.sku,
            name: d.name,
            brand: d.brand,
            category: d.category,
            subCategory: d.sub_category || d.category,
            power: d.power,
            powerKw: d.power_kw,
            dimensions: d.dimensions,
            origin: d.origin,
            material: d.material || 'AISI 304 High-Tensile Stainless Steel',
            description: d.description,
            image: d.image,
            featured: Boolean(d.featured)
          }));
          renderTable();
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local dataset:', err);
      }
    }

    // Fallback: localStorage merged with base dataset
    const custom = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
    let list = baseProducts.filter(p => !deletedIds.includes(p.id));
    custom.forEach(c => {
      const idx = list.findIndex(p => p.id === c.id);
      if (idx > -1) list[idx] = c;
      else list.unshift(c);
    });

    currentProducts = list;
    renderTable();
  }

  // Live Spec Preview
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

  [prodName, prodSku, prodBrand, prodCategory, prodSubCategory, prodPower, prodPowerKw, prodDimensions, prodOrigin, prodImage, prodFeatured].forEach(el => {
    if (el) el.addEventListener('input', updateLivePreview);
  });

  // Handle Product Save / Upload
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editProductId.value);
    const catImg = defaultImages[prodCategory.value] || defaultImages['Coffee & Beverage'];
    const client = window.SipSupabase.getClient();

    const productPayload = {
      sku: prodSku.value.trim().toUpperCase(),
      name: prodName.value.trim(),
      brand: prodBrand.value.trim(),
      category: prodCategory.value,
      sub_category: prodSubCategory.value.trim() || prodCategory.value,
      power: prodPower.value,
      power_kw: prodPowerKw.value.trim() || 'Commercial Standard',
      dimensions: prodDimensions.value.trim() || 'Standard GN Dimensions',
      origin: prodOrigin.value.trim() || 'European Union',
      material: 'AISI 304 High-Tensile Stainless Steel',
      description: prodDescription.value.trim() || `Industrial-grade commercial ${prodName.value.trim()} engineered by ${prodBrand.value.trim()} for high-volume hospitality.`,
      image: prodImage.value.trim() || catImg,
      featured: prodFeatured.checked
    };

    btnSaveProduct.innerHTML = 'SAVING TO DATABASE...';
    btnSaveProduct.disabled = true;

    if (client) {
      try {
        if (isEdit) {
          const { error } = await client.from('products').update(productPayload).eq('id', editProductId.value);
          if (error) throw error;
        } else {
          const { error } = await client.from('products').insert([productPayload]);
          if (error) throw error;
        }
        alert(isEdit ? '✓ Equipment updated in Supabase cloud database!' : '✓ New equipment uploaded to Supabase database!');
      } catch (err) {
        alert(`Supabase Cloud Error: ${err.message}\nFalling back to local persistence.`);
        saveLocalProduct(productPayload, isEdit);
      }
    } else {
      saveLocalProduct(productPayload, isEdit);
      alert(isEdit ? '✓ Equipment updated locally!' : '✓ New equipment saved locally!');
    }

    resetForm();
    await loadProducts();
    btnSaveProduct.innerHTML = 'Save to Supabase Database <span class="arrow">→</span>';
    btnSaveProduct.disabled = false;
  });

  function saveLocalProduct(payload, isEdit) {
    let customList = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
    const id = isEdit ? parseInt(editProductId.value) : Date.now();
    const item = { ...payload, id, subCategory: payload.sub_category, powerKw: payload.power_kw };

    if (isEdit) {
      const idx = customList.findIndex(p => p.id === id);
      if (idx > -1) customList[idx] = item;
      else customList.push(item);
    } else {
      customList.unshift(item);
    }
    localStorage.setItem('sip_custom_products', JSON.stringify(customList));
  }

  function resetForm() {
    productForm.reset();
    editProductId.value = '';
    formTitle.textContent = 'Upload New Equipment';
    editIndicator.textContent = 'NEW SPECIFICATION';
    btnSaveProduct.innerHTML = 'Save to Supabase Database <span class="arrow">→</span>';
    btnCancelEdit.style.display = 'none';
    updateLivePreview();
  }

  btnCancelEdit.addEventListener('click', resetForm);

  // Render Table
  function renderTable() {
    const q = tableFilterQuery.toLowerCase().trim();

    const filtered = currentProducts.filter(p => {
      if (!q) return true;
      return `${p.sku} ${p.name} ${p.brand} ${p.category} ${p.origin} ${p.power}`.toLowerCase().includes(q);
    });

    statTotalCount.textContent = currentProducts.length;
    adminTableBody.innerHTML = '';

    if (filtered.length === 0) {
      adminTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#888;">No equipment matching your query in database.</td></tr>';
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
            <button class="admin-btn-action admin-btn-del" data-id="${p.id}" title="Delete Unit">Delete</button>
          </div>
        </td>
      `;

      tr.querySelector('.admin-btn-edit').addEventListener('click', () => editProduct(p));
      tr.querySelector('.admin-btn-del').addEventListener('click', () => deleteProduct(p.id, p.name));

      adminTableBody.appendChild(tr);
    });

    tableCountInfo.textContent = `Showing ${start + 1}–${Math.min(start + tablePerPage, filtered.length)} of ${filtered.length} units in database`;

    // Pagination
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
    btnSaveProduct.innerHTML = 'Update Supabase Specification <span class="arrow">→</span>';
    btnCancelEdit.style.display = 'inline-flex';

    updateLivePreview();
    window.scrollTo({ top: productForm.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }

  async function deleteProduct(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;

    const client = window.SipSupabase.getClient();
    if (client) {
      try {
        const { error } = await client.from('products').delete().eq('id', id);
        if (error) throw error;
        alert('✓ Product deleted from Supabase cloud database.');
      } catch (err) {
        alert(`Failed to delete from Supabase: ${err.message}`);
      }
    }

    // Also remove from local cache
    let customList = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
    const idx = customList.findIndex(p => p.id === id);
    if (idx > -1) {
      customList.splice(idx, 1);
      localStorage.setItem('sip_custom_products', JSON.stringify(customList));
    } else {
      let deletedIds = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
      deletedIds.push(id);
      localStorage.setItem('sip_deleted_ids', JSON.stringify(deletedIds));
    }

    await loadProducts();
  }

  // Seed 500 Products into Supabase
  if (btnSeedSupabase) {
    btnSeedSupabase.addEventListener('click', async () => {
      const client = window.SipSupabase.getClient();
      if (!client) {
        alert('Please configure your Supabase Project URL and Anon API key first.');
        supaModal.classList.add('open');
        return;
      }

      if (!confirm(`Seed all 500 default commercial equipment products into your Supabase database?`)) return;

      btnSeedSupabase.innerHTML = '⚡ Seeding 500 products...';
      btnSeedSupabase.disabled = true;

      try {
        const payload = baseProducts.map(p => ({
          sku: p.sku,
          name: p.name,
          brand: p.brand,
          category: p.category,
          sub_category: p.subCategory,
          power: p.power,
          power_kw: p.powerKw,
          dimensions: p.dimensions,
          origin: p.origin,
          material: p.material,
          description: p.description,
          image: p.image,
          featured: p.featured
        }));

        // Batch upload in chunks of 50
        const chunkSize = 50;
        for (let i = 0; i < payload.length; i += chunkSize) {
          const chunk = payload.slice(i, i + chunkSize);
          const { error } = await client.from('products').upsert(chunk, { onConflict: 'sku' });
          if (error) throw error;
          btnSeedSupabase.innerHTML = `⚡ Seeding (${Math.min(i + chunkSize, payload.length)}/500)...`;
        }

        alert('✓ Successfully seeded 500 commercial equipment products into your Supabase database!');
        await loadProducts();
      } catch (err) {
        alert(`Seeding failed: ${err.message}\nEnsure you have created the 'products' table using the SQL schema in Settings.`);
      } finally {
        btnSeedSupabase.innerHTML = '⚡ Seed 500 Products to Supabase';
        btnSeedSupabase.disabled = false;
      }
    });
  }

  // Supabase Settings Modal Triggers
  btnOpenSupaSettings.addEventListener('click', () => supaModal.classList.add('open'));
  btnCloseSupaModal.addEventListener('click', () => supaModal.classList.remove('open'));
  supaModal.addEventListener('click', (e) => {
    if (e.target === supaModal) supaModal.classList.remove('open');
  });

  supaConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    window.SipSupabase.saveCredentials(cfgSupaUrl.value, cfgSupaKey.value);
    const isOk = await refreshConnectionStatus();
    if (isOk) {
      alert('✓ Connected to Supabase Cloud Database successfully!');
      supaModal.classList.remove('open');
      await loadProducts();
    } else {
      alert('Could not connect to Supabase. Please verify your Project URL, Anon Key, and ensure the "products" table is created.');
    }
  });

  btnDisconnectSupa.addEventListener('click', async () => {
    if (confirm('Disconnect Supabase and switch back to local storage?')) {
      window.SipSupabase.clearCredentials();
      if (cfgSupaUrl) cfgSupaUrl.value = '';
      if (cfgSupaKey) cfgSupaKey.value = '';
      await refreshConnectionStatus();
      supaModal.classList.remove('open');
      await loadProducts();
    }
  });

  // Table Search
  tableSearch.addEventListener('input', () => {
    tableFilterQuery = tableSearch.value;
    tablePage = 1;
    renderTable();
  });

  // Export dataset
  btnExportData.addEventListener('click', () => {
    const jsContent = "/* Sip & Play — 500+ Commercial Equipment Dataset */\nwindow.SIP_PRODUCTS = " + JSON.stringify(currentProducts, null, 2) + ";\n";
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

  // Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Are you sure you want to end your admin session and log out?')) {
        sessionStorage.removeItem('sip_admin_session');
        sessionStorage.removeItem('sip_admin_user');
        window.location.replace('login.html');
      }
    });
  }

  // Initial Run
  updateLivePreview();
  await refreshConnectionStatus();
  await loadProducts();
});
