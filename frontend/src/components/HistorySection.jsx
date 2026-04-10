import {
  formatTimestamp,
  formatResponseTime,
  getStatusColor,
  getStatusText,
  getMethodColor,
  truncate
} from '../utils/helpers';
import '../styles/HistorySection.css';

/**
 * History Section Component
 * Displays recent API test results
 */
function HistorySection({ history, onClear, onSelectResult }) {
  if (history.length === 0) {
    return (
      <div className="history-card">
        <h2>Recent Checks</h2>
        <div className="empty-state">
          <p>No tests run yet. Test an API to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-card">
      <div className="history-header">
        <h2>Recent Checks</h2>
        <span className="count">{history.length} results</span>
        {history.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={onClear}>
            Clear History
          </button>
        )}
      </div>

      <div className="history-table">
        <div className="table-header">
          <div className="col col-status">Status</div>
          <div className="col col-method">Method</div>
          <div className="col col-url">URL</div>
          <div className="col col-time">Time</div>
          <div className="col col-timestamp">When</div>
        </div>

        {history.map((item, index) => {
          const statusColor = getStatusColor(item.success, item.responseTimeMs);
          const statusText = getStatusText(item.success, item.statusCode, item.responseTimeMs);
          const methodColor = getMethodColor(item.method);

          return (
            <div
              key={item.historyId || index}
              className="table-row"
              onClick={() => onSelectResult(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="col col-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColor }}
                >
                  {statusText}
                </span>
              </div>

              <div className="col col-method">
                <span
                  className="method-badge"
                  style={{ color: methodColor }}
                >
                  {item.method}
                </span>
              </div>

              <div
                className="col col-url"
                title={item.url}
              >
                {truncate(item.url, 40)}
              </div>

              <div className="col col-time">
                {formatResponseTime(item.responseTimeMs)}
              </div>

              <div className="col col-timestamp">
                {formatTimestamp(item.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistorySection;
