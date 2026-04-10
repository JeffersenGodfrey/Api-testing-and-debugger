# Cloud-Based API Failure Visualizer & Debugger

A professional, interview-ready web application for testing API endpoints and understanding failures through intelligent debugging insights.

## Quick Overview

**What is it?**
A lightweight API testing and debugging tool that helps developers test any API endpoint and get instant failure analysis.

**Why build this?**
- Demonstrates full-stack cloud development (S3 frontend + EC2 backend)
- Shows real-world API integration and error handling
- Teaches monitoring and debugging concepts
- Production-ready code suitable for portfolio and interviews

**Tech Stack**
- Frontend: React + Vite, hosted on Amazon S3
- Backend: Node.js + Express, hosted on Amazon EC2
- Communication: REST API via Axios

## Architecture

```
┌─────────────────────┐
│   Browser / S3      │  (Frontend: React)
│  Static Website     │  - Test form UI
│  (Vite Build)       │  - Results display
└──────────┬──────────┘  - History tracking
           │ HTTP
           ↓
┌─────────────────────┐
│   EC2 Instance      │  (Backend: Node.js + Express)
│     API Server      │  - API testing service
│   :5000             │  - Debug insights
└─────────────────────┘  - History storage

```

## Key Features

**API Testing**
- Test any HTTP endpoint
- Support for GET, POST, PUT, DELETE, PATCH, etc.
- Custom headers support
- JSON body support
- Configurable timeout

**Intelligent Failure Analysis**
- Human-readable error explanations
- Context-specific debugging hints
- Status code interpretation
- Network error detection

**Response Handling**
- Response time measurement
- Status code capture
- Response preview (JSON or text)
- Error message display

**Test History**
- Store recent API tests (last 20)
- Quick access to previous results
- Clear history option
- Click to view details

**Production Deployment Ready**
- Static S3 frontend
- Stateless EC2 backend
- Environment variable configuration
- Health check endpoint
- CORS support

## Project Structure

```
demo-app/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── server.js          # Main server entry point
│   │   ├── middleware/        # CORS, error handling
│   │   ├── routes/            # API routes definition
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   │   ├── apiTestService.js
│   │   │   └── historyService.js
│   │   └── utils/             # Helper functions
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Main component
│   │   ├── components/        # React components
│   │   │   ├── ApiTestForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── HistorySection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js         # API communication
│   │   ├── utils/
│   │   │   └── helpers.js     # Utility functions
│   │   └── styles/            # Component CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── docs/                       # Documentation
│   ├── SETUP.md              # Local setup guide
│   ├── DEPLOYMENT.md         # S3 + EC2 deployment
│   ├── API.md                # Backend API reference
│   └── TROUBLESHOOTING.md    # Common issues
│
└── README.md                  # This file
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Git

### 1. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs at http://localhost:5173
```

### 3. Test It

Open http://localhost:5173 in your browser.

Try testing an API:
- URL: `https://jsonplaceholder.typicode.com/posts`
- Method: `GET`
- Click "Test API"

You should see:
- ✓ Success status
- Response time
- Response preview
- Entry in recent history

## API Contract

### POST /api/test
Test an API endpoint.

**Request:**
```json
{
  "url": "https://jsonplaceholder.typicode.com/posts",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null,
  "timeout": 5000
}
```

**Response (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "responseTimeMs": 142,
  "timestamp": "2026-04-10T10:30:00.000Z",
  "url": "https://jsonplaceholder.typicode.com/posts",
  "method": "GET",
  "responsePreview": {
    "type": "json",
    "data": "[{...}]"
  },
  "debugInsight": "✓ API responded quickly and successfully.",
  "historyId": "abc123"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "statusCode": 404,
  "responseTimeMs": 210,
  "timestamp": "2026-04-10T10:32:00.000Z",
  "url": "https://example.com/bad-route",
  "method": "GET",
  "errorType": "HTTP_ERROR",
  "errorMessage": "Request failed with status code 404",
  "debugInsight": "🔍 Not Found (404). The endpoint does not exist...",
  "responsePreview": {
    "type": "text",
    "data": "Not Found"
  },
  "historyId": "def456"
}
```

### GET /api/history
Get recent test results.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### DELETE /api/history
Clear all test history.

**Response:**
```json
{
  "success": true,
  "message": "History cleared",
  "count": 0
}
```

### GET /api/health
Backend health check.

**Response:**
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

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
REQUEST_TIMEOUT=5000
MAX_RESPONSE_SIZE=1000000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

For production, update these to your EC2 and S3 URLs.

## Deployment to AWS

### 1. Deploy Frontend to S3

```bash
cd frontend

# Build frontend
npm run build

# This creates a 'dist' folder

# Upload to S3
# Option A: AWS Console
#   - Create S3 bucket
#   - Upload contents of 'dist' folder
#   - Enable static website hosting
#
# Option B: AWS CLI
aws s3 sync dist/ s3://your-bucket-name --delete

# Update bucket policy for public access
```

### 2. Deploy Backend to EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone or upload code
git clone your-repo
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with production values

# Start backend
npm start

# For persistent running, use PM2 or similar
# sudo npm install -g pm2
# pm2 start src/server.js --name "api-visualizer"
```

### 3. Security Setup

```bash
# EC2 Security Group
# - Allow inbound on port 5000 from your frontend S3 IP
# - Allow inbound on port 22 for SSH (your IP only)
# - Allow outbound on port 443 (HTTPS for external APIs)
```

See `docs/DEPLOYMENT.md` for detailed instructions.

## Testing

### Local Testing

```bash
# All endpoints respond at http://localhost:5000

# Test health
curl http://localhost:5000/api/health

# Test API testing
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://httpbin.org/status/200",
    "method": "GET",
    "timeout": 5000
  }'

# Get history
curl http://localhost:5000/api/history

# Clear history
curl -X DELETE http://localhost:5000/api/history
```

### Browser Testing

1. Start both backend and frontend locally
2. Open http://localhost:5173
3. Try different API endpoints:
   - Working: `https://httpbin.org/status/200`
   - 404: `https://httpbin.org/status/404`
   - Timeout: `https://httpbin.org/delay/10` (with 5000ms timeout)
   - Network error: `https://invalid-domain-12345.com`

## Performance Metrics

- **Frontend build size:** ~150KB (Vite optimized)
- **Backend startup time:** <1 second
- **API test latency:** 200-500ms (depends on target API)
- **Memory usage:** ~50MB (backend) + 30MB (frontend in browser)

## Security Features

✓ Input validation (URL, method, headers, body)
- CORS properly configured
- Request timeout limits (100ms - 60s)
- Response size limits (1MB max)
- Error messages don't leak sensitive info
- No authentication required (stateless)

## What Real-World Problem Does This Solve?

**Common Developer Workflows:**
1. Developer is testing API integrations
2. API fails, they need to debug quickly
3. Unclear why it failed (network? auth? endpoint?)
4. Manual curl commands are tedious
5. Browser DevTools show CORS errors, not root cause

**This Tool:**
✓ One-click API testing
✓ Intelligent error explanations
✓ History for regression testing
✓ Works for ANY public API
✓ No setup needed (just a URL)

**Real Use Cases:**
- Testing third-party APIs before integrating
- Debugging webhook URLs
- Load testing API endpoints
- Learning HTTP protocols
- Interview demos of DevOps understanding

## Interview Explanation

**"Why S3 for frontend?"**
- Static assets don't require compute
- Auto-scales without server costs
- CDN integration (CloudFront) for global performance
- Simple deployment pipeline
- Perfect for SPAs (React)

**"Why EC2 for backend?"**
- Need full Node.js runtime
- Outbound HTTP requests (to test APIs)
- Stateless design = easy horizontal scaling
- Lower cost than Lambda for continuously running service
- Full control over dependencies

**"How would you scale this?"**
- Frontend: S3 + CloudFront for caching
- Backend: EC2 Auto Scaling + ALB
- Add RDS for persistent history (optional)
- Add CloudWatch for monitoring
- Use CodePipeline for CI/CD

## Future Enhancements

- [ ] User authentication & saved profiles
- [ ] API endpoint bookmarks
- [ ] Request/response formatting options
- [ ] Multi-step API workflows
- [ ] Archive old history to S3
- [ ] CloudWatch integration for metrics
- [ ] GraphQL support
- [ ] WebSocket testing
- [ ] OAuth flow simulator
- [ ] Rate limiting visualization
- [ ] IP geolocation for API endpoints
- [ ] Batch API testing

## Common Issues & Troubleshooting

**"CORS error in browser"**
- Ensure backend running on correct port
- Check `.env` FRONTEND_URL matches your frontend URL
- Browser same-origin policy blocks cross-origin requests

**"API test hangs"**
- Increase timeout value
- Check if target API is responsive
- Verify network connectivity

**"Backend won't start"**
- Check port 5000 not already in use
- Verify Node.js installed: `node --version`
- Check `.env` file exists

See `docs/TROUBLESHOOTING.md` for more issues.

## Code Quality

- ✓ Beginner-friendly comments
- ✓ Clear function names
- ✓ Separated concerns (controllers, services, utils)
- ✓ Error handling throughout
- ✓ Environment variable configuration
- ✓ No hardcoded values
- ✓ Easy to modify and extend

## Resume Bullet Points

• Built full-stack API testing tool (React frontend on S3, Node.js backend on EC2) demonstrating cloud DevOps architecture and AWS deployment practices
• Implemented intelligent API failure analysis system with context-specific debugging insights for 7+ HTTP error types and network error categories
· Designed stateless, production-ready backend with CORS support, request validation, in-memory history storage, and health check endpoint for EC2 monitoring

## License

MIT

## Questions?

This project is designed to be self-documenting and interview-ready. All code includes helpful comments and follows clear patterns.

---

**Last Updated:** April 2026
