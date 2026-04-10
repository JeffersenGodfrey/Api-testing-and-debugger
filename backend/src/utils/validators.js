/**
 * URL and input validation utilities
 */

/**
 * Validate if URL has valid format
 */
export function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate HTTP method
 */
export function isValidHttpMethod(method) {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  return validMethods.includes(method?.toUpperCase());
}

/**
 * Safely parse JSON headers string
 */
export function parseHeaders(headersInput) {
  if (!headersInput || typeof headersInput !== 'string') {
    return {};
  }

  try {
    // If it's a JSON string, parse it
    if (headersInput.trim().startsWith('{')) {
      return JSON.parse(headersInput);
    }
    // Otherwise return empty object
    return {};
  } catch (e) {
    throw new Error('Headers must be valid JSON');
  }
}

/**
 * Safely parse JSON body
 */
export function parseBody(bodyInput) {
  if (!bodyInput) {
    return null;
  }

  if (typeof bodyInput === 'string') {
    try {
      return JSON.parse(bodyInput);
    } catch (e) {
      throw new Error('Request body must be valid JSON');
    }
  }

  return bodyInput;
}

/**
 * Validate request payload
 */
export function validateTestRequest(payload) {
  const errors = [];

  if (!payload.url) {
    errors.push('URL is required');
  } else if (!isValidUrl(payload.url)) {
    errors.push('URL must be a valid HTTP/HTTPS URL');
  }

  if (!payload.method) {
    errors.push('HTTP method is required');
  } else if (!isValidHttpMethod(payload.method)) {
    errors.push('Invalid HTTP method');
  }

  if (payload.timeout && (payload.timeout < 100 || payload.timeout > 60000)) {
    errors.push('Timeout must be between 100ms and 60000ms');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
}
