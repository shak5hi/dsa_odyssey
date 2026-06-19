const questRepository = require('../repositories/quest.repository');
const xpService = require('./xp.service');
const { QUEST_XP } = require('../utils/xp.utils');

class QuestService {
  async toggleQuest(userId, qid, action) {
    if (action === 'complete') {
      await questRepository.insertCompletedQuest(userId, qid);
    } else {
      await questRepository.deleteCompletedQuest(userId, qid);
    }

    const newXp = await xpService.recalculateUserXp(userId);
    const xpDelta = QUEST_XP[qid] || 10;

    return {
      success: true,
      newXp,
      xpGained: action === 'complete' ? xpDelta : -xpDelta
    };
  }
}

module.exports = new QuestService();
