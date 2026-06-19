const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);
router.get('/state', userController.getState);
router.post('/state', userController.updateState);

module.exports = router;
