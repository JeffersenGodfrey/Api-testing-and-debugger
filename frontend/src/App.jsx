import { useState, useEffect } from 'react';
import ApiTestForm from './components/ApiTestForm';
import ResultCard from './components/ResultCard';
import HistorySection from './components/HistorySection';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { testApi, getHistory, clearHistory } from './services/api';
import './App.css';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleTestApi = async (testConfig) => {
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await testApi(testConfig);
      setCurrentResult(result);
      
      // Reload history to get the new entry
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to test API'
      );
      console.error('API test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear history? This cannot be undone.')) {
      try {
        await clearHistory();
        setHistory([]);
        setCurrentResult(null);
      } catch (err) {
        setError('Failed to clear history');
        console.error('Clear history error:', err);
      }
    }
  };

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <section className="hero">
          <h2>API Failure Visualizer & Debugger</h2>
          <p>Test any API endpoint and get instant failure analysis and debugging insights</p>
        </section>

        <section className="container">
          <ApiTestForm onTest={handleTestApi} loading={loading} />

          {error && (
            <div className="error-card">
              <h3>⚠️ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {currentResult && <ResultCard result={currentResult} />}

          <HistorySection
            history={history}
            onClear={handleClearHistory}
            onSelectResult={setCurrentResult}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
