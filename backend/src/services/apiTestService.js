import axios from 'axios';
import { formatResponsePreview, generateDebugInsight } from '../utils/debugInsight.js';

/**
 * API Testing Service
 * Handles making HTTP requests and capturing results
 */

/**
 * Test an API endpoint and return detailed results
 */
export async function testApi(testConfig) {
  const {
    url,
    method = 'GET',
    headers = {},
    body = null,
    timeout = 5000
  } = testConfig;

  const startTime = Date.now();
  let result = {
    success: false,
    statusCode: null,
    responseTimeMs: 0,
    timestamp: new Date().toISOString(),
    url,
    method,
    responsePreview: null,
    debugInsight: '',
    errorType: null,
    errorMessage: null
  };

  try {
    // Make the request
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      timeout,
      maxRedirects: 5,
      validateStatus: () => true // Don't throw on any status code
    });

    result.success = response.status >= 200 && response.status < 300;
    result.statusCode = response.status;
    result.responsePreview = formatResponsePreview(response.data);
    result.responseTimeMs = Date.now() - startTime;

    // Generate insight based on status
    result.debugInsight = generateDebugInsight(result);

    return result;

  } catch (error) {
    result.responseTimeMs = Date.now() - startTime;
    result.errorMessage = error.message;

    // Categorize error type
    if (error.code === 'ECONNABORTED') {
      result.errorType = 'TIMEOUT';
    } else if (error.code === 'ENOTFOUND' || error.code === 'EADDRNOTFOUND') {
      result.errorType = 'NETWORK_ERROR';
      result.errorMessage = 'Domain not found or network unreachable';
    } else if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'EHOSTUNREACH'
    ) {
      result.errorType = 'NETWORK_ERROR';
    } else if (error.response) {
      result.statusCode = error.response.status;
      result.responsePreview = formatResponsePreview(error.response.data);
      result.errorType = 'HTTP_ERROR';
      result.success = false;
    } else if (error.request) {
      result.errorType = 'NETWORK_ERROR';
    } else {
      result.errorType = 'REQUEST_ERROR';
    }

    // Generate debug insight for error
    result.debugInsight = generateDebugInsight(result);

    return result;
  }
}

/**
 * Validate request can be made (pre-flight checks)
 */
export function validateRequestConfig(config) {
  const errors = [];

  if (!config.url) {
    errors.push('URL is required');
  }

  if (!config.method) {
    errors.push('HTTP method is required');
  }

  if (config.timeout && (typeof config.timeout !== 'number' || config.timeout < 100)) {
    errors.push('Timeout must be a number >= 100ms');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return true;
}
