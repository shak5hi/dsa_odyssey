const { getRow, getRows, runQuery } = require('../db/sqlite');

class NoteRepository {
  async getQuestNote(userId, qid) {
    return getRow(`SELECT notes FROM completed_quests WHERE user_id = ? AND qid = ?`, [userId, qid]);
  }

  async updateQuestNote(userId, qid, notes) {
    return runQuery(`UPDATE completed_quests SET notes = ? WHERE user_id = ? AND qid = ?`, [notes, userId, qid]);
  }

  async getAllCodexEntries(userId) {
    return getRows(`SELECT * FROM codex_entries WHERE user_id = ? ORDER BY updated_at DESC`, [userId]);
  }

  async insertCodexEntry(userId, data) {
    const { qid, title, content, rid, rname, pattern, difficulty } = data;
    return runQuery(
      `INSERT INTO codex_entries (user_id, qid, title, content, realm_id, realm_name, pattern, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, qid, title, content, rid, rname, pattern || 'Custom Note', difficulty || 'N/A']
    );
  }

  async updateCodexEntry(userId, id, data) {
    const { title, content } = data;
    return runQuery(
      `UPDATE codex_entries SET title = ?, content = ?, updated_at = datetime('now') WHERE user_id = ? AND id = ?`,
      [title, content, userId, id]
    );
  }

  async deleteCodexEntry(userId, id) {
    return runQuery(`DELETE FROM codex_entries WHERE user_id = ? AND id = ?`, [userId, id]);
  }
}

module.exports = new NoteRepository();
