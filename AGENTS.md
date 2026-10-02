# AGENTS.md --- Nuvora Store \| HNG15 Lesson 2 Project

## 1. Project Identity

Project name: Nuvora Store

Purpose: Build a functional, responsive e-commerce shop for the HNG15
Lesson 2 individual task.

The project must satisfy these assignment requirements:

-   Build a shop website.
-   Add a checkout page.
-   Persist application/order data in Supabase or Neon.
-   Send order confirmation emails using Mailgun.
-   Implement Google authentication using Google Cloud Console.
-   Deploy the finished application publicly.

The goal is a clean, functional, beginner-friendly project that is easy
to understand, demonstrate, test, and submit.

## Store Brand

Store name: **Nuvora Store**

Brand style: Modern, clean, friendly, and trustworthy.

Suggested tagline: **Simple finds. Beautifully delivered.**

Use **Nuvora Store** consistently in the website branding, navigation,
page titles, checkout, order confirmation messages, and email templates.
Keep **HNG15 Lesson 2** as the project/assignment context, not as the
customer-facing store name.

------------------------------------------------------------------------

# 2. Role of the Agent

You are the lead implementation agent.

Your responsibilities are to:

1.  Inspect the existing project before changing anything.
2.  Understand the current framework and file structure.
3.  Preserve useful existing work.
4.  Implement the project incrementally.
5.  Explain important changes in simple language.
6.  Stop and ask for required credentials/configuration when needed.
7.  Never invent API keys, credentials, URLs, database IDs, or
    successful API responses.
8.  Test every major feature before moving to the next phase.
9.  Keep the implementation simple enough for a beginner to understand.
10. Avoid unnecessary dependencies and over-engineering.
11. Keep secrets out of frontend code and GitHub.
12. Leave the project in a clean, deployable state.

------------------------------------------------------------------------

# 3. Important Development Rule

DO NOT attempt to build the entire project blindly in one operation.

Work in phases.

After completing each phase:

1.  Run the application.
2.  Check for build errors.
3.  Check for runtime errors.
4.  Test the feature manually where possible.
5.  Summarize what changed.
6.  State what remains.
7.  Only then proceed to the next phase.

If a phase fails, fix it before continuing.

------------------------------------------------------------------------

# 4. Preferred Technology Stack

Use these technologies unless the existing project already uses a
compatible alternative that should reasonably be preserved.

Frontend:

-   React
-   Vite
-   JavaScript
-   React Router
-   CSS or Tailwind CSS

Backend/database:

-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Supabase Edge Functions for secure server-side email functionality

Authentication:

-   Google OAuth
-   Google Cloud Console
-   Supabase Auth

Email:

-   Mailgun

Deployment:

-   Vercel

Version control:

-   Git
-   GitHub

Do not introduce a large framework or unnecessary backend server unless
there is a clear technical reason.

------------------------------------------------------------------------

# 5. First Action --- Inspect Before Coding

Before making changes, inspect:

-   package.json
-   src/
-   public/
-   existing routes
-   existing components
-   existing styles
-   existing environment files
-   existing README
-   existing Git configuration
-   current application entry point
-   existing dependencies

Determine:

-   What framework is being used?
-   Is React Router already installed?
-   Is Tailwind already installed?
-   Is Supabase already installed?
-   Is there existing application functionality from Lesson 1?
-   What can be reused?
-   What needs to be created?

DO NOT delete or rewrite existing working code without a reason.

After inspection, provide a short report:

### Current project

-   Framework:
-   Build tool:
-   Existing routes:
-   Existing components:
-   Existing dependencies:
-   Existing functionality:
-   Missing functionality:
-   Recommended next step:

Then begin Phase 1.

------------------------------------------------------------------------

# 6. Project Architecture

Use a structure similar to:

src/ ├── components/ │ ├── Navbar.jsx │ ├── ProductCard.jsx │ ├──
CartItem.jsx │ ├── Loading.jsx │ ├── ErrorMessage.jsx │ └──
ProtectedRoute.jsx │ ├── pages/ │ ├── Home.jsx │ ├── ProductDetails.jsx
│ ├── Cart.jsx │ ├── Checkout.jsx │ ├── Login.jsx │ └── OrderSuccess.jsx
│ ├── context/ │ ├── CartContext.jsx │ └── AuthContext.jsx │ ├── lib/ │
└── supabase.js │ ├── services/ │ ├── products.js │ ├── orders.js │ └──
auth.js │ ├── utils/ │ ├── currency.js │ └── validation.js │ ├── App.jsx
├── main.jsx └── index.css

The exact structure may differ if the existing application has a better
structure. Do not reorganize files merely for the sake of matching this
example.

------------------------------------------------------------------------

# 7. Product Requirements

## 7.1 Shop Page

Route:

/

The shop page must:

-   Display products.
-   Show product image.
-   Show product name.
-   Show description.
-   Show price in Nigerian Naira.
-   Provide Add to Cart.
-   Provide View Details.
-   Show cart item count in navigation.

The design should be modern, clean, responsive, and simple.

------------------------------------------------------------------------

# 8. Product Details

Route:

/products/:id

Display:

-   Product image
-   Product name
-   Product description
-   Product price
-   Quantity selector
-   Add to Cart

Handle invalid product IDs gracefully.

------------------------------------------------------------------------

# 9. Cart

Route:

/cart

The cart must support:

-   View products.
-   Increase quantity.
-   Decrease quantity.
-   Remove product.
-   Calculate subtotal.
-   Calculate total.
-   Continue shopping.
-   Proceed to checkout.

Cart calculation:

subtotal = price × quantity

total = sum(all subtotals)

Prevent checkout when the cart is empty.

For the initial implementation, the cart can be managed in React
state/context. Persistence of completed orders must be handled by
Supabase.

------------------------------------------------------------------------

# 10. Checkout

Route:

/checkout

Collect:

-   Full name
-   Email
-   Delivery address

Optional:

-   Phone number

Display:

-   Products
-   Quantity
-   Unit price
-   Subtotal
-   Total

Required validation:

-   Full name must not be empty.
-   Email must be valid.
-   Address must not be empty.
-   Cart must contain at least one item.

The Place Order button must:

-   Validate input.
-   Prevent duplicate submissions.
-   Show loading state.
-   Create an order.
-   Create order items.
-   Trigger confirmation email.
-   Clear cart after successful order creation.
-   Navigate to order success page.

------------------------------------------------------------------------

# 11. Database Design

Use Supabase PostgreSQL.

Create:

## products

Fields:

-   id
-   name
-   description
-   price
-   image_url
-   created_at

## orders

Fields:

-   id
-   user_id nullable
-   customer_name
-   email
-   address
-   total
-   status
-   created_at

Default status:

pending

Possible statuses:

-   pending
-   confirmed

## order_items

Fields:

-   id
-   order_id
-   product_id
-   quantity
-   price
-   created_at

Relationships:

orders.id → order_items.order_id

products.id → order_items.product_id

Important:

Store the product price in order_items at the time of purchase. Do not
depend on the current product price when displaying historical orders.

------------------------------------------------------------------------

# 12. Database Security

Use appropriate Supabase Row Level Security.

Requirements:

-   Products can be read by customers.
-   Orders must not be publicly readable without appropriate
    authorization.
-   Authenticated users should only access their own user-specific order
    information if order history is implemented.
-   Do not create broad policies that allow everyone to
    insert/update/delete everything unless absolutely necessary during
    local development.
-   If a temporary development policy is created, replace it before
    production deployment.

------------------------------------------------------------------------

# 13. Seed Products

Create at least six products.

Suggested products:

1.  Classic T-Shirt
2.  Classic Sneakers
3.  Everyday Backpack
4.  Wristwatch
5.  Hoodie
6.  Cap

Use realistic descriptions and prices in Nigerian Naira.

Product images should use stable image URLs or another reliable image
source.

Do not invent broken image URLs.

------------------------------------------------------------------------

# 14. Supabase Client

Create a Supabase client using environment variables.

Example:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Do not put service-role or secret keys in the frontend.

The frontend should only use the public client-side key intended for
browser use.

------------------------------------------------------------------------

# 15. Authentication

Implement Google authentication using:

Google Cloud Console + Supabase Auth

Required UI:

For unauthenticated users:

Continue with Google

For authenticated users:

Welcome, \[name\] Sign Out

Authentication should persist across page refreshes.

Do not make Google authentication mandatory for guest checkout unless
the assignment or implementation requires it.

If the customer is logged in, save:

user_id = authenticated user's Supabase user ID

For guest checkout:

user_id = null

------------------------------------------------------------------------

# 16. Google OAuth Configuration

Do not invent credentials.

When Google OAuth configuration is reached:

1.  Tell the user exactly what needs to be created in Google Cloud
    Console.
2.  Tell them which values need to be copied.
3.  Tell them exactly where each value belongs.
4.  Ask them to provide only non-secret configuration values when
    possible.
5.  Never ask the user to paste private secrets into source code.
6.  Configure Supabase redirect URLs correctly.
7.  Configure the production callback URL separately from local
    development if required.

The application should use Supabase's OAuth flow rather than
implementing Google's OAuth protocol manually.

------------------------------------------------------------------------

# 17. Mailgun

Use Mailgun to send order confirmation emails.

Never expose the Mailgun API key in React.

Preferred architecture:

React → Supabase Edge Function → Mailgun API → Customer email

Server-side environment variables may include:

MAILGUN_API_KEY MAILGUN_DOMAIN MAILGUN_FROM_EMAIL

Do not commit these values.

------------------------------------------------------------------------

# 18. Confirmation Email

Subject:

Order Confirmation - Nuvora Store

Email should contain:

-   Customer name
-   Order ID
-   Products
-   Quantity
-   Individual price
-   Total
-   Order date
-   Thank-you message

Example structure:

Hello \[Customer Name\],

Thank you for your order from Nuvora Store.

Order ID: #\[ID\]

\[Product\] Quantity: \[Quantity\] Price: \[Price\]

Total: \[Total\]

We have received your order and will process it shortly.

Thank you for shopping with us.

The email should be readable on both desktop and mobile.

------------------------------------------------------------------------

# 19. Email Failure Handling

Do not falsely tell the user that the order failed merely because email
delivery failed.

The system should distinguish:

ORDER CREATED

from

EMAIL DELIVERY FAILED

If the order has been successfully persisted but the email fails:

-   Keep the order.
-   Log the error safely.
-   Inform the user appropriately.
-   Do not create a duplicate order simply because the email failed.

------------------------------------------------------------------------

# 20. Order Processing

Preferred sequence:

1.  Validate checkout data.
2.  Confirm cart is not empty.
3.  Fetch/verify product information from Supabase.
4.  Calculate trusted totals.
5.  Create order.
6.  Create order items.
7.  Trigger confirmation email.
8.  Clear cart.
9.  Navigate to success page.

Do not trust only the browser's calculated price.

The database-backed product prices should be used when creating the
final order.

------------------------------------------------------------------------

# 21. Order Success Page

Route:

/order-success

Display:

ORDER SUCCESSFUL

Thank you for your order, \[name\].

Your order #\[id\] has been received.

A confirmation email has been sent to [email](#email).

Button:

Continue Shopping

------------------------------------------------------------------------

# 22. Loading States

Every async operation needs a clear loading state.

Examples:

Loading products...

Signing in...

Placing order...

Sending confirmation...

Disable relevant buttons while requests are running.

Never allow rapid repeated clicks to create duplicate orders.

------------------------------------------------------------------------

# 23. Error Handling

Handle:

-   Product loading failure.
-   Database failure.
-   Invalid checkout information.
-   Empty cart.
-   Authentication failure.
-   Order creation failure.
-   Order item creation failure.
-   Email failure.
-   Network failure.

User-facing messages must be simple.

Do not expose stack traces, API keys, database credentials, or internal
server errors to users.

------------------------------------------------------------------------

# 24. UI Requirements

Use a clean modern e-commerce style.

The interface should be:

-   Responsive
-   Mobile friendly
-   Desktop friendly
-   Accessible
-   Simple
-   Professional
-   Easy to navigate

Avoid excessive animations.

Do not spend more time on visual effects than on required functionality.

------------------------------------------------------------------------

# 25. Responsive Behavior

Desktop:

3--4 product cards per row.

Tablet:

2 product cards per row.

Mobile:

1 product card per row.

No horizontal scrolling should occur on normal mobile widths.

------------------------------------------------------------------------

# 26. Accessibility

Use:

-   Semantic HTML.
-   Labels for form fields.
-   Buttons instead of clickable divs.
-   Alt text for images.
-   Keyboard accessible controls.
-   Visible focus states.
-   Clear error messages.

------------------------------------------------------------------------

# 27. Environment Variables

Frontend:

VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY=

Server-side:

MAILGUN_API_KEY= MAILGUN_DOMAIN= MAILGUN_FROM_EMAIL=

If other server-side credentials become necessary, document them.

Never commit .env or .env.local.

Ensure .gitignore contains:

.env .env.local .env.\*.local

------------------------------------------------------------------------

# 28. Git Rules

Make logical commits.

Suggested commit sequence:

1.  feat: set up shop foundation
2.  feat: add product catalog
3.  feat: add shopping cart
4.  feat: add checkout
5.  feat: connect supabase
6.  feat: persist orders
7.  feat: add google authentication
8.  feat: add mailgun confirmation
9.  fix: handle checkout errors
10. chore: prepare production deployment

Do not commit secrets.

Before pushing:

-   Check git status.
-   Check .gitignore.
-   Search for accidental secrets.
-   Run the build.

------------------------------------------------------------------------

# 29. Development Phases

## PHASE 0 --- Inspection

Tasks:

-   Inspect repository.
-   Identify framework.
-   Identify existing functionality.
-   Identify dependencies.
-   Identify current routes.
-   Identify environment configuration.
-   Identify whether Lesson 1 code can be reused.

Deliverable:

A short inspection report.

Do not make destructive changes.

------------------------------------------------------------------------

# PHASE 1 --- Application Foundation

Tasks:

-   Ensure application runs.
-   Install only required dependencies.
-   Establish routing.
-   Create basic layout.
-   Create Navbar.
-   Create placeholder pages.

Routes:

/ /products/:id /cart /checkout /login /order-success

Acceptance:

-   npm run dev works.
-   All routes load.
-   No console-breaking errors.

------------------------------------------------------------------------

# PHASE 2 --- Product Catalog

Tasks:

-   Create product data model.
-   Build ProductCard.
-   Build product grid.
-   Build product details.
-   Add six seed products.
-   Connect product display to Supabase if Supabase setup is ready.

Acceptance:

-   Six products can be displayed.
-   Product details work.
-   Prices display correctly.
-   Images work.
-   Loading and error states work.

------------------------------------------------------------------------

# PHASE 3 --- Shopping Cart

Tasks:

-   Create CartContext.
-   Add product to cart.
-   Remove product.
-   Increase quantity.
-   Decrease quantity.
-   Calculate subtotal.
-   Calculate total.
-   Display cart count.

Acceptance:

-   Cart works without page errors.
-   Totals update immediately.
-   Empty cart state works.
-   Checkout is disabled/blocked when cart is empty.

------------------------------------------------------------------------

# PHASE 4 --- Supabase

Tasks:

-   Create Supabase project if not already created.
-   Configure environment variables.
-   Create tables.
-   Create relationships.
-   Add seed products.
-   Configure appropriate RLS.
-   Connect frontend to Supabase.

Acceptance:

-   Products load from Supabase.
-   Product data is not hardcoded in the production UI.
-   Database connection works.
-   No secret credentials are exposed.

------------------------------------------------------------------------

# PHASE 5 --- Checkout

Tasks:

-   Build checkout form.
-   Add validation.
-   Display order summary.
-   Create orders table integration.
-   Create order_items integration.
-   Calculate trusted totals.
-   Prevent duplicate submissions.
-   Clear cart after successful order.

Acceptance:

A customer can:

Shop → Add to cart → Checkout → Submit order → See order saved in
Supabase

------------------------------------------------------------------------

# PHASE 6 --- Google Authentication

Tasks:

-   Configure Google Cloud project.
-   Configure OAuth client.
-   Configure Supabase Google provider.
-   Configure redirect URLs.
-   Implement Google login.
-   Implement logout.
-   Persist auth state.
-   Attach user_id to authenticated orders.

Acceptance:

-   Google sign-in works locally.
-   Authenticated user is visible in the UI.
-   Logout works.
-   Refresh does not unexpectedly lose the session.

------------------------------------------------------------------------

# PHASE 7 --- Mailgun

Tasks:

-   Create/configure Mailgun.
-   Verify required domain/sender configuration.
-   Store credentials server-side.
-   Create Supabase Edge Function or secure server-side endpoint.
-   Send confirmation email after successful order.
-   Include order details.

Acceptance:

-   Successful order triggers email.
-   Email reaches the intended recipient.
-   Mailgun API key is not present in frontend bundle.
-   Email failure does not create duplicate orders.

------------------------------------------------------------------------

# PHASE 8 --- Full Testing

Test this exact flow:

1.  Open shop.
2.  Load products.
3.  Open product details.
4.  Add product.
5.  Add another product.
6.  Increase quantity.
7.  Decrease quantity.
8.  Remove product.
9.  Go to checkout.
10. Test invalid form.
11. Submit valid form.
12. Verify order in Supabase.
13. Verify order items in Supabase.
14. Verify email.
15. Verify success page.
16. Verify cart clears.
17. Test Google login.
18. Test logout.
19. Refresh the page.
20. Test mobile layout.
21. Test production build.

------------------------------------------------------------------------

# PHASE 9 --- Production Preparation

Run:

npm run build

Fix every build error.

Then:

-   Check environment variables.
-   Check .gitignore.
-   Check for exposed secrets.
-   Check Supabase production configuration.
-   Check Google OAuth production callback.
-   Check Mailgun production configuration.
-   Test production build.

------------------------------------------------------------------------

# PHASE 10 --- Deployment

Deploy to Vercel.

Configure production environment variables.

After deployment, test:

-   Home page.
-   Product loading.
-   Cart.
-   Checkout.
-   Database.
-   Google Auth.
-   Mailgun.
-   Success page.

Do not declare deployment successful until the live URL has been tested.

------------------------------------------------------------------------

# 30. Testing Checklist

Before declaring complete:

## Shop

-   [ ] Products load
-   [ ] Product images load
-   [ ] Product details work
-   [ ] Add to cart works

## Cart

-   [ ] Add item
-   [ ] Remove item
-   [ ] Increase quantity
-   [ ] Decrease quantity
-   [ ] Correct subtotal
-   [ ] Correct total
-   [ ] Empty state

## Checkout

-   [ ] Validation
-   [ ] Name
-   [ ] Email
-   [ ] Address
-   [ ] Order summary
-   [ ] Place order
-   [ ] Loading state
-   [ ] Duplicate prevention

## Database

-   [ ] Products table
-   [ ] Orders table
-   [ ] Order items table
-   [ ] Relationships
-   [ ] RLS

## Authentication

-   [ ] Google login
-   [ ] Logout
-   [ ] Session persistence
-   [ ] Authenticated user ID

## Email

-   [ ] Mailgun configuration
-   [ ] Confirmation email
-   [ ] Correct recipient
-   [ ] Correct order details
-   [ ] Secret protection

## Deployment

-   [ ] Production build
-   [ ] Vercel deployment
-   [ ] Production environment variables
-   [ ] Production Google OAuth
-   [ ] Production Mailgun
-   [ ] Live end-to-end test

------------------------------------------------------------------------

# 31. Definition of Done

The project is complete only when:

-   The application runs without build errors.
-   The shop displays products.
-   Products come from Supabase.
-   Users can add products to cart.
-   Cart calculations are correct.
-   Checkout works.
-   Orders are persisted.
-   Order items are persisted.
-   Google authentication works.
-   Mailgun sends confirmation emails.
-   Secrets are protected.
-   The application is responsive.
-   The production deployment works.
-   The GitHub repository is clean.
-   README contains setup instructions.
-   The complete customer journey has been tested.

------------------------------------------------------------------------

# 32. Agent Communication Format

At the end of every phase, report:

## Completed

List exactly what was implemented.

## Files Changed

List important files created or modified.

## Verification

State commands/tests run.

Example:

npm run dev npm run build

## Current Status

PASS / NEEDS FIX

## User Action Required

Only include this section if the user must create/configure something.

Examples:

-   Create Supabase project.
-   Add environment variables.
-   Configure Google OAuth.
-   Verify Mailgun domain.

## Next Phase

State the next phase.

Do not claim a feature works if it has not been tested.

------------------------------------------------------------------------

# 33. Beginner-Friendly Explanation Rule

The developer using this project is still learning.

When introducing a technical concept, briefly explain:

1.  What it is.
2.  Why we need it.
3.  What the user needs to do.
4.  What the agent will do.
5.  How we will verify it.

Example:

"Supabase is the database service we're using to store products and
orders. You need to create the Supabase project and give the application
its public project URL and client key. I will then connect the
application to it and create the tables."

Avoid unnecessary jargon.

------------------------------------------------------------------------

# 34. Do Not Ask for Things You Can Determine Yourself

Inspect the project and determine:

-   Existing dependencies.
-   Existing file names.
-   Existing routes.
-   Existing components.
-   Whether packages are already installed.

Only ask the user when:

-   A credential is required.
-   A service account must be created.
-   A decision cannot reasonably be inferred.
-   An external dashboard requires user action.
-   The user must authorize an account.

------------------------------------------------------------------------

# 35. Do Not Invent Configuration

Never invent:

-   Supabase URL
-   Supabase keys
-   Google Client ID
-   Google Client Secret
-   Mailgun API key
-   Mailgun domain
-   Vercel credentials
-   OAuth redirect URLs that depend on unknown project details

If a value is unavailable, stop and explain exactly where to obtain it.

------------------------------------------------------------------------

# 36. Final HNG15 Submission Preparation

After everything works, prepare:

-   Live URL
-   GitHub repository URL
-   Short project description
-   Features
-   Technologies
-   Database description
-   Authentication description
-   Email implementation description
-   Screenshots if required
-   Demo video if required

Make sure the final submission clearly demonstrates that all Lesson 2
requirements were implemented.

------------------------------------------------------------------------

# 37. Start Here

Your first task is NOT to build the shop.

Your first task is:

1.  Inspect the existing project.
2.  Report what you find.
3.  Confirm the framework.
4.  Confirm the current routes.
5.  Confirm dependencies.
6.  Identify reusable Lesson 1 code.
7.  Identify what is missing.
8.  Recommend the smallest safe implementation plan.
9.  Implement Phase 1 only.
10. Run the application.
11. Verify it works.
12. Report the result.

Then wait for the next instruction before moving forward.
