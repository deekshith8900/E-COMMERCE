# E-Commerce Admin & Order Management System

A full-stack e-commerce platform featuring a modern Customer Shop, a powerful Admin Dashboard, and a simulated Payment & Order processing system.

## 🚀 What This Application Does

This application is a complete solution for running an online store. It includes:

*   **Customer Storefront**: Browse products, search & filter by category, view details, and add to cart (`/shop`).
*   **Shopping Cart**: Persistent cart management with a slide-out drawer.
*   **Checkout & Payments**: A complete checkout flow with shipping address collection and simulated payment processing (`/checkout`).
*   **Admin Dashboard**: comprehensive analytics showing total revenue, orders, and sales charts (`/admin`).
*   **Order Management**: Admins can view all orders and update their status (Pending → Shipped → Delivered).
*   **Product Management**: Admins can add, edit, and upload images for products via a Python/FastAPI backend service.
*   **Authentication**: Secure Sign Up, Login, and Role-Based Access Control (Admin vs Customer) using Supabase.

## 🤖 AI Tools Used

This project was built using **Google DeepMind's Antigravity Agent**.
*   **Code Generation**: The entire codebase (Frontend, Backend, Database Schema) was generated and refined by the AI agent.
*   **Problem Solving**: The agent handled debugging, build fixes, and deployment configuration autonomously.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons, Recharts.
*   **Backend**: Python FastAPI (for Image Uploads and Payment Simulation).
*   **Database & Auth**: Supabase (PostgreSQL, GoTrue, Storage).
*   **Deployment**: Vercel (Frontend) + Railway/Render (Backend).

## 💻 How to Run Locally

Follow these steps to set up the project on your machine.

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   Supabase Account

### 1. Clone the Repository
```bash
git clone https://github.com/deekshith8900/E-COMMERCE.git
cd E-COMMERCE
```

### 2. Setup Frontend (Next.js)
```bash
# Install dependencies
npm install

# Set up Environment Variables
# Create a .env.local file in the root directory
cp .env.local.example .env.local
```
Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the development server:
```bash
npm run dev
# Open http://localhost:3000
```

### 3. Setup Backend (FastAPI)
The backend handles payments and image uploads.

```bash
cd api

# Create Login to virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
# backend runs at http://localhost:8000
```

### 4. Database Setup (Supabase)
Run the SQL scripts located in `lib/supabase/` in your Supabase SQL Editor to create the tables (`profiles`, `products`, `orders`, `transactions`) and set up Security Policies (RLS).

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel and Railway.
