# ZENJI Store — Premium Frontend E-commerce Design Spec

## Goal
Build a frontend-only premium anime-inspired streetwear e-commerce experience for ZENJI that is clearly original, more polished than the current brand site, and suitable for a web developer hiring assessment.

## Product Direction
ZENJI Store is not a clone of zenji.shop. It preserves the brand DNA—anime influence, Japanese visual culture, limited-drop energy, bold streetwear attitude—but upgrades the shopping experience with stronger hierarchy, cleaner navigation, editorial product storytelling, and refined motion.

## Tech Stack
- React (JSX)
- Vite
- Tailwind CSS
- Framer Motion
- Hugeicons
- React Router DOM
- Local JavaScript product data only
- localStorage for cart/wishlist persistence only
- No backend, database, auth, or payment integration

## Visual System
### Palette
- Ink Black: #090909
- Carbon: #121212
- Warm Ivory: #F3EFE7
- Soft White: #FAF8F4
- Graphite: #252525
- Muted Silver: #A6A6A6
- Crimson: #D72638

Crimson is an accent only. No gradient text.

### Typography
- Display: Bricolage Grotesque
- UI / Body: Instrument Sans
- System / Meta: Geist Mono
- Japanese glyph fallback: Noto Sans JP

Large hero typography uses responsive clamp sizing and tight tracking. Uppercase is reserved for system labels and selective campaign language.

## Experience Principles
1. Brand-first but commerce-clear.
2. Editorial layouts without sacrificing shopping usability.
3. Motion communicates hierarchy and interaction, never decorates randomly.
4. Product imagery dominates the experience.
5. Desktop experience feels cinematic; mobile remains fast, direct, and thumb-friendly.
6. Every interactive element has visible hover/focus/pressed states.
7. Keep the interface mostly monochrome with controlled crimson moments.

## Information Architecture
### Routes
- `/` Home
- `/shop` Shop / collection
- `/product/:slug` Product detail
- `/lookbook` Lookbook
- `/story` Brand story
- `/cart` Cart

### Global UI
- Announcement / drop ticker
- Sticky adaptive navigation
- Search overlay
- Cart drawer
- Mobile menu
- Custom cursor on fine-pointer devices only
- Page transition shell
- Footer

## Homepage
### Hero — “ENTER THE NEXT ARC”
Full-height editorial hero with oversized split typography, product/model image area, subtle grid coordinates, system metadata, primary Shop Drop CTA, secondary Explore Story action, and scroll indicator.

Motion:
- staged character/word reveal
- image mask reveal
- subtle pointer parallax on desktop
- nav shifts from transparent to solid after scroll

### Current Drop
Asymmetric editorial layout presenting the collection as a release rather than a generic category. Includes drop code, title, short manifesto, product count, and large campaign imagery.

### Featured Product Rail
Horizontal product cards with large image canvases. Cards reveal color, price, quick-view control, and wishlist action on hover. Mobile becomes a snap carousel.

### Product Spotlight
One immersive sticky-scroll product story. Product imagery changes as users move through fabric, artwork, fit, and detail copy. Reduced-motion users receive a static stacked version.

### New Arrivals Grid
Clean shopping grid to re-establish conventional e-commerce usability after editorial sections.

### Next Drop Countdown
Dark crimson-accented release block with client-side countdown and Notify Me UI (frontend only; button shows confirmation toast).

### Lookbook Preview
Asymmetric masonry-style preview with category labels and a View Lookbook CTA.

### Manifesto
Large typographic statement and restrained Japanese glyph treatment.

### Newsletter / Community
Minimal email field with frontend success state only.

## Shop Page
- Editorial page header
- Search within products
- Category tabs
- Size filters
- Color filters
- Price range buckets
- Sort: Featured / Newest / Price Low-High / Price High-Low
- Desktop filter rail or top toolbar based on viewport
- Mobile filter bottom sheet
- Product result count
- Animated product grid
- Empty state

## Product Card
- Primary and alternate images
- Image crossfade / directional reveal on hover
- Product name
- Drop label
- Price and optional compare-at price
- Swatches
- Wishlist
- Quick add / quick view affordance
- Entire card remains keyboard accessible

## Product Detail Page
Desktop layout: large gallery left, sticky information column right.

Features:
- Breadcrumb/system path
- Image gallery with thumbnails
- Product title
- Collection/drop metadata
- Price / sale price
- Stock state
- Colorway
- Size selector
- Size guide modal
- Add to Bag
- Wishlist
- Expandable Product Details / Fit / Shipping sections
- Fabric/material callouts
- Related products

Add-to-cart is local state only and opens the cart drawer with visible confirmation.

## Cart
### Cart Drawer
- Line items
- Thumbnail
- Size/color
- Quantity stepper
- Remove
- Subtotal
- Free-shipping progress visual
- View Cart / Checkout UI

### Full Cart Page
- Larger item list
- Order summary
- Promo-code visual interaction only
- Checkout button opens a “Demo frontend only” modal instead of payment flow

## Lookbook
- Filter controls: All / Front / Back / Detail / On Body
- Mixed editorial grid
- Hover metadata and linked product
- Motion layout transitions between filters

## Story Page
- Brand statement
- Anime/Japanese/streetwear inspiration
- Timeline / philosophy blocks
- Large editorial images
- Manifesto typography
- CTA back to shop

## Motion System
Framer Motion only.

### Motion Tokens
- Fast: 0.18–0.24s
- Standard: 0.35–0.5s
- Editorial: 0.7–0.95s
- Primary ease: [0.22, 1, 0.36, 1]

### Behaviors
- text mask reveals
- clip/image reveals
- hover media scaling max ~1.04
- magnetic CTA movement kept subtle
- nav underline/active-pill motion
- cart drawer spring
- filter layout transitions
- shared product-image transition where practical
- page opacity/translate transitions
- reduced-motion support via `useReducedMotion`

No excessive scroll hijacking, no long intro loader, and no animations that block shopping.

## Responsive Rules
- Mobile-first Tailwind breakpoints
- 44px minimum touch targets
- No custom cursor on touch devices
- Hero composition reflows rather than simply scales down
- Sticky product info becomes normal document flow on mobile
- Filters become bottom sheet
- Product grids: 2 columns on common phones, 3 on tablet, 4 on desktop where space allows

## Accessibility
- Semantic buttons and links
- Visible keyboard focus
- Dialog focus handling
- Meaningful image alt text
- `aria-label` for icon-only controls
- color contrast checked against dark and ivory surfaces
- reduced motion support

## Data Model
Local `products.js` exports product records with:
- id
- slug
- name
- collection
- dropCode
- category
- description
- details
- fit
- price
- compareAtPrice
- colors
- sizes
- stock
- images
- tags
- featured
- newArrival

## State
React context + reducer for cart/wishlist and localStorage persistence. UI state stays local unless shared globally.

## Code Quality
- Focused components
- Data separated from presentation
- Reusable motion primitives
- Shared Button, IconButton, ProductCard, SectionHeader, Drawer, Modal, and Reveal components
- Avoid monolithic page files
- ESLint clean
- Production build must pass

## Deliverable
A complete Vite React project that can be run with `npm install && npm run dev`, deployed to Vercel/Netlify, and used as the frontend-only assessment submission.
