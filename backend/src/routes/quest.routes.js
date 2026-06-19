const express = require('express');
const questController = require('../controllers/quest.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);
router.post('/complete', questController.toggleQuest);

module.exports = router;
