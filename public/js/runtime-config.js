(function initRuntimeConfig() {
  var storedBase = '';
  try {
    storedBase = localStorage.getItem('COSMO_API_BASE') || '';
  } catch (_) {}

  var defaultHostedApiBase = '';
  if (window.location.hostname === 'gorgeborger2-byte.github.io') {
    defaultHostedApiBase = 'https://reported-becomes-compressed-face.trycloudflare.com';
  }

  var apiBase = window.COSMO_API_BASE || storedBase || defaultHostedApiBase || '';
  var host = window.location.hostname;

  if (!apiBase && (host === 'localhost' || host === '127.0.0.1')) {
    apiBase = '';
  }

  function normalizeBase(base) {
    if (!base) return '';
    return String(base).replace(/\/$/, '');
  }

  window.COSMO_RUNTIME = {
    apiBase: normalizeBase(apiBase)
  };

  window.cosmoApiUrl = function cosmoApiUrl(path) {
    if (/^https?:\/\//i.test(path)) return path;
    var base = window.COSMO_RUNTIME.apiBase;
    return base ? (base + path) : path;
  };

  window.cosmoFetch = function cosmoFetch(path, options) {
    var opts = options || {};
    if (!Object.prototype.hasOwnProperty.call(opts, 'credentials')) {
      opts.credentials = 'include';
    }
    return fetch(window.cosmoApiUrl(path), opts);
  };
})();
