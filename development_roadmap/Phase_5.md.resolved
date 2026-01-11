# Phase 5: Payments & Integration

## Goal
Securely process financial transactions using the FastAPI backend and integrate a third-party payment gateway (e.g., Stripe, Razorpay).

## Connection to Previous Phase
- Takes the **Pending Orders** from **Phase 4** and processes the payment.
- Updates Order Status to **Paid/Processing** upon success.

## Features & Components

### 1. Payment Gateway Service (FastAPI)
- **Role**: Securely handle secrets and communicate with the Payment Provider.
- **Endpoints**:
  - `POST /create-payment-intent`: Receives order details, returns client secret.
  - `POST /webhook`: Listens for payment provider events (success, failure).

### 2. Frontend Payment Flow
- **UI**: Payment Element (integrated form fields) styled to match the "Institute" theme.
- **Components**: `CheckoutPaymentForm`.
- **Logic**:
  1. Call FastAPI to get intent.
  2. Confirm payment on client side.
  3. Show "Success/Thank You" page.

### 3. Transaction Logging
- **Database**: Record every payment attempt in Supabase.
- **Table**: `transactions` (order_id, provider_id, amount, status).

## Technical Implementation

### Backend (FastAPI)
- **Security**: Validate that the `order_id` matches the amount being charged.
- **Async**: Use async libraries to communicate with Stripe/Razorpay API.

### Database (Supabase)
```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders,
  provider_transaction_id text,
  amount decimal,
  status text, -- 'success', 'failed'
  created_at timestamptz default now()
);
```

### Integration Flow
1. User clicks "Pay" -> Next.js calls FastAPI.
2. FastAPI calls Stripe -> returns Secret.
3. Next.js uses Secret to prompt card entry.
4. Stripe confirms -> Stripe calls FastAPI Webhook.
5. FastAPI Webhook updates Supabase Order status to 'paid'.

## Deliverables
- [ ] functioning Payment API in FastAPI.
- [ ] Secure Payment Form on Frontend.
- [ ] Webhook listener for async status updates.
- [ ] "Order Success" page with digital receipt.
