const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);
router.post('/feedback', feedbackController.saveFelt);
router.get('/insights', feedbackController.getInsights);

module.exports = router;
