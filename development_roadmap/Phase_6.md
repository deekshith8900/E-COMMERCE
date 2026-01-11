# Phase 6: Analytics & Optimization

## Goal
Turn the raw data into actionable insights for the Admin, optimize application performance, and apply final UI/UX polish.

## Connection to Previous Phase
- Uses **Order** and **Transaction** data from **Phase 4 & 5** to generate charts.
- Finalizes the UI introduced in **Phase 0**.

## Features & Components

### 1. Admin Analytics Dashboard
- **Charts**:
  - Total Revenue (Line Chart).
  - Orders per Day (Bar Chart).
  - Top Selling Products (Pie/List).
- **Libraries**: `Recharts` or `Chart.js`. (Keep it minimal and styled).

### 2. SEO & Performance
- **Next.js**: Implement Metadata API for dynamic OG tags on Product Pages.
- **Sitemap**: Generate `sitemap.xml`.
- **Performance**: Analyze Core Web Vitals. Optimize images (Next/Image).

### 3. Final UI/UX Polish
- **Review**: Walk through every page.
- **Tasks**:
  - Check mobile responsiveness on all screens.
  - Verify "Institute" theme consistency (fonts, spacing, colors).
  - Ensure all micro-animations are smooth.

## Technical Implementation

### Frontend
- **Dashboard**: Aggregation queries should be done via Supabase RPC (Postgres Functions) or simple count queries if data is small.
- **Metadata**:
```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return { title: product.name, description: product.description };
}
```

### Database (Supabase)
- **RPC Function**: `get_daily_revenue()` to offload heavy calculation to the database.

## Deliverables
- [ ] Analytics Dashboard with real data visualization.
- [ ] Perfect Lighthouse Score (Performance, SEO).
- [ ] Fully responsive and polished UI across the entire app.
- [ ] Complete Project Documentation.
