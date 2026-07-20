/* ========================================
   KARIRLINK - PORTAL TRACER STUDY
   Global Navigation & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initTabs();
  initDropdowns();
  initModals();
  initToast();
  initExpandCards();
  initActionMenus();
});

/* ========================================
   TABS
   ======================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetId = this.dataset.tab;
      
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      this.classList.add('active');
      
      // Hide all tab contents
      tabContents.forEach(content => content.classList.add('hidden'));
      // Show target content
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }
    });
  });
}

/* ========================================
   DROPDOWNS
   ======================================== */
function initDropdowns() {
  const dropdownBtns = document.querySelectorAll('.filter-btn');
  
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const menu = this.nextElementSibling;
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      
      menu.classList.toggle('show');
    });
  });

  // Dropdown item selection
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
      const dropdown = this.closest('.filter-dropdown');
      const btn = dropdown.querySelector('.filter-btn span');
      
      // Update button text
      btn.textContent = this.textContent;
      
      // Update active state
      dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      // Close dropdown
      dropdown.querySelector('.dropdown-menu').classList.remove('show');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  });
}

/* ========================================
   MODALS
   ======================================== */
function initModals() {
  // Open modal buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', function() {
      const modalId = this.dataset.modal;
      openModal(modalId);
    });
  });
  
  // Close modal buttons
  document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      closeModal(modal);
    });
  });
  
  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.show');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */
function initToast() {
  // Toast will be triggered by other actions
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (toast) {
    const messageEl = toast.querySelector('.toast-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* ========================================
   EXPANDABLE CARDS
   ======================================== */
function initExpandCards() {
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.kuesioner-card');
      const expandedContent = card.querySelector('.card-expanded');
      
      this.classList.toggle('expanded');
      card.classList.toggle('expanded');
      
      if (expandedContent) {
        expandedContent.classList.toggle('show');
      }
    });
  });
}

/* ========================================
   ACTION MENUS (3-dot menus)
   ======================================== */
function initActionMenus() {
  document.querySelectorAll('.action-dropdown .btn-icon').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const menu = this.nextElementSibling;
      
      // Close all other action menus
      document.querySelectorAll('.action-menu').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      
      menu.classList.toggle('show');
    });
  });
  
  // Close action menus when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.action-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  });
  
  // Action menu items
  document.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;
      const menu = this.closest('.action-menu');
      menu.classList.remove('show');
      
      // Handle different actions
      switch(action) {
        case 'kirim-ulang':
          openModal('modal-kirim-ulang');
          break;
        case 'salin-link':
          showToast('Link berhasil disalin');
          break;
        case 'reset-hasil':
          openModal('modal-reset-hasil');
          break;
        case 'buat-salinan':
          openModal('modal-salin');
          break;
        case 'hapus':
          openModal('modal-hapus');
          break;
      }
    });
  });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Link berhasil disalin');
  });
}

/* ========================================
   MULTISELECT DROPDOWN FUNCTIONS
   ======================================== */
function toggleMultiselect(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const allDropdowns = document.querySelectorAll('.multiselect-dropdown');
  
  // Close all other dropdowns
  allDropdowns.forEach(d => {
    if (d.id !== dropdownId) {
      d.classList.remove('open');
    }
  });
  
  dropdown.classList.toggle('open');
}

function filterMultiselect(input, dropdownId) {
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById(dropdownId);
  const options = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all)');
  
  options.forEach(option => {
    const text = option.querySelector('span').textContent.toLowerCase();
    if (text.includes(filter)) {
      option.style.display = 'flex';
    } else {
      option.style.display = 'none';
    }
  });
}

function updateMultiselectTags(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const tagsContainer = dropdown.querySelector('.multiselect-tags');
  const checkboxes = dropdown.querySelectorAll('.multiselect-options input[type="checkbox"]:checked:not([value="all"])');
  
  // Clear existing tags
  tagsContainer.innerHTML = '';
  
  if (checkboxes.length === 0) {
    tagsContainer.innerHTML = '<span class="multiselect-placeholder">Pilih Tahun Lulus</span>';
  } else {
    checkboxes.forEach(cb => {
      const tag = document.createElement('span');
      tag.className = 'multiselect-tag';
      tag.innerHTML = `<span>${cb.value}</span><button onclick="removeMultiselectTag(event, '${dropdownId}', '${cb.value}')">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

/* ========================================
   TAHUN LULUS MULTISELECT FUNCTIONS
   ======================================== */

// Tahun Lulus - Modal Kirim (Campaign)
function selectAllTahun(checkbox) {
  const dropdown = document.getElementById('tahun-dropdown');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]');
  
  if (checkbox.checked) {
    // Uncheck all other checkboxes
    otherCheckboxes.forEach(cb => cb.checked = false);
    updateTahunTags();
  }
}

function updateTahunTags() {
  const dropdown = document.getElementById('tahun-dropdown');
  const tagsContainer = dropdown.querySelector('.multiselect-tags');
  const allCheckbox = dropdown.querySelector('input[value="all"]');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]:checked');
  
  // Clear existing tags
  tagsContainer.innerHTML = '';
  
  // Check if "Pilih Semua" is selected
  if (allCheckbox && allCheckbox.checked) {
    const tag = document.createElement('span');
    tag.className = 'multiselect-tag';
    tag.innerHTML = `<span>Semua Tahun Lulus</span><button onclick="removeTahunTag(event, 'all')">×</button>`;
    tagsContainer.appendChild(tag);
    return;
  }
  
  // If individual tahun selected
  if (otherCheckboxes.length === 0) {
    tagsContainer.innerHTML = '<span class="multiselect-placeholder">Pilih Tahun Lulus</span>';
  } else {
    // Uncheck "Pilih Semua" if individual items are selected
    if (allCheckbox) allCheckbox.checked = false;
    
    otherCheckboxes.forEach(cb => {
      const tag = document.createElement('span');
      tag.className = 'multiselect-tag';
      tag.innerHTML = `<span>${cb.value}</span><button onclick="removeTahunTag(event, '${cb.value}')">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

function removeTahunTag(event, value) {
  event.stopPropagation();
  const dropdown = document.getElementById('tahun-dropdown');
  const checkbox = dropdown.querySelector(`input[value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateTahunTags();
  }
}

// Tahun Lulus - Modal Kirim (Campaign, versi lengkap)
function selectAllTahunLengkap(checkbox) {
  const dropdown = document.getElementById('tahun-dropdown-lengkap');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]');
  
  if (checkbox.checked) {
    otherCheckboxes.forEach(cb => cb.checked = false);
    updateTahunTagsLengkap();
  }
}

function updateTahunTagsLengkap() {
  const dropdown = document.getElementById('tahun-dropdown-lengkap');
  const tagsContainer = dropdown.querySelector('.multiselect-tags');
  const allCheckbox = dropdown.querySelector('input[value="all"]');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]:checked');
  
  tagsContainer.innerHTML = '';
  
  if (allCheckbox && allCheckbox.checked) {
    const tag = document.createElement('span');
    tag.className = 'multiselect-tag';
    tag.innerHTML = `<span>Semua Tahun Lulus</span><button onclick="removeTahunTagLengkap(event, 'all')">×</button>`;
    tagsContainer.appendChild(tag);
    return;
  }
  
  if (otherCheckboxes.length === 0) {
    tagsContainer.innerHTML = '<span class="multiselect-placeholder">Pilih Tahun Lulus</span>';
  } else {
    if (allCheckbox) allCheckbox.checked = false;
    
    otherCheckboxes.forEach(cb => {
      const tag = document.createElement('span');
      tag.className = 'multiselect-tag';
      tag.innerHTML = `<span>${cb.value}</span><button onclick="removeTahunTagLengkap(event, '${cb.value}')">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

function removeTahunTagLengkap(event, value) {
  event.stopPropagation();
  const dropdown = document.getElementById('tahun-dropdown-lengkap');
  const checkbox = dropdown.querySelector(`input[value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateTahunTagsLengkap();
  }
}

function removeMultiselectTag(event, dropdownId, value) {
  event.stopPropagation();
  const dropdown = document.getElementById(dropdownId);
  const checkbox = dropdown.querySelector(`input[value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateMultiselectTags(dropdownId);
  }
}

// Program Studi specific functions
function selectAllProdi(checkbox) {
  const dropdown = document.getElementById('prodi-dropdown');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]');
  
  if (checkbox.checked) {
    // Uncheck all other checkboxes
    otherCheckboxes.forEach(cb => cb.checked = false);
    updateProdiTags();
  }
}

function updateProdiTags() {
  const dropdown = document.getElementById('prodi-dropdown');
  const tagsContainer = dropdown.querySelector('.multiselect-tags');
  const allCheckbox = dropdown.querySelector('input[value="all"]');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]:checked');
  
  // Clear existing tags
  tagsContainer.innerHTML = '';
  
  // Check if "Semua Program Studi" is selected
  if (allCheckbox && allCheckbox.checked) {
    const tag = document.createElement('span');
    tag.className = 'multiselect-tag';
    tag.innerHTML = `<span>Semua Program Studi</span><button onclick="removeProdiTag(event, 'all')">×</button>`;
    tagsContainer.appendChild(tag);
    return;
  }
  
  // If individual prodi selected
  if (otherCheckboxes.length === 0) {
    tagsContainer.innerHTML = '<span class="multiselect-placeholder">Pilih Program Studi</span>';
  } else {
    // Uncheck "Semua Program Studi" if individual items are selected
    if (allCheckbox) allCheckbox.checked = false;
    
    otherCheckboxes.forEach(cb => {
      const label = cb.closest('.multiselect-option').querySelector('span').textContent;
      const tag = document.createElement('span');
      tag.className = 'multiselect-tag';
      tag.innerHTML = `<span>${label}</span><button onclick="removeProdiTag(event, '${cb.value}')">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

function removeProdiTag(event, value) {
  event.stopPropagation();
  const dropdown = document.getElementById('prodi-dropdown');
  const checkbox = dropdown.querySelector(`input[value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateProdiTags();
  }
}

// Modal Kirim Campaign functions
function selectAllProdiLengkap(checkbox) {
  const dropdown = document.getElementById('prodi-dropdown-lengkap');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]');
  
  if (checkbox.checked) {
    otherCheckboxes.forEach(cb => cb.checked = false);
    updateProdiTagsLengkap();
  }
}

function updateProdiTagsLengkap() {
  const dropdown = document.getElementById('prodi-dropdown-lengkap');
  const tagsContainer = dropdown.querySelector('.multiselect-tags');
  const allCheckbox = dropdown.querySelector('input[value="all"]');
  const otherCheckboxes = dropdown.querySelectorAll('.multiselect-option:not(.multiselect-option-all) input[type="checkbox"]:checked');
  
  tagsContainer.innerHTML = '';
  
  if (allCheckbox && allCheckbox.checked) {
    const tag = document.createElement('span');
    tag.className = 'multiselect-tag';
    tag.innerHTML = `<span>Semua Program Studi</span><button onclick="removeProdiTagLengkap(event, 'all')">×</button>`;
    tagsContainer.appendChild(tag);
    return;
  }
  
  if (otherCheckboxes.length === 0) {
    tagsContainer.innerHTML = '<span class="multiselect-placeholder">Pilih Program Studi</span>';
  } else {
    if (allCheckbox) allCheckbox.checked = false;
    
    otherCheckboxes.forEach(cb => {
      const label = cb.closest('.multiselect-option').querySelector('span').textContent;
      const tag = document.createElement('span');
      tag.className = 'multiselect-tag';
      tag.innerHTML = `<span>${label}</span><button onclick="removeProdiTagLengkap(event, '${cb.value}')">×</button>`;
      tagsContainer.appendChild(tag);
    });
  }
}

function removeProdiTagLengkap(event, value) {
  event.stopPropagation();
  const dropdown = document.getElementById('prodi-dropdown-lengkap');
  const checkbox = dropdown.querySelector(`input[value="${value}"]`);
  if (checkbox) {
    checkbox.checked = false;
    updateProdiTagsLengkap();
  }
}

// Close multiselect when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.multiselect-dropdown')) {
    document.querySelectorAll('.multiselect-dropdown').forEach(d => {
      d.classList.remove('open');
    });
  }
});

/* ========================================
   MODAL KIRIM KUESIONER FUNCTIONS
   ======================================== */
function toggleBatasAkhir(checkbox) {
  const formBatasAkhir = document.getElementById('form-batas-akhir');
  if (checkbox.checked) {
    formBatasAkhir.style.display = 'none';
    checkbox.closest('.form-checkbox-block').classList.add('checked');
  } else {
    formBatasAkhir.style.display = 'block';
    checkbox.closest('.form-checkbox-block').classList.remove('checked');
  }
}

function toggleBatasAkhirLengkap(checkbox) {
  const formBatasAkhir = document.getElementById('form-batas-akhir-lengkap');
  if (checkbox.checked) {
    formBatasAkhir.style.display = 'none';
    checkbox.closest('.form-checkbox-block').classList.add('checked');
  } else {
    formBatasAkhir.style.display = 'block';
    checkbox.closest('.form-checkbox-block').classList.remove('checked');
  }
}

function toggleKirimButton(checkbox) {
  const btnKirim = document.getElementById('btn-kirim-submit');
  if (checkbox.checked) {
    btnKirim.disabled = false;
    checkbox.closest('.form-checkbox-block').classList.add('checked');
  } else {
    btnKirim.disabled = true;
    checkbox.closest('.form-checkbox-block').classList.remove('checked');
  }
}

function toggleKirimButtonLengkap(checkbox) {
  const btnKirim = document.getElementById('btn-kirim-submit-lengkap');
  if (checkbox.checked) {
    btnKirim.disabled = false;
    checkbox.closest('.form-checkbox-block').classList.add('checked');
  } else {
    btnKirim.disabled = true;
    checkbox.closest('.form-checkbox-block').classList.remove('checked');
  }
}

/* ========================================
   TAB TRANSITION FUNCTIONS (SIMULATION)
   ======================================== */
function finalisasiKuesioner(cardId) {
  // Close modal
  const modal = document.querySelector('.modal-overlay.show');
  if (modal) {
    closeModal(modal);
  }
  
  // Show toast
  showToast('Kuesioner berhasil difinalisasi dan dipindahkan ke tab Siap Kirim');
  
  // Simulate moving card to Siap Kirim tab
  // In real implementation, this would be handled by backend
  setTimeout(() => {
    // Switch to Siap Kirim tab
    const siapKirimTab = document.querySelector('[data-tab="tab-siap-kirim"]');
    if (siapKirimTab) {
      siapKirimTab.click();
    }
  }, 1500);
}

function kirimKuesioner() {
  // Close modal
  const modal = document.getElementById('modal-kirim');
  if (modal) {
    closeModal(modal);
  }
  
  // Show toast
  showToast('Kuesioner berhasil dikirim dan dipindahkan ke tab Terkirim');
  
  // Simulate moving card to Terkirim tab
  setTimeout(() => {
    const terkirimTab = document.querySelector('[data-tab="tab-terkirim"]');
    if (terkirimTab) {
      terkirimTab.click();
    }
  }, 1500);
}

function kirimKuesionerLengkap() {
  // Close modal
  const modal = document.getElementById('modal-kirim-lengkap');
  if (modal) {
    closeModal(modal);
  }
  
  // Show toast
  showToast('Kuesioner berhasil dikirim dan dipindahkan ke tab Terkirim');
  
  // Simulate moving card to Terkirim tab
  setTimeout(() => {
    const terkirimTab = document.querySelector('[data-tab="tab-terkirim"]');
    if (terkirimTab) {
      terkirimTab.click();
    }
  }, 1500);
}


/* ========================================
   DATEPICKER FUNCTIONS (Bahasa Indonesia)
   ======================================== */

// Indonesian month names
const bulanIndonesia = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Datepicker state for modal-kirim
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

// Datepicker state for modal-kirim-lengkap
let currentMonthLengkap = new Date().getMonth();
let currentYearLengkap = new Date().getFullYear();
let selectedDateLengkap = null;

// Toggle datepicker
function toggleDatepicker(wrapperId) {
  const wrapper = document.getElementById(wrapperId);
  const allWrappers = document.querySelectorAll('.datepicker-wrapper');
  
  // Close all other datepickers
  allWrappers.forEach(w => {
    if (w.id !== wrapperId) {
      w.classList.remove('open');
    }
  });
  
  wrapper.classList.toggle('open');
  
  if (wrapper.classList.contains('open')) {
    if (wrapperId === 'datepicker-wrapper') {
      renderCalendar();
    } else {
      renderCalendarLengkap();
    }
  }
}

// Render calendar for modal-kirim
function renderCalendar() {
  const daysContainer = document.getElementById('datepicker-days');
  const monthYearLabel = document.getElementById('datepicker-month-year');
  
  if (!daysContainer || !monthYearLabel) return;
  
  monthYearLabel.textContent = `${bulanIndonesia[currentMonth]} ${currentYear}`;
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
  const daysInMonth = lastDay.getDate();
  
  // Get previous month days
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  
  let html = '';
  
  // Previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    html += `<button type="button" class="datepicker-day other-month" onclick="selectDatePrevMonth(${day})">${day}</button>`;
  }
  
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    let classes = 'datepicker-day';
    
    if (today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      classes += ' today';
    }
    
    if (selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
      classes += ' selected';
    }
    
    html += `<button type="button" class="${classes}" onclick="selectDate(${i})">${i}</button>`;
  }
  
  // Next month days
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const nextMonthDays = totalCells - startDay - daysInMonth;
  for (let i = 1; i <= nextMonthDays; i++) {
    html += `<button type="button" class="datepicker-day other-month" onclick="selectDateNextMonth(${i})">${i}</button>`;
  }
  
  daysContainer.innerHTML = html;
}

// Change month for modal-kirim
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

// Select date for modal-kirim
function selectDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  updateDatepickerValue();
  document.getElementById('datepicker-wrapper').classList.remove('open');
}

function selectDatePrevMonth(day) {
  changeMonth(-1);
  selectDate(day);
}

function selectDateNextMonth(day) {
  changeMonth(1);
  selectDate(day);
}

function selectToday() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  selectedDate = today;
  updateDatepickerValue();
  document.getElementById('datepicker-wrapper').classList.remove('open');
}

function clearDatepicker() {
  selectedDate = null;
  const valueEl = document.getElementById('datepicker-value');
  valueEl.textContent = 'Atur batas akhir pengisian kuesioner';
  valueEl.classList.remove('has-value');
  document.getElementById('datepicker-wrapper').classList.remove('open');
}

function updateDatepickerValue() {
  const valueEl = document.getElementById('datepicker-value');
  if (selectedDate) {
    const day = selectedDate.getDate();
    const month = bulanIndonesia[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    valueEl.textContent = `${day} ${month} ${year}`;
    valueEl.classList.add('has-value');
  }
  renderCalendar();
}

// ========== Datepicker for modal-kirim-lengkap ==========

function renderCalendarLengkap() {
  const daysContainer = document.getElementById('datepicker-days-lengkap');
  const monthYearLabel = document.getElementById('datepicker-month-year-lengkap');
  
  if (!daysContainer || !monthYearLabel) return;
  
  monthYearLabel.textContent = `${bulanIndonesia[currentMonthLengkap]} ${currentYearLengkap}`;
  
  const firstDay = new Date(currentYearLengkap, currentMonthLengkap, 1);
  const lastDay = new Date(currentYearLengkap, currentMonthLengkap + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();
  
  const prevMonthLastDay = new Date(currentYearLengkap, currentMonthLengkap, 0).getDate();
  
  let html = '';
  
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    html += `<button type="button" class="datepicker-day other-month" onclick="selectDatePrevMonthLengkap(${day})">${day}</button>`;
  }
  
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    let classes = 'datepicker-day';
    
    if (today.getDate() === i && today.getMonth() === currentMonthLengkap && today.getFullYear() === currentYearLengkap) {
      classes += ' today';
    }
    
    if (selectedDateLengkap && selectedDateLengkap.getDate() === i && selectedDateLengkap.getMonth() === currentMonthLengkap && selectedDateLengkap.getFullYear() === currentYearLengkap) {
      classes += ' selected';
    }
    
    html += `<button type="button" class="${classes}" onclick="selectDateLengkap(${i})">${i}</button>`;
  }
  
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const nextMonthDays = totalCells - startDay - daysInMonth;
  for (let i = 1; i <= nextMonthDays; i++) {
    html += `<button type="button" class="datepicker-day other-month" onclick="selectDateNextMonthLengkap(${i})">${i}</button>`;
  }
  
  daysContainer.innerHTML = html;
}

function changeMonthLengkap(delta) {
  currentMonthLengkap += delta;
  if (currentMonthLengkap > 11) {
    currentMonthLengkap = 0;
    currentYearLengkap++;
  } else if (currentMonthLengkap < 0) {
    currentMonthLengkap = 11;
    currentYearLengkap--;
  }
  renderCalendarLengkap();
}

function selectDateLengkap(day) {
  selectedDateLengkap = new Date(currentYearLengkap, currentMonthLengkap, day);
  updateDatepickerValueLengkap();
  document.getElementById('datepicker-wrapper-lengkap').classList.remove('open');
}

function selectDatePrevMonthLengkap(day) {
  changeMonthLengkap(-1);
  selectDateLengkap(day);
}

function selectDateNextMonthLengkap(day) {
  changeMonthLengkap(1);
  selectDateLengkap(day);
}

function selectTodayLengkap() {
  const today = new Date();
  currentMonthLengkap = today.getMonth();
  currentYearLengkap = today.getFullYear();
  selectedDateLengkap = today;
  updateDatepickerValueLengkap();
  document.getElementById('datepicker-wrapper-lengkap').classList.remove('open');
}

function clearDatepickerLengkap() {
  selectedDateLengkap = null;
  const valueEl = document.getElementById('datepicker-value-lengkap');
  valueEl.textContent = 'Atur batas akhir pengisian kuesioner';
  valueEl.classList.remove('has-value');
  document.getElementById('datepicker-wrapper-lengkap').classList.remove('open');
}

function updateDatepickerValueLengkap() {
  const valueEl = document.getElementById('datepicker-value-lengkap');
  if (selectedDateLengkap) {
    const day = selectedDateLengkap.getDate();
    const month = bulanIndonesia[selectedDateLengkap.getMonth()];
    const year = selectedDateLengkap.getFullYear();
    valueEl.textContent = `${day} ${month} ${year}`;
    valueEl.classList.add('has-value');
  }
  renderCalendarLengkap();
}

// Close datepicker when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.datepicker-wrapper')) {
    document.querySelectorAll('.datepicker-wrapper').forEach(w => {
      w.classList.remove('open');
    });
  }
});
