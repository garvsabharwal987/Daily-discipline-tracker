const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initWordCron = require('./features/word/wordCron');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/streaks', require('./routes/streakRoutes'));
app.use('/api/vocab', require('./routes/vocabRoutes'));
app.use('/api/reading', require('./routes/readingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/calendar', require('./features/calendar/calendarRoutes'));
app.use('/api/gamification', require('./features/gamification/gamificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/word', require('./features/word/wordRoutes'));

// Initialize cron jobs
initWordCron();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
