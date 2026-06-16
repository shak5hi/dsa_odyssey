const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dsa_odyssey_secret_key_123';

const app = express();
app.use(cors());
app.use(express.json());

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const DB_PATH = path.join(DB_DIR, 'dsa_odyssey.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('DB Error:', err);
});

// Initialize Schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS user_state (
      user_id INTEGER PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      last_activity TEXT,
      inventory TEXT DEFAULT '[]',
      achievements TEXT DEFAULT '{}',
      daily_quests TEXT DEFAULT '[]',
      daily_quest_date TEXT,
      daily_quest_realm TEXT,
      ceremony_seen TEXT DEFAULT '{}',
      bonus_done TEXT DEFAULT '{}',
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS completed_quests (
      user_id INTEGER NOT NULL,
      qid TEXT NOT NULL,
      completed_at TEXT DEFAULT (date('now')),
      notes TEXT DEFAULT '',
      PRIMARY KEY (user_id, qid)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS codex_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      qid TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      realm_id TEXT NOT NULL,
      realm_name TEXT NOT NULL,
      pattern TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
});

// Helpers
const getRow = (query, params = []) => new Promise((resolve, reject) => {
  db.get(query, params, (err, row) => err ? reject(err) : resolve(row));
});
const getRows = (query, params = []) => new Promise((resolve, reject) => {
  db.all(query, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const runQuery = (query, params = []) => new Promise((resolve, reject) => {
  db.run(query, params, function(err) { err ? reject(err) : resolve(this) });
});

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existingUser = await getRow('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) return res.status(400).json({ error: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const result = await runQuery('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    const userId = result.lastID;
    
    await runQuery('INSERT INTO user_state (user_id) VALUES (?)', [userId]);

    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: userId, username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getRow('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/state
app.get('/api/state', authenticateToken, async (req, res) => {
  try {
    const userState = await getRow(`SELECT * FROM user_state WHERE user_id = ?`, [req.user.id]);
    const quests = await getRows(`SELECT * FROM completed_quests WHERE user_id = ?`, [req.user.id]);
    
    if (!userState) return res.status(404).json({ error: 'State not found' });

    userState.inventory = JSON.parse(userState.inventory || '[]');
    userState.achievements = JSON.parse(userState.achievements || '{}');
    userState.daily_quests = JSON.parse(userState.daily_quests || '[]');
    userState.ceremony_seen = JSON.parse(userState.ceremony_seen || '{}');
    userState.bonus_done = JSON.parse(userState.bonus_done || '{}');
    
    res.json({
      ...userState,
      completedQuests: quests.map(q => q.qid)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/state
app.post('/api/state', authenticateToken, async (req, res) => {
  try {
    const d = req.body;
    let sql = `UPDATE user_state SET `;
    let updates = [];
    let params = [];
    
    if (d.xp !== undefined) { updates.push('xp = ?'); params.push(d.xp); }
    if (d.streak !== undefined) { updates.push('streak = ?'); params.push(d.streak); }
    if (d.best_streak !== undefined) { updates.push('best_streak = ?'); params.push(d.best_streak); }
    if (d.last_activity !== undefined) { updates.push('last_activity = ?'); params.push(d.last_activity); }
    if (d.inventory !== undefined) { updates.push('inventory = ?'); params.push(JSON.stringify(d.inventory)); }
    if (d.achievements !== undefined) { updates.push('achievements = ?'); params.push(JSON.stringify(d.achievements)); }
    if (d.daily_quests !== undefined) { updates.push('daily_quests = ?'); params.push(JSON.stringify(d.daily_quests)); }
    if (d.daily_quest_date !== undefined) { updates.push('daily_quest_date = ?'); params.push(d.daily_quest_date); }
    if (d.daily_quest_realm !== undefined) { updates.push('daily_quest_realm = ?'); params.push(d.daily_quest_realm); }
    if (d.ceremony_seen !== undefined) { updates.push('ceremony_seen = ?'); params.push(JSON.stringify(d.ceremony_seen)); }
    if (d.bonus_done !== undefined) { updates.push('bonus_done = ?'); params.push(JSON.stringify(d.bonus_done)); }

    if (updates.length > 0) {
      sql += updates.join(', ') + ' WHERE user_id = ?';
      params.push(req.user.id);
      await runQuery(sql, params);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/complete
app.post('/api/complete', authenticateToken, async (req, res) => {
  try {
    const { qid, action } = req.body;
    if (action === 'complete') {
      await runQuery(`INSERT OR IGNORE INTO completed_quests (user_id, qid, completed_at) VALUES (?, ?, date('now'))`, [req.user.id, qid]);
    } else {
      await runQuery(`DELETE FROM completed_quests WHERE user_id = ? AND qid = ?`, [req.user.id, qid]);
    }
    // Return mock calculations for streak/xp for simplicity (in a real app this logic would be in backend)
    // Actually wait, earlier the backend returned newXp, inventory, etc.
    // Wait, the previous server.js just returned `{ success: true }`. The frontend computes XP.
    // Let me check my previous snapshot of server.js: Yes, `/api/complete` just did DB update and returned `{ success: true }`.
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message, ok: false });
  }
});

// GET /api/notes?qid=...
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const qid = req.query.qid;
    const row = await getRow(`SELECT notes FROM completed_quests WHERE user_id = ? AND qid = ?`, [req.user.id, qid]);
    res.json({ notes: row ? row.notes : '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { qid, notes } = req.body;
    await runQuery(`UPDATE completed_quests SET notes = ? WHERE user_id = ? AND qid = ?`, [notes, req.user.id, qid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/codex
app.get('/api/codex', authenticateToken, async (req, res) => {
  try {
    const rows = await getRows(`SELECT * FROM codex_entries WHERE user_id = ? ORDER BY updated_at DESC`, [req.user.id]);
    res.json({ entries: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/codex
app.post('/api/codex', authenticateToken, async (req, res) => {
  try {
    const { id, qid, title, content, realm_id, realm_name, pattern, difficulty } = req.body;
    if (id) {
      await runQuery(`
        UPDATE codex_entries 
        SET title = ?, content = ?, updated_at = datetime('now')
        WHERE user_id = ? AND id = ?
      `, [title, content, req.user.id, id]);
    } else {
      await runQuery(`
        INSERT INTO codex_entries (user_id, qid, title, content, realm_id, realm_name, pattern, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, qid, title, content, realm_id, realm_name, pattern, difficulty]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/codex
app.delete('/api/codex', authenticateToken, async (req, res) => {
  try {
    const id = req.query.id;
    await runQuery(`DELETE FROM codex_entries WHERE user_id = ? AND id = ?`, [req.user.id, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Backend server running on port ' + port);
});
