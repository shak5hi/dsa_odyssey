const { getRow, getRows, runQuery } = require('../db/sqlite');

class QuestRepository {
  async insertCompletedQuest(userId, qid) {
    return runQuery(
      `INSERT OR IGNORE INTO completed_quests (user_id, qid, completed_at) VALUES (?, ?, date('now'))`,
      [userId, qid]
    );
  }

  async deleteCompletedQuest(userId, qid) {
    return runQuery(
      `DELETE FROM completed_quests WHERE user_id = ? AND qid = ?`,
      [userId, qid]
    );
  }

  async getCompletedQuests(userId) {
    return getRows(
      `SELECT * FROM completed_quests WHERE user_id = ?`,
      [userId]
    );
  }

  async getCompletedQuestsIds(userId) {
    return getRows(
      `SELECT qid FROM completed_quests WHERE user_id = ?`,
      [userId]
    );
  }
}

module.exports = new QuestRepository();
