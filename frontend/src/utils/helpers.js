/**
 * Utility functions for the frontend
 */

/**
 * Format timestamp to readable date/time
 */
export function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

/**
 * Format response time with unit
 */
export function formatResponseTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get status badge color
 */
export function getStatusColor(success, latency = null) {
  if (!success) return '#ef4444'; // red
  if (latency && latency > 1000) return '#eab308'; // yellow
  return '#22c55e'; // green
}

/**
 * Get status badge text
 */
export function getStatusText(success, statusCode = null, latency = null) {
  if (!success) {
    if (statusCode === 0) return 'Network Error';
    if (statusCode === 408) return 'Timeout';
    return 'Failed';
  }
  return 'Success';
}

/**
 * Truncate long strings
 */
export function truncate(str, length = 100) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Format JSON for display
 */
export function formatJson(data, indent = 2) {
  try {
    if (typeof data === 'string') {
      return JSON.stringify(JSON.parse(data), null, indent);
    }
    return JSON.stringify(data, null, indent);
  } catch (e) {
    return String(data);
  }
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy to clipboard:', err);
  });
}

/**
 * Format HTTP method with color
 */
export function getMethodColor(method) {
  const colors = {
    GET: '#3b82f6',
    POST: '#10b981',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
    PATCH: '#8b5cf6',
    HEAD: '#6366f1',
    OPTIONS: '#06b6d4'
  };
  return colors[method?.toUpperCase()] || '#6b7280';
}
