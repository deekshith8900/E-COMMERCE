# Phase 1: Foundation & Authentication

## Goal
Set up the core project structure, database schema, and robust authentication for both Admin and Customer roles.

## Connection to Previous Phase
- Uses the `Admin Login` and `Customer Signup` entry points defined in **Phase 0**.

## Features & Components

### 1. Project Initialization
- **Next.js**: Initialize project with TypeScript, Tailwind CSS, eslint.
- **Directories**: Set up `folder-structure` as per Unix guidelines (`components/`, `lib/`, `types/`, `hooks/`).
- **Design System**: Configure Tailwind `globals.css` with the "Institute" theme colors, fonts, and base styles.

### 2. Supabase Integration
- **Setup**: distinct Supabase project.
- **Environment Variables**: secure storage of API keys in `.env.local`.
- **Client**: `lib/supabaseClient.ts` for frontend interaction.

### 3. Database Schema (SQL)
- **Users Table**: Extends Supabase Auth with roles (`admin`, `customer`) and profile data.
- **RLS Policies**: STRICT Row Level Security.
  - Admins can view/edit all data.
  - Customers can only view/edit their own data.

### 4. Authentication Module
- **Features**: Sign Up, Login, Forgot Password, Logout.
- **UI Components**: Minimalist, centered card forms. High contrast buttons.
- **Routing**: Protected routes. Redirect unauthorized users.
  - `/admin/dashboard` (Admin only)
  - `/shop/` (Customer only - or public browsing, depends on logic, likely public but cart/profile needs auth).

## Technical Implementation

### Database (Supabase)
```sql
-- Profile Table
create table profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'customer')) default 'customer',
  full_name text,
  ...
);
```

### Frontend (Next.js)
- **Middleware**: `middleware.ts` to handle role-based route protection.
- **Auth Provider**: React Context or Hook (`useAuth`) to manage session state globally.

## Deliverables
- [ ] Working Next.js App Shell.
- [ ] Users can sign up and log in.
- [ ] Profiles are created in the database on signup.
- [ ] Admins are redirected to `/admin` dashboard; user to `/shop` (placeholder).
