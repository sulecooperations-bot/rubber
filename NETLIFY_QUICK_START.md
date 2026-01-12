# 🚀 Quick Netlify Deployment Guide

Your code is now on GitHub at: **https://github.com/sulecooperations-bot/rubber**

## Step-by-Step Netlify Deployment

### 1. Deploy Backend First (Railway - Recommended)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select repository: `sulecooperations-bot/rubber`
4. Click **"Add Service"** → **"GitHub Repo"**
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_PATH=./database/rubber_plantation.db
   ```
7. Wait for deployment and **copy your Railway URL** (e.g., `https://your-app.up.railway.app`)

### 2. Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select repository: `sulecooperations-bot/rubber`

### 3. Configure Netlify Build Settings

In the Netlify deployment settings:

- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`

### 4. Add Environment Variables in Netlify

Go to **Site settings** → **Environment variables** → **Add variable**

Add these variables:

```
VITE_API_URL = https://your-railway-app.up.railway.app/api
VITE_APP_NAME = SPATIO SDS - RubberPanel
VITE_BASEMAP_TYPE = XYZ
VITE_BASEMAP_URL = https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_BASEMAP_ATTRIBUTION = © OpenStreetMap contributors
```

**Important**: Replace `https://your-railway-app.up.railway.app` with your actual Railway backend URL!

### 5. Update Backend CORS

Go back to Railway and add this environment variable:

```
FRONTEND_URL = https://your-netlify-site.netlify.app
```

Replace with your actual Netlify URL (you'll get it after deployment).

### 6. Deploy!

1. Click **"Deploy site"** in Netlify
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at: `https://random-name-123.netlify.app`

### 7. Seed the Database

1. Go to Railway dashboard
2. Click on your backend service
3. Open the **"Deployments"** tab
4. Click **"View Logs"** or use the **"Terminal"** tab
5. Run:
   ```bash
   npm run seed
   ```

## ✅ Verification Checklist

- [ ] Backend deployed on Railway
- [ ] Backend health check works: `https://your-backend.railway.app/api/health`
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set in Netlify
- [ ] CORS configured in Railway (FRONTEND_URL)
- [ ] Database seeded
- [ ] Frontend can connect to backend (check browser console)

## 🔧 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Railway matches your Netlify URL exactly
- Include `https://` in the URL

### API Not Found
- Verify `VITE_API_URL` in Netlify includes `/api` at the end
- Check Railway logs to ensure backend is running

### Build Fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Try: **Site settings** → **Build & deploy** → **Clear cache and deploy site**

## 🎉 Success!

Your Rubber Plantation Management System is now live!

- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-app.railway.app

## 📝 Next Steps

1. **Custom Domain** (Optional):
   - In Netlify: Site settings → Domain management → Add custom domain

2. **Monitor Deployments**:
   - Netlify and Railway both auto-deploy on git push
   - Check deployment logs if issues occur

3. **Update Code**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   Both services will auto-deploy!

---

**Need help?** Check the full deployment guide: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)
