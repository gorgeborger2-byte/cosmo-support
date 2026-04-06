(async function initAuthUI() {
  try {
    const resp = await cosmoFetch('/api/auth/me');
    const data = await resp.json();
    if (!data || !data.authenticated) {
      window.location.href = 'index.html';
      return;
    }

    if (data.canAdmin) {
      document.querySelectorAll('.admin-only').forEach((el) => {
        el.style.display = '';
      });
    }

    document.querySelectorAll('[data-logout]').forEach((el) => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await cosmoFetch('/api/auth/logout', { method: 'POST' });
        } catch (_) {}
        window.location.href = 'index.html';
      });
    });
  } catch (_) {
    window.location.href = 'index.html';
  }
})();
