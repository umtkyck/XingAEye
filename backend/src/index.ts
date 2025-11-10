import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Route imports
import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';
import videoRoutes from './routes/videos';
import alertRoutes from './routes/alerts';
import crossingRoutes from './routes/crossings';
import analyticsRoutes from './routes/analytics';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', authMiddleware, deviceRoutes);
app.use('/api/videos', authMiddleware, videoRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/crossings', authMiddleware, crossingRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;
const server = app.listen(PORT, () => {
  logger.info(`🚂 XingAEye Backend Server started on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
