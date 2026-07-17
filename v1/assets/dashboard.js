/* ========================================
   DASHBOARD - Charts & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initDashboardTabs();
  initDashboardCharts();
  initPenggunaLulusanCharts();
  initProdiFilter();
  initDownloadDropdown();
});

/* ========================================
   DASHBOARD TABS
   ======================================== */
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.dashboard-tabs .tab');
  const tabContents = document.querySelectorAll('.tab-content-dashboard');
  const downloadMenuLulusan = document.getElementById('download-menu-lulusan');
  const downloadMenuPengguna = document.getElementById('download-menu-pengguna');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide tab content
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });

      // Switch download menu based on active tab
      if (targetTab === 'tab-kuesioner-lulusan') {
        downloadMenuLulusan.classList.remove('hidden');
        downloadMenuPengguna.classList.add('hidden');
      } else {
        downloadMenuLulusan.classList.add('hidden');
        downloadMenuPengguna.classList.remove('hidden');
      }

      // Initialize charts for pengguna lulusan tab if not already done
      if (targetTab === 'tab-kuesioner-pengguna') {
        initPenggunaLulusanCharts();
      }
    });
  });
}

/* ========================================
   CHARTS - KUESIONER LULUSAN
   ======================================== */
function initDashboardCharts() {
  // Chart: Pengisian Tracer Study (Donut)
  const ctxPengisian = document.getElementById('chart-pengisian');
  if (ctxPengisian) {
    new Chart(ctxPengisian, {
      type: 'doughnut',
      data: {
        labels: ['Sudah Mengisi', 'Belum Mengisi'],
        datasets: [{ data: [98, 2088], backgroundColor: ['#1e40af', '#ef4444'], borderWidth: 0, cutout: '70%' }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }
    });
  }

  // Chart: Waktu Tunggu Lulusan (Donut)
  const ctxWaktuTunggu = document.getElementById('chart-waktu-tunggu');
  if (ctxWaktuTunggu) {
    new Chart(ctxWaktuTunggu, {
      type: 'doughnut',
      data: {
        labels: ['Kurang dari 6 Bulan', 'Lebih dari 6 Bulan'],
        datasets: [{ data: [29, 42], backgroundColor: ['#1e40af', '#f97316'], borderWidth: 0, cutout: '70%' }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }
    });
  }

  // Chart: Status Lulusan (Bar)
  const ctxStatusLulusan = document.getElementById('chart-status-lulusan');
  if (ctxStatusLulusan) {
    new Chart(ctxStatusLulusan, {
      type: 'bar',
      data: {
        labels: ['Bekerja', 'Belum Bekerja', 'Wiraswasta', 'Lanjut Studi', 'Mencari Kerja'],
        datasets: [{ data: [51, 16, 11, 7, 13], backgroundColor: '#1e40af', borderRadius: 4, barThickness: 40 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 60, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart: Kesesuaian Bidang Kerja (Bar)
  const ctxKesesuaian = document.getElementById('chart-kesesuaian-bidang');
  if (ctxKesesuaian) {
    new Chart(ctxKesesuaian, {
      type: 'bar',
      data: {
        labels: ['Sangat Erat', 'Erat', 'Cukup Erat', 'Kurang Erat', 'Tidak Sama Sekali'],
        datasets: [{ data: [23, 16, 12, 10, 5], backgroundColor: '#1e40af', borderRadius: 4, barThickness: 40 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 25, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart: Tingkat Tempat Kerja (Bar)
  const ctxTingkatKerja = document.getElementById('chart-tingkat-kerja');
  if (ctxTingkatKerja) {
    new Chart(ctxTingkatKerja, {
      type: 'bar',
      data: {
        labels: ['Lokal/Tidak berbadan hukum', 'Nasional/Berbadan hukum', 'Multinasional/Internasional'],
        datasets: [{ data: [23, 25, 13], backgroundColor: '#1e40af', borderRadius: 4, barThickness: 50 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 30, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Chart: Detail Waktu Tunggu Mendapatkan Pekerjaan (Bar)
  const ctxDetailWaktu = document.getElementById('chart-detail-waktu-tunggu');
  if (ctxDetailWaktu) {
    new Chart(ctxDetailWaktu, {
      type: 'bar',
      data: {
        labels: ['< 0 bulan', '< 3 bulan', '3-6 bulan', '7-12 bulan', '13-18 bulan', '> 18 bulan'],
        datasets: [{ data: [38, 2, 2, 23, 2, 5], backgroundColor: '#1e40af', borderRadius: 4, barThickness: 50 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 40, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } }
      }
    });
  }
}

/* ========================================
   CHARTS - KUESIONER PENGGUNA LULUSAN
   ======================================== */
let penggunaChartsInitialized = false;

function initPenggunaLulusanCharts() {
  if (penggunaChartsInitialized) return;
  
  const chartColors = ['#ef4444', '#f97316', '#1e40af', '#22c55e']; // Kurang, Cukup, Baik, Sangat Baik
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return context.label + ': ' + percentage + '%';
          }
        }
      }
    }
  };

  // Chart data for each competency (Kurang, Cukup, Baik, Sangat Baik)
  const chartData = {
    'chart-integritas': [4.1, 23.0, 68.9, 4.0],
    'chart-profesionalisme': [2.7, 20.3, 32.4, 44.6],
    'chart-bahasa-asing': [2.7, 21.6, 36.5, 39.2],
    'chart-teknologi': [5.4, 20.3, 32.4, 41.9],
    'chart-komunikasi': [4.1, 18.9, 28.4, 48.6],
    'chart-kerjasama': [2.7, 17.6, 35.1, 44.6],
    'chart-kepemimpinan': [2.7, 20.3, 32.4, 44.6],
    'chart-pengembangan': [4.1, 25.7, 33.8, 36.5],
    'chart-etos': [4.1, 18.9, 32.4, 44.6],
    'chart-kesiapan': [5.4, 23.0, 31.1, 40.5],
    'chart-kritis': [4.9, 14.6, 31.7, 48.8],
    'chart-kreatifitas': [4.9, 17.1, 22.0, 56.1]
  };

  Object.keys(chartData).forEach(chartId => {
    const ctx = document.getElementById(chartId);
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Kurang', 'Cukup', 'Baik', 'Sangat Baik'],
          datasets: [{
            data: chartData[chartId],
            backgroundColor: chartColors,
            borderWidth: 0,
            cutout: '60%'
          }]
        },
        options: chartOptions
      });
    }
  });

  penggunaChartsInitialized = true;
}

/* ========================================
   PROGRAM STUDI FILTER
   ======================================== */
function initProdiFilter() {
  const trigger = document.getElementById('filter-prodi-trigger');
  const dropdown = document.getElementById('prodi-dropdown');
  const searchInput = document.getElementById('prodi-search');
  const clearBtn = document.getElementById('prodi-clear');
  const selectAllBtn = document.getElementById('prodi-select-all');
  const prodiList = document.getElementById('prodi-list');
  const tagsContainer = document.getElementById('prodi-tags');

  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', function(e) {
    if (e.target !== searchInput && e.target !== clearBtn) {
      dropdown.classList.toggle('show');
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      const options = prodiList.querySelectorAll('.prodi-option');
      options.forEach(option => {
        const text = option.querySelector('span').textContent.toLowerCase();
        option.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
    searchInput.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.add('show');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const checkboxes = prodiList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      checkboxes[0].checked = true;
      updateProdiTags();
    });
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', function() {
      const checkboxes = prodiList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
      updateProdiTags();
    });
  }

  if (prodiList) {
    prodiList.addEventListener('change', function(e) {
      if (e.target.type === 'checkbox') updateProdiTags();
    });
  }

  document.addEventListener('click', function(e) {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  function updateProdiTags() {
    if (!tagsContainer) return;
    const checked = prodiList.querySelectorAll('input[type="checkbox"]:checked:not([value="all"])');
    const allChecked = prodiList.querySelector('input[value="all"]');
    tagsContainer.innerHTML = '';
    if (allChecked && allChecked.checked && checked.length === 0) return;
    checked.forEach(cb => {
      const label = cb.parentElement.querySelector('span').textContent;
      const tag = document.createElement('span');
      tag.className = 'prodi-tag';
      tag.innerHTML = `${label.substring(0, 15)}${label.length > 15 ? '...' : ''} <button onclick="this.parentElement.remove()">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

/* ========================================
   DOWNLOAD DROPDOWN
   ======================================== */
function initDownloadDropdown() {
  const btn = document.getElementById('btn-unduh');
  const menuLulusan = document.getElementById('download-menu-lulusan');
  const menuPengguna = document.getElementById('download-menu-pengguna');

  if (!btn) return;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    // Toggle the visible menu
    if (!menuLulusan.classList.contains('hidden')) {
      menuLulusan.classList.toggle('show');
    } else if (!menuPengguna.classList.contains('hidden')) {
      menuPengguna.classList.toggle('show');
    }
  });

  document.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !menuLulusan.contains(e.target) && !menuPengguna.contains(e.target)) {
      menuLulusan.classList.remove('show');
      menuPengguna.classList.remove('show');
    }
  });

  // Handle "Semua Informasi" checkbox
  document.querySelectorAll('.download-options').forEach(container => {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const allCheckbox = checkboxes[0]; // First checkbox is "Semua Informasi"
    
    allCheckbox.addEventListener('change', function() {
      checkboxes.forEach(cb => cb.checked = this.checked);
    });

    checkboxes.forEach((cb, index) => {
      if (index > 0) {
        cb.addEventListener('change', function() {
          const allChecked = Array.from(checkboxes).slice(1).every(c => c.checked);
          allCheckbox.checked = allChecked;
        });
      }
    });
  });
}
