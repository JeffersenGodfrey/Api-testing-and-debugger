# Troubleshooting Guide

Solutions for common issues and problems.

## Table of Contents

1. [Local Development Issues](#local-development)
2. [Backend Issues](#backend-issues)
3. [Frontend Issues](#frontend-issues)
4. [CORS & Network Issues](#cors--network)
5. [AWS Deployment Issues](#aws-deployment)
6. [Performance Issues](#performance)
7. [Getting Help](#getting-help)

---

## Local Development

### "Port 5000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use this shortcut
lsof -ti:5000 | xargs kill -9
```

**Windows (PowerShell):**
```powershell
# Find process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill process
Stop-Process -Id <PID> -Force

# Or use netstat
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Alternative:** Change port in backend `.env`:
```
PORT=5001  # Use different port
```

Then update frontend `.env`:
```
VITE_API_URL=http://localhost:5001
```

---

### "Cannot find module 'express'"

**Error:**
```
Error: Cannot find module 'express'
```

**Solutions:**

1. **Make sure you're in the right directory:**
   ```bash
   cd backend
   npm install
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be 16+
   ```

---

### "Backend not responding"

**Symptoms:**
- Frontend shows "Cannot connect to server"
- API tests hang or fail
- Network error in browser console

**Debugging:**

```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# 2. Check port
lsof -i :5000  # macOS/Linux

# 3. Check firewall
# Windows: Check if port 5000 in firewall exceptions
# macOS: System Preferences > Security & Privacy

# 4. Restart backend
npm run dev
```

---

### "CORS error: No 'Access-Control-Allow-Origin' header"

**Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
1. Backend not running
2. Backend URL in frontend `.env` is wrong
3. CORS not configured properly

**Solutions:**

```bash
# 1. Verify backend running
curl http://localhost:5000/api/health

# 2. Check frontend .env
cat frontend/.env
# Should show: VITE_API_URL=http://localhost:5000

# 3. Check backend .env
cat backend/.env
# Should include: FRONTEND_URL=http://localhost:5173

# 4. Restart both services
# Kill both processes and restart
```

---

### Terminal shows "npm: command not found"

**Problem:** npm not installed or not in PATH

**Solutions:**

```bash
# Check if Node.js installed
node --version

# If not installed, download from https://nodejs.org/

# Check npm
npm --version

# If npm not in PATH, add Node.js to system PATH
# Windows: Add C:\Program Files\nodejs to PATH
# macOS: Usually auto-added
# Linux: Usually auto-added
```

---

## Backend Issues

### "Backend starts but won't accept requests"

**Problem:** Backend listens on 127.0.0.1, not 0.0.0.0

**Check:**
```bash
# Is backend truly listening?
netstat -an | grep 5000

# Should show 0.0.0.0:5000, not 127.0.0.1:5000
```

**Fix:** Check `src/server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => {  // Make sure this is '0.0.0.0'
  // ...
});
```

For EC2, this is critical.

---

### "API test fails with 'Cannot parse body'"

**Error:**
```json
{
  "error": "Request body must be valid JSON",
  "type": "VALIDATION_ERROR"
}
```

**Cause:** Invalid JSON in request body

**Solution:**

Use valid JSON:
```bash
# Valid
{"name": "test"}

# Invalid (wrong quotes)
{'name': 'test'}

# Invalid (missing quotes on keys)
{name: test}

# Use online validator
# https://jsonlint.com/
```

---

### "History not persisting"

**Problem:** History clears when backend restarts

**Reason:** In-memory storage is by design (v1)

**Solution:** For persistent storage, add database:
```javascript
// Use MongoDB or PostgreSQL instead of in-memory
// See "Future Enhancements" in README
```

---

### "Backend crashes randomly"

**Error:** Process exits with no message

**Debugging:**

```bash
# Use PM2 to catch crashes
npm install -g pm2

pm2 start src/server.js --name "api-visualizer"
pm2 logs api-visualizer  # See crash details

pm2 restart api-visualizer
```

**Common causes:**
- Out of memory
- Unhandled exception
- Port conflict

---

### "Response truncated or doesn't show"

**Problem:** Long API responses cut off at 500 characters

**Reason:** Intentional limit to prevent huge output

**Solution:**

Increase limit in `backend/src/utils/debugInsight.js`:
```javascript
export function formatResponsePreview(data, maxLength = 1000) {  // Change 500 to 1000
  // ...
}
```

Then restart backend.

---

## Frontend Issues

### "Frontend won't start - Port 5173 in use"

```bash
# Find process
lsof -i :5173

# Kill it
kill -9 <PID>
```

---

### "Blank page when opening frontend"

**Debugging steps:**

1. **Check console errors (F12):**
   - Browser DevTools > Console tab
   - Look for red errors

2. **Check backend connection:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check frontend `.env`:**
   ```bash
   cat frontend/.env
   ```

4. **Restart frontend:**
   ```bash
   npm run dev
   ```

5. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Or open in incognito/private mode

---

### "Components not updating when code changes"

**Problem:** Hot reload not working

**Solution:**

```bash
# Stop and restart
Ctrl+C
npm run dev

# If still not working, clean cache
rm -rf node_modules .vite
npm install
npm run dev
```

---

### "Cannot read properties of undefined"

**Error:** React component crashes

**Debugging:**
1. Check browser console (F12)
2. Look at the exact error line
3. Add null checks:
   ```javascript
   {result?.success && <div>Success!</div>}
   ```

---

### "Styles not loading"

**Problem:** Page looks unstyled/broken layout

**Solution:**

```bash
# Make sure CSS files are imported
grep -r "import.*css" frontend/src/

# Should show:
# src/styles/globals.css
# src/App.css
# etc.

# Restart:
npm run dev
```

---

## CORS & Network

### "CORS error when testing external API"

**Error:** Browser console shows CORS block

**Why:** Browser enforces CORS. Your backend doesn't.

**Expected:** Tests should work from frontend because backend adds CORS headers.

**If not working:**

```bash
# Check backend .env FRONTEND_URL
# Should match your frontend URL exactly

# For local dev:
FRONTEND_URL=http://localhost:5173

# Restart backend
npm run dev
```

---

### "Cannot reach API endpoint"

**Problem:** API test shows network error

**Debugging:**

```bash
# Test from backend (SSH if on EC2)
curl https://api.example.com/endpoint

# Is the endpoint real?
# Is the domain accessible?
# Check for typos in URL
```

**Common mistakes:**
- Typo in domain
- Forgotten https://
- Endpoint requires authentication
- Endpoint has rate limiting

---

### "Timeout on slow APIs"

**Problem:** API test times out

**Default:** 5000ms (5 seconds)

**Solution:**

Increase timeout in frontend form:
```
Timeout: 10000  (10 seconds)
```

Or set in test form max to 60000ms in code if needed.

---

## AWS Deployment

### "S3 bucket name invalid"

**Error:** "The specified bucket already exists"

**Cause:** S3 bucket names must be globally unique

**Solution:**

Use a unique name:
```bash
# Instead of:
api-visualizer-prod

# Use:
api-visualizer-prod-YOURNAME-12345
```

---

### "Cannot upload files to S3"

**Error:** Access Denied or permission issues

**Solutions:**

1. **Check IAM permissions:**
   ```bash
   # You need:
   # - s3:PutObject
   # - s3:GetObject
   # - s3:ListBucket
   ```

2. **Check AWS credentials:**
   ```bash
   aws configure
   # Enter Access Key ID
   # Enter Secret Access Key
   # Choose region
   ```

3. **Verify bucket name:**
   ```bash
   aws s3 ls  # List all buckets
   ```

---

### "S3 website returns 403 Forbidden"

**Problem:** Can't access S3 hosted site publicly

**Causes:**
1. Bucket policy not set
2. Block Public Access settings enabled

**Solutions:**

1. **Update bucket policy:**
   - Go to S3 > Bucket > Permissions > Bucket Policy
   - Add public read policy

2. **Disable Block Public Access:**
   - Permissions > Block public access
   - Uncheck all boxes

3. **Enable static website hosting:**
   - Properties > Static website hosting
   - Enable it

---

### "EC2 connection times out"

**Error:** Cannot SSH to instance

**Debugging:**

```bash
# 1. Instance running?
aws ec2 describe-instances --query 'Reservations[0].Instances[0].[InstanceId,State.Name,PublicIpAddress]'

# 2. Security group allows SSH?
# AWS Console > EC2 > Security Groups
# Should have port 22 inbound rule

# 3. IP address changed?
# Get new public IP and reconnect

# 4. Key pair permissions
chmod 400 key.pem
```

---

### "Backend on EC2 won't start"

**SSH to instance first:**

```bash
ssh -i key.pem ec2-user@EC2_IP

# Then debug:
cd backend
npm start

# Check errors:
pm2 logs api-visualizer
```

**Common issues:**
- Port 5000 already used
- Node.js not installed
- Dependencies not installed (npm install)
- `.env` file missing or misconfigured

---

### "Frontend on S3 shows localhost URLs"

**Problem:** Frontend still points to localhost:5000

**Cause:** Frontend built with old `.env`

**Solution:**

```bash
# 1. Update frontend/.env with EC2 IP
VITE_API_URL=http://EC2_IP:5000

# 2. Rebuild frontend
npm run build

# 3. Upload to S3
aws s3 sync dist/ s3://bucket-name --delete
```

---

### "CloudFront caching old files"

**Problem:** Frontend shows old version

**Solutions:**

```bash
# 1. Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"

# 2. Or disable caching on static assets
# CloudFront > Behaviors > Cache Policy

# 3. Or use versioned file names
# (Vite does this automatically)
```

---

## Performance

### "API tests very slow"

**Debugging:**

```bash
# 1. Check backend response time
curl http://localhost:5000/api/health
# Should be <100ms

# 2. Check target API speed
time curl https://target-api.com/endpoint
# Note the time

# 3. Check network latency
ping target-api.com
```

**Optimization:**
- Target API may be slow or far away
- Network latency contributes
- Large responses take longer

---

### "Memory usage high on EC2"

```bash
# SSH to instance
ssh -i key.pem ec2-user@IP

# Check memory
free -h

# Check Node process
ps aux | grep node

# Check PM2
pm2 monit

# If running out of memory:
# 1. Reduce history size in historyService.js
# 2. Upgrade EC2 instance type
# 3. Add Redis for caching (optional)
```

---

### "Build process very slow"

```bash
# Frontend build taking too long?
npm run build

# Can be slow on low-end machines
# Minimize CSS if needed
```

---

## Getting Help

### Gather Debug Information

When posting issues, include:

```bash
# 1. Node.js version
node --version

# 2. npm version
npm --version

# 3. Environment (.env files - redact secrets!)
cat backend/.env
cat frontend/.env

# 4. Error message
# Full error from terminal or console

# 5. Which service fails?
# Frontend? Backend? Both?

# 6. Is it local or deployed?
# Localhost or AWS?

# 7. Recent changes?
# What did you modify?
```

### Useful Commands

```bash
# Restart everything
pkill -f "node src/server.js"
cd backend && npm run dev

# New terminal
cd frontend && npm run dev

# Test backend
curl -v http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173

# Check logs
# macOS/Linux:
grep -r "error" backend/src/*.js

# Debug API test
npm run dev 2>&1 | grep -i error
```

### Still Stuck?

1. **Re-read docs:**
   - `docs/SETUP.md` - Setup help
   - `docs/API.md` - API reference
   - `docs/DEPLOYMENT.md` - Deployment issues

2. **Check the code:**
   - Comments in source code explain logic
   - Error messages usually point to problem
   - Check response format matches API reference

3. **Try minimal test:**
   - Use `https://httpbin.org/status/200` to test
   - This should always work
   - If fails, backend issue
   - If works, target API issue

4. **Search online:**
   - Error message + "Node.js"
   - Error message + "Express"
   - Error message + "React"

---

## Quick Fixes Checklist

- [ ] Both services running? (npm run dev in both terminals)
- [ ] Frontend .env pointing to correct backend?
- [ ] Backend .env has correct FRONTEND_URL?
- [ ] Ports not blocked by firewall?
- [ ] No typos in URLs?
- [ ] API endpoint actually exists?
- [ ] API doesn't require authentication?
- [ ] Browser console open? (Check for errors)
- [ ] Terminal shows actual startup messages?
- [ ] Tried hard refresh (Ctrl+Shift+R)?

---

**Most issues solved by restarting both services and checking .env files!**

Good luck! 
