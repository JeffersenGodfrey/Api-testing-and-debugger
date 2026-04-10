import { testApi, validateRequestConfig } from '../services/apiTestService.js';
import { parseHeaders, parseBody, validateTestRequest } from '../utils/validators.js';
import historyService from '../services/historyService.js';

/**
 * Test API Controller
 * Handles the test API endpoint requests
 */

/**
 * POST /api/test
 * Test an API endpoint
 */
export async function handleTestApi(req, res) {
  try {
    const { url, method, headers, body, timeout } = req.body;

    // Validate input
    validateTestRequest({ url, method, timeout });

    // Parse headers and body safely
    let parsedHeaders = {};
    let parsedBody = null;

    try {
      parsedHeaders = headers ? parseHeaders(JSON.stringify(headers)) : {};
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid headers format',
        type: 'VALIDATION_ERROR'
      });
    }

    try {
      parsedBody = body ? parseBody(body) : null;
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body (must be valid JSON)',
        type: 'VALIDATION_ERROR'
      });
    }

    // Prepare test config
    const testConfig = {
      url,
      method: method.toUpperCase(),
      headers: parsedHeaders,
      body: parsedBody,
      timeout: timeout || 5000
    };

    // Validate config
    validateRequestConfig(testConfig);

    // Execute API test
    const result = await testApi(testConfig);

    // Store in history
    const historyEntry = historyService.addResult(result);

    // Return result with history ID
    return res.json({
      ...result,
      historyId: historyEntry.historyId
    });

  } catch (error) {
    console.error('Test API error:', error);

    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to test API',
      type: 'VALIDATION_ERROR'
    });
  }
}

/**
 * GET /api/history
 * Get recent test history
 */
export function handleGetHistory(req, res) {
  try {
    const history = historyService.getAll();
    return res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve history',
      type: 'INTERNAL_ERROR'
    });
  }
}

/**
 * DELETE /api/history
 * Clear all test history
 */
export function handleClearHistory(req, res) {
  try {
    historyService.clear();
    return res.json({
      success: true,
      message: 'History cleared',
      count: 0
    });
  } catch (error) {
    console.error('Clear history error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear history',
      type: 'INTERNAL_ERROR'
    });
  }
}

/**
 * GET /api/health
 * Health check endpoint
 */
export function handleHealthCheck(req, res) {
  const startTime = process.uptime ? (Date.now() / 1000 - process.uptime?.()) : 0;

  return res.json({
    success: true,
    status: 'healthy',
    service: 'api-failure-visualizer',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime?.()),
    historyCount: historyService.getCount(),
    environment: process.env.NODE_ENV || 'development'
  });
}
