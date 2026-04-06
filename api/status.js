const fetch = require('node-fetch');

const BRANDS = [
  { id: 'all', name: 'All Brands', url: 'status.php?brand=all' },
  { id: 'AstroZoom', name: 'AstroZoom', url: 'status.php?brand=AstroZoom' },
  { id: 'Athena', name: 'Athena', url: 'status.php?brand=Athena' },
  { id: 'Atlas', name: 'Atlas', url: 'status.php?brand=Atlas' },
  { id: 'Forge', name: 'Forge', url: 'status.php?brand=Forge' },
  { id: 'Hero', name: 'Hero', url: 'status.php?brand=Hero' },
  { id: 'Kane', name: 'Kane', url: 'status.php?brand=Kane' },
  { id: 'Liquid', name: 'Liquid', url: 'status.php?brand=Liquid' },
  { id: 'Pulse', name: 'Pulse', url: 'status.php?brand=Pulse' },
  { id: 'Vex', name: 'Vex', url: 'status.php?brand=Vex' },
  { id: 'Viper', name: 'Viper', url: 'status.php?brand=Viper' },
  { id: 'Volt', name: 'Volt', url: 'status.php?brand=Volt' }
];

let statusCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 30000;

async function fetchBrandStatus(brand) {
  const base = 'https://support.cosmotickets.com/status/';
  const loginUrl = base + brand.url;
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  try {
    let sessionId = '';

    const initRes = await fetch(loginUrl, {
      headers: { 'User-Agent': userAgent },
      redirect: 'manual'
    });
    const initCookie = initRes.headers.get('set-cookie') || '';
    const initMatch = initCookie.match(/PHPSESSID=([^;]+)/);
    if (initMatch) sessionId = initMatch[1];

    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'User-Agent': userAgent,
        'Referer': loginUrl,
        'Origin': 'https://support.cosmotickets.com'
      },
      body: 'password=support',
      redirect: 'manual'
    });

    const loginSetCookie = loginRes.headers.get('set-cookie') || '';
    const loginMatch = loginSetCookie.match(/PHPSESSID=([^;]+)/);
    if (loginMatch) sessionId = loginMatch[1];
    const location = loginRes.headers.get('location') || '';

    const headers = {
      'Cookie': `PHPSESSID=${sessionId}`,
      'User-Agent': userAgent,
      'Referer': loginUrl
    };

    const urlsToTry = [];
    if (location) {
      const fullLoc = location.startsWith('http') ? location : base + location.replace(/^\//, '');
      urlsToTry.push(fullLoc);
    }
    urlsToTry.push(loginUrl);
    urlsToTry.push(base + 'index.php');
    urlsToTry.push(`${base}status.php`);

    let html = '';
    for (const url of urlsToTry) {
      try {
        const r = await fetch(url, { headers });
        const t = await r.text();
        if (!t.includes('Status Login') && t.length > 1000) {
          html = t;
          break;
        }
        if (t.length > html.length) html = t;
      } catch(e) { }
    }

    if (!html || html.includes('Status Login') || html.length < 500) {
      return { brand: brand.name, status: 'unknown', products: [], error: 'Auth failed' };
    }

    const products = parseStatusHtml(html, brand.name);
    const overallStatus = determineOverallStatus(products);
    
    return { brand: brand.name, status: overallStatus, products, error: null };
  } catch (err) {
    return { brand: brand.name, status: 'error', products: [], error: err.message };
  }
}

function determineOverallStatus(products) {
  if (products.length === 0) return 'unknown';
  const hasUpdating = products.some(p => p.status.toLowerCase().includes('updat'));
  const hasTesting = products.some(p => p.status.toLowerCase().includes('test'));
  const hasOffline = products.some(p => p.status.toLowerCase().includes('offline') || p.status.toLowerCase().includes('down'));
  const hasMaintenance = products.some(p => p.status.toLowerCase().includes('maintenance'));
  
  if (hasUpdating) return 'updating';
  if (hasTesting) return 'testing';
  if (hasMaintenance) return 'maintenance';
  if (hasOffline) return 'offline';
  return 'online';
}

function parseStatusHtml(html, brandName) {
  const products = [];
  const clean = (str) => str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

  const tableRows = html.matchAll(/<tr[^>]*>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi);
  for (const row of tableRows) {
    const name = clean(row[1]);
    const statusRaw = clean(row[2]);
    const status = normalizeStatus(statusRaw);
    if (name && status && name.length < 50) {
      products.push({ name, status });
    }
  }

  if (products.length === 0) {
    const divItems = html.matchAll(/<div[^>]*class="[^"]*(?:product|item|status)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
    for (const item of divItems) {
      const text = clean(item[1]);
      if (text.length > 3 && text.length < 100) {
        const statusKeywords = ['online', 'offline', 'updating', 'testing', 'maintenance', 'down', 'operational'];
        const lowerText = text.toLowerCase();
        for (const kw of statusKeywords) {
          if (lowerText.includes(kw)) {
            products.push({ name: text.split(kw)[0].trim() || brandName, status: normalizeStatus(kw) });
            break;
          }
        }
      }
    }
  }

  return products;
}

function normalizeStatus(status) {
  const s = status.toLowerCase();
  if (s.includes('updat')) return 'Updating';
  if (s.includes('test')) return 'Testing';
  if (s.includes('online') || s.includes('operational') || s.includes('working')) return 'Online';
  if (s.includes('offline') || s.includes('down') || s.includes('unavail')) return 'Offline';
  if (s.includes('maintenance')) return 'Maintenance';
  return status || 'Unknown';
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  
  // Check cache
  if (statusCache.data && (now - statusCache.timestamp) < CACHE_DURATION) {
    return res.json(statusCache.data);
  }

  try {
    const results = await Promise.all(BRANDS.map(brand => fetchBrandStatus(brand)));
    
    const response = {
      success: true,
      brands: results,
      lastUpdated: new Date().toISOString(),
      nextUpdate: new Date(now + CACHE_DURATION).toISOString()
    };

    statusCache = { data: response, timestamp: now };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
