/**
 * Debug insight generator
 * Provides human-readable explanations for API failures and successes
 */

export function generateDebugInsight(result) {
  // Success case
  if (result.success) {
    const responseTime = result.responseTimeMs;
    
    if (responseTime < 500) {
      return '✓ API responded quickly and successfully.';
    } else if (responseTime < 2000) {
      return '✓ API responded successfully (moderate latency detected).';
    } else {
      return '⚠ API responded successfully but with high latency. Consider optimization.';
    }
  }

  // Timeout case
  if (result.errorType === 'TIMEOUT') {
    return '⏱ Request timeout. The API took too long to respond. Check server status or increase timeout.';
  }

  // Network error
  if (result.errorType === 'NETWORK_ERROR') {
    const message = result.errorMessage.toLowerCase();
    
    if (message.includes('enotfound') || message.includes('getaddrinfo')) {
      return '🌐 Domain resolution failed. Verify that the domain name is correct and accessible.';
    }
    if (message.includes('econnrefused')) {
      return '🔌 Connection refused. The server may be down or not listening on that port.';
    }
    if (message.includes('econnreset')) {
      return '🔄 Connection reset by peer. The server closed the connection unexpectedly.';
    }
    
    return '🌐 Network error occurred. Check your internet connection and the API endpoint.';
  }

  // HTTP errors by status code
  const statusCode = result.statusCode;

  switch (statusCode) {
    case 400:
      return '❌ Bad Request (400). The request syntax is invalid. Check URL parameters and request body.';
    case 401:
      return '🔐 Unauthorized (401). Authentication is required or invalid. Check API key or credentials.';
    case 403:
      return '🚫 Forbidden (403). You do not have permission to access this resource.';
    case 404:
      return '🔍 Not Found (404). The endpoint does not exist. Verify the URL is correct.';
    case 429:
      return '⏳ Rate Limited (429). Too many requests. Wait before retrying.';
    case 500:
      return '⚠ Internal Server Error (500). The API server encountered an error. Try again later.';
    case 502:
      return '🌉 Bad Gateway (502). The upstream server is not responding correctly.';
    case 503:
      return '🔧 Service Unavailable (503). The API is temporarily down for maintenance.';
    case 504:
      return '⏱ Gateway Timeout (504). The upstream server did not respond in time.';
    default:
      if (statusCode >= 500) {
        return `❌ Server Error (${statusCode}). The API encountered an unexpected error.`;
      }
      if (statusCode >= 400) {
        return `❌ Client Error (${statusCode}). Check your request.`;
      }
      return '❓ Unknown response. Review the response details.';
  }
}

/**
 * Format response preview with size limits
 */
export function formatResponsePreview(data, maxLength = 500) {
  if (!data) {
    return {
      type: 'text',
      data: '(empty response)'
    };
  }

  try {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    const preview = jsonStr.length > maxLength 
      ? jsonStr.substring(0, maxLength) + '... (truncated)'
      : jsonStr;

    return {
      type: 'json',
      data: preview
    };
  } catch (e) {
    const textPreview = String(data).substring(0, maxLength);
    return {
      type: 'text',
      data: textPreview
    };
  }
}

/**
 * Generate latency indicator
 */
export function getLatencyColor(responseTimeMs) {
  if (responseTimeMs < 300) return 'green'; // fast
  if (responseTimeMs < 1000) return 'yellow'; // moderate
  return 'red'; // slow
}
