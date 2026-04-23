# ⚡ Full-Stack Boilerplate

> React + Tailwind · Node.js + Express · MongoDB · JWT Auth · Vercel + Render

A production-ready full-stack starter with real authentication, protected routes, and one-command local development.

---

## 📁 Project Structure

```
fullstack-app/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/       # Axios instance + API helpers
│   │   ├── components/# Reusable components (ProtectedRoute, etc.)
│   │   ├── context/   # AuthContext (global auth state)
│   │   ├── pages/     # Landing, Login, Signup, Dashboard
│   │   └── main.jsx   # Entry point
│   ├── vercel.json    # Vercel SPA routing config
│   └── .env.example   # Frontend env vars template
│
└── backend/           # Node.js + Express REST API
    ├── controllers/   # Route handler logic
    ├── middleware/    # Auth guard, error handler
    ├── models/        # Mongoose schemas (User)
    ├── routes/        # auth.js, user.js
    ├── utils/         # JWT helpers
    ├── server.js      # Express app entry
    ├── render.yaml    # Render deployment config
    └── .env.example   # Backend env vars template
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier) **or** local MongoDB

---

### 1. Clone & install

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd fullstack-app

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

---

### 2. Configure environment variables

**Backend** — copy and fill in:
```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/myapp
JWT_SECRET=make_this_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** — copy and fill in:
```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` and set:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev     # uses nodemon for hot reload
```
> Runs on http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
> Runs on http://localhost:5173

---

## 🗄️ MongoDB Setup (Atlas — Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a **free M0 cluster**
3. Under **Database Access** → Add a new user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all — for dev)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<username>` and `<password>` in your `MONGODB_URI`

---

## 🔑 Auth Flow

```
POST /api/auth/signup   → creates user, returns JWT + user object
POST /api/auth/login    → verifies credentials, returns JWT + user object
GET  /api/auth/me       → returns current user (requires Bearer token)

GET  /api/user/profile         → get profile (protected)
PUT  /api/user/profile         → update name (protected)
PUT  /api/user/change-password → change password (protected)
```

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
5. Click **Deploy** ✅

---

### Backend → Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables:
   ```
   NODE_ENV       = production
   PORT           = 10000
   MONGODB_URI    = mongodb+srv://...
   JWT_SECRET     = your_secret_here
   JWT_EXPIRES_IN = 7d
   CLIENT_URL     = https://your-frontend.vercel.app
   ```
7. Click **Create Web Service** ✅

> ⚠️ On free Render tier, the server sleeps after 15 mins of inactivity. First request may be slow.

---

### After Deployment — Update CORS

Once both are live, update these values:

| Variable | Value |
|---|---|
| `CLIENT_URL` (backend env) | Your Vercel URL e.g. `https://myapp.vercel.app` |
| `VITE_API_URL` (frontend env) | Your Render URL e.g. `https://myapp-api.onrender.com/api` |

Redeploy both after updating env vars.

---

## 🛡️ Security Features

- ✅ Passwords hashed with **bcrypt** (12 salt rounds)
- ✅ **JWT** authentication with expiry
- ✅ **Helmet** for security headers
- ✅ **Rate limiting** on all API routes (100/15min) + auth routes (10/15min)
- ✅ **Input validation** with express-validator
- ✅ **CORS** restricted to your frontend URL
- ✅ Passwords excluded from DB queries by default (`select: false`)
- ✅ Mongoose duplicate key & validation error handling

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Tailwind CSS 3, Vite |
| Backend | Node.js, Express 4, express-validator, Helmet |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 📝 Extending the App

**Add a new protected API route:**
```js
// backend/routes/yourRoute.js
const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect); // all routes below are protected

router.get('/', async (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = router;
```

```js
// backend/server.js — register it
app.use('/api/your-route', require('./routes/yourRoute'));
```

**Add a new frontend API call:**
```js
// frontend/src/api/index.js
export const yourApi = {
  getAll: () => api.get('/your-route'),
  create: (data) => api.post('/your-route', data)
};
```

---

## 📄 License

MIT — use freely for personal and commercial projects.
