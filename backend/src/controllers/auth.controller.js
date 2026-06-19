const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const userRepository = require('../repositories/user.repository');

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
      
      const existing = await userRepository.getUserByUsername(username);
      if (existing) return res.status(400).json({ error: 'Username already taken' });
      
      const hash = await bcrypt.hash(password, 10);
      const userId = await userRepository.createUser(username, hash);
      
      const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ success: true, token, user: { id: userId, username } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userRepository.getUserByUsername(username);
      if (!user) return res.status(400).json({ error: 'Invalid username or password' });
      
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(400).json({ error: 'Invalid username or password' });
      
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ success: true, token, user: { id: user.id, username: user.username } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
