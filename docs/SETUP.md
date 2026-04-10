# Local Setup Guide

Complete step-by-step instructions for running the project locally.

## Prerequisites

Before you start, make sure you have:

- **Node.js 16 or higher** ([Download](https://nodejs.org/))
  ```bash
  node --version  # Should be v16.0.0 or higher
  npm --version   # Should be 7.0.0 or higher
  ```

- **Git** ([Download](https://git-scm.com/))
  ```bash
  git --version
  ```

- **A code editor** (VS Code recommended)

- **Internet connection** (to download packages and test external APIs)

## Directory Structure Reference

```
demo-app/
├── backend/          ← Start here for backend setup
├── frontend/         ← Start here for frontend setup
└── docs/            ← Documentation files
```

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory

```bash
cd backend
```

### 1.2 Copy Environment File

```bash
cp .env.example .env
```

**Contents of `.env` file (for local dev):**
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
REQUEST_TIMEOUT=5000
MAX_RESPONSE_SIZE=1000000
```

### 1.3 Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `axios` - HTTP client for making API requests
- `cors` - Cross-origin request handler
- `dotenv` - Environment variable loader

**Expected output:**
```
added 60 packages in 2s
```

### 1.4 Start Backend Server

```bash
npm run dev
```

Or for production-like testing:
```bash
npm start
```

**Expected output:**

**Backend is now running!** Keep this terminal open.

### 1.5 Test Backend (Optional)

In a **new terminal**, test the API:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"status":"healthy","service":"api-failure-visualizer",...}
```

## Step 2: Frontend Setup

### 2.1 Open New Terminal and Navigate to Frontend

```bash
# In a different terminal (keep backend running)
cd frontend
```

### 2.2 Copy Environment File

```bash
cp .env.example .env
```

**Contents of `.env` file:**
```
VITE_API_URL=http://localhost:5000
```

This tells the frontend where to find the backend API.

### 2.3 Install Dependencies

```bash
npm install
```

This installs:
- `react` - UI framework
- `react-dom` - React browser renderer
- `axios` - HTTP client
- `vite` - Build tool

**Expected output:**
```
added 150 packages in 3s
```

### 2.4 Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

**Frontend is now running!**

## Step 3: Open in Browser

1. Open http://localhost:5173 in your web browser
2. You should see the API Debugger interface

## Step 4: Test the Full Stack

### 4.1 Simple Test

1. **URL:** `https://jsonplaceholder.typicode.com/posts/1`
2. **Method:** `GET`
3. Click **"Test API"**

### Expected Result:
- ✓ Status shows "Success"
- Green success badge
- Response time displays
- Response preview shows JSON
- Entry added to "Recent Checks"

### 4.2 Test With 404 Error

1. **URL:** `https://jsonplaceholder.typicode.com/posts/99999`
2. **Method:** `GET`
3. Click **"Test API"**

### Expected Result:
- ✗ Status shows "Failed"
- Red error badge
- "Failure Analysis" explains the 404 error
- History updated

### 4.3 Test POST Request

1. **URL:** `https://jsonplaceholder.typicode.com/posts`
2. **Method:** `POST`
3. **Body:**
   ```json
   {
     "title": "Test Post",
     "body": "This is a test",
     "userId": 1
   }
   ```
4. Click **"Test API"**

### Expected Result:
- ✓ Success status
- Response shows created post with ID
- History updated

## Stopping the Servers

### Stop Backend
In the backend terminal:
```bash
Ctrl + C
```

### Stop Frontend
In the frontend terminal:
```bash
Ctrl + C
```

## Restarting Services

### To restart backend:
```bash
cd backend && npm run dev
```

### To restart frontend:
```bash
cd frontend && npm run dev
```

## Connecting Both Services

✓ Backend automatically listens on `http://localhost:5000`
✓ Frontend automatically points to backend via `.env` file
✓ CORS is configured for local development
✓ No additional configuration needed!

## Common Issues During Setup

### Issue: "Port 5000 already in use"

```bash
# Kill the process using port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Issue: "Cannot find module 'express'"

Make sure you ran `npm install` in the backend directory:
```bash
cd backend && npm install
```

### Issue: "CORS error in browser console"

```
Access to XMLHttpRequest blocked by CORS policy
```

Check that:
1. Backend is running on `http://localhost:5000`
2. Frontend `.env` has `VITE_API_URL=http://localhost:5000`
3. Backend `.env` has `FRONTEND_URL=http://localhost:5173`

### Issue: "Cannot connect to backend"

1. Verify backend terminal shows "Server running..."
2. Test manually:
   ```bash
   curl http://localhost:5000/api/health
   ```
3. Check port 5000 is not blocked by firewall

## Development Workflow

### Hot Reload

Both services support hot reload:

**Backend** (`npm run dev`):
- Automatically restarts when you change code
- Check terminal for changes logged

**Frontend** (`npm run dev`):
- Files update instantly in browser
- No page reload needed

### Making Code Changes

1. Edit a file (e.g., `frontend/src/components/ApiTestForm.jsx`)
2. Save the file
3. Changes appear immediately in browser
4. Check console for errors

## File Organization During Development

```
Terminal 1: Backend loaded
$ cd backend && npm run dev

Terminal 2: Frontend loaded
$ cd frontend && npm run dev

Terminal 3: Testing/git commands
$ cd .
```

## Next Steps

1. **Learn the code structure** - See `docs/API.md` for backend endpoints
2. **Modify the UI** - Edit files in `frontend/src/components/`
3. **Extend backend** - Add new endpoints in `backend/src/routes/`
4. **Deploy** - Follow `docs/DEPLOYMENT.md` when ready

## Quick Reference Commands

| Command | What it does |
|---------|-------------|
| `cd backend && npm install` | Install backend dependencies |
| `cd backend && npm run dev` | Start backend in development mode |
| `cd backend && npm start` | Start backend in production mode |
| `cd frontend && npm install` | Install frontend dependencies |
| `cd frontend && npm run dev` | Start frontend dev server |
| `cd frontend && npm run build` | Build frontend for production |

## Troubleshooting Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List all running Node processes
ps aux | grep node

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies fresh
rm -rf node_modules package-lock.json && npm install
```

## Environment Variables Cheat Sheet

### Backend (.env)
```
PORT=5000                    # Port backend listens on
NODE_ENV=development         # development or production
FRONTEND_URL=http://localhost:5173  # Where frontend runs
REQUEST_TIMEOUT=5000         # Timeout for API requests (ms)
MAX_RESPONSE_SIZE=1000000    # Max response size (bytes)
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000  # Where backend is
```

## You're Ready!

- ✓ Backend running on http://localhost:5000
- ✓ Frontend running on http://localhost:5173
- ✓ Full integration working
- ✓ History storing test results
- ✓ Error analysis displaying

Start testing APIs and enjoy! 

---

**Need help?** Check `docs/TROUBLESHOOTING.md` for more common issues.
