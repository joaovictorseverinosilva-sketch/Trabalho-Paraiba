/**
 * NOTAVISION APP SHELL & UTILITIES
 * Espelhado das funcionalidades interativas do Farm-Fin
 * (Sidebar Drawer, Tema Claro/Escuro, Toast Notifications, ConfirmDialog, Table Sorter)
 */

(function () {
  'use strict';

  // --- 1. TOAST SYSTEM ---
  function createToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function (type, title, message, duration = 4000) {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 240ms ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  };

  // --- 2. CONFIRM DIALOG ---
  window.confirmDialog = function ({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', isDanger = false, onConfirm }) {
    let overlay = document.getElementById('globalConfirmModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'globalConfirmModal';
      overlay.className = 'crud-modal-overlay hidden';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="crud-modal-card" style="max-width: 440px;">
        <div class="crud-modal-header">
          <div class="crud-modal-title" style="font-size: 16px;">${title}</div>
          <button type="button" class="crud-modal-close" id="btnCloseConfirm"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="crud-modal-body" style="padding: 20px 24px; font-size: 14px; color: var(--text-secondary);">
          ${message}
        </div>
        <div class="crud-modal-footer">
          <button type="button" class="clay-btn clay-btn-outline" id="btnCancelConfirm">${cancelText}</button>
          <button type="button" class="clay-btn ${isDanger ? 'clay-btn-danger' : 'clay-btn-primary'}" id="btnOkConfirm">${confirmText}</button>
        </div>
      </div>
    `;

    overlay.classList.remove('hidden');

    const close = () => overlay.classList.add('hidden');
    document.getElementById('btnCloseConfirm').onclick = close;
    document.getElementById('btnCancelConfirm').onclick = close;
    document.getElementById('btnOkConfirm').onclick = () => {
      close();
      if (typeof onConfirm === 'function') onConfirm();
    };
  };

  // --- 3. THEME TOGGLE (DARK / LIGHT) ---
  function initTheme() {
    const saved = localStorage.getItem('NOTAVISION_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    const toggleBtn = document.getElementById('btnThemeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('NOTAVISION_THEME', next);
        updateThemeIcon(next);
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        icon.parentElement.title = 'Alternar para Modo Claro';
      } else {
        icon.className = 'fa-solid fa-moon';
        icon.parentElement.title = 'Alternar para Modo Noturno';
      }
    }
  }

  // --- 4. SIDEBAR RESPONSIVE DRAWER ---
  function initSidebar() {
    const toggleBtn = document.getElementById('btnMobileMenu');
    const sidebar = document.getElementById('appSidebar');
    const closeBtn = document.getElementById('btnSidebarClose');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }
  }

  // --- 5. LOGOUT ---
  function initLogout() {
    const logoutBtns = document.querySelectorAll('.btn-logout-trigger');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.confirmDialog({
          title: 'Sair do Sistema',
          message: 'Deseja realmente encerrar sua sessão no NotaVision?',
          confirmText: 'Sair',
          isDanger: true,
          onConfirm: () => {
            localStorage.removeItem('AUTH_TOKEN');
            sessionStorage.clear();
            window.location.href = '/login.html';
          }
        });
      });
    });
  }

  // --- 6. TABLE SORTING HELPER ---
  window.initTableSort = function (tableElement, onSortChange) {
    if (!tableElement) return;
    const headers = tableElement.querySelectorAll('th[data-sort]');
    headers.forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        const isAsc = th.classList.contains('sorted-asc');
        headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
        
        if (isAsc) {
          th.classList.add('sorted-desc');
          if (typeof onSortChange === 'function') onSortChange(field, 'desc');
        } else {
          th.classList.add('sorted-asc');
          if (typeof onSortChange === 'function') onSortChange(field, 'asc');
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initLogout();
  });
})();
