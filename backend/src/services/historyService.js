/**
 * In-memory history storage service
 * Stores recent API test results
 */

class HistoryService {
  constructor(maxSize = 20) {
    this.history = [];
    this.maxSize = maxSize;
  }

  /**
   * Add a test result to history
   */
  addResult(result) {
    const historyEntry = {
      ...result,
      historyId: this.generateId(),
      addedAt: new Date().toISOString()
    };

    this.history.unshift(historyEntry); // Add to beginning
    
    // Keep only maxSize most recent entries
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(0, this.maxSize);
    }

    return historyEntry;
  }

  /**
   * Get all history
   */
  getAll() {
    return this.history;
  }

  /**
   * Clear all history
   */
  clear() {
    this.history = [];
  }

  /**
   * Get history count
   */
  getCount() {
    return this.history.length;
  }

  /**
   * Generate unique history ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export default new HistoryService();
