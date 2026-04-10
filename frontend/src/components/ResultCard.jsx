import {
  formatTimestamp,
  formatResponseTime,
  getStatusColor,
  getStatusText,
  getMethodColor,
  truncate
} from '../utils/helpers';
import '../styles/ResultCard.css';

/**
 * Result Card Component
 * Displays the result of a single API test
 */
function ResultCard({ result }) {
  if (!result) return null;

  const statusColor = getStatusColor(result.success, result.responseTimeMs);
  const statusText = getStatusText(result.success, result.statusCode, result.responseTimeMs);
  const methodColor = getMethodColor(result.method);

  return (
    <div className="result-card">
      <div className="result-header">
        <h2>Execution Summary</h2>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </span>
      </div>

      {/* Basic Info */}
      <div className="result-grid">
        <div className="result-item">
          <span className="label">URL</span>
          <span className="value" title={result.url}>{truncate(result.url, 60)}</span>
        </div>

        <div className="result-item">
          <span className="label">Method</span>
          <span
            className="method-badge"
            style={{ color: methodColor }}
          >
            {result.method}
          </span>
        </div>

        <div className="result-item">
          <span className="label">Status Code</span>
          <span className="value">{result.statusCode || 'N/A'}</span>
        </div>

        <div className="result-item">
          <span className="label">Response Time</span>
          <span className="value">{formatResponseTime(result.responseTimeMs)}</span>
        </div>

        <div className="result-item">
          <span className="label">Timestamp</span>
          <span className="value">{formatTimestamp(result.timestamp)}</span>
        </div>

        {result.errorType && (
          <div className="result-item">
            <span className="label">Error Type</span>
            <span className="value">{result.errorType}</span>
          </div>
        )}
      </div>

      {/* Debug Insight */}
      <div className="debug-section">
        <h3>🔍 Failure Analysis</h3>
        <p className="debug-insight">{result.debugInsight}</p>
      </div>

      {/* Error Message */}
      {result.errorMessage && (
        <div className="error-section">
          <h3>Error Details</h3>
          <p className="error-message">{result.errorMessage}</p>
        </div>
      )}

      {/* Response Preview */}
      <div className="response-section">
        <h3>Response Preview</h3>
        <div className="response-preview">
          <pre>
            {result.responsePreview?.type === 'json'
              ? result.responsePreview.data
              : result.responsePreview?.data || '(empty response)'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
