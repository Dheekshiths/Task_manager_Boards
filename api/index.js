const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('../backend/config/db');
const { errorHandler, notFound } = require('../backend/middleware/errorHandler');

// Route imports
const authRoutes = require('../backend/routes/auth.routes');
const userRoutes = require('../backend/routes/user.routes');
const projectRoutes = require('../backend/routes/project.routes');
const taskRoutes = require('../backend/routes/task.routes');
const commentRoutes = require('../backend/routes/comment.routes');
const dashboardRoutes = require('../backend/routes/dashboard.routes');

const app = express();

// Security & parsing middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
      uriExists: !!process.env.MONGO_URI
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/tasks', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
