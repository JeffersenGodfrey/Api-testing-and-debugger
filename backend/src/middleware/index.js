import cors from 'cors';

/**
 * CORS middleware configuration
 * Allows requests from frontend origin (local dev or S3 production)
 */
export function corsMiddleware() {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  return cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
}

/**
 * Error handling middleware
 * Catches and formats all errors consistently
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      type: 'VALIDATION_ERROR'
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      type: err.type || 'ERROR'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    type: 'INTERNAL_ERROR'
  });
}

/**
 * Request validation middleware
 * Basic validation for incoming requests
 */
export function validateRequest(req, res, next) {
  // Add request ID for tracking
  req.requestId = Date.now().toString();
  next();
}
