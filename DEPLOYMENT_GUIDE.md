# 🚀 MERN Portfolio Deployment Guide (Vercel + Render)

## ✅ Prerequisites
- MongoDB Atlas (already done ✓)
- Cloudinary account (already done ✓)
- GitHub account (for version control)
- Vercel account (free)
- Render account (free)

---

## **PHASE 1: PREPARE BACKEND FOR RENDER**

### Step 1.1 - Check backend/package.json
Ensure you have a start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 1.2 - Create `.gitignore` (if not exists)
```
node_modules/
.env
.env.local
.DS_Store
```

### Step 1.3 - Push to GitHub
```bash
# Navigate to project root
cd c:\Users\hassa\Downloads\hassan-portfolio-mern\hassan-portfolio

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MERN portfolio"

# Create repo on GitHub and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hassan-portfolio.git
git push -u origin main
```

---

## **PHASE 2: DEPLOY BACKEND TO RENDER**

### Step 2.1 - Create Render Account
Visit: https://render.com

### Step 2.2 - Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the correct repository
4. Fill in details:
   - **Name:** `hassan-portfolio-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`

### Step 2.3 - Add Environment Variables
In Render dashboard, scroll to "Environment"
Add these variables:
```
MONGO_URI=<your MongoDB connection string>
EMAIL_USER=<your Gmail>
EMAIL_PASS=<your Gmail app password>
CLOUDINARY_NAME=<your Cloudinary name>
CLOUDINARY_KEY=<your Cloudinary API key>
CLOUDINARY_SECRET=<your Cloudinary API secret>
JWT_SECRET=<any random string, e.g., "your_jwt_secret_key_123">
CLIENT_URL=<will update after Vercel deployment>
NODE_ENV=production
```

### Step 2.4 - Deploy
- Click **"Create Web Service"**
- Wait for deployment to complete (5-10 mins)
- Get your backend URL: `https://hassan-portfolio-api.onrender.com`
- Test it: `https://hassan-portfolio-api.onrender.com/api/health`

✅ Backend deployed!

---

## **PHASE 3: PREPARE FRONTEND FOR VERCEL**

### Step 3.1 - Update Frontend API Configuration
Edit: `frontend/src/services/api.js`

Change all API calls to use your Render backend URL:
```javascript
const API_BASE = process.env.VITE_API_URL || 'https://hassan-portfolio-api.onrender.com/api';

// OR if you're using environment variables:
const API_BASE = import.meta.env.VITE_API_URL || 'https://hassan-portfolio-api.onrender.com/api';
```

### Step 3.2 - Create `.env.production` in frontend folder
```
VITE_API_URL=https://hassan-portfolio-api.onrender.com/api
```

### Step 3.3 - Update CORS in Backend
Go back to `backend/server.js` and update:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-vercel-domain.vercel.app'],
  credentials: true,
}));
```

---

## **PHASE 4: DEPLOY FRONTEND TO VERCEL**

### Step 4.1 - Create Vercel Account
Visit: https://vercel.com
Sign up with GitHub

### Step 4.2 - Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Vercel auto-detects it's a Vite project

### Step 4.3 - Configure Project
- **Framework:** `Vite`
- **Root Directory:** `./frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 4.4 - Add Environment Variables
In Vercel dashboard:
- **VITE_API_URL:** `https://hassan-portfolio-api.onrender.com/api`

### Step 4.5 - Deploy
- Click **"Deploy"**
- Wait for deployment (3-5 mins)
- Get your live URL: `https://your-portfolio.vercel.app`

✅ Frontend deployed!

---

## **PHASE 5: FINAL UPDATES & TESTING**

### Step 5.1 - Update Backend Render Config
Update the `CLIENT_URL` in Render:
```
CLIENT_URL=https://your-portfolio.vercel.app
```

### Step 5.2 - Test Live Application
1. Visit your Vercel URL
2. Try sending a contact form
3. Check your email for notification
4. Visit admin panel and test CRUD operations

### Step 5.3 - Fix Any Issues
If you get CORS errors:
```javascript
// Update backend server.js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

Then redeploy backend on Render

---

## **📋 Environment Variables Checklist**

### Backend (Render)
- [ ] MONGO_URI
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] CLOUDINARY_NAME
- [ ] CLOUDINARY_KEY
- [ ] CLOUDINARY_SECRET
- [ ] JWT_SECRET
- [ ] CLIENT_URL (after Vercel setup)
- [ ] NODE_ENV=production

### Frontend (Vercel)
- [ ] VITE_API_URL (Render backend URL)

---

## **🔧 Troubleshooting**

### Issue: CORS errors
**Solution:** Make sure `CLIENT_URL` in Render matches your Vercel domain

### Issue: Database connection fails
**Solution:** Check MongoDB whitelist includes Render IP

### Issue: Emails not sending
**Solution:** Verify Gmail app password (not regular password)

### Issue: Cloudinary upload fails
**Solution:** Check API credentials in Render env vars

### Issue: Cold start delay
**Solution:** This is normal on Render free tier (first request takes longer)

---

## **✅ Deployment Complete!**

Your portfolio is now live:
- **Frontend:** `https://your-portfolio.vercel.app`
- **Backend API:** `https://hassan-portfolio-api.onrender.com/api`
- **Admin Panel:** `https://your-portfolio.vercel.app/login`

