# ZENJI Store — Premium Frontend E-Commerce Concept

A frontend-only redesign concept for **ZENJI**, built as a Web Developer assessment. The experience combines premium editorial streetwear design, anime/Japanese visual cues, a realistic commerce flow, responsive interaction design, and clean React architecture.

## Stack

- React + JSX
- Vite
- Tailwind CSS
- Framer Motion
- Hugeicons
- React Router
- Context API + `useReducer`
- `localStorage` persistence

## Design System

- **Display:** Bricolage Grotesque
- **UI:** Instrument Sans
- **Technical labels:** Geist Mono
- **Japanese glyphs:** Noto Sans JP
- **Palette:** Ink Black, Warm Ivory, Graphite, Silver, controlled Crimson
- No gradient text

## Implemented Frontend Flow

- Premium animated homepage
- Current drop / campaign storytelling
- Shop + search + filters + sorting
- Product cards + wishlist
- Product details with gallery, color, size, quantity and accordion content
- Cart drawer + cart page
- Frontend login/register flow
- Protected-looking account routes
- Editable profile
- Saved addresses
- Wishlist persistence
- Checkout steps
- Shipping + payment UI
- Local order creation
- Order confirmation
- Order history + order details + timeline
- Recently viewed products
- Drops page
- Lookbook filtering
- Brand story page
- Responsive mobile navigation and filters
- Reduced-motion accessibility support

## Demo Login

The login form is prefilled with:

```txt
Email: demo@zenji.store
Password: zenji123
```

This project is intentionally **frontend-only**. Authentication, payment, orders, profile changes, addresses, cart, wishlist and history are simulated in the browser with Context API and `localStorage`.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Tests

Core reducer and product utility behavior uses Node's built-in test runner, so the tests themselves do not require an extra testing dependency:

```bash
npm test
```

## Production Build

```bash
npm run build
npm run preview
```

## Suggested Deployment

Deploy directly to Vercel or Netlify. For client-side routing, configure the host to rewrite unknown routes to `index.html` if required by the platform.

## Project Notes

- No backend
- No database
- No real authentication
- No real payment gateway
- No commercial use intended
- Product/campaign photography uses remote Unsplash imagery for assessment/demo presentation. Replace those URLs with final licensed brand assets if the project is ever adapted beyond the assessment.

## Architecture

Global state is split by responsibility instead of one oversized store:

```txt
AuthContext
CartContext
WishlistContext
OrderContext
ShopContext
```

Complex transitions are handled with reducers; presentational state remains local to the component that owns it.
