# API Reference

Complete documentation of all backend endpoints.

## Base URL

**Local Development:**
```
http://localhost:5000
```

**Production (EC2):**
```
http://YOUR-EC2-IP:5000
```

## Authentication

No authentication required. All endpoints are public.

## Response Format

All successful responses return:
```json
{
  "success": true,
  "data": {...}
}
```

All error responses return:
```json
{
  "success": false,
  "error": "Error message",
  "type": "ERROR_TYPE"
}
```

---

## Endpoints

### 1. POST /api/test

Test an API endpoint and get detailed results.

**Description:**
Makes a request to the specified API endpoint and returns:
- Response status code
- Response time
- Response body preview
- Error analysis and debugging insights
- Unique history ID

**Request Body:**
```json
{
  "url": "https://jsonplaceholder.typicode.com/posts/1",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  "body": null,
  "timeout": 5000
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Full URL to test (http/https) |
| `method` | string | Yes | HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS) |
| `headers` | object | No | Custom HTTP headers |
| `body` | string\|object | No | Request body (JSON). Required for POST/PUT/PATCH |
| `timeout` | number | No | Request timeout in milliseconds (default: 5000, min: 100, max: 60000) |

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "timeout": 5000
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "responseTimeMs": 145,
  "timestamp": "2026-04-10T10:30:00.000Z",
  "url": "https://jsonplaceholder.typicode.com/posts",
  "method": "GET",
  "responsePreview": {
    "type": "json",
    "data": "[{\"userId\": 1, \"id\": 1, ...}]"
  },
  "debugInsight": "✓ API responded quickly and successfully.",
  "historyId": "1712753400000-a1b2c3d4e"
}
```

**Failure Response (HTTP Error):**
```json
{
  "success": false,
  "statusCode": 404,
  "responseTimeMs": 210,
  "timestamp": "2026-04-10T10:32:00.000Z",
  "url": "https://jsonplaceholder.typicode.com/posts/99999",
  "method": "GET",
  "errorType": "HTTP_ERROR",
  "errorMessage": "Request failed with status code 404",
  "responsePreview": {
    "type": "text",
    "data": "{}"
  },
  "debugInsight": " Not Found (404). The endpoint does not exist. Verify the URL is correct.",
  "historyId": "1712753400000-f5g6h7i8j"
}
```

**Failure Response (Network Error):**
```json
{
  "success": false,
  "statusCode": null,
  "responseTimeMs": 5012,
  "timestamp": "2026-04-10T10:33:00.000Z",
  "url": "https://invalid-domain-12345.com/api",
  "method": "GET",
  "errorType": "NETWORK_ERROR",
  "errorMessage": "getaddrinfo ENOTFOUND invalid-domain-12345.com",
  "responsePreview": {
    "type": "text",
    "data": "(empty response)"
  },
  "debugInsight": " Domain resolution failed. Verify that the domain name is correct and accessible.",
  "historyId": "1712753400000-k9l0m1n2o"
}
```

**Error Response (Validation Error):**
```json
{
  "success": false,
  "error": "URL must be a valid HTTP/HTTPS URL",
  "type": "VALIDATION_ERROR"
}
```

**Debug Insights by Error Type:**

| 200 (Success)    | API responded successfully (optionally notes latency) |
| 400 Bad Request  | Check URL parameters and request body syntax |
| 401 Unauthorized | Check API key or authentication credentials |
| 403 Forbidden    | You don't have permission to access this resource |
| 404 Not Found    | The endpoint doesn't exist, verify the URL |
| 429 Rate Limited | Too many requests, wait before retrying |
| 500 Server Error | The API encountered an error, try again later |
| Network Error    | Connection issue, check domain and connectivity |
| Timeout          | API took too long to respond |

---

### 2. GET /api/history

Retrieve all recent API test results.

**Description:**
Returns list of recent tests (last 20), newest first.

**Request:**
```bash
curl http://localhost:5000/api/history
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "success": true,
      "statusCode": 200,
      "responseTimeMs": 145,
      "timestamp": "2026-04-10T10:30:00.000Z",
      "url": "https://jsonplaceholder.typicode.com/posts",
      "method": "GET",
      "responsePreview": {
        "type": "json",
        "data": "[...]"
      },
      "debugInsight": "✓ API responded quickly and successfully.",
      "historyId": "1712753400000-a1b2c3d4e",
      "addedAt": "2026-04-10T10:30:00.000Z"
    },
    {
      "success": false,
      "statusCode": 404,
      "responseTimeMs": 210,
      "timestamp": "2026-04-10T10:29:00.000Z",
      "url": "https://jsonplaceholder.typicode.com/invalid",
      "method": "GET",
      "errorType": "HTTP_ERROR",
      "errorMessage": "Request failed with status code 404",
      "responsePreview": {
        "type": "text",
        "data": "{}"
      },
      "debugInsight": "🔍 Not Found (404). The endpoint does not exist.",
      "historyId": "1712753400000-f5g6h7i8j",
      "addedAt": "2026-04-10T10:29:00.000Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true for this endpoint |
| `count` | number | Number of history entries |
| `data` | array | Array of test results (see POST /api/test response) |

---

### 3. DELETE /api/history

Clear all test history.

**Description:**
Removes all stored API test results. Cannot be undone.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/history
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "History cleared",
  "count": 0
}
```

**Confirmation:**
After this call:
- GET /api/history returns empty data array
- All previous test results are deleted
- Storage is reset for new tests

---

### 4. GET /api/health

Check backend health status.

**Description:**
Returns backend service health information.

Useful for:
- Monitoring backend availability
- EC2 health checks
- Load balancer heartbeats
- Integration verification

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "service": "api-failure-visualizer",
  "timestamp": "2026-04-10T10:30:00.000Z",
  "uptime": 3600,
  "historyCount": 12,
  "environment": "production"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true if healthy |
| `status` | string | Always "healthy" |
| `service` | string | Service name |
| `timestamp` | string | Current UTC timestamp |
| `uptime` | number | Server uptime in seconds |
| `historyCount` | number | Number of tests in memory |
| `environment` | string | "development" or "production" |

**Use Cases:**

```bash
# Continuous monitoring
watch -n 5 'curl -s http://localhost:5000/api/health | jq .'

# Load balancer health check URL
# GET http://backend-ip:5000/api/health

# Simple status check
curl http://localhost:5000/api/health | head -c 1
# Returns "{ " if healthy, error otherwise
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid request (validation error) |
| 404 | Endpoint not found |
| 500 | Server error |

### Response Error Types

| Type | Cause | Solution |
|------|-------|----------|
| `VALIDATION_ERROR` | Invalid input | Check URL format, method, timeout |
| `NETWORK_ERROR` | Can't reach target API | Verify domain/network connectivity |
| `INTERNAL_ERROR` | Backend error | Check server logs |
| `HTTP_ERROR` | Target API errors (4xx/5xx) | Review target API response |
| `REQUEST_ERROR` | Request preparation failed | Check headers/body format |

---

## Rate Limiting

**Current:** No rate limiting (suitable for small usage)

**To implement if needed:**
```javascript
// Add rate limiting middleware
// Max 100 requests per 15 minutes per IP
```

---

## Timeouts

- **Minimum:** 100ms
- **Maximum:** 60,000ms (60 seconds)
- **Default:** 5,000ms (5 seconds)

Setting timeout too low may cause false timeouts.

---

## Request Size Limits

- **Header size:** Unlimited
- **Body size:** 10MB max
- **Response preview:** 500 characters max

---

## CORS Headers

Backend includes:
```
Access-Control-Allow-Origin: (configured in .env)
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Response Time

Expected latency:
- Local: 10-50ms
- S3 + EC2: 50-200ms
- Depends on target API: 100-5000ms typical

---

## Pagination

History is limited to 20 most recent entries.
Older entries are automatically removed.

Future feature: Pagination support.

---

## Example: Complete Workflow

```bash
# 1. Test a public API
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/repos/torvalds/linux",
    "method": "GET",
    "timeout": 10000
  }' | jq .

# 2. View all test history
curl http://localhost:5000/api/history | jq '.'

# 3. Check backend health
curl http://localhost:5000/api/health | jq '.'

# 4. Clear history when done
curl -X DELETE http://localhost:5000/api/history | jq '.'
```

---

## Example: Integration in Code

**Node.js:**
```javascript
const axios = require('axios');

const result = await axios.post('http://localhost:5000/api/test', {
  url: 'https://api.example.com/data',
  method: 'GET',
  timeout: 5000
});

console.log(result.data.debugInsight);
```

**JavaScript (Fetch):**
```javascript
const response = await fetch('http://localhost:5000/api/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://api.example.com/data',
    method: 'GET'
  })
});

const data = await response.json();
console.log(data.debugInsight);
```

**Python:**
```python
import requests

response = requests.post('http://localhost:5000/api/test', json={
    'url': 'https://api.example.com/data',
    'method': 'GET',
    'timeout': 5000
})

print(response.json()['debugInsight'])
```

---

## Monitoring & Logging

**View backend logs:**
```bash
# Development
npm run dev  # Shows all logs in terminal

# Production (PM2)
pm2 logs api-visualizer
```

**Log includes:**
- Incoming requests
- Outgoing API calls
- Error messages
- Server events

---

**Full API documentation complete!**

For more help, see `docs/TROUBLESHOOTING.md`.
