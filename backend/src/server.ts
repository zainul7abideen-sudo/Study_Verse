import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { maintenanceGuard } from './middleware/maintenanceMiddleware.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { authRoutes } from './routes/authRoutes.js';
import { bookRoutes } from './routes/bookRoutes.js';
import { resellRoutes } from './routes/resellRoutes.js';
import { exchangeRoutes } from './routes/exchangeRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { ebookRoutes } from './routes/ebookRoutes.js';
import { academicRoutes } from './routes/academicRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { aiRoutes } from './routes/aiRoutes.js';
import { courseRoutes } from './routes/courseRoutes.js';
import { assignmentRoutes } from './routes/assignmentRoutes.js';
import { resourceRoutes } from './routes/resourceRoutes.js';
import { emailRoutes } from './routes/emailRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-bypass-key']
}));

app.use(express.json());

// Maintenance Guard Middleware
app.use(maintenanceGuard);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Study Student Shop (SSS) API Engine',
    version: '2.5.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/resell', resellRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/admin', adminRoutes);

// StudyVerse Integrated Hub Routes
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Study Student Shop (SSS) API Backend v2.5 is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️ Maintenance Guard: Active`);
  console.log(`🤖 Dropship Auto-Order Engine: Online`);
  console.log(`🧠 AI Study Engine & Attendance 75% Bunk Radar: Ready`);
  console.log(`🎓 Indian Universities Grading Matrix: Ready`);
  console.log(`=======================================================`);
});
