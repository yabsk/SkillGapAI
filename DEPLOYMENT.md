# 🌐 SkillGap AI — Production Deployment Guide

This guide provides step-by-step instructions to deploy the **SkillGap AI** application (Frontend + Backend + Database) to cloud providers (Render, Vercel, and MongoDB Atlas) for a live production environment.

---

## 🏗️ Architecture Overview

```
[ Frontend: Vercel / Render Static Site ]
          │
          │ HTTPS REST API requests (Bearer JWT Header)
          ▼
[ Backend: Render Web Service (Node.js/Express) ]
          │
    ┌─────┴─────────────────────┐
    ▼                           ▼
[ MongoDB Atlas ]       [ Google Gemini AI ]
(Database Cluster)      (Copilot AI Model)
```

---

## 🗄️ Step 1: Set Up Cloud Database (MongoDB Atlas)

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project (e.g., `SkillGapAI`).
3. Deploy a **Free M0 Shared Cluster**.
4. Create a **Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Select **Password** authentication.
   - Set username & password (e.g., `skillgap_admin` / `SecurePass123!`).
   - Grant `Read and write to any database` role.
5. Configure **Network Access**:
   - Go to **Network Access** -> **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so cloud servers like Render can connect.
6. Get your **MongoDB Connection String**:
   - Click **Connect** on your cluster -> **Drivers** -> **Node.js**.
   - Copy the URI string:
     `mongodb+srv://skillgap_admin:<password>@cluster0.abcde.mongodb.net/skillgap_ai?retryWrites=true&w=majority`

---

## ⚙️ Step 2: Deploy Backend REST API (Render Web Service)

1. Sign up or log into [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing the SkillGap AI codebase.
4. Configure service settings:
   - **Name**: `skillgap-ai-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables** under the **Environment** tab:

   | Key | Value / Description |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | `mongodb+srv://skillgap_admin:<password>@cluster0.abcde.mongodb.net/skillgap_ai?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `a_long_random_secure_production_secret_key_2026` |
   | `JWT_EXPIRE` | `7d` |
   | `CLIENT_ORIGIN` | `https://skillgap-ai-frontend.vercel.app` *(update with your actual frontend domain)* |
   | `GEMINI_API_KEY` | *(Your Google Gemini API Key from Google AI Studio)* |

6. Click **Create Web Service**.
7. Render will build and launch your backend. Once complete, copy your **Backend URL**:
   `https://skillgap-ai-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend Web App (Vercel or Render Static Site)

### Option A: Vercel Deployment (Recommended)

1. Sign up or log into [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure deployment settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://skillgap-ai-backend.onrender.com/api` *(Your Render Backend URL + `/api`)*
6. Click **Deploy**.
7. Once deployed, copy your **Frontend Domain** (e.g. `https://skillgap-ai-frontend.vercel.app`).

### Option B: Render Static Site

1. On Render, click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://skillgap-ai-backend.onrender.com/api`
5. Click **Create Static Site**.

---

## 🔄 Step 4: Final Environment Linking & Verification

1. Go back to your **Backend Service** on Render -> **Environment Variables**.
2. Ensure `CLIENT_ORIGIN` matches your live Frontend URL:
   `CLIENT_ORIGIN=https://skillgap-ai-frontend.vercel.app`
3. Save changes (Render will automatically redeploy the backend with updated CORS rules).

### Verification Steps:

1. Open `https://skillgap-ai-backend.onrender.com/api/health` in your browser.
   - Output should return `{"status": "healthy", "system": "SkillGap AI REST API Server", ...}`.
2. Open your live Frontend URL (`https://skillgap-ai-frontend.vercel.app`).
3. Test the full application workflow:
   - **Login**: Use default demo credentials:
     - Student: `keerthi@gmail.com` / `userpassword123`
     - Admin: `admin@skillgap.ai` / `adminpassword123`
   - **Resume Upload & NLP Extractor**: Upload a PDF resume and click **Run NLP Extractor**.
   - **Skill-Gap Analysis & Roadmap**: View matched skills and target job role recommendations.
   - **SkillGap Copilot**: Ask dynamic career questions to test AI response generation.
   - **Job Readiness & ATS Score**: Check score calculation.

---

## 🛠️ Maintenance & Redeployment

- **Pushing Updates**: Any `git push` to your connected repository branch will automatically trigger builds on Render and Vercel.
- **Auto-Seeding**: The backend automatically seeds master job roles, skills, and default accounts into MongoDB Atlas if the database is fresh.
