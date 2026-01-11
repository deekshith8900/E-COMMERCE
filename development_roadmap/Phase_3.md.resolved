# Phase 3: Customer Experience & Shopping Cart

## Goal
Build the customer-facing side of the application, allowing users to browse products, view details, and manage their cart.

## Connection to Previous Phase
- Displays **Products** created in **Phase 2**.
- Uses **Customer Authentication** from **Phase 1** for profile-based actions.

## Features & Components

### 1. Product Listing Page (PLP)
- **Features**: Grid view of products.
- **Search & Filter**: Searching by name, filtering by Category (from Phase 2) or Price Range.
- **UI**: Clean product cards using the "Institute" design (Card, Image, Bold Title, Price, "Add to Cart" button).

### 2. Product Detail Page (PDP)
- **Route**: `/product/[id]`
- **Features**: Large image gallery, detailed description, stock status, quantity selector.
- **Interaction**: "Add to Cart" with micro-animation feedback.

### 3. Shopping Cart
- **State Management**: `Zustand` or `React Context` + `localStorage` for persistence.
- **UI**: slide-out drawer or dedicated page. Show list of items, subtotal, and "Checkout" button.
- **Logic**: Update quantity, remove item, calculate total price.

## Technical Implementation

### Frontend (Next.js)
- **Data Fetching**: Server Components for fetching product list (SEO friendly).
- **Client Components**: Search bar, Filters, Cart interactivity.

### Database (Supabase)
- **Queries**:
  - `select * from products where active = true`
- **Cart Sync** (Optional): If logged in, sync cart state to a `carts` table in Supabase. For this phase, local storage is sufficient.

## Deliverables
- [ ] Product Listing Page with functional Search/Filter.
- [ ] Product Detail Page with dynamic routing.
- [ ] Functional Shopping Cart (Add, Remove, View Total).
