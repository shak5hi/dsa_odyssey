const questService = require('../services/quest.service');

class QuestController {
  async toggleQuest(req, res) {
    try {
      const { qid, action } = req.body;
      const result = await questService.toggleQuest(req.user.id, qid, action);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
  }
}

module.exports = new QuestController();
