const noteRepository = require('../repositories/note.repository');

class NoteController {
  async getQuestNote(req, res) {
    try {
      const { qid } = req.query;
      const row = await noteRepository.getQuestNote(req.user.id, qid);
      res.json({ notes: row ? row.notes : '' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateQuestNote(req, res) {
    try {
      const { qid, notes } = req.body;
      await noteRepository.updateQuestNote(req.user.id, qid, notes);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCodexEntries(req, res) {
    try {
      const rows = await noteRepository.getAllCodexEntries(req.user.id);
      res.json({ entries: rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async saveCodexEntry(req, res) {
    try {
      if (req.body.id) {
        await noteRepository.updateCodexEntry(req.user.id, req.body.id, req.body);
      } else {
        await noteRepository.insertCodexEntry(req.user.id, req.body);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteCodexEntry(req, res) {
    try {
      await noteRepository.deleteCodexEntry(req.user.id, req.query.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new NoteController();
