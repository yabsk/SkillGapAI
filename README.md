# SkillGap AI 🚀
### AI-Powered Semantic Skill Gap Analysis & Personalized Career Roadmap System

SkillGap AI is an end-to-end, intelligent career development and skill alignment platform. It leverages NLP-based resume parsing, semantic skill extraction, weighted gap analysis algorithms, automated ATS compatibility scoring, and personalized learning roadmap generation to help students and professionals bridge the gap between their current capabilities and target job roles.

---

## 🌟 Key Features

### 👤 Student / User Features
1. **User Authentication & RBAC**: Secure JWT-based registration, login, and protected routing.
2. **Interactive User Profile**: Manage user details, current skill inventory, target job roles, and career preferences.
3. **Resume Parsing & NLP Engine**: Extract skills, education, certifications, and experience from PDF/DOCX resumes automatically using regex and rule-based NLP extraction.
4. **Target Job-Role Selection**: Browse master industry roles (e.g., Full Stack Developer, Java Backend Engineer, DevOps Engineer) and view mandatory & optional skill requirements.
5. **Semantic Skill-Gap Analysis**: Jaccard semantic matching and weighted gap prioritization based on role requirements vs. user skills.
6. **Job Readiness Score Index**: Dynamic composite calculation (0–100%) evaluating overall role readiness based on skill coverage, resume quality, experience, and progress.
7. **ATS Compatibility & Resume Evaluation**: Detailed ATS pass rate score, missing key resume sections, and keyword density feedback.
8. **Personalized Career Roadmap**: Phase-by-phase learning roadmap with interactive milestone progress tracking.
9. **Curated Recommendations**: Automated suggestions for external courses, industry certifications, coding practice platforms, and hands-on portfolio projects.
10. **Unified Dashboard**: Live visual gauges, skill match badges, priority gap alerts, and interactive progress widgets.

### 🛡️ Admin Features
- Management interface for creating and updating Master Job Roles, Required Skills, Learning Resources, and Recommended Projects.
- System metrics overview tracking registered users, parsed resumes, job roles, and platform activity.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router v7, Axios, Lucide Icons, Vanilla CSS Design System (Dark Glassmorphism).
- **Backend**: Node.js, Express.js REST API Architecture, JWT Authentication, Multer (File Uploads), `pdf-parse` & `mammoth` (Resume Parsing).
- **Database**: MongoDB (Mongoose ODM) with automatic local `mongodb-memory-server` fallback for zero-dependency execution.
- **AI/NLP Layer**: Rule-based NLP pattern matching, canonical skill alias normalization, Jaccard semantic similarity, and weighted scoring algorithms.

---

## 🏗️ System Architecture

```
React 19 (Vite SPA) 
       │ (REST APIs + Bearer JWT Header)
       ▼
Express.js Router Middleware (Port 5000)
       │
       ├──► Auth & Admin Guards (JWT Middleware)
       ├──► File Upload Handler (Multer - PDF/DOCX Validation)
       ├──► Modular AI / NLP Engine
       │     ├── Resume NLP Parser
       │     ├── Semantic Skill Extractor
       │     ├── Gap Analysis Engine
       │     ├── Roadmap & Recommendation Generator
       │     └── Job Readiness & ATS Evaluator
       │
       ▼
MongoDB Database (Mongoose ODM / MongoMemoryServer)
```

---

## 📁 Project Structure

```
SkillGapAi/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection & JWT settings
│   │   ├── controllers/        # Express request controllers (10 modules)
│   │   ├── middleware/         # Auth guards, file upload & error handling
│   │   ├── models/             # Mongoose Schemas (User, JobRole, Skill, etc.)
│   │   ├── routes/             # REST API Endpoints (/api/*)
│   │   ├── services/           # Modular AI/NLP Services
│   │   └── utils/              # Database seeder & verification test suite
│   ├── uploads/                # Resume storage directory
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Footer, Gauges, SkillBadges
│   │   ├── context/            # AuthContext state manager
│   │   ├── pages/              # 14 Full Page Views & Admin Dashboard
│   │   ├── services/           # Axios API Client services
│   │   └── styles/             # Global CSS Design Tokens & Glassmorphism UI
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- *(Optional)* Local MongoDB Instance (defaults to automated In-Memory MongoDB if local service is not running)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillgap_ai
JWT_SECRET=skillgap_ai_jwt_super_secret_key_2026
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🖥️ Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🗄️ Database Setup & Credentials

On initial startup, if the database is empty or running on fallback memory mode, the system automatically seeds default roles, skills, learning resources, and demonstration accounts:

- **Admin Account**:
  - Email: `admin@skillgap.ai`
  - Password: `adminpassword123`
- **User Account**:
  - Email: `keerthi@gmail.com`
  - Password: `userpassword123`

---

## 📡 API Endpoints Overview

| Route Group | Base Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | User Registration, Login, Logout, Session User (`/me`) |
| **Users** | `/api/users` | Get and Update User Profile & Skills |
| **Resumes** | `/api/resumes` | Resume PDF/DOCX Upload, Retrieval, & NLP Extraction |
| **Job Roles** | `/api/job-roles` | Browse Available Job Roles & Target Role Selection |
| **Analysis** | `/api/analysis` | Trigger & Retrieve Skill Gap Analysis Results |
| **Recommendations** | `/api/recommendations` | Get Suggested Courses, Certifications, Projects, & Coding Platforms |
| **Roadmap** | `/api/roadmap` | Generate & Track Career Milestone Progress |
| **ATS & Evaluation** | `/api/resume-evaluation` | Resume Structural Quality & ATS Compatibility Analysis |
| **Readiness** | `/api/readiness` | Calculate Overall Job Readiness Score Index |
| **Admin** | `/api/admin` | Admin Metrics Overview & Master Data CRUD Management |

---

## 🧪 Testing Instructions

Run the comprehensive automated 21-point system verification suite:

```bash
cd backend
node src/utils/test_full_system_suite.js
```

### Build Verification
To test production frontend bundle compilation:
```bash
cd frontend
npm run build
```

---

## 🌐 Production Deployment Guide

For step-by-step instructions on setting up MongoDB Atlas, deploying the backend REST API to Render, and deploying the React frontend SPA to Vercel/Render, refer to the [DEPLOYMENT.md](file:///c:/Users/Keerthi%20Yabaluri/OneDrive/Desktop/SkillGapAi/DEPLOYMENT.md) guide.

---

## 📜 License
This project is created for college mini project demonstration purposes. All rights reserved.
