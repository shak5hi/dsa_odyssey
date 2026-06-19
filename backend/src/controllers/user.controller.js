const userRepository = require('../repositories/user.repository');
const questRepository = require('../repositories/quest.repository');
const xpService = require('../services/xp.service');

class UserController {
  async getState(req, res) {
    try {
      const userState = await userRepository.getUserState(req.user.id);
      const quests = await questRepository.getCompletedQuests(req.user.id);
      if (!userState) return res.status(404).json({ error: 'State not found' });

      const completed = {};
      const notes = {};
      for (const q of quests) {
        completed[q.qid] = { date: q.completed_at || '', notes: q.notes || '' };
        if (q.notes) notes[q.qid] = q.notes;
      }

      // Sync XP
      const calculatedXp = await xpService.recalculateUserXp(req.user.id);

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
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateState(req, res) {
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

      if (updates.length > 0) {
        await userRepository.updateUserState(req.user.id, updates, params);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
