# 🚀 Netlify Deployment Guide for Rubber Plantation System

This guide will help you deploy the Rubber Plantation Management System to Netlify.

## 📋 Overview

The application consists of:
- **Frontend**: React + Vite (deploy to Netlify)
- **Backend**: Node.js + Express + SQLite (deploy separately)

## 🌐 Deployment Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Netlify (CDN)  │ ──────► │ Backend Service  │
│   (Frontend)    │         │ (Railway/Render)  │
│  React + Vite   │         │  Express + SQLite │
└─────────────────┘         └──────────────────┘
```

## 🎯 Step 1: Prepare Backend for Deployment

### Option A: Deploy to Railway (Recommended)

1. **Create a Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure the backend service**
   - Click "Add Service" → "GitHub Repo"
   - Select your repo
   - Set the Root Directory to `/backend`
   - Add environment variables:
     ```
     PORT=5000
     NODE_ENV=production
     DB_PATH=./database/rubber_plantation.db
     FRONTEND_URL=https://your-netlify-site.netlify.app
     ```

4. **Deploy and get your backend URL**
   - Railway will automatically deploy
   - Copy the public URL (e.g., `https://your-app.up.railway.app`)

### Option B: Deploy to Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a Web Service**
   - Connect your GitHub repo
   - Set the following:
     - **Name**: `rubber-plantation-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free tier

3. **Add Environment Variables**:
   ```
   PORT=10000
   NODE_ENV=production
   DB_PATH=./database/rubber_plantation.db
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```

4. **Deploy and get your backend URL**

## 🎨 Step 2: Deploy Frontend to Netlify

### Method 1: Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Configure environment variables**
   ```bash
   cd frontend
   ```

4. **Deploy to Netlify**
   ```bash
   cd ..
   netlify deploy --prod
   ```

### Method 2: GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure build settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Add environment variables**
   In Netlify dashboard → Site settings → Environment variables:
   
   For Production:
   ```
   VITE_API_URL = https://your-backend.railway.app/api
   VITE_APP_NAME = SPATIO SDS - RubberPanel
   VITE_APP_VERSION = 1.0.0
   VITE_APP_DESCRIPTION = Sri Lankan Rubber Plantation Management System
   VITE_BASEMAP_TYPE = XYZ
   VITE_BASEMAP_URL = https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
   VITE_BASEMAP_ATTRIBUTION = © OpenStreetMap contributors
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site is live!

### Method 3: Netlify Drop

1. **Build the frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `frontend/dist` folder

## ⚙️ Step 3: Environment Variables

### Frontend Variables (Set in Netlify)

Update these in Netlify dashboard → Environment variables:

```bash
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=SPATIO SDS - RubberPanel
VITE_BASEMAP_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Backend Variables (Set in Railway/Render)

```bash
PORT=5000
NODE_ENV=production
DB_PATH=./database/rubber_plantation.db
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 🗄️ Step 4: Database Setup

### For Railway/Render Deployment

The SQLite database file will be created automatically when the backend starts. To seed initial data:

1. **SSH into your backend instance** (Railway provides a terminal)
2. **Run the seed script**:
   ```bash
   npm run seed
   ```

Or add this to your Railway start command:
```bash
npm start && npm run seed
```

### For Production Database (Optional)

For a more robust solution, migrate to PostgreSQL:

1. **Update backend/config/database.js**:
   ```javascript
   const sequelize = new Sequelize(
     process.env.DB_NAME,
     process.env.DB_USER,
     process.env.DB_PASSWORD,
     {
       host: process.env.DB_HOST,
       dialect: 'postgres',
       logging: false
     }
   );
   ```

2. **Add PostgreSQL addon** in Railway/Render

## ✅ Step 5: Verify Deployment

1. **Check backend health**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"status":"OK","message":"Rubber Plantation API is running"}`

2. **Check frontend**
   - Visit your Netlify URL
   - Should load the dashboard

3. **Test API connection**
   - Open browser console
   - Check for API call logs

## 🔄 Updating Your Deployment

### For Frontend (Netlify)
```bash
git commit -am "Update frontend"
git push origin main
# Netlify auto-deploys
```

### For Backend (Railway/Render)
```bash
git commit -am "Update backend"
git push origin main
# Auto-redeploys
```

## 🔧 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend env matches your Netlify domain
- Add both `www` and non-`www` versions if needed

### API Not Found
- Verify `VITE_API_URL` in Netlify environment variables
- Check that the backend is running and accessible
- Ensure trailing `/api` in the URL

### Database Issues
- For Railway: Check logs in the dashboard
- For Render: Check logs and ensure disk space is available (SQLite needs disk storage)

### Build Failures
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Try clearing Netlify cache

## 📊 Continuous Deployment

Both Netlify and Railway/Render support automatic deployments:
- **Netlify**: Auto-deploys on push to main branch
- **Railway/Render**: Auto-redeploys on GitHub push

## 🎉 You're Done!

Your Rubber Plantation Management System is now live on:
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-backend.railway.app

## 📝 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

**Built with ❤️ by SPATIO SDS for the Sri Lankan Rubber Industry**

