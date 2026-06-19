const { getRow, runQuery } = require('../db/sqlite');

class UserRepository {
  async getUserByUsername(username) {
    return getRow('SELECT * FROM users WHERE username = ?', [username]);
  }

  async createUser(username, hash) {
    const result = await runQuery('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    await runQuery('INSERT INTO user_state (user_id) VALUES (?)', [result.lastID]);
    return result.lastID;
  }

  async getUserState(userId) {
    return getRow(`SELECT * FROM user_state WHERE user_id = ?`, [userId]);
  }

  async updateUserState(userId, updates, params) {
    params.push(userId);
    return runQuery(`UPDATE user_state SET ${updates.join(', ')} WHERE user_id = ?`, params);
  }

  async updateUserXp(userId, xp) {
    return runQuery(`UPDATE user_state SET xp = ? WHERE user_id = ?`, [xp, userId]);
  }
}

module.exports = new UserRepository();
