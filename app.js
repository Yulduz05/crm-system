/**
 * APEXCRM ENTERPRISE INTERACTIVE LOGIC
 * Boshqaruv paneli, filtrlar, modal va dinamik ma'lumotlar bilan ishlash
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Elementlarni tanlab olish
  // ==========================================
  const addModal = document.getElementById('addClientModal');
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const closeAddModalBtn = document.getElementById('closeAddModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const addClientForm = document.getElementById('addClientForm');

  const dealsTableBody = document.getElementById('dealsTableBody');
  const tableRowsCount = document.getElementById('tableRowsCount');
  const tableSearchInput = document.getElementById('tableSearchInput');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const agentFilterSelect = document.getElementById('agentFilterSelect');
  const filterBtns = document.querySelectorAll('.t-filter-btn');

  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const exportBtn = document.getElementById('exportBtn');
  const toast = document.getElementById('crmToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');

  const chartPoints = document.querySelectorAll('.chart-point-group');
  const chartTooltip = document.getElementById('chartTooltip');
  const ttMonth = document.getElementById('ttMonth');
  const ttAmount = document.getElementById('ttAmount');

  // ==========================================
  // 2. Yangi Mijoz Modalini Boshqarish
  // ==========================================
  function openModal() {
    addModal.classList.add('show');
    document.getElementById('clientFullName').focus();
  }

  function closeModal() {
    addModal.classList.remove('show');
    addClientForm.reset();
  }

  openAddModalBtn.addEventListener('click', openModal);
  closeAddModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  // Modal tashqarisiga bosilganda yopish
  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
      closeModal();
    }
  });

  // ESC tugmasi orqali yopish
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addModal.classList.contains('show')) {
      closeModal();
    }
    // Ctrl + K orqali qidiruvga o'tish
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      globalSearchInput.focus();
    }
  });

  // ==========================================
  // 3. Yangi Mijoz Qo'shish (Form submit)
  // ==========================================
  addClientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('clientFullName').value.trim();
    const company = document.getElementById('companyName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const email = document.getElementById('clientEmail').value.trim() || 'aloqa@' + company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.uz';
    const amount = Number(document.getElementById('dealAmount').value) || 0;
    const stage = document.getElementById('dealStage').value;
    const agent = document.getElementById('assignedAgent').value;
    const category = document.getElementById('dealCategory').value.trim() || 'Korporativ Litsenziya';

    // Status pill va dot klasslarini aniqlash
    let statusPillClass = 'status-lead';
    if (stage === 'Shartnoma') statusPillClass = 'status-contract';
    else if (stage === 'Yutildi') statusPillClass = 'status-won';
    else if (stage === 'Muzokarada') statusPillClass = 'status-negotiation';

    // Formatlangan summa
    const formattedAmount = '$' + amount.toLocaleString('en-US');

    // Kompaniya uchun 2 harfli avatar
    const initials = company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'KL';

    // Menejer avatari
    let agentAvatarHtml = `<div class="avatar-letter j-avatar">${agent[0]}</div>`;
    if (agent.includes('Alisher')) {
      agentAvatarHtml = `<img src="assets/images/manager1.jpg" alt="${agent}" class="agent-avatar-mini">`;
    } else if (agent.includes('Malika')) {
      agentAvatarHtml = `<img src="assets/images/manager2.jpg" alt="${agent}" class="agent-avatar-mini">`;
    }

    // Yangi satr HTML
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-status', stage);
    newRow.setAttribute('data-agent', agent);
    newRow.style.backgroundColor = 'rgba(99, 102, 241, 0.12)';
    newRow.style.transition = 'background-color 1.5s ease';

    newRow.innerHTML = `
      <td>
        <div class="client-cell">
          <div class="client-logo-avatar custom-bg">${initials}</div>
          <div class="client-text">
            <span class="client-name">${fullName}</span>
            <span class="company-name">${company}</span>
          </div>
        </div>
      </td>
      <td>
        <div class="contact-info">
          <span class="contact-phone">${phone}</span>
          <span class="contact-email">${email}</span>
        </div>
      </td>
      <td>
        <div class="deal-value-cell">
          <span class="amount-number green-text">${formattedAmount}</span>
          <span class="deal-type-badge">${category}</span>
        </div>
      </td>
      <td>
        <span class="status-pill ${statusPillClass}">
          <span class="status-dot"></span>
          ${stage}
        </span>
      </td>
      <td>
        <div class="agent-chip">
          ${agentAvatarHtml}
          <span>${agent}</span>
        </div>
      </td>
      <td>
        <div class="activity-time">
          <span class="time-main">Hozirgina</span>
          <span class="time-sub">Yangi kiritildi</span>
        </div>
      </td>
      <td class="text-right">
        <div class="row-actions">
          <button class="action-btn call-action" title="Qo'ng'iroq qilish">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </button>
          <button class="action-btn edit-action" title="Tahrirlash">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn delete-action" title="O'chirish">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `;

    // Jadval boshiga qo'shish
    dealsTableBody.insertBefore(newRow, dealsTableBody.firstChild);

    // Qayta amallarni ulash
    bindRowEvents(newRow);

    // Rangini muloyim tiklash
    setTimeout(() => {
      newRow.style.backgroundColor = 'transparent';
    }, 1200);

    closeModal();
    updateRowCount();
    showToast('Mijoz muvaffaqiyatli saqlandi!', `${company} (${fullName}) tizimga muvaffaqiyatli kiritildi.`);
  });

  // ==========================================
  // 4. Jadval Qidiruvi va Filtrlash
  // ==========================================
  let currentStatusFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatusFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', applyFilters);
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      if (tableSearchInput) {
        tableSearchInput.value = e.target.value;
      }
      applyFilters();
    });
  }

  if (agentFilterSelect) {
    agentFilterSelect.addEventListener('change', applyFilters);
  }

  function applyFilters() {
    const searchText = (tableSearchInput ? tableSearchInput.value : '').toLowerCase().trim();
    const selectedAgent = agentFilterSelect ? agentFilterSelect.value : '';
    const rows = dealsTableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const rowStatus = row.getAttribute('data-status') || '';
      const rowAgent = row.getAttribute('data-agent') || '';
      const rowText = row.innerText.toLowerCase();

      // Status filtri
      const statusMatch = (currentStatusFilter === 'all') || (rowStatus === currentStatusFilter);
      // Menejer filtri
      const agentMatch = !selectedAgent || (rowAgent === selectedAgent);
      // Matn qidiruvi
      const searchMatch = !searchText || rowText.includes(searchText);

      if (statusMatch && agentMatch && searchMatch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (tableRowsCount) {
      tableRowsCount.innerText = visibleCount;
    }
  }

  function updateRowCount() {
    const rows = dealsTableBody.querySelectorAll('tr');
    let visibleCount = 0;
    rows.forEach(r => {
      if (r.style.display !== 'none') visibleCount++;
    });
    if (tableRowsCount) {
      tableRowsCount.innerText = visibleCount;
    }
  }

  // ==========================================
  // 5. Jadval Qator Amallari (O'chirish, Qo'ng'iroq)
  // ==========================================
  function bindRowEvents(row) {
    const deleteBtn = row.querySelector('.delete-action');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        const clientName = row.querySelector('.client-name')?.innerText || 'Mijoz';
        if (confirm(`Haqiqatan ham "${clientName}" bitimini o'chirmoqchimisiz?`)) {
          row.style.opacity = '0';
          row.style.transform = 'scale(0.95)';
          row.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            row.remove();
            updateRowCount();
            showToast('Bitim o\'chirildi', `${clientName} tizimdan olib tashlandi.`);
          }, 300);
        }
      });
    }

    const callBtn = row.querySelector('.call-action');
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        const phone = row.querySelector('.contact-phone')?.innerText || '';
        const name = row.querySelector('.client-name')?.innerText || '';
        showToast('Qo\'ng\'iroq ulanmoqda...', `${name} (${phone}) raqamiga IP-telefoniya orqali qo'ng'iroq yo'naltirildi.`);
      });
    }

    const editBtn = row.querySelector('.edit-action');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const name = row.querySelector('.client-name')?.innerText || '';
        const company = row.querySelector('.company-name')?.innerText || '';
        showToast('Tahrirlash rejimi', `"${company} - ${name}" ma'lumotlari tahrirlash uchun ochilmoqda.`);
      });
    }
  }

  // Barcha mavjud satrlarga ulash
  document.querySelectorAll('#dealsTableBody tr').forEach(bindRowEvents);

  // ==========================================
  // 6. Bildirishnomalar Paneli Toggle
  // ==========================================
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove('show');
      }
    });

    const markReadBtn = notifDropdown.querySelector('.mark-all-read');
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        notifDropdown.querySelectorAll('.notif-item').forEach(item => {
          item.classList.remove('unread');
        });
        const badge = notifBtn.querySelector('.notif-count-badge');
        if (badge) badge.style.display = 'none';
        showToast('Bildirishnomalar', 'Barcha bildirishnomalar o\'qildi deb belgilandi.');
      });
    }
  }

  // ==========================================
  // 7. Eksport (CSV Generatsiya va Yuklab Olish)
  // ==========================================
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rows = dealsTableBody.querySelectorAll('tr');
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Mijoz,Kompaniya,Telefon,Email,Summa,Bosqich,Menejer\n';

      rows.forEach(row => {
        if (row.style.display !== 'none') {
          const clientName = row.querySelector('.client-name')?.innerText || '';
          const company = row.querySelector('.company-name')?.innerText || '';
          const phone = row.querySelector('.contact-phone')?.innerText || '';
          const email = row.querySelector('.contact-email')?.innerText || '';
          const amount = row.querySelector('.amount-number')?.innerText.replace('$', '').replace(',', '') || '';
          const status = row.getAttribute('data-status') || '';
          const agent = row.getAttribute('data-agent') || '';

          csvContent += `"${clientName}","${company}","${phone}","${email}","${amount}","${status}","${agent}"\n`;
        }
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ApexCRM_Mijozlar_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Eksport muvaffaqiyatli!', 'Mijozlar ro\'yxati Excel (CSV) fayl sifatida yuklab olindi.');
    });
  }

  // ==========================================
  // 8. Grafik Tooltip Interaktivligi
  // ==========================================
  chartPoints.forEach(pointGroup => {
    pointGroup.addEventListener('mouseenter', (e) => {
      const month = pointGroup.getAttribute('data-month');
      const val = pointGroup.getAttribute('data-val');

      if (ttMonth) ttMonth.innerText = month + ' 2026';
      if (ttAmount) ttAmount.innerText = val;

      chartTooltip.style.opacity = '1';
      chartTooltip.style.transform = 'translateY(0)';
    });
  });

  // ==========================================
  // 9. Toast Xabar Ko'rsatish Yordamchisi
  // ==========================================
  let toastTimer;
  function showToast(title, desc) {
    if (!toast) return;
    toastTitle.innerText = title;
    toastDesc.innerText = desc;

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Sahifa birinchi ochilganda kichik xush kelibsiz xabari
  setTimeout(() => {
    showToast('ApexCRM tizimiga xush kelibsiz!', 'Barcha ma\'lumotlar yangilandi va sinxronlashdi.');
  }, 800);

});
