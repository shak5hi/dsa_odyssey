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

// XP table — quest id -> xp value (same as data.ts)
const QUEST_XP = {
  // Arrays
  a1:5,a2:5,a3:5,a4:15,a5:15,a6:15,a7:15,a8:15,a9:15,a10:15,
  // Hashing
  h1:5,h2:15,h3:15,h4:15,h5:15,h6:15,h7:15,h8:15,
  // Two Pointers
  tp1:5,tp2:15,tp3:15,tp4:15,tp5:30,tp6:15,tp7:15,
  // Sliding Window
  sw1:5,sw2:15,sw3:15,sw4:15,sw5:30,sw6:30,sw7:15,sw8:15,
  // Prefix
  px1:5,px2:5,px3:5,px4:15,px5:15,px6:15,
  // Binary Search
  bs1:5,bs2:15,bs3:15,bs4:15,bs5:15,bs6:15,bs7:30,bs8:15,
  // Linked Lists
  ll1:5,ll2:5,ll3:15,ll4:15,ll5:15,ll6:15,ll7:5,ll8:15,ll9:15,ll10:30,ll11:30,
  // Stack
  st1:5,st2:15,st3:15,st4:15,st5:15,st6:15,st7:30,st8:30,
  // Heap
  hp1:5,hp2:5,hp3:15,hp4:15,hp5:15,hp6:15,hp7:30,hp8:30,
  // Backtracking
  bt1:15,bt2:15,bt3:15,bt4:15,bt5:15,bt6:15,bt7:15,bt8:15,bt9:30,bt10:30,
  // Trees
  tr1:5,tr2:5,tr3:5,tr4:5,tr5:5,tr6:5,tr7:15,tr8:15,tr9:15,tr10:15,tr11:15,tr12:15,tr13:15,tr14:30,tr15:30,
  // BST
  bst1:5,bst2:15,bst3:15,bst4:15,bst5:15,bst6:15,
  // DFS
  df1:15,df2:15,df3:15,df4:15,df5:15,df6:15,df7:15,df8:15,df9:15,df10:15,df11:30,
  // BFS
  bf1:15,bf2:15,bf3:15,bf4:30,bf5:15,bf6:15,bf7:15,
  // DSU
  ds1:15,ds2:15,ds3:15,ds4:15,
  // DP1
  dp1a:5,dp1b:5,dp1c:15,dp1d:15,dp1e:15,dp1f:15,dp1g:15,dp1h:15,dp1i:15,dp1j:15,dp1k:15,dp1l:15,
  // DP2
  dp2a:15,dp2b:15,dp2c:15,dp2d:15,dp2e:15,dp2f:15,dp2g:30,dp2h:30,dp2i:30,dp2j:30,dp2k:30,
};

// Initialize Schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user_state (
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
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS completed_quests (
    user_id INTEGER NOT NULL,
    qid TEXT NOT NULL,
    completed_at TEXT DEFAULT (date('now')),
    notes TEXT DEFAULT '',
    PRIMARY KEY (user_id, qid)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS codex_entries (
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
  )`);
  // Migrate: recalculate XP from completed_quests if xp=0 but quests exist
  db.all(`SELECT user_id FROM user_state WHERE xp = 0`, [], (err, rows) => {
    if (err || !rows) return;
    rows.forEach(row => {
      db.all(`SELECT qid FROM completed_quests WHERE user_id = ?`, [row.user_id], (e2, quests) => {
        if (e2 || !quests || quests.length === 0) return;
        const totalXp = quests.reduce((sum, q) => sum + (QUEST_XP[q.qid] || 10), 0);
        if (totalXp > 0) {
          db.run(`UPDATE user_state SET xp = ? WHERE user_id = ?`, [totalXp, row.user_id]);
          console.log(`Migrated user ${row.user_id}: recalculated ${totalXp} XP from ${quests.length} completed quests`);
        }
      });
    });
  });
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
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const existing = await getRow('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(400).json({ error: 'Username already taken' });
    const hash = await bcrypt.hash(password, 10);
    const result = await runQuery('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    await runQuery('INSERT INTO user_state (user_id) VALUES (?)', [result.lastID]);
    const token = jwt.sign({ id: result.lastID, username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: result.lastID, username } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getRow('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/state — returns fully camelCased state
app.get('/api/state', authenticateToken, async (req, res) => {
  try {
    const userState = await getRow(`SELECT * FROM user_state WHERE user_id = ?`, [req.user.id]);
    const quests = await getRows(`SELECT * FROM completed_quests WHERE user_id = ?`, [req.user.id]);
    if (!userState) return res.status(404).json({ error: 'State not found' });

    // Build completed map: { qid: { date, notes } }
    const completed = {};
    const notes = {};
    for (const q of quests) {
      completed[q.qid] = { date: q.completed_at || '', notes: q.notes || '' };
      if (q.notes) notes[q.qid] = q.notes;
    }

    // Recalculate XP from completed quests (source of truth)
    const calculatedXp = quests.reduce((sum, q) => sum + (QUEST_XP[q.qid] || 10), 0);
    // If DB xp doesn't match, fix it
    if (calculatedXp !== userState.xp) {
      await runQuery(`UPDATE user_state SET xp = ? WHERE user_id = ?`, [calculatedXp, req.user.id]);
    }

    res.json({
      xp: calculatedXp,
      streak: userState.streak || 0,
      bestStreak: userState.best_streak || 0,
      lastActivity: userState.last_activity || null,
      inventory: JSON.parse(userState.inventory || '[]'),
      achievements: JSON.parse(userState.achievements || '{}'),
      ceremonySeen: JSON.parse(userState.ceremony_seen || '{}'),
      bonusDone: JSON.parse(userState.bonus_done || '{}'),
      dailyQuests: JSON.parse(userState.daily_quests || '[]'),
      dailyQuestDate: userState.daily_quest_date || null,
      dailyQuestRealm: userState.daily_quest_realm || null,
      completed,
      notes,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/state — update fields
app.post('/api/state', authenticateToken, async (req, res) => {
  try {
    const d = req.body;
    const updates = [];
    const params = [];

    if (d.streak !== undefined) { updates.push('streak = ?'); params.push(d.streak); }
    if (d.bestStreak !== undefined) { updates.push('best_streak = ?'); params.push(d.bestStreak); }
    if (d.lastActivity !== undefined) { updates.push('last_activity = ?'); params.push(d.lastActivity); }
    if (d.inventory !== undefined) { updates.push('inventory = ?'); params.push(JSON.stringify(d.inventory)); }
    if (d.achievements !== undefined) { updates.push('achievements = ?'); params.push(JSON.stringify(d.achievements)); }
    if (d.dailyQuests !== undefined) { updates.push('daily_quests = ?'); params.push(JSON.stringify(d.dailyQuests)); }
    if (d.dailyQuestDate !== undefined) { updates.push('daily_quest_date = ?'); params.push(d.dailyQuestDate); }
    if (d.dailyQuestRealm !== undefined) { updates.push('daily_quest_realm = ?'); params.push(d.dailyQuestRealm); }
    if (d.ceremonySeen !== undefined) { updates.push('ceremony_seen = ?'); params.push(JSON.stringify(d.ceremonySeen)); }
    if (d.bonusDone !== undefined) { updates.push('bonus_done = ?'); params.push(JSON.stringify(d.bonusDone)); }
    // NOTE: xp is NOT saved here — it's always computed from completed_quests

    if (updates.length > 0) {
      params.push(req.user.id);
      await runQuery(`UPDATE user_state SET ${updates.join(', ')} WHERE user_id = ?`, params);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/complete — marks/unmarks a quest and returns updated XP
app.post('/api/complete', authenticateToken, async (req, res) => {
  try {
    const { qid, action } = req.body;
    if (action === 'complete') {
      await runQuery(
        `INSERT OR IGNORE INTO completed_quests (user_id, qid, completed_at) VALUES (?, ?, date('now'))`,
        [req.user.id, qid]
      );
    } else {
      await runQuery(`DELETE FROM completed_quests WHERE user_id = ? AND qid = ?`, [req.user.id, qid]);
    }

    // Recalculate total XP from all completed quests (source of truth)
    const quests = await getRows(`SELECT qid FROM completed_quests WHERE user_id = ?`, [req.user.id]);
    const newXp = quests.reduce((sum, q) => sum + (QUEST_XP[q.qid] || 10), 0);
    const xpDelta = QUEST_XP[qid] || 10;

    // Save XP to user_state
    await runQuery(`UPDATE user_state SET xp = ? WHERE user_id = ?`, [newXp, req.user.id]);

    res.json({ success: true, newXp, xpGained: action === 'complete' ? xpDelta : -xpDelta });
  } catch (err) { res.status(500).json({ error: err.message, success: false }); }
});

// GET /api/notes?qid=...
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { qid } = req.query;
    const row = await getRow(`SELECT notes FROM completed_quests WHERE user_id = ? AND qid = ?`, [req.user.id, qid]);
    res.json({ notes: row ? row.notes : '' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/notes
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { qid, notes } = req.body;
    await runQuery(`UPDATE completed_quests SET notes = ? WHERE user_id = ? AND qid = ?`, [notes, req.user.id, qid]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/codex
app.get('/api/codex', authenticateToken, async (req, res) => {
  try {
    const rows = await getRows(`SELECT * FROM codex_entries WHERE user_id = ? ORDER BY updated_at DESC`, [req.user.id]);
    res.json({ entries: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/codex
app.post('/api/codex', authenticateToken, async (req, res) => {
  try {
    const { id, qid, title, content, realm_id, realmId, realm_name, realmName, pattern, difficulty } = req.body;
    const rid = realm_id || realmId || 'manual';
    const rname = realm_name || realmName || 'Custom';
    if (id) {
      await runQuery(
        `UPDATE codex_entries SET title = ?, content = ?, updated_at = datetime('now') WHERE user_id = ? AND id = ?`,
        [title, content, req.user.id, id]
      );
    } else {
      await runQuery(
        `INSERT INTO codex_entries (user_id, qid, title, content, realm_id, realm_name, pattern, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, qid, title, content, rid, rname, pattern || 'Custom Note', difficulty || 'N/A']
      );
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/codex
app.delete('/api/codex', authenticateToken, async (req, res) => {
  try {
    await runQuery(`DELETE FROM codex_entries WHERE user_id = ? AND id = ?`, [req.user.id, req.query.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
