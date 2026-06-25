const express = require('express');
const cors = require('cors');
const { PORT } = require('./src/config/env');
const initializeDatabase = require('./src/db/init');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const questRoutes = require('./src/routes/quest.routes');
const noteRoutes = require('./src/routes/note.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database Schema and Migrations
initializeDatabase();

// Mount Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', questRoutes);
app.use('/api', noteRoutes);
app.use('/api', feedbackRoutes);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
