# SkillBridge

SkillBridge is a campus gig marketplace with three local services:

- `skillbridge-frontend`: React + Vite client
- `skillbridge-backend`: Express API with Supabase and Razorpay integration
- `skillbridge-ai`: Flask AI service for recommendations, moderation, and chatbot assistance

## Prerequisites

Install these before running the project:

- Node.js
- npm
- Python 3.13 or compatible Python 3.x
- A Supabase project with the required tables
- Razorpay test keys if you want to test paid gig payment flows

## Project Structure

```text
skillbridge-dev-ai-s/
  skillbridge-ai/          Flask AI service
  skillbridge-backend/     Express API server
  skillbridge-frontend/    React frontend
```

## 1. Backend Setup

Open a terminal:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-backend"
npm install
```

Create `skillbridge-backend/.env`:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```powershell
npm run dev
```

If `nodemon` causes permission issues on Windows, run:

```powershell
npm start
```

Backend URL:

```text
http://localhost:5000
```

## 2. AI Service Setup

Open a second terminal:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-ai"
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe app.py
```

AI service URL:

```text
http://localhost:5001
```

Health check:

```powershell
Invoke-WebRequest http://localhost:5001/health
```

Expected response:

```json
{"status":"ok"}
```

## 3. Frontend Setup

Open a third terminal:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-frontend"
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Optional frontend env file: `skillbridge-frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

## Run Order

Start services in this order:

1. AI service on port `5001`
2. Backend on port `5000`
3. Frontend on port `5173`

The backend calls the AI service at `http://localhost:5001`, so the AI service should be running before testing AI features.

## Main Routes

Frontend routes:

```text
/dashboard       Main dashboard and recommendations
/assistant       Chatbot assistant (testing)
/profile         User profile
/gigs            Browse gigs
/gigs/post       Post a gig
/wallet          Wallet
```

Backend AI-related routes:

```text
GET  /api/ml/recommended
POST /api/chat/message
```

AI service routes:

```text
GET  /health
POST /api/ml/recommend
POST /api/moderate
POST /api/chat
```

## AI Features

### 1. Gig Recommendations

The dashboard recommends open gigs based on the logged-in user's profile skills.

How to test:

1. Log in.
2. Add skills to your profile, for example `React, Python, UI Design`.
3. Create or keep some open gigs with matching skills.
4. Go to `/dashboard`.
5. Check the `Recommended For You` section.

### 2. Content Moderation

Gig titles/descriptions and application messages are checked for inappropriate language.

How to test:

1. Try posting a gig with inappropriate text.
2. Try applying to a gig with inappropriate text.
3. The backend should reject unsafe content.

### 3. Chatbot

The chatbot answers SkillBridge-related questions using lightweight AI service logic and profile context.

How to test:

1. Go to `/assistant`.
2. Ask:

```text
How do recommendations work?
How can I improve my profile?
How do recommendations work?
```

## Direct AI Service Tests

Test recommendations:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5001/api/ml/recommend -ContentType "application/json" -Body '{"user_skills":["React","Python"],"open_gigs":[{"id":1,"title":"Frontend help","description":"Build React UI","skills_required":["React","CSS"]}]}'
```

Test moderation:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5001/api/moderate -ContentType "application/json" -Body '{"text":"This is a normal message"}'
```

Test chatbot:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5001/api/chat -ContentType "application/json" -Body '{"message":"How do recommendations work?","profile":{"full_name":"Nikhil","skills":["React","Python"],"year":4},"history":[]}'
```

## Common Issues

### `ModuleNotFoundError: No module named 'flask'`

Install AI dependencies inside the AI venv:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-ai"
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### `scikit-learn` or `numpy` tries to build from source

Use the versions already listed in `skillbridge-ai/requirements.txt`. They are selected for Python 3.13 Windows wheels.

If the venv is corrupted, recreate it:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-ai"
Remove-Item -Recurse -Force .\venv
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### Backend says AI service is unavailable

Make sure the Flask AI service is running:

```powershell
Invoke-WebRequest http://localhost:5001/health
```

### `vite is not recognized`

Install frontend dependencies:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-frontend"
npm install
```

### `nodemon` crashes with `spawn EPERM`

Run the backend without nodemon:

```powershell
cd "c:\Users\Nikhil\OneDrive\Desktop\Final Year Project\COPY\skillbridge-dev-ai-s\skillbridge-backend"
npm start
```

## Development Notes

- Do not commit `.env` files.
- Start the AI service before testing recommendation, moderation, or chatbot flows.
- The chatbot is a local lightweight assistant, not an external GPT/OpenAI integration.
