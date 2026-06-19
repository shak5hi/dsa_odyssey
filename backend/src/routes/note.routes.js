const express = require('express');
const noteController = require('../controllers/note.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

// Simple quest notes
router.get('/notes', noteController.getQuestNote);
router.post('/notes', noteController.updateQuestNote);

// Codex entries
router.get('/codex', noteController.getCodexEntries);
router.post('/codex', noteController.saveCodexEntry);
router.delete('/codex', noteController.deleteCodexEntry);

module.exports = router;
