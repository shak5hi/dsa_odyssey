const { db, runQuery } = require('./sqlite');
const { QUEST_XP } = require('../utils/xp.utils');

function initializeDatabase() {
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
      felt TEXT DEFAULT '',
      PRIMARY KEY (user_id, qid)
    )`);

    // Migration: add felt column if it doesn't exist (for existing DBs)
    db.run(`ALTER TABLE completed_quests ADD COLUMN felt TEXT DEFAULT ''`, [], (err) => {
      // Ignore error if column already exists
    });
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
}

module.exports = initializeDatabase;
