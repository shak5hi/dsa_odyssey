const questRepository = require('../repositories/quest.repository');

class FeedbackController {
  // POST /api/feedback — save a felt rating for a completed quest
  async saveFelt(req, res) {
    try {
      const { qid, felt } = req.body;
      if (!qid || !felt) return res.status(400).json({ error: 'qid and felt are required', success: false });
      const valid = ['easy', 'medium', 'hard'];
      if (!valid.includes(felt)) return res.status(400).json({ error: 'felt must be easy, medium, or hard', success: false });

      await questRepository.saveFelt(req.user.id, qid, felt);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
  }

  // GET /api/insights — return per-qid felt ratings for the logged-in user
  async getInsights(req, res) {
    try {
      const rows = await questRepository.getInsights(req.user.id);
      // Build { qid: felt } map
      const felt = {};
      for (const row of rows) {
        felt[row.qid] = row.felt;
      }
      res.json({ success: true, felt });
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
  }
}

module.exports = new FeedbackController();
