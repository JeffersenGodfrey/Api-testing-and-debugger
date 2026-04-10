import { useState } from 'react';
import '../styles/ApiTestForm.css';

/**
 * API Test Form Component
 * Allows users to input API details and test them
 */
function ApiTestForm({ onTest, loading }) {
  const [formData, setFormData] = useState({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: null,
    timeout: 5000
  });

  const [bodyInput, setBodyInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBodyChange = (e) => {
    setBodyInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = bodyInput.trim() ? bodyInput : null;

    const testConfig = {
      url: formData.url,
      method: formData.method,
      headers: formData.headers ? JSON.parse(formData.headers) : {},
      body: body,
      timeout: parseInt(formData.timeout, 10)
    };

    onTest(testConfig);
  };

  const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <div className="form-card">
      <h2>API Request Tester</h2>
      <form onSubmit={handleSubmit}>
        
        {/* URL Input */}
        <div className="form-group">
          <label htmlFor="url">API Endpoint URL *</label>
          <input
            id="url"
            type="text"
            name="url"
            placeholder="https://api.example.com/endpoint"
            value={formData.url}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>

        {/* Method & Timeout */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="method">HTTP Method *</label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleInputChange}
              className="input-field"
            >
              {HTTP_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="timeout">Timeout (ms)</label>
            <input
              id="timeout"
              type="number"
              name="timeout"
              value={formData.timeout}
              onChange={handleInputChange}
              min="100"
              max="60000"
              className="input-field"
            />
          </div>
        </div>

        {/* Headers Input */}
        <div className="form-group">
          <label htmlFor="headers">Headers (JSON)</label>
          <textarea
            id="headers"
            name="headers"
            placeholder='{\n  "Authorization": "Bearer token",\n  "Custom-Header": "value"\n}'
            value={formData.headers}
            onChange={handleInputChange}
            rows="4"
            className="input-field textarea"
          />
          <small>Optional. Leave empty for default headers.</small>
        </div>

        {/* Body Input - only show for methods that typically have a body */}
        {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
          <div className="form-group">
            <label htmlFor="body">Request Body (JSON)</label>
            <textarea
              id="body"
              placeholder='{\n  "key": "value"\n}'
              value={bodyInput}
              onChange={handleBodyChange}
              rows="4"
              className="input-field textarea"
            />
            <small>Optional. Must be valid JSON.</small>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Testing API...' : 'Test API'}
        </button>
      </form>
    </div>
  );
}

export default ApiTestForm;
