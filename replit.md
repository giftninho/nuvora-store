# Nuvora Store

## Running on Replit
- Stack: React 18, React Router 6, and Vite 5. Keep the imported structure.
- Runtime: Node.js 22, required by the installed Supabase SDK.
- Run the **Start application** workflow, which executes `npm run dev`.
- The development server listens on `0.0.0.0:5000` and accepts Replit preview hosts.
- Install dependencies with `npm ci` when setting up a fresh checkout.
- Build the static site with `npm run build`; output is written to `dist/`.
- Run the route-rendering check with `node _render-check.mjs`.

## Current scope
- Product listings come from Supabase; the cart remains client-side.
- Create a Supabase project, apply `supabase/schema.sql`, `supabase/seed.sql`, and `supabase/phase5_create_order.sql` in its SQL Editor, and add `VITE_SUPABASE_URL` plus `VITE_SUPABASE_ANON_KEY` to Replit Secrets.
- Use only the Supabase project URL and public anon/publishable browser key in the frontend. Never put a service-role key in Vite variables or client code.
- Enable email/password sign-in in Supabase Auth, keep email confirmation enabled, and allow the app's development and published origins to redirect to `/login` and `/reset-password`.
- Apply `supabase/phase6_auth.sql` after the Phase 5 SQL. It preserves guest checkout, associates signed-in orders from the verified Supabase session, and allows users to read only their own orders.
- Product listings have public read-only access. Browser clients cannot directly insert, update, or delete orders.
- Email/password signup stores the full name in Supabase user metadata. Password recovery returns through `/reset-password`; no passwords are stored by the app.
- Checkout submits orders through the Supabase `create_order` function, which calculates trusted totals in the database. Live order submission and cross-user database isolation still need end-to-end testing.
- Payments and email delivery are not connected.