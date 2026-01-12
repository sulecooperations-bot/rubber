# 🚨 Quick Fix for Netlify Deployment

## Your Issue
The deployed Netlify site shows zeros and empty charts because it can't connect to the backend API.

## Immediate Fix (5 minutes)

### Step 1: Get Your Backend URL
1. Go to [Railway Dashboard](https://railway.app)
2. Open your backend service
3. Copy the **Public URL** (e.g., `https://your-app.up.railway.app`)
4. Add `/api` to the end: `https://your-app.up.railway.app/api`

### Step 2: Configure Netlify Environment Variable
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app.up.railway.app/api` (use your actual Railway URL)
   - **Scopes**: ✅ Production, ✅ Deploy previews, ✅ Branch deploys
6. Click **"Save"**

### Step 3: Redeploy
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-3 minutes for build to complete

### Step 4: Configure CORS in Railway
1. Go back to Railway dashboard
2. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app` (your actual Netlify URL)
3. Railway will auto-restart

### Step 5: Seed Database (If Not Done)
1. In Railway, open your backend service
2. Go to **Terminal** tab
3. Run: `npm run seed`
4. Wait for completion

## Verify It Works

1. **Check Backend Health:**
   ```
   https://your-backend.railway.app/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Check Frontend:**
   - Visit your Netlify URL
   - Open browser console (F12)
   - Look for: `[API] Base URL configured: https://...`
   - Should see data loading (not zeros)

3. **Check Connection Status:**
   - Bottom-right corner should NOT show red "Disconnected" indicator
   - If it does, check the console for errors

## Common Mistakes to Avoid

❌ **Wrong URL format:**
- ❌ `https://your-app.up.railway.app` (missing `/api`)
- ❌ `https://your-app.up.railway.app/` (trailing slash)
- ✅ `https://your-app.up.railway.app/api` (correct)

❌ **Wrong variable name:**
- ❌ `API_URL` (won't work - Vite ignores it)
- ✅ `VITE_API_URL` (correct - Vite includes it)

❌ **Not redeploying:**
- Environment variables are baked into the build
- Must redeploy after adding/changing variables
- Use "Clear cache and deploy site"

## Still Not Working?

1. **Check Browser Console:**
   - Press F12
   - Look for red errors
   - Check Network tab for failed API calls

2. **Verify Environment Variable:**
   - In browser console, type: `console.log(import.meta.env.VITE_API_URL)`
   - Should show your Railway URL

3. **Check Railway Logs:**
   - Railway dashboard → Your service → Logs
   - Look for errors or CORS issues

4. **See Full Guide:**
   - Read `DEPLOYMENT_TROUBLESHOOTING.md` for detailed solutions

---

**After fixing, your site should show:**
- ✅ Real data (not zeros)
- ✅ Charts with data
- ✅ All features working
- ✅ No connection errors
