/* ============================================================
   SIP & PLAY ENTERPRISE PORTAL — DASHBOARD & ANALYTICS ENGINE
   Chart.js Stock Analytics • Supabase Real-Time CRUD • Asset Valuation
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const baseProducts = window.SIP_PRODUCTS || [];
  let currentProducts = [];

  let valuationChartInstance = null;
  let categoryChartInstance = null;

  // DOM Elements
  const kpiValuation = document.getElementById('kpiValuation');
  const kpiTotalCount = document.getElementById('kpiTotalCount');
  const kpiStockHealth = document.getElementById('kpiStockHealth');
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  const tableInfo = document.getElementById('tableInfo');
  const tablePagination = document.getElementById('tablePagination');
  const portalSearch = document.getElementById('portalSearch');
  const filterCategory = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');
  const cloudStatusBadge = document.getElementById('cloudStatusBadge');
  const btnQuickSeed = document.getElementById('btnQuickSeed');
  const btnExportJson = document.getElementById('btnExportJson');
  const btnPortalLogout = document.getElementById('btnPortalLogout');
  const portalUserDisplay = document.getElementById('portalUserDisplay');

  // Modals
  const uploadModal = document.getElementById('uploadModal');
  const btnOpenUploadModal = document.getElementById('btnOpenUploadModal');
  const btnSidebarUpload = document.getElementById('btnSidebarUpload');
  const btnCloseUploadModal = document.getElementById('btnCloseUploadModal');
  const btnCancelForm = document.getElementById('btnCancelForm');
  const equipmentForm = document.getElementById('equipmentForm');
  const modalFormTitle = document.getElementById('modalFormTitle');
  const formEditId = document.getElementById('formEditId');

  // Settings Modal
  const settingsModal = document.getElementById('settingsModal');
  const btnSidebarSettings = document.getElementById('btnSidebarSettings');
  const btnCloseSettingsModal = document.getElementById('btnCloseSettingsModal');
  const supaCredForm = document.getElementById('supaCredForm');
  const supaUrlInput = document.getElementById('supaUrlInput');
  const supaKeyInput = document.getElementById('supaKeyInput');
  const btnDisconnectCloud = document.getElementById('btnDisconnectCloud');

  // Form Inputs
  const inpName = document.getElementById('inpName');
  const inpSku = document.getElementById('inpSku');
  const inpBrand = document.getElementById('inpBrand');
  const inpCategory = document.getElementById('inpCategory');
  const inpPower = document.getElementById('inpPower');
  const inpStatus = document.getElementById('inpStatus');
  const inpPrice = document.getElementById('inpPrice');
  const inpDimensions = document.getElementById('inpDimensions');
  const inpImage = document.getElementById('inpImage');
  const inpDesc = document.getElementById('inpDesc');

  let tablePage = 1;
  const tablePerPage = 12;

  // Set user display
  const loggedInUser = sessionStorage.getItem('sip_portal_user') || 'admin';
  if (portalUserDisplay) portalUserDisplay.textContent = `USER: ${loggedInUser.toUpperCase()}`;

  // Logout
  if (btnPortalLogout) {
    btnPortalLogout.addEventListener('click', () => {
      sessionStorage.removeItem('sip_portal_auth');
      sessionStorage.removeItem('sip_portal_user');
      window.location.replace('login.html');
    });
  }

  // Check Supabase Cloud Connection
  async function checkCloudStatus() {
    const creds = window.SipSupabase.getCredentials();
    if (supaUrlInput) supaUrlInput.value = creds.url;
    if (supaKeyInput) supaKeyInput.value = creds.anonKey;

    if (!window.SipSupabase.isConfigured()) {
      cloudStatusBadge.textContent = '○ LOCAL STORAGE';
      cloudStatusBadge.className = 'badge-cloud offline';
      return false;
    }

    const res = await window.SipSupabase.testConnection();
    if (res.success) {
      cloudStatusBadge.textContent = '● SUPABASE CLOUD CONNECTED';
      cloudStatusBadge.className = 'badge-cloud';
      return true;
    } else {
      cloudStatusBadge.textContent = '⚠ CLOUD OFFLINE';
      cloudStatusBadge.className = 'badge-cloud offline';
      return false;
    }
  }

  // Load Products (Supabase vs Local Cache)
  async function loadProducts() {
    const client = window.SipSupabase.getClient();
    let loadedFromCloud = false;

    if (client) {
      try {
        const { data, error } = await client.from('products').select('*').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          currentProducts = data.map(d => ({
            id: d.id,
            sku: d.sku,
            name: d.name,
            brand: d.brand,
            category: d.category,
            power: d.power,
            dimensions: d.dimensions || 'Standard GN Spec',
            priceLkr: d.unit_price_lkr || 850000,
            status: d.stock_status || 'In Stock (Colombo)',
            image: d.image || '',
            description: d.description || ''
          }));
          loadedFromCloud = true;
        }
      } catch (err) {
        console.warn('Supabase fetch notice, falling back:', err);
      }
    }

    if (!loadedFromCloud) {
      const custom = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
      const deleted = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
      let list = baseProducts.filter(p => !deleted.includes(p.id));
      custom.forEach(c => {
        const idx = list.findIndex(p => p.id === c.id);
        if (idx > -1) list[idx] = c;
        else list.unshift(c);
      });
      currentProducts = list.map((p, i) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        category: p.category,
        power: p.power,
        dimensions: p.dimensions || 'Standard Commercial Dimensions',
        priceLkr: 650000 + ((p.id * 14500) % 2500000),
        status: i % 7 === 0 ? 'Low Stock' : (i % 5 === 0 ? 'Direct Factory Import' : 'In Stock (Colombo)'),
        image: p.image || '',
        description: p.description || ''
      }));
    }

    updateKPIs();
    initOrUpdateCharts();
    renderTable();
  }

  // Update Executive KPI Metrics
  function updateKPIs() {
    const totalUnits = currentProducts.length;
    const totalVal = currentProducts.reduce((acc, p) => acc + (p.priceLkr || 850000), 0);
    const inStockUnits = currentProducts.filter(p => p.status === 'In Stock (Colombo)').length;

    kpiTotalCount.textContent = `${totalUnits} Units`;
    kpiValuation.textContent = `LKR ${(totalVal / 1000000).toFixed(1)}M`;
    kpiStockHealth.textContent = `${((inStockUnits / (totalUnits || 1)) * 100).toFixed(1)}%`;
  }

  // Chart.js Visualizations
  function initOrUpdateCharts() {
    // 1. Valuation Trend Chart
    const ctxVal = document.getElementById('valuationChart');
    if (ctxVal) {
      const gradient = ctxVal.getContext('2d').createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(0, 255, 157, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 255, 157, 0)');

      const valuationData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Asset Valuation (LKR Millions)',
          data: [280, 295, 310, 340, 365, 390, 410, 425.8, 440, 460, 475, 490],
          borderColor: '#00ff9d',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#00ff9d',
          pointBorderColor: '#08080a',
          pointRadius: 4
        }]
      };

      if (valuationChartInstance) {
        valuationChartInstance.update();
      } else {
        valuationChartInstance = new Chart(ctxVal, {
          type: 'line',
          data: valuationData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#121217',
                titleColor: '#fff',
                bodyColor: '#00ff9d',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
              }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8e8e9f', font: { family: 'Space Mono', size: 10 } } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8e8e9f', font: { family: 'Space Mono', size: 10 } } }
            }
          }
        });
      }
    }

    // 2. Category Doughnut Chart
    const ctxCat = document.getElementById('categoryChart');
    if (ctxCat) {
      const catCounts = {};
      currentProducts.forEach(p => {
        catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      });

      const catLabels = Object.keys(catCounts);
      const catValues = Object.values(catCounts);

      const catData = {
        labels: catLabels,
        datasets: [{
          data: catValues,
          backgroundColor: [
            '#00ff9d', '#00d2ff', '#ffb800', '#ff4757',
            '#9b59b6', '#3498db', '#e67e22', '#1abc9c'
          ],
          borderColor: '#121217',
          borderWidth: 3
        }]
      };

      if (categoryChartInstance) {
        categoryChartInstance.data = catData;
        categoryChartInstance.update();
      } else {
        categoryChartInstance = new Chart(ctxCat, {
          type: 'doughnut',
          data: catData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#8e8e9f',
                  font: { family: 'Inter', size: 10 },
                  padding: 12,
                  boxWidth: 8
                }
              }
            },
            cutout: '72%'
          }
        });
      }
    }
  }

  // Render Table
  function renderTable() {
    const q = portalSearch.value.toLowerCase().trim();
    const cat = filterCategory.value;
    const status = filterStatus.value;

    const filtered = currentProducts.filter(p => {
      const matchesQ = !q || `${p.sku} ${p.name} ${p.brand}`.toLowerCase().includes(q);
      const matchesCat = cat === 'all' || p.category === cat;
      const matchesStatus = status === 'all' || p.status === status;
      return matchesQ && matchesCat && matchesStatus;
    });

    inventoryTableBody.innerHTML = '';

    if (filtered.length === 0) {
      inventoryTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#888;">No commercial equipment matches your filters.</td></tr>';
      tableInfo.textContent = '0 items found';
      tablePagination.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(filtered.length / tablePerPage);
    if (tablePage > totalPages) tablePage = totalPages;

    const start = (tablePage - 1) * tablePerPage;
    const pageItems = filtered.slice(start, start + tablePerPage);

    pageItems.forEach(p => {
      const tr = document.createElement('tr');
      let statusClass = 'in-stock';
      if (p.status === 'Low Stock') statusClass = 'low-stock';
      if (p.status === 'Direct Factory Import') statusClass = 'import';

      tr.innerHTML = `
        <td style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:#fff;">${p.sku}</td>
        <td><strong style="color:#fff;">${p.name}</strong></td>
        <td>${p.brand}</td>
        <td><span style="font-size:0.75rem; color:#aaa;">${p.category}</span></td>
        <td><span style="font-family:var(--font-mono); font-size:0.7rem;">${p.power}</span></td>
        <td><span class="stock-tag ${statusClass}">● ${p.status}</span></td>
        <td style="font-family:var(--font-mono); font-size:0.75rem; color:#fff;">LKR ${Number(p.priceLkr).toLocaleString()}</td>
        <td>
          <div style="display:flex; gap:4px;">
            <button class="btn-portal btn-portal--outline btn-edit-item" style="padding:4px 8px; font-size:0.6rem;" data-id="${p.id}">Edit</button>
            <button class="btn-portal btn-portal--outline btn-del-item" style="padding:4px 8px; font-size:0.6rem; color:var(--accent-rose);" data-id="${p.id}">Delete</button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-edit-item').addEventListener('click', () => openEditModal(p));
      tr.querySelector('.btn-del-item').addEventListener('click', () => deleteItem(p.id, p.name));

      inventoryTableBody.appendChild(tr);
    });

    tableInfo.textContent = `Displaying ${start + 1}–${Math.min(start + tablePerPage, filtered.length)} of ${filtered.length} equipment assets`;

    // Pagination
    tablePagination.innerHTML = '';
    if (totalPages > 1) {
      for (let i = 1; i <= Math.min(totalPages, 8); i++) {
        const btn = document.createElement('button');
        btn.className = `btn-portal btn-portal--outline ${i === tablePage ? 'style="background:#fff; color:#000;"' : ''}`;
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '0.65rem';
        btn.textContent = i;
        btn.addEventListener('click', () => {
          tablePage = i;
          renderTable();
        });
        tablePagination.appendChild(btn);
      }
    }
  }

  // Modal Controllers
  function openUploadModal() {
    equipmentForm.reset();
    formEditId.value = '';
    modalFormTitle.textContent = 'Upload New Commercial Equipment';
    uploadModal.classList.add('open');
  }

  function openEditModal(p) {
    formEditId.value = p.id;
    inpName.value = p.name;
    inpSku.value = p.sku;
    inpBrand.value = p.brand;
    inpCategory.value = p.category;
    inpPower.value = p.power;
    inpStatus.value = p.status || 'In Stock (Colombo)';
    inpPrice.value = p.priceLkr || 850000;
    inpDimensions.value = p.dimensions || '';
    inpImage.value = p.image || '';
    inpDesc.value = p.description || '';

    modalFormTitle.textContent = `Edit Equipment: ${p.sku}`;
    uploadModal.classList.add('open');
  }

  function closeUploadModal() {
    uploadModal.classList.remove('open');
  }

  if (btnOpenUploadModal) btnOpenUploadModal.addEventListener('click', openUploadModal);
  if (btnSidebarUpload) btnSidebarUpload.addEventListener('click', (e) => { e.preventDefault(); openUploadModal(); });
  if (btnCloseUploadModal) btnCloseUploadModal.addEventListener('click', closeUploadModal);
  if (btnCancelForm) btnCancelForm.addEventListener('click', closeUploadModal);

  // Settings Modal Controllers
  if (btnSidebarSettings) btnSidebarSettings.addEventListener('click', (e) => { e.preventDefault(); settingsModal.classList.add('open'); });
  if (btnCloseSettingsModal) btnCloseSettingsModal.addEventListener('click', () => settingsModal.classList.remove('open'));

  // Save / Upload Equipment (Supabase Cloud + Local Cache)
  equipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isEdit = Boolean(formEditId.value);
    const client = window.SipSupabase.getClient();

    const payload = {
      sku: inpSku.value.trim().toUpperCase(),
      name: inpName.value.trim(),
      brand: inpBrand.value.trim(),
      category: inpCategory.value,
      sub_category: inpCategory.value,
      power: inpPower.value,
      stock_status: inpStatus.value,
      unit_price_lkr: parseFloat(inpPrice.value) || 850000,
      dimensions: inpDimensions.value.trim() || 'Standard GN Spec',
      origin: 'European Union',
      material: 'AISI 304 High-Tensile Stainless Steel',
      description: inpDesc.value.trim() || `Industrial-grade commercial ${inpName.value.trim()} engineered by ${inpBrand.value.trim()}.`,
      image: inpImage.value.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      featured: false
    };

    if (client) {
      try {
        if (isEdit) {
          const { error } = await client.from('products').update(payload).eq('id', formEditId.value);
          if (error) throw error;
        } else {
          const { error } = await client.from('products').insert([payload]);
          if (error) throw error;
        }
        alert('✓ Successfully saved to Supabase Cloud Database!');
      } catch (err) {
        alert(`Supabase Cloud notice: ${err.message}\nSaved to local storage.`);
        saveLocal(payload, isEdit);
      }
    } else {
      saveLocal(payload, isEdit);
      alert('✓ Saved to Local Storage (Configure Supabase for cloud sync).');
    }

    closeUploadModal();
    await loadProducts();
  });

  function saveLocal(payload, isEdit) {
    let custom = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
    const id = isEdit ? parseInt(formEditId.value) : Date.now();
    const item = { ...payload, id, subCategory: payload.sub_category, priceLkr: payload.unit_price_lkr, status: payload.stock_status };

    if (isEdit) {
      const idx = custom.findIndex(p => p.id === id);
      if (idx > -1) custom[idx] = item;
      else custom.push(item);
    } else {
      custom.unshift(item);
    }
    localStorage.setItem('sip_custom_products', JSON.stringify(custom));
  }

  // Delete Item
  async function deleteItem(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;

    const client = window.SipSupabase.getClient();
    if (client) {
      try {
        const { error } = await client.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Cloud delete error:', err);
      }
    }

    let custom = JSON.parse(localStorage.getItem('sip_custom_products') || '[]');
    const idx = custom.findIndex(p => p.id === id);
    if (idx > -1) {
      custom.splice(idx, 1);
      localStorage.setItem('sip_custom_products', JSON.stringify(custom));
    } else {
      let deleted = JSON.parse(localStorage.getItem('sip_deleted_ids') || '[]');
      deleted.push(id);
      localStorage.setItem('sip_deleted_ids', JSON.stringify(deleted));
    }

    await loadProducts();
  }

  // Seed 500 Products to Supabase
  if (btnQuickSeed) {
    btnQuickSeed.addEventListener('click', async () => {
      const client = window.SipSupabase.getClient();
      if (!client) {
        alert('Please configure your Supabase Project credentials first in Supabase Settings.');
        settingsModal.classList.add('open');
        return;
      }

      if (!confirm('Seed all 500 commercial equipment units into your Supabase cloud database?')) return;

      btnQuickSeed.innerHTML = '⚡ Seeding...';
      btnQuickSeed.disabled = true;

      try {
        const payload = baseProducts.map((p, i) => ({
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
          featured: p.featured,
          stock_qty: 10,
          stock_status: i % 7 === 0 ? 'Low Stock' : (i % 5 === 0 ? 'Direct Factory Import' : 'In Stock (Colombo)'),
          unit_price_lkr: 650000 + ((p.id * 14500) % 2500000)
        }));

        const chunkSize = 50;
        for (let i = 0; i < payload.length; i += chunkSize) {
          const chunk = payload.slice(i, i + chunkSize);
          const { error } = await client.from('products').upsert(chunk, { onConflict: 'sku' });
          if (error) throw error;
        }

        alert('✓ Successfully seeded 500 commercial equipment assets to Supabase!');
        await loadProducts();
      } catch (err) {
        alert(`Seeding failed: ${err.message}\nMake sure to run the SQL schema in your Supabase SQL Editor.`);
      } finally {
        btnQuickSeed.innerHTML = '⚡ Seed 500 to Supabase';
        btnQuickSeed.disabled = false;
      }
    });
  }

  // Supabase Settings Form
  supaCredForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    window.SipSupabase.saveCredentials(supaUrlInput.value, supaKeyInput.value);
    const isOk = await checkCloudStatus();
    if (isOk) {
      alert('✓ Connected to Supabase Cloud Database!');
      settingsModal.classList.remove('open');
      await loadProducts();
    } else {
      alert('Could not connect. Please verify your Project URL and Anon API key.');
    }
  });

  if (btnDisconnectCloud) {
    btnDisconnectCloud.addEventListener('click', async () => {
      window.SipSupabase.clearCredentials();
      if (supaUrlInput) supaUrlInput.value = '';
      if (supaKeyInput) supaKeyInput.value = '';
      await checkCloudStatus();
      settingsModal.classList.remove('open');
      await loadProducts();
    });
  }

  // Search & Filter Listeners
  portalSearch.addEventListener('input', () => { tablePage = 1; renderTable(); });
  filterCategory.addEventListener('change', () => { tablePage = 1; renderTable(); });
  filterStatus.addEventListener('change', () => { tablePage = 1; renderTable(); });

  // Export
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const dataStr = JSON.stringify(currentProducts, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sip-commercial-inventory-2026.json';
      a.click();
    });
  }

  // Initial Boot
  await checkCloudStatus();
  await loadProducts();
});
