import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware, errorHandler, validateRequest } from './middleware/index.js';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware());
app.use(validateRequest);

// Routes
app.use('/', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Cloud-Based API Failure Visualizer & Debugger',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      test: 'POST /api/test',
      history: 'GET /api/history',
      clearHistory: 'DELETE /api/history',
      health: 'GET /api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, HOST, () => {
  console.log(`                                               
╔═══════════════════════════════════════════════════════════════                  ╗
║ API Failure Visualizer & Debugger Backend                                       ║
║ Server running at http://${HOST}:${PORT}                                        ║
║ Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)}              ║
║ CORS Origin: ${(process.env.FRONTEND_URL || 'http://localhost:5173').padEnd(34)}║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
