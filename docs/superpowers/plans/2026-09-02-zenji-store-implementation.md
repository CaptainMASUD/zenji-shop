# ZENJI Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete premium, responsive, frontend-only ZENJI streetwear e-commerce experience defined in the design spec.

**Architecture:** Vite React application with route-level pages, focused presentational components, a local product catalog, and a small global commerce context for cart/wishlist persistence. Framer Motion powers page, section, card, drawer, and filter transitions while reusable primitives keep motion consistent.

**Tech Stack:** React JSX, Vite, Tailwind CSS, Framer Motion, Hugeicons, React Router DOM, Vitest/Testing Library

**Spec:** `docs/superpowers/specs/2026-09-02-zenji-store-design.md`

## Global Constraints
- Frontend only: no backend, database, authentication, or payment integration.
- React components must use JSX, not TypeScript.
- Tailwind CSS controls styling.
- Framer Motion controls application motion.
- Hugeicons is the primary icon library.
- No gradient text.
- Primary palette: #090909, #121212, #F3EFE7, #FAF8F4, #252525, #A6A6A6, #D72638.
- Typography: Bricolage Grotesque, Instrument Sans, Geist Mono, Noto Sans JP fallback.
- Respect `prefers-reduced-motion`.
- Desktop and mobile experiences must both be complete.

---

## File Structure

```text
zenji-store/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/products.js
│   ├── context/CommerceContext.jsx
│   ├── hooks/useMediaQuery.js
│   ├── hooks/useScrollLock.js
│   ├── utils/currency.js
│   ├── layout/SiteLayout.jsx
│   ├── components/common/
│   │   ├── AnnouncementBar.jsx
│   │   ├── Navbar.jsx
│   │   ├── MobileMenu.jsx
│   │   ├── SearchOverlay.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomCursor.jsx
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Drawer.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── Reveal.jsx
│   │   └── Toast.jsx
│   ├── components/product/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductGallery.jsx
│   │   ├── ProductInfo.jsx
│   │   ├── SizeGuide.jsx
│   │   └── RelatedProducts.jsx
│   ├── components/cart/
│   │   ├── CartDrawer.jsx
│   │   ├── CartLineItem.jsx
│   │   └── CartSummary.jsx
│   ├── components/home/
│   │   ├── HeroSection.jsx
│   │   ├── CurrentDrop.jsx
│   │   ├── FeaturedRail.jsx
│   │   ├── ProductSpotlight.jsx
│   │   ├── NewArrivals.jsx
│   │   ├── DropCountdown.jsx
│   │   ├── LookbookPreview.jsx
│   │   ├── Manifesto.jsx
│   │   └── Newsletter.jsx
│   ├── components/shop/
│   │   ├── ShopToolbar.jsx
│   │   ├── FilterPanel.jsx
│   │   └── MobileFilterSheet.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── ShopPage.jsx
│       ├── ProductPage.jsx
│       ├── LookbookPage.jsx
│       ├── StoryPage.jsx
│       ├── CartPage.jsx
│       └── NotFoundPage.jsx
└── tests/
    ├── commerce.test.jsx
    ├── filters.test.jsx
    └── product-page.test.jsx
```

### Task 1: Foundation, theme, catalog, and routing

**Files:** create `package.json`, Vite config, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/data/products.js`, utility/hooks, and initial page shells.

**Interfaces:**
- Produces `products` array and `getProductBySlug(slug)`.
- Produces route shell consumed by all page tasks.

- [ ] Write a catalog utility test for `getProductBySlug` and currency formatting.
- [ ] Run tests and confirm failure before implementation.
- [ ] Scaffold Vite React dependencies and implement theme/font tokens, routes, local product data, and utilities.
- [ ] Run unit tests and production build.
- [ ] Commit `feat: establish zenji storefront foundation`.

### Task 2: Commerce context and persistence

**Files:** create `src/context/CommerceContext.jsx`, `tests/commerce.test.jsx`.

**Interfaces:**
- Produces `useCommerce()` with `cartItems`, `wishlist`, `cartCount`, `subtotal`, `addToCart`, `removeFromCart`, `updateQuantity`, `toggleWishlist`, and `clearCart`.

- [ ] Write failing tests for add, quantity update, remove, subtotal, and wishlist toggle.
- [ ] Run targeted tests and confirm failure.
- [ ] Implement reducer/context and guarded localStorage hydration/persistence.
- [ ] Run tests and verify pass.
- [ ] Commit `feat: add local commerce state`.

### Task 3: Global layout and navigation

**Files:** create layout/common components: announcement bar, navbar, mobile menu, search overlay, footer, cursor, buttons, reveal, drawer, modal, toast.

**Interfaces:**
- SiteLayout wraps route content.
- Drawer and Modal expose `open`, `onClose`, and `children`.

- [ ] Add interaction tests for menu/search escape close and keyboard-visible controls.
- [ ] Implement adaptive sticky nav, announcement ticker, full-screen mobile menu, animated search overlay, global footer, desktop-only custom cursor.
- [ ] Add reduced-motion fallbacks.
- [ ] Run lint/tests/build.
- [ ] Commit `feat: build global zenji shell`.

### Task 4: Homepage editorial experience

**Files:** all `src/components/home/*` and `src/pages/HomePage.jsx`.

**Interfaces:**
- Consumes product catalog and `useCommerce` wishlist/cart interactions.

- [ ] Add smoke test asserting primary hero CTA, current drop, latest product content, and countdown block render.
- [ ] Implement hero with staged text/image reveal and responsive composition.
- [ ] Implement Current Drop and Featured Rail.
- [ ] Implement sticky Product Spotlight with reduced-motion static fallback.
- [ ] Implement New Arrivals, countdown, lookbook preview, manifesto, and newsletter success state.
- [ ] Run responsive browser checks, tests, lint, and build.
- [ ] Commit `feat: create premium zenji homepage`.

### Task 5: Shop discovery and filtering

**Files:** `ShopPage.jsx`, `ShopToolbar.jsx`, `FilterPanel.jsx`, `MobileFilterSheet.jsx`, `ProductCard.jsx`, `ProductGrid.jsx`, `tests/filters.test.jsx`.

**Interfaces:**
- Filters operate on local products by category, size, color, search term, price bucket, and sort order.

- [ ] Write failing pure-filter tests for combined category/size/search and price sorting.
- [ ] Implement filter utilities and verify tests pass.
- [ ] Implement desktop toolbar/filter UI and mobile bottom sheet.
- [ ] Implement premium animated ProductCard and responsive grid/empty state.
- [ ] Verify keyboard operation and mobile touch targets.
- [ ] Run full validation.
- [ ] Commit `feat: add animated product discovery`.

### Task 6: Product detail experience

**Files:** `ProductPage.jsx`, `ProductGallery.jsx`, `ProductInfo.jsx`, `SizeGuide.jsx`, `RelatedProducts.jsx`, `tests/product-page.test.jsx`.

**Interfaces:**
- Reads product from `getProductBySlug`.
- Adds selected size/color to `useCommerce().addToCart`.

- [ ] Write failing test that Add to Bag remains disabled until required size is selected and then adds the correct variant.
- [ ] Implement image gallery/thumb navigation and sticky product info.
- [ ] Implement color/size selection, size guide modal, accordions, wishlist, and Add to Bag feedback.
- [ ] Implement related products.
- [ ] Test unknown slugs route to Not Found state.
- [ ] Run validation and commit `feat: build zenji product experience`.

### Task 7: Cart drawer and cart page

**Files:** `CartDrawer.jsx`, `CartLineItem.jsx`, `CartSummary.jsx`, `CartPage.jsx`.

**Interfaces:**
- Consumes all cart methods from CommerceContext.

- [ ] Add test for quantity update, remove, and subtotal UI.
- [ ] Implement spring cart drawer and line-item controls.
- [ ] Implement free-shipping progress and empty cart state.
- [ ] Implement full cart page and demo checkout modal.
- [ ] Run accessibility interaction checks and validation.
- [ ] Commit `feat: complete frontend cart flow`.

### Task 8: Lookbook and Story

**Files:** `LookbookPage.jsx`, `StoryPage.jsx`.

**Interfaces:**
- Lookbook filter layout links entries back to product routes.

- [ ] Add render/filter smoke test for Lookbook.
- [ ] Implement animated editorial lookbook filter transitions.
- [ ] Implement brand Story page with manifesto, timeline/philosophy sections, and shop CTA.
- [ ] Verify responsive editorial composition.
- [ ] Run validation and commit `feat: add zenji editorial pages`.

### Task 9: Final polish and release validation

**Files:** cross-project adjustments only where required by validation.

**Interfaces:** no new public API.

- [ ] Run `npm test -- --run` and resolve all failures.
- [ ] Run `npm run lint` and resolve all warnings/errors.
- [ ] Run `npm run build` and verify production bundle completes.
- [ ] Check 360px, 768px, 1280px, and 1536px layouts for overflow and broken interactions.
- [ ] Check keyboard navigation, visible focus, modal/drawer close behavior, and reduced-motion mode.
- [ ] Verify no backend/auth/payment calls exist and no gradient text styles exist.
- [ ] Add README with setup, features, design rationale, stack, and deployment steps.
- [ ] Commit `chore: prepare zenji assessment release`.
