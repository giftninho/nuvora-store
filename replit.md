# Nuvora Store

## Running on Replit
- Stack: React 18, React Router 6, and Vite 5. Keep the imported structure.
- Runtime: Node.js 22, required by the installed Supabase SDK.
- Run the **Start application** workflow, which executes `npm run dev`.
- The development server listens on `0.0.0.0:5000` and accepts Replit preview hosts.
- Install dependencies with `npm ci` when setting up a fresh checkout.
- Build the static site with `npm run build`; output is written to `dist/`.
- Run the existing route-rendering check with `node _render-check.mjs`.

## Current scope
- Product listings come from Supabase; the cart remains client-side.
- Create a Supabase project, apply `supabase/schema.sql` and then `supabase/seed.sql` in its SQL Editor, and add `VITE_SUPABASE_URL` plus `VITE_SUPABASE_ANON_KEY` to Replit Secrets.
- Use only the Supabase project URL and public anon/publishable browser key in the frontend. Never put a service-role key in Vite variables or client code.
- RLS allows public read-only access to products. Orders and order items have RLS enabled and no browser access policies yet.
- Checkout submits orders through the Supabase `create_order` function. For a fresh database, apply `supabase/phase5_create_order.sql` after the schema and seed scripts. Order submission has not been verified during import setup.
- Login remains a placeholder; authentication and payments are not connected.