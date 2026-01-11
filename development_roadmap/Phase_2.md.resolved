# Phase 2: Product & Inventory Management (Admin)

## Goal
Empower administrators to manage the e-commerce catalog completely. This phase introduces the FastAPI backend for advanced media handling.

## Connection to Previous Phase
- Requires the **Admin Authentication** and **Role-based Access Control** established in **Phase 1**.

## Features & Components

### 1. Admin Dashboard Shell
- **UI/UX**: Sidebar navigation (Products, Orders, Customers), Header with Profile.
- **Style**: "Institute" minimal look - distinct from the customer view.

### 2. Category Management
- **CRUD**: Create, Read, Update, Delete product categories (e.g., Electronics, Books).
- **UI**: Simple data table with "Add Category" modal.

### 3. Product Management (CRUD)
- **List View**: Table with columns (Image, Name, Price, Stock, Actions). Search and pagination.
- **Add/Edit Product Form**:
  - text inputs for Name, Description, Price.
  - Number input for Stock.
  - Dropdown for Category.
  - **Image Upload Area**.

### 4. Media Upload Service (FastAPI)
- **Role**: Handle secure file uploads to Supabase Storage (or other s3 compatible storage) via Python backend.
- **Why FastAPI?**: Specialized processing (resizing, validation) before storage. 
- **Endpoint**: `POST /upload/product-image`
  - Validates file type/size.
  - Uploads to storage bucket.
  - Returns public URL to frontend.

## Technical Implementation

### Backend (FastAPI)
- **Setup**: Minimal FastAPI server.
- **CORS**: Allow requests from Next.js frontend.
- **Dep**: `python-multipart` for file uploads.

### Database (Supabase)
- **Products Table**:
  - `id`, `name`, `description`, `price` (decimal), `stock_quantity`, `category_id`, `image_url`.

### Frontend
- **State Management**: React Query (TanStack Query) for fetching/caching admin data.
- **Image Upload**: Component that sends file to FastAPI, receives URL, then submits full product data to Supabase.

## Deliverables
- [ ] Admin sidebar navigation.
- [ ] Fully functional Product CRUD.
- [ ] FastAPI service running for image uploads.
- [ ] Integration: Upload Image -> Get URL -> Save Product.
