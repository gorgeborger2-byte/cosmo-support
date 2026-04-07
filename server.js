const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const STATUS_PASSWORD = 'support';
const ROLES = ['support', 'trail support', 'head support', 'Owner', 'msd'];
const ADMIN_ROLES = new Set(['Owner', 'msd']);

const SESSION_COOKIE = 'cosmo_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const sessions = new Map();
const COOKIE_SECURE = process.env.COOKIE_SECURE === '1';
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  }

  const localhostAllowed = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  const explicitAllowed = CORS_ORIGINS.includes(origin);

  if (localhostAllowed || explicitAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

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
let sessionCookie = '';
const CACHE_DURATION = 60000;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, user) {
  if (!user || !user.salt || !user.hash) return false;
  const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.hash, 'hex'));
}

function loadUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    const owner = hashPassword('owner123!');
    const msd = hashPassword('msd123!');
    const seed = {
      users: [
        { username: 'owner', role: 'Owner', salt: owner.salt, hash: owner.hash },
        { username: 'msd', role: 'msd', salt: msd.salt, hash: msd.hash }
      ]
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(seed, null, 2), 'utf8');
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !Array.isArray(parsed.users)) return { users: [] };
    return parsed;
  } catch (_) {
    return { users: [] };
  }
}

function saveUsers(db) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function publicUser(user) {
  return { username: user.username, role: user.role };
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((chunk) => {
    const [k, ...v] = chunk.trim().split('=');
    if (!k) return;
    out[k] = decodeURIComponent(v.join('='));
  });
  return out;
}

function setSessionCookie(res, token) {
  const sameSite = COOKIE_SECURE ? 'None' : 'Lax';
  const secure = COOKIE_SECURE ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`);
}

function clearSessionCookie(res) {
  const sameSite = COOKIE_SECURE ? 'None' : 'Lax';
  const secure = COOKIE_SECURE ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=0${secure}`);
}

function createSession(username) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { username, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
}

function getSessionUser(req) {
  cleanupSessions();
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token || !sessions.has(token)) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  const db = loadUsers();
  return db.users.find((u) => u.username === session.username) || null;
}

app.use((req, _res, next) => {
  req.user = getSessionUser(req);
  next();
});

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  if (!ADMIN_ROLES.has(req.user.role)) return res.status(403).json({ success: false, error: 'Forbidden' });
  next();
}

// Block direct HTML access when not authenticated (except login page)
app.use((req, res, next) => {
  if (!req.path.endsWith('.html')) return next();
  if (req.path === '/index.html') return next();
  if (!req.user) return res.redirect('/');
  if (req.path === '/admin.html' && !ADMIN_ROLES.has(req.user.role)) return res.redirect('/dashboard');
  next();
});

app.use(express.static(PUBLIC_DIR));

// Auth API
app.post('/api/auth/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  const db = loadUsers();
  const user = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !verifyPassword(password, user)) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = createSession(user.username);
  setSessionCookie(res, token);
  return res.json({ success: true, user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (token) sessions.delete(token);
  clearSessionCookie(res);
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.json({ success: true, authenticated: false });
  res.json({ success: true, authenticated: true, user: publicUser(req.user), canAdmin: ADMIN_ROLES.has(req.user.role) });
});

app.get('/api/health', async (_req, res) => {
  const now = Date.now();
  const statusCacheAgeMs = statusCache.timestamp ? (now - statusCache.timestamp) : null;
  let scraperReachable = false;
  let scraperLatencyMs = null;

  const started = Date.now();
  try {
    const r = await fetch('http://localhost:5050/api/status', { timeout: 4000 });
    if (r.ok) scraperReachable = true;
    scraperLatencyMs = Date.now() - started;
  } catch (_) {
    scraperReachable = false;
    scraperLatencyMs = Date.now() - started;
  }

  const payload = {
    success: true,
    service: 'cosmo-support-web',
    uptimeSec: Math.floor(process.uptime()),
    sessions: sessions.size,
    nodeStatus: 'ok',
    scraper: {
      reachable: scraperReachable,
      latencyMs: scraperLatencyMs
    },
    statusCache: {
      hasData: !!statusCache.data,
      ageMs: statusCacheAgeMs,
      stale: statusCacheAgeMs === null ? true : statusCacheAgeMs > CACHE_DURATION * 2,
      ttlMs: CACHE_DURATION
    },
    time: new Date().toISOString()
  };

  res.json(payload);
});

// Admin API
app.get('/api/admin/users', requireAdmin, (_req, res) => {
  const db = loadUsers();
  res.json({ success: true, users: db.users.map(publicUser), roles: ROLES });
});

app.post('/api/admin/users', requireAdmin, (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const role = String(req.body.role || '').trim();

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, error: 'Username, password and role are required' });
  }
  if (!ROLES.includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  const db = loadUsers();
  if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ success: false, error: 'User already exists' });
  }

  const p = hashPassword(password);
  db.users.push({ username, role, salt: p.salt, hash: p.hash });
  saveUsers(db);
  res.json({ success: true, user: { username, role } });
});

app.patch('/api/admin/users/:username', requireAdmin, (req, res) => {
  const usernameParam = String(req.params.username || '').trim();
  const newRole = req.body.role ? String(req.body.role).trim() : null;
  const newPassword = req.body.password ? String(req.body.password) : null;

  const db = loadUsers();
  const user = db.users.find((u) => u.username.toLowerCase() === usernameParam.toLowerCase());
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  if (newRole !== null) {
    if (!ROLES.includes(newRole)) return res.status(400).json({ success: false, error: 'Invalid role' });
    user.role = newRole;
  }

  if (newPassword !== null) {
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters' });
    }
    const p = hashPassword(newPassword);
    user.salt = p.salt;
    user.hash = p.hash;
  }

  saveUsers(db);
  res.json({ success: true, user: publicUser(user) });
});

app.delete('/api/admin/users/:username', requireAdmin, (req, res) => {
  const usernameParam = String(req.params.username || '').trim();
  const currentUsername = req.user.username.toLowerCase();
  if (usernameParam.toLowerCase() === currentUsername) {
    return res.status(400).json({ success: false, error: 'You cannot remove your own account' });
  }

  const db = loadUsers();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.username.toLowerCase() !== usernameParam.toLowerCase());
  if (db.users.length === before) return res.status(404).json({ success: false, error: 'User not found' });
  saveUsers(db);
  res.json({ success: true });
});

async function login() {
  const base = 'https://support.cosmotickets.com/status/';
  const loginUrl = base + 'status.php?brand=all';

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  try {
    const initRes = await fetch(loginUrl, { headers, redirect: 'follow' });

    let cookies = [];
    const setCookie = initRes.headers.get('set-cookie');
    if (setCookie) {
      setCookie.split(',').forEach((c) => {
        const match = c.trim().match(/PHPSESSID=([^;]+)/);
        if (match) cookies.push(`PHPSESSID=${match[1]}`);
      });
    }

    let html = await initRes.text();
    if (html.includes('Status Login') || html.includes('login-box')) {
      const cookieStr = cookies.join('; ');
      const loginRes = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookieStr,
          'Referer': loginUrl,
          'Origin': 'https://support.cosmotickets.com'
        },
        body: `password=${STATUS_PASSWORD}`,
        redirect: 'follow'
      });

      const loginSetCookie = loginRes.headers.get('set-cookie');
      if (loginSetCookie) {
        loginSetCookie.split(',').forEach((c) => {
          const match = c.trim().match(/PHPSESSID=([^;]+)/);
          if (match) cookies.push(`PHPSESSID=${match[1]}`);
        });
      }
      html = await loginRes.text();
      if (html.includes('Status Login') || html.includes('login-box')) return null;
      sessionCookie = cookies.join('; ');
      return sessionCookie;
    }

    sessionCookie = cookies.join('; ');
    return sessionCookie;
  } catch (_err) {
    return null;
  }
}

function determineStatus(products) {
  if (products.length === 0) return 'Unknown';
  const statuses = products.map((p) => p.status.toLowerCase());
  if (statuses.some((s) => s.includes('updat'))) return 'Updating';
  if (statuses.some((s) => s.includes('test'))) return 'Testing';
  if (statuses.some((s) => s.includes('offline') || s.includes('down'))) return 'Offline';
  if (statuses.some((s) => s.includes('maintenance'))) return 'Maintenance';
  if (statuses.every((s) => s.includes('online') || s.includes('operational'))) return 'Online';
  return products[0].status;
}

function normalizeStatus(s) {
  s = s.toLowerCase();
  if (s.includes('updat')) return 'Updating';
  if (s.includes('test')) return 'Testing';
  if (s.includes('online') || s.includes('operational') || s.includes('working')) return 'Online';
  if (s.includes('offline') || s.includes('down') || s.includes('unavail')) return 'Offline';
  if (s.includes('maintenance')) return 'Maintenance';
  return s || 'Unknown';
}

function parseStatusHtml(html) {
  const products = [];
  const rows = html.matchAll(/<tr[^>]*>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi);
  for (const row of rows) {
    const name = row[1].trim();
    const status = row[2].trim();
    if (name && name.length > 1 && name.length < 50 && !name.toLowerCase().includes('product')) {
      products.push({ name, status: normalizeStatus(status) });
    }
  }
  if (products.length === 0) {
    const divRows = html.matchAll(/<div[^>]*class="[^"]*row[^"]*"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>[\s\S]*?<div[^>]*>([^<]+)<\/div>/gi);
    for (const row of divRows) {
      const name = row[1].trim();
      const status = row[2].trim();
      if (name && name.length > 1 && name.length < 50) products.push({ name, status: normalizeStatus(status) });
    }
  }
  return products;
}

async function fetchBrandStatus(brand) {
  const base = 'https://support.cosmotickets.com/status/';
  const url = base + brand.url;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cookie': sessionCookie,
    'Referer': base + 'status.php?brand=all'
  };
  try {
    const resp = await fetch(url, { headers, redirect: 'follow' });
    const html = await resp.text();
    if (html.includes('Status Login') || html.includes('login-box') || html.length < 500) {
      const newSession = await login();
      if (newSession) {
        headers.Cookie = newSession;
        const retryResp = await fetch(url, { headers, redirect: 'follow' });
        const retryHtml = await retryResp.text();
        if (!retryHtml.includes('Status Login') && retryHtml.length > 500) {
          const products = parseStatusHtml(retryHtml);
          return { brand: brand.name, status: determineStatus(products), products };
        }
      }
      return { brand: brand.name, status: 'Login Required', products: [] };
    }

    const products = parseStatusHtml(html);
    return { brand: brand.name, status: determineStatus(products), products };
  } catch (err) {
    return { brand: brand.name, status: 'Error', products: [], error: err.message };
  }
}

app.get('/api/status', requireAuth, async (_req, res) => {
  const now = Date.now();
  if (statusCache.data && (now - statusCache.timestamp) < CACHE_DURATION) {
    return res.json(statusCache.data);
  }
  try {
    if (!sessionCookie) await login();
    const results = await Promise.all(BRANDS.map((brand) => fetchBrandStatus(brand)));
    const response = { success: true, brands: results, lastUpdated: new Date().toISOString() };
    statusCache = { data: response, timestamp: now };
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Public status endpoint - no auth required
app.get('/api/public-status', async (_req, res) => {
  const now = Date.now();
  if (statusCache.data && (now - statusCache.timestamp) < CACHE_DURATION) {
    return res.json({ mode: 'live', generatedAt: new Date().toISOString(), ...statusCache.data });
  }
  try {
    if (!sessionCookie) await login();
    const results = await Promise.all(BRANDS.map((brand) => fetchBrandStatus(brand)));
    const response = { success: true, brands: results, lastUpdated: new Date().toISOString() };
    statusCache = { data: response, timestamp: now };
    res.json({ mode: 'live', generatedAt: new Date().toISOString(), ...response });
  } catch (err) {
    res.status(500).json({ mode: 'live', generatedAt: new Date().toISOString(), success: false, error: err.message });
  }
});

// Page routes
app.get('/', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/dashboard', requireAuth, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html')));
app.get('/guide', requireAuth, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'guide.html')));
app.get('/status', requireAuth, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'status.html')));
app.get('/commands', requireAuth, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'commands.html')));
app.get('/admin', requireAdmin, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'admin.html')));

// Serve status.json directly for status page
app.get('/data/status.json', (_req, res) => {
  const jsonPath = path.join(__dirname, 'public', 'data', 'status.json');
  res.sendFile(jsonPath);
});

app.listen(PORT, '0.0.0.0', () => {
  loadUsers();
  console.log(`Cosmo Support running on http://localhost:${PORT}`);
  console.log('Default owner: owner / owner123!');
  console.log('Default msd: msd / msd123!');
});
