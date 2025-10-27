# 🚀 Quick Deploy Guide

Deploy the Rubber Plantation Management System in 10 minutes!

## 📝 Prerequisites

- GitHub account
- Netlify account (free): https://netlify.com
- Railway account (free): https://railway.app

## ⚡ Quick Start

### 1️⃣ Push to GitHub (2 min)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/rubber-plantation.git
git push -u origin main
```

### 2️⃣ Deploy Backend to Railway (3 min)

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "⚙️ Settings" → "Add Service" → "Environment"
5. Add these variables:
   ```
   PORT = 5000
   NODE_ENV = production
   DB_PATH = ./database/rubber_plantation.db
   FRONTEND_URL = (we'll add this after Netlify deployment)
   ```
6. Click "Generate Domain" to get your backend URL
7. Copy the URL (e.g., `https://rubber-plantation.up.railway.app`)

### 3️⃣ Deploy Frontend to Netlify (5 min)

1. Go to https://app.netlify.com and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click "Show advanced" → "New variable" and add:
   ```
   VITE_API_URL = https://your-railway-url.up.railway.app/api
   ```
   (Replace with your Railway backend URL from step 2)
6. Click "Deploy site"
7. Copy your Netlify site URL (e.g., `https://rubber-plantation.netlify.app`)

### 4️⃣ Update Backend CORS (2 min)

1. Go back to Railway → Your Project → Environment Variables
2. Update `FRONTEND_URL` to your Netlify URL:
   ```
   FRONTEND_URL = https://your-netlify-site.netlify.app
   ```
3. The backend will automatically redeploy

### 5️⃣ Seed the Database (2 min)

1. In Railway, click on your service
2. Click "View Logs" → "Service Logs"
3. Click "Open in terminal" (or use Railway CLI)
4. Run:
   ```bash
   npm run seed
   ```
5. Or add to Railway environment: `START_COMMAND = npm run seed && npm start`

## ✅ Done!

Your app is now live:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-backend.up.railway.app

## 🔄 Updating Your App

Just push to GitHub:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Both Railway and Netlify will auto-deploy!

## 🆘 Troubleshooting

**Backend not responding?**
- Check Railway logs
- Verify environment variables
- Ensure CORS is configured

**Frontend can't connect to API?**
- Check Netlify environment variables
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors

**Database issues?**
- SSH into Railway instance
- Run `npm run seed` manually
- Check database file exists

## 💡 Pro Tips

1. **Custom Domain**: Add your domain in Netlify settings
2. **HTTPS**: Automatically configured by both services
3. **Monitoring**: Check Railway and Netlify dashboards for logs
4. **Cost**: Both services have free tiers that should be sufficient

---

**Need help?** Check the full deployment guide: `NETLIFY_DEPLOYMENT.md`

