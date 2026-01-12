# 🔧 Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Dashboard Shows Zeros / Empty Data

**Symptoms:**
- All statistics show "0" (Total Area: 0 ha, Total Trees: 0, etc.)
- Charts are empty
- No data loading

**Causes & Solutions:**

#### A. VITE_API_URL Not Configured
**Solution:**
1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Click "Add a variable"
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend.up.railway.app/api`
   - **Scopes**: Production, Deploy previews, Branch deploys
4. Click "Save"
5. Go to **Deploys** tab → Click "Trigger deploy" → "Clear cache and deploy site"

#### B. Backend Not Running
**Solution:**
1. Check Railway dashboard to ensure backend is running
2. Test backend health: `https://your-backend.railway.app/api/health`
3. Should return: `{"status":"OK","message":"Rubber Plantation API is running"}`
4. If not running, check Railway logs for errors

#### C. CORS Configuration
**Solution:**
1. In Railway, add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app`
2. Restart the backend service in Railway

#### D. Database Not Seeded
**Solution:**
1. Go to Railway dashboard → Your backend service
2. Open Terminal tab
3. Run: `npm run seed`
4. Wait for completion
5. Refresh your Netlify site

---

### Issue 2: Network Errors / Cannot Connect to Backend

**Symptoms:**
- Browser console shows: "Network Error" or "Cannot connect to backend API"
- Connection status indicator shows red/disconnected

**Solutions:**

1. **Verify VITE_API_URL Format:**
   ```
   ✅ Correct: https://your-app.up.railway.app/api
   ❌ Wrong: https://your-app.up.railway.app (missing /api)
   ❌ Wrong: https://your-app.up.railway.app/ (trailing slash)
   ```

2. **Check Backend URL:**
   - Open Railway dashboard
   - Copy the public URL
   - Ensure it's accessible (try in browser)
   - Add `/api` to the end

3. **Test API Connection:**
   ```bash
   # In browser console or terminal
   curl https://your-backend.railway.app/api/health
   ```
   Should return JSON response

4. **Check CORS:**
   - Backend must have `FRONTEND_URL` set to your Netlify URL
   - Both URLs must match exactly (including https://)

---

### Issue 3: Build Fails on Netlify

**Symptoms:**
- Netlify build shows errors
- Deployment fails

**Solutions:**

1. **Check Build Logs:**
   - Go to Netlify → Deploys → Click on failed deploy
   - Check the build log for specific errors

2. **Common Build Issues:**

   **Missing Dependencies:**
   ```bash
   # Solution: Ensure all dependencies are in package.json
   cd frontend
   npm install
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push
   ```

   **Node Version:**
   - Netlify should use Node 18 (configured in netlify.toml)
   - If issues persist, add `.nvmrc` file:
     ```
     echo "18" > frontend/.nvmrc
     ```

   **Build Command:**
   - Verify in Netlify: Build command should be: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

---

### Issue 4: Charts Not Rendering

**Symptoms:**
- Charts show empty areas
- No data visualization

**Causes:**
1. API not returning data (see Issue 1)
2. Data format mismatch
3. JavaScript errors

**Solutions:**

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

2. **Verify API Response:**
   ```javascript
   // In browser console
   fetch('https://your-backend.railway.app/api/dashboard/stats')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Check Data Format:**
   - Dashboard expects: `{ totalArea, totalTrees, averageYield, healthIndex, ... }`
   - Trends expects: `{ yieldTrends: [...], rainfallData: [...] }`

---

### Issue 5: Routes Not Working (404 on Refresh)

**Symptoms:**
- Direct URL access shows 404
- Refresh on sub-pages fails

**Solution:**
- This should be fixed by `_redirects` file
- Verify `frontend/public/_redirects` exists with:
  ```
  /*    /index.html   200
  ```
- The build process should copy this to `dist/`
- If not working, manually add redirect in Netlify:
  - Site settings → Build & deploy → Post processing → Snippet injection
  - Or use Netlify's redirects UI

---

### Issue 6: Environment Variables Not Working

**Symptoms:**
- VITE_API_URL not being used
- Still connecting to wrong URL

**Solutions:**

1. **Variable Naming:**
   - Must start with `VITE_` for Vite to include it
   - ✅ `VITE_API_URL`
   - ❌ `API_URL` (won't work)

2. **Rebuild Required:**
   - Environment variables are baked into build
   - After adding/changing, must redeploy
   - Use "Clear cache and deploy site" option

3. **Verify in Build:**
   - Check Netlify build logs
   - Should see: `VITE_API_URL` in environment
   - Can add temporary log in `api.js`:
     ```javascript
     console.log('API URL:', import.meta.env.VITE_API_URL)
     ```

---

## Debugging Checklist

### Frontend (Netlify)
- [ ] VITE_API_URL is set in environment variables
- [ ] Variable starts with `VITE_`
- [ ] URL includes `/api` at the end
- [ ] Site was redeployed after adding variable
- [ ] Build completed successfully
- [ ] Check browser console for errors
- [ ] Check Network tab for API calls

### Backend (Railway)
- [ ] Service is running (green status)
- [ ] Health endpoint works: `/api/health`
- [ ] FRONTEND_URL is set correctly
- [ ] Database is seeded (`npm run seed`)
- [ ] Check logs for errors
- [ ] Port is correct (usually 5000 or Railway's assigned port)

### Connection
- [ ] Backend URL is accessible (try in browser)
- [ ] CORS allows Netlify domain
- [ ] No firewall blocking requests
- [ ] SSL certificates are valid (https)

---

## Quick Diagnostic Commands

### Test Backend Health
```bash
curl https://your-backend.railway.app/api/health
```

### Test API Endpoint
```bash
curl https://your-backend.railway.app/api/dashboard/stats
```

### Check Environment Variables (in browser console)
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('All env vars:', import.meta.env)
```

---

## Still Having Issues?

1. **Check Logs:**
   - Netlify: Deploys → Build log
   - Railway: Deployments → View logs
   - Browser: DevTools → Console & Network tabs

2. **Compare with Local:**
   - Does it work on localhost?
   - If yes, it's a deployment configuration issue
   - If no, it's a code issue

3. **Common Mistakes:**
   - Forgetting to add `/api` to backend URL
   - Not redeploying after env var changes
   - Wrong CORS URL (http vs https, www vs non-www)
   - Database not seeded

---

## Getting Help

If you're still stuck:
1. Check browser console for specific error messages
2. Check Network tab to see which API calls are failing
3. Verify all environment variables are set correctly
4. Ensure backend is running and accessible
5. Check that database has data (seed if needed)

---

**Last Updated:** After system optimization
**Version:** 1.0
