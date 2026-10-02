# Nuvora Store

## Running on Replit
- Stack: React 18, React Router 6, and Vite 5. Keep the imported structure.
- Run the **Start application** workflow, which executes `npm run dev`.
- The development server listens on `0.0.0.0:5000` and accepts Replit preview hosts.
- Install dependencies with `npm ci` when setting up a fresh checkout.
- Build the static site with `npm run build`; output is written to `dist/`.
- Run the existing route-rendering check with `node _render-check.mjs`.

## Current scope
- No secrets or external services are needed to run the imported storefront.
- Products are local seed data; the cart uses the existing client-side implementation.
- Checkout and login are explicitly unfinished placeholder pages. No real orders, payments, or authentication are connected.