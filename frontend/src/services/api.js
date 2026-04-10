import axios from 'axios';

/**
 * API Service
 * Handles all communication with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Test an API endpoint
 */
export async function testApi(testConfig) {
  try {
    const response = await apiClient.post('/api/test', testConfig);
    return response.data;
  } catch (error) {
    console.error('API test error:', error);
    throw error;
  }
}

/**
 * Get test history
 */
export async function getHistory() {
  try {
    const response = await apiClient.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('Get history error:', error);
    throw error;
  }
}

/**
 * Clear test history
 */
export async function clearHistory() {
  try {
    const response = await apiClient.delete('/api/history');
    return response.data;
  } catch (error) {
    console.error('Clear history error:', error);
    throw error;
  }
}

/**
 * Check backend health
 */
export async function checkHealth() {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

export default apiClient;
