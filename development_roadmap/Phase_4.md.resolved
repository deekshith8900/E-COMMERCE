# Phase 4: Order Management System

## Goal
Implement the end-to-end order lifecycle: from Checkout UI creation (pre-payment) to Admin Order Fulfillment.

## Connection to Previous Phase
- Converts the **Cart** contents from **Phase 3** into a persistent **Order**.
- Admin manages these orders using the dashboard structure from **Phase 2**.

## Features & Components

### 1. Checkout UI (Pre-Payment)
- **Form**: Shipping Address, Contact Info.
- **Summary**: Order total, tax (simplified), shipping cost.
- **Action**: "Place Order" (creates 'Pending' order). *Note: Actual payment processing is Phase 5.*

### 2. Order Database & API
- **Tables**: `orders`, `order_items`.
- **Logic**: When order is placed -> decrement product stock -> clear cart.

### 3. Customer Order History
- **Page**: `/account/orders`.
- **View**: List of past orders with status badges (Pending, Shipped, Delivered, Canceled).

### 4. Admin Order Management
- **Dashboard View**: New "Orders" tab.
- **Action**: View order details, Change Status (e.g., Pending -> Processed -> Shipped). Update Tracking Number.

## Technical Implementation

### Database (Supabase)
```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  status text default 'pending',
  shipping_address jsonb,
  total_amount decimal,
  created_at timestamptz default now()
);

create table order_items (
  order_id uuid references orders,
  product_id uuid references products,
  quantity int,
  price_at_purchase decimal
);
```

### Frontend
- **Optimistic Updates**: UI updates status immediately when Admin clicks "Ship".

## Deliverables
- [ ] Checkout Form (validates address).
- [ ] Order placement logic (creates db records).
- [ ] Customer "My Orders" page.
- [ ] Admin "Order Management" view with Status changing capability.
