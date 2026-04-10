import express from 'express';
import {
  handleTestApi,
  handleGetHistory,
  handleClearHistory,
  handleHealthCheck
} from '../controllers/testController.js';

const router = express.Router();

/**
 * API Routes
 */

// Test API endpoint
router.post('/api/test', handleTestApi);

// History endpoints
router.get('/api/history', handleGetHistory);
router.delete('/api/history', handleClearHistory);

// Health check
router.get('/api/health', handleHealthCheck);

export default router;
