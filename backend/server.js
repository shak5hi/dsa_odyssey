const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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
    CREATE TABLE IF NOT EXISTS user_state (
      id INTEGER PRIMARY KEY DEFAULT 1,
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
      bonus_done TEXT DEFAULT '{}'
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS completed_quests (
      qid TEXT PRIMARY KEY,
      completed_at TEXT DEFAULT (date('now')),
      notes TEXT DEFAULT ''
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS codex_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  db.run(`INSERT OR IGNORE INTO user_state (id) VALUES (1)`);
});

// Helper for promise
const getRow = (query, params = []) => new Promise((resolve, reject) => {
  db.get(query, params, (err, row) => err ? reject(err) : resolve(row));
});
const getRows = (query, params = []) => new Promise((resolve, reject) => {
  db.all(query, params, (err, rows) => err ? reject(err) : resolve(rows));
});
const runQuery = (query, params = []) => new Promise((resolve, reject) => {
  db.run(query, params, function(err) { err ? reject(err) : resolve(this) });
});

// GET /api/state
app.get('/api/state', async (req, res) => {
  try {
    const user = await getRow(`SELECT * FROM user_state WHERE id = 1`);
    const quests = await getRows(`SELECT * FROM completed_quests`);
    
    // Parse JSON fields
    user.inventory = JSON.parse(user.inventory || '[]');
    user.achievements = JSON.parse(user.achievements || '{}');
    user.daily_quests = JSON.parse(user.daily_quests || '[]');
    user.ceremony_seen = JSON.parse(user.ceremony_seen || '{}');
    user.bonus_done = JSON.parse(user.bonus_done || '{}');
    
    res.json({
      ...user,
      completedQuests: quests.map(q => q.qid)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/state
app.post('/api/state', async (req, res) => {
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
      sql += updates.join(', ') + ' WHERE id = 1';
      await runQuery(sql, params);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/complete
app.post('/api/complete', async (req, res) => {
  try {
    const { qid, completed } = req.body;
    if (completed) {
      await runQuery(`INSERT OR IGNORE INTO completed_quests (qid, completed_at) VALUES (?, date('now'))`, [qid]);
    } else {
      await runQuery(`DELETE FROM completed_quests WHERE qid = ?`, [qid]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes?qid=...
app.get('/api/notes', async (req, res) => {
  try {
    const qid = req.query.qid;
    const row = await getRow(`SELECT notes FROM completed_quests WHERE qid = ?`, [qid]);
    res.json({ notes: row ? row.notes : '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes
app.post('/api/notes', async (req, res) => {
  try {
    const { qid, notes } = req.body;
    await runQuery(`UPDATE completed_quests SET notes = ? WHERE qid = ?`, [notes, qid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/codex
app.get('/api/codex', async (req, res) => {
  try {
    const rows = await getRows(`SELECT * FROM codex_entries ORDER BY updated_at DESC`);
    res.json({ entries: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/codex
app.post('/api/codex', async (req, res) => {
  try {
    const { id, qid, title, content, realm_id, realm_name, pattern, difficulty } = req.body;
    if (id) {
      await runQuery(`
        UPDATE codex_entries 
        SET title = ?, content = ?, updated_at = datetime('now')
        WHERE id = ?
      `, [title, content, id]);
    } else {
      await runQuery(`
        INSERT INTO codex_entries (qid, title, content, realm_id, realm_name, pattern, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [qid, title, content, realm_id, realm_name, pattern, difficulty]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/codex
app.delete('/api/codex', async (req, res) => {
  try {
    const id = req.query.id;
    await runQuery(`DELETE FROM codex_entries WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Backend server running on port ' + port);
});
