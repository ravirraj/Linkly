# Linkly — URL Shortener

Short description
- Linkly is a small URL shortener project with a Vite + React frontend and an Express (serverless-export) backend. Auth uses access/refresh tokens (cookies) and Axios interceptors for refresh logic.

Tech stack
- Frontend: Vite, React, Redux (store slice for auth), Axios
- Backend: Node.js, Express (serverless ready), MongoDB
- Deployment: Vercel (recommended) or other hosts

Repository layout
- /frontend — Vite React app
  - src/utils/axiousInstance.js — axios instance + token refresh logic
  - src/pages, components, store, etc.
- /backend — Express app (exports app for serverless)
  - index.js — entry (connects to Mongo and configures CORS)
  - src/ — controllers, routes, middleware, models, utils

Environment variables
- Backend (required)
  - MONGO_URI — MongoDB connection string
  - BASE_URL_FRONTEND — frontend origin (must include protocol, e.g., https://app.example.com). Used for CORS.
  - ACCESS_TOKEN_SECRET — JWT access token secret
  - REFRESH_TOKEN_SECRET — JWT refresh token secret
  - ACCESS_TOKEN_EXPIRES_IN — e.g. 15m
  - REFRESH_TOKEN_EXPIRES_IN — e.g. 7d
  - CUSTOM_URL_ENDPOINT — public short URL base (e.g., https://short.example.com/)
  - NODE_ENV — production | development
  - PORT — optional local port (default 3000)

- Frontend (required at build time)
  - VITE_BACKEND_URL — full backend base URL including protocol (e.g., https://api.example.com)

Important notes
- VITE_ variables are baked into the frontend at build time. On Vercel set VITE_BACKEND_URL in Project > Settings > Environment Variables and then redeploy.
- BASE_URL_FRONTEND must include protocol (https://) — otherwise CORS responses will be invalid and browser will block requests.
- Secure cookies require HTTPS — ensure TLS in production.

Local development
1. Backend
   ```
   cd backend
   npm install
   # if package.json has dev script (nodemon), use it, else:
   npm run dev    # or: node index.js
   ```
   The backend connects to Mongo on start (index.js calls connectToMongoDB when NODE_ENV !== "production").

2. Frontend
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Build for production:
   ```
   cd frontend
   npm run build    # outputs dist/
   ```

Deploy (Vercel recommended)
- Frontend: Deploy the frontend project to Vercel (or Netlify). Set VITE_BACKEND_URL (include https://) in project env for Production and redeploy.
- Backend: Deploy the backend as a separate Vercel project (serverless). Set env:
  - MONGO_URI, BASE_URL_FRONTEND (https://your-frontend-url), ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV=production, etc.
- Ensure both frontend and backend env vars include protocol and correct host names.

Troubleshooting
- CORS error "invalid value 'example.com'": BASE_URL_FRONTEND lacks protocol — set to e.g. https://linkly-frontend-sable.vercel.app and redeploy backend.
- 404 calls like https://frontend.com/backend-host/api/... : VITE_BACKEND_URL was treated as a path (missing protocol). Ensure VITE_BACKEND_URL starts with https:// and consider normalizing it in frontend/src/utils/axiousInstance.js.
- vite.svg 404: check asset path references in index.html or public assets.
- Cookies not sent: check axios withCredentials and backend CORS `credentials: true` and secure cookie flags (HTTPS required).

Common commands
- Commit & redeploy (frontend): update VITE_BACKEND_URL in Vercel > Settings > Env → Redeploy.
- Redeploy via Git: push to branch linked to Vercel:
  ```
  git add .
  git commit -m "deploy changes"
  git push origin main
  ```

Testing CORS preflight (example)
```
curl -i -X OPTIONS \
  -H "Origin: https://linkly-frontend-sable.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  "https://linkly-three-pi.vercel.app/api/auth/register"
```
Verify response headers include:
- Access-Control-Allow-Origin: https://linkly-frontend-sable.vercel.app
- Access-Control-Allow-Credentials: true

If you want, apply these sample .env files into the repo and I can prepare small normalization patches for axios and backend CORS handling.


# Backend sample .env — copy to backend/.env and fill values

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# Frontend origin for CORS (MUST include protocol)
BASE_URL_FRONTEND=https://linkly-frontend-sable.vercel.app

# JWT secrets
ACCESS_TOKEN_SECRET=replace_with_strong_random_string
REFRESH_TOKEN_SECRET=replace_with_strong_random_string

# Token expirations
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Public short link base
CUSTOM_URL_ENDPOINT=https://short.yourdomain.com/

# App config
NODE_ENV=production
PORT=3000


# Frontend sample .env — set this in Vercel (build-time). Must include protocol.
VITE_BACKEND_URL=https://linkly-three-pi.vercel.app