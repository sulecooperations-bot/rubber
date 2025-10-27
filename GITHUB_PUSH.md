# 🚀 Push to GitHub - Quick Guide

Your code is committed locally and ready to push to GitHub!

## Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `rubber-plantation` (or your preferred name)
3. Description: "Rubber Plantation Management System for Sri Lankan estates"
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README" (we already have one)
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, copy the URL (it will look like):
```
https://github.com/YOUR_USERNAME/rubber-plantation.git
```

### Option A: Run the Helper Script
```bash
push-to-github.bat
```
Follow the prompts.

### Option B: Manual Commands
Open PowerShell/CMD in this directory and run:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/rubber-plantation.git

# Push the code
git push -u origin main
```

Replace `YOUR_USERNAME` and `rubber-plantation` with your actual GitHub username and repository name.

## Step 3: Verify

Go to your GitHub repository page and you should see all your files there!

## 🎉 Next Steps After Pushing

Once your code is on GitHub, you can:

1. **Deploy to Netlify** (Frontend)
   - Follow: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

2. **Deploy to Railway** (Backend)
   - Follow: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

## ⚠️ If You Get Authentication Errors

If `git push` asks for credentials:

1. **Use a Personal Access Token** (Recommended)
   - Go to: https://github.com/settings/tokens
   - Create token with `repo` permissions
   - Use token as password when prompted

2. **Or use GitHub Desktop**
   - Download: https://desktop.github.com
   - Use the GUI to push

---

Your code is ready! Just create the GitHub repo and push! 🚀

