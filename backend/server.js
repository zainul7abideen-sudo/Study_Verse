const express = require('express');
const cors = require('cors');
const path = require('path');

const coursesRoutes = require('./routes/courses');
const assignmentsRoutes = require('./routes/assignments');
const aiRoutes = require('./routes/ai');
const resourcesRoutes = require('./routes/resources');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/courses', coursesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'StudyVerse Student Platform Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🎓 StudyVerse Platform Backend running on port ${PORT}`);
    console.log(`🌐 Student Dashboard: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
    console.log(`🤖 AI Summarizer API: http://localhost:${PORT}/api/ai/summarize`);
    console.log(`====================================================`);
  });
}

module.exports = app;
