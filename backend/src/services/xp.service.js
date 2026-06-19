const { QUEST_XP } = require('../utils/xp.utils');
const questRepository = require('../repositories/quest.repository');
const userRepository = require('../repositories/user.repository');

class XpService {
  async recalculateUserXp(userId) {
    const quests = await questRepository.getCompletedQuestsIds(userId);
    const newXp = quests.reduce((sum, q) => sum + (QUEST_XP[q.qid] || 10), 0);
    await userRepository.updateUserXp(userId, newXp);
    return newXp;
  }
}

module.exports = new XpService();
