# Deployment Guide

This guide covers how to deploy the E-Commerce Store to production.

## 1. Frontend Deployment (Vercel)

We recommend **Vercel** for the Next.js frontend.

1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your GitHub repository.
4.  **Build Settings**:
    *   Framework Preset: Next.js (Automatic)
    *   Root Directory: `web`
5.  **Environment Variables**:
    *   Add the following variables (copy from your `.env.local`):
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   `NEXT_PUBLIC_API_URL` (See Backend Deployment below)

## 2. Backend Deployment (Railway / Render)

We recommend **Railway** or **Render** for the Python/FastAPI backend.

### Option A: Railway
1.  Create a new project on [Railway.app](https://railway.app).
2.  Connect your GitHub repo.
3.  **Settings**:
    *   Root Directory: `api`
    *   Build Command: `pip install -r requirements.txt`
    *   Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  **Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  **Copy the URL**: Once deployed, copy the public URL (e.g., `https://my-api.up.railway.app`) and update the `NEXT_PUBLIC_API_URL` in your Vercel project variables.

## 3. Supabase Production

1.  Go to your Supabase Project Settings > API.
2.  Ensure your `Site URL` and `Redirect URLs` in Auth settings include your Vercel production domain (e.g., `https://my-store.vercel.app`).

## 4. Final Sanity Check

Once both are live:
1.  Visit your Vercel URL.
2.  Try to Log In.
3.  Try to Add a Product (Admin).
4.  Try to Checkout (Simulated).
