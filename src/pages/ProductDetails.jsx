import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { products } from '../data/products.js';
import { currency } from '../utils/currency.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';

const EASE = [0.16, 1, 0.3, 1];

// Product Details gets its own shape language:
// asymmetrical editorial slash cuts instead of the site's repeated four-corner cut.
const GALLERY_SLASH_CLIP =
  'polygon(34px 0, 100% 0, 100% 42%, calc(100% - 16px) 42%, calc(100% - 16px) 61%, 100% 61%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 34px)';
const INFO_SLASH_CLIP =
  'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 22px 100%, 0 calc(100% - 22px), 0 62%, 14px 62%, 14px 41%, 0 41%)';
const THUMB_SINGLE_CUT =
  'polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)';
const SIZE_SINGLE_CUT =
  'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)';
const CTA_SLASH_CLIP =
  'polygon(0 0, calc(100% - 18px) 0, 100% 18px, calc(100% - 12px) 100%, 0 100%)';
const MICRO_CLIP =
  'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)';
const EMPTY_STATE_CLIP =
  'polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)';

const DETAIL_TABS = [
  { id: 'details', label: 'Product details' },
  { id: 'shipping', label: 'Shipping & returns' },
  { id: 'care', label: 'Material & care' },
];

function getProductIdentity(item) {
  return item?.id ?? item?._id ?? item?.slug ?? '';
}



function normalizeReview(review, index = 0) {
  const rating = Math.min(5, Math.max(1, Math.round(Number(review?.rating ?? review?.stars ?? 0))));
  const name = String(review?.name ?? review?.author ?? review?.customerName ?? 'ZENJI CUSTOMER').trim();
  const title = String(review?.title ?? review?.headline ?? '').trim();
  const body = String(review?.body ?? review?.comment ?? review?.text ?? review?.review ?? '').trim();
  const date = review?.date ?? review?.createdAt ?? review?.created_at ?? new Date().toISOString();

  if (!rating || (!title && !body)) return null;

  return {
    id: review?.id ?? `seed-review-${index}-${name.replace(/\\s+/g, '-').toLowerCase()}`,
    rating,
    name: name || 'ZENJI CUSTOMER',
    title: title || 'ZENJI PIECE REVIEW',
    body,
    date,
    verified: Boolean(review?.verified ?? review?.verifiedPurchase),
  };
}

function formatReviewDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'RECENT';

  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .toUpperCase();
}

function Stars({ value, size = 'text-[15px]', muted = false }) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <span
      aria-label={`${rounded} out of 5 stars`}
      className={`inline-flex gap-0.5 ${size} ${muted ? 'text-white/24' : 'text-crimson'}`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true" className={star <= rounded ? 'text-crimson' : 'text-white/20'}>
          ★
        </span>
      ))}
    </span>
  );
}

function Gallery({ product, images, image, setImage }) {
  const activeImage = images[image] ?? images[0] ?? '';

  return (
    <div className="grid gap-3 lg:h-full lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-4">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setImage(index)}
            aria-label={`Show ${product.name} image ${index + 1}`}
            aria-current={image === index ? 'true' : undefined}
            className={`group relative h-[66px] w-[58px] shrink-0 overflow-hidden border bg-[#0A0A0A] outline-none transition-[border-color,transform] duration-300 focus-visible:ring-2 focus-visible:ring-crimson lg:h-[78px] lg:w-16 ${
              image === index
                ? 'border-crimson'
                : 'border-white/[0.12] hover:-translate-y-0.5 hover:border-white/40'
            }`}
            style={{ clipPath: THUMB_SINGLE_CUT }}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition duration-500 ${
                image === index
                  ? 'scale-[1.025] opacity-100'
                  : 'opacity-55 group-hover:scale-[1.025] group-hover:opacity-100'
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-[3px] bg-crimson transition-all duration-300 ${
                image === index ? 'w-full' : 'w-0 group-hover:w-1/2'
              }`}
            />
          </button>
        ))}
      </div>

      <div
        className="order-1 relative overflow-hidden border border-white/[0.11] bg-[#090909] lg:order-2 lg:h-full"
        style={{ clipPath: GALLERY_SLASH_CLIP }}
      >
        <div className="relative min-h-[520px] h-[min(74svh,620px)] sm:min-h-[580px] sm:h-[min(76svh,660px)] lg:h-full lg:min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            {activeImage ? (
              <motion.img
                key={`${activeImage}-${image}`}
                initial={{ opacity: 0, x: 18, scale: 1.018 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -14, scale: 1.008 }}
                transition={{ duration: 0.42, ease: EASE }}
                src={activeImage}
                alt={`${product.name} — view ${image + 1}`}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <motion.div
                key="image-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]"
              >
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/35">
                  IMAGE PENDING
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="pointer-events-none absolute left-0 top-0 h-[5px] w-[28%] bg-crimson" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-[5px] w-[20%] bg-[#F4F0E8]" />
          <span className="pointer-events-none absolute right-0 top-[42%] h-[19%] w-[16px] bg-[#050505]" />

          <div className="absolute left-4 top-4 flex items-center gap-2.5 bg-[#050505] px-3 py-2 sm:left-5 sm:top-5" style={{ clipPath: MICRO_CLIP }}>
            <span className="h-1.5 w-1.5 bg-crimson" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#F4F0E8]">
              {String(image + 1).padStart(2, '0')} / {String(Math.max(images.length, 1)).padStart(2, '0')}
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-4 hidden sm:block">
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-white/60">
              ZENJI / PRODUCT FRAME
            </p>
            <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#F4F0E8]">
              {product.collection}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSelector({ colors, colorHex, color, setColor }) {
  if (!colors.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#F4F0E8]">
          COLORWAY
        </p>
        <span className="truncate text-right font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-crimson">
          {color}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((colorName, index) => (
          <button
            key={colorName}
            type="button"
            onClick={() => setColor(colorName)}
            aria-label={`Select ${colorName}`}
            aria-pressed={color === colorName}
            title={colorName}
            className={`group relative flex h-11 min-w-11 items-center justify-center border px-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-crimson ${
              color === colorName
                ? 'border-crimson bg-[#16090B]'
                : 'border-white/[0.13] bg-[#0A0A0A] hover:border-white/40'
            }`}
          >
            <span
              className="block h-5 w-5 border border-white/25"
              style={{ backgroundColor: colorHex[index] ?? '#171717' }}
            />
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-0 h-[3px] bg-crimson transition-all duration-300 ${
                color === colorName ? 'w-full' : 'w-0 group-hover:w-1/2'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeSelector({ sizes, size, setSize }) {
  if (!sizes.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#F4F0E8]">
          SELECT SIZE
        </p>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-white/60">
          {size || 'REQUIRED'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1.5 sm:flex sm:flex-wrap">
        {sizes.map((sizeName) => (
          <button
            key={sizeName}
            type="button"
            onClick={() => setSize(sizeName)}
            aria-label={`Select size ${sizeName}`}
            aria-pressed={size === sizeName}
            className={`relative min-h-[46px] min-w-0 border px-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-crimson sm:min-w-[58px] ${
              size === sizeName
                ? 'border-crimson bg-crimson text-white'
                : 'border-white/[0.13] bg-[#090909] text-[#F4F0E8] hover:border-white/45'
            }`}
            style={{ clipPath: SIZE_SINGLE_CUT }}
          >
            {sizeName}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantityControl({ qty, setQty, stock }) {
  const atMax = stock <= 0 || qty >= stock;

  return (
    <div className="flex min-h-[54px] items-center justify-between border border-white/[0.14] bg-[#090909] px-1">
      <button
        type="button"
        onClick={() => setQty((current) => Math.max(1, current - 1))}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-[20px] font-medium text-[#F4F0E8] transition-colors hover:bg-white hover:text-[#050505] disabled:cursor-not-allowed disabled:opacity-25"
      >
        −
      </button>

      <span className="min-w-8 text-center font-mono text-[12px] font-bold text-[#F4F0E8]">
        {qty}
      </span>

      <button
        type="button"
        onClick={() => setQty((current) => Math.min(stock, current + 1))}
        disabled={atMax}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-[20px] font-medium text-[#F4F0E8] transition-colors hover:bg-white hover:text-[#050505] disabled:cursor-not-allowed disabled:opacity-25"
      >
        +
      </button>
    </div>
  );
}

function DetailsTabs({ active, setActive, product, materials }) {
  const handleTabKeyDown = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + DETAIL_TABS.length) % DETAIL_TABS.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % DETAIL_TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = DETAIL_TABS.length - 1;

    const next = DETAIL_TABS[nextIndex];
    setActive(next.id);
    requestAnimationFrame(() => document.getElementById(`product-tab-${next.id}`)?.focus());
  };

  const sectionLabel = (label) => (
    <div className="flex items-center gap-2.5">
      <span className="h-2 w-2 shrink-0 bg-crimson" />
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson">
        {label}
      </p>
    </div>
  );

  const activeContent = {
    details: (
      <div className="grid gap-7 md:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)] md:gap-10 lg:gap-14">
        <div>
          {sectionLabel('PRODUCT SUMMARY')}
          <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-white/70 sm:text-[15px]">
            {product.description || 'Product description is not available for this piece.'}
          </p>
        </div>

        <div className="md:border-l md:border-white/[0.1] md:pl-8 lg:pl-10">
          {sectionLabel('MATERIAL / BUILD')}
          {materials.length ? (
            <ul className="mt-3 grid gap-2.5 text-[14px] leading-6 text-white/68 sm:grid-cols-2 md:grid-cols-1">
              {materials.map((material) => (
                <li key={material} className="flex items-start gap-3">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-crimson" />
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] leading-6 text-white/55">Material details are not available.</p>
          )}
        </div>
      </div>
    ),
    shipping: (
      <div className="max-w-[820px]">
        {sectionLabel('SHIPPING / RETURNS')}
        <p className="mt-3 text-[14px] leading-7 text-white/70 sm:text-[15px]">
          Free shipping over A$80. Standard delivery 3–7 business days. Returns are accepted within 14 days when the item is unworn and in original condition.
        </p>
      </div>
    ),
    care: (
      <div className="max-w-[820px]">
        {sectionLabel('CARE INSTRUCTIONS')}
        <p className="mt-3 text-[14px] leading-7 text-white/70 sm:text-[15px]">
          Cold gentle wash inside-out. Do not tumble dry. Dry away from direct heat and do not iron directly over the artwork.
        </p>
      </div>
    ),
  };

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden border border-white/[0.11] bg-[#080808]">
      <div role="tablist" aria-label="Product information" className="grid grid-cols-3 border-b border-white/[0.11]">
        {DETAIL_TABS.map((tab, index) => {
          const selected = active === tab.id;

          return (
            <button
              key={tab.id}
              id={`product-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`product-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`group relative min-h-[58px] border-r border-white/[0.1] px-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.12em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson sm:min-h-[62px] sm:px-5 sm:text-[10px] sm:tracking-[0.14em] last:border-r-0 ${
                selected
                  ? 'bg-[#101010] text-[#F4F0E8]'
                  : 'bg-[#080808] text-white/58 hover:bg-[#0C0C0C] hover:text-white/90'
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-[4px] origin-left bg-crimson transition-transform duration-300 ${
                  selected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-40'
                }`}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          id={`product-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`product-tab-${active}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
        >
          {activeContent[active]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function ReviewsSection({ reviews, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });

  const reviewCount = reviews.length;
  const average = reviewCount
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    return {
      star,
      count,
      percentage: reviewCount ? Math.round((count / reviewCount) * 100) : 0,
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rating) {
      setStatus({ type: 'error', text: 'SELECT A RATING BEFORE SUBMITTING.' });
      return;
    }

    if (name.trim().length < 2) {
      setStatus({ type: 'error', text: 'ADD YOUR NAME TO CONTINUE.' });
      return;
    }

    if (title.trim().length < 3) {
      setStatus({ type: 'error', text: 'ADD A SHORT REVIEW TITLE.' });
      return;
    }

    if (body.trim().length < 10) {
      setStatus({ type: 'error', text: 'TELL US A LITTLE MORE ABOUT THE PIECE.' });
      return;
    }

    onSubmit({
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      rating,
      name: name.trim(),
      title: title.trim(),
      body: body.trim(),
      date: new Date().toISOString(),
      verified: false,
    });

    setRating(0);
    setHoverRating(0);
    setName('');
    setTitle('');
    setBody('');
    setStatus({ type: 'success', text: 'REVIEW ADDED. THANKS FOR SHARING YOUR SIGNAL.' });
  };

  const inputClass =
    'mt-2 min-h-12 w-full border border-white/[0.14] bg-[#080808] px-4 text-[14px] text-[#F4F0E8] outline-none transition-colors placeholder:text-white/28 focus:border-crimson focus:ring-1 focus:ring-crimson';

  return (
    <section id="reviews" className="scroll-mt-24 border-b border-white/[0.1] bg-[#070707] py-12 sm:py-14 lg:py-16">
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.11] pb-6 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-crimson" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/58">
                REVIEWS / COMMUNITY SIGNAL
              </p>
            </div>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,4.3rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em]">
              Worn. Tested. <span className="text-crimson">Shared.</span>
            </h2>
          </div>

          <p className="max-w-md text-[14px] leading-6 text-white/52 sm:text-right sm:text-[15px]">
            Fit, fabric, print and everyday wear — straight from people who have spent time in the piece.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(300px,.72fr)_minmax(0,1.28fr)] lg:gap-6 xl:gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative overflow-hidden border border-white/[0.12] bg-[#0A0A0A] p-5 sm:p-6"
            style={{ clipPath: INFO_SLASH_CLIP }}
          >
            <span className="pointer-events-none absolute left-0 top-0 h-[4px] w-[30%] bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/48">
              RATING BREAKDOWN
            </p>

            <div className="mt-6 flex items-end gap-4 border-b border-white/[0.1] pb-6">
              <span className="font-display text-[64px] font-semibold leading-[0.75] tracking-[-0.06em] text-[#F4F0E8] sm:text-[72px]">
                {reviewCount ? average.toFixed(1) : '—'}
              </span>
              <div className="pb-0.5">
                <Stars value={average} size="text-[17px]" muted={!reviewCount} />
                <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/48">
                  {reviewCount ? `${reviewCount} ${reviewCount === 1 ? 'REVIEW' : 'REVIEWS'}` : 'NO REVIEWS YET'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3.5">
              {breakdown.map((item) => (
                <div key={item.star} className="grid grid-cols-[34px_minmax(0,1fr)_28px] items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-white/70">{item.star}★</span>
                  <div className="h-[5px] overflow-hidden bg-white/[0.08]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: item.percentage / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: EASE }}
                      className="h-full origin-left bg-crimson"
                    />
                  </div>
                  <span className="text-right font-mono text-[9px] font-semibold text-white/42">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 border-t border-white/[0.1] pt-5">
              <p className="font-display text-xl font-semibold uppercase tracking-[-0.035em]">
                COMMUNITY, NOT COPY.
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/48">
                Reviews are saved on this device for this frontend build and stay attached to this product when you return.
              </p>
            </div>
          </motion.aside>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.04, ease: EASE }}
            className="relative border border-white/[0.12] bg-[#0A0A0A] p-5 sm:p-6 lg:p-7"
          >
            <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-crimson">
                  SHARE YOUR EXPERIENCE
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.04em] sm:text-3xl">
                  ADD YOUR REVIEW.
                </h3>
              </div>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/38">
                FIT / QUALITY / PRINT / FEEL
              </span>
            </div>

            <fieldset className="mt-6">
              <legend className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/62">
                YOUR RATING
              </legend>
              <div className="mt-2 flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setStatus({ type: '', text: '' });
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
                      aria-pressed={rating === star}
                      className={`flex h-11 w-11 items-center justify-center border text-[23px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-crimson ${
                        active
                          ? 'border-crimson bg-[#16090B] text-crimson'
                          : 'border-white/[0.12] bg-[#080808] text-white/22 hover:border-white/35 hover:text-white/60'
                      }`}
                    >
                      <span aria-hidden="true">★</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/62">
                NAME
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass}
                />
              </label>

              <label className="block font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/62">
                REVIEW TITLE
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="How did the piece feel?"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="mt-5 block font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/62">
              YOUR REVIEW
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={5}
                placeholder="Tell others about the fit, fabric, print quality and how it wears."
                className={`${inputClass} resize-y py-3.5 leading-6`}
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.1] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p
                aria-live="polite"
                className={`min-h-5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
                  status.type === 'error'
                    ? 'text-crimson'
                    : status.type === 'success'
                      ? 'text-[#F4F0E8]'
                      : 'text-white/34'
                }`}
              >
                {status.text || 'YOUR REVIEW APPEARS BELOW AFTER SUBMISSION.'}
              </p>

              <button
                type="submit"
                className="group flex min-h-[50px] min-w-[190px] items-center justify-between bg-crimson px-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white outline-none transition-colors hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:ring-2 focus-visible:ring-[#F4F0E8]"
                style={{ clipPath: CTA_SLASH_CLIP }}
              >
                SUBMIT REVIEW
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </motion.form>
        </div>

        <div className="mt-10 border-t border-white/[0.11] pt-7 sm:mt-12 sm:pt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/58">
              COMMUNITY REVIEWS
            </p>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-crimson">
              {String(reviewCount).padStart(2, '0')} SIGNALS
            </span>
          </div>

          {reviewCount ? (
            <div className="border-t border-white/[0.1]">
              <AnimatePresence initial={false}>
                {reviews.map((review, index) => (
                  <motion.article
                    layout
                    key={review.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.025, 0.12), ease: EASE }}
                    className="grid gap-4 border-b border-white/[0.1] py-6 md:grid-cols-[210px_minmax(0,1fr)_150px] md:gap-8 md:py-7"
                  >
                    <div>
                      <Stars value={review.rating} />
                      <p className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/52">
                        {review.rating}.0 / 5.0
                      </p>
                    </div>

                    <div>
                      <h4 className="font-display text-xl font-semibold uppercase leading-tight tracking-[-0.035em] text-[#F4F0E8] sm:text-2xl">
                        {review.title}
                      </h4>
                      <p className="mt-2 max-w-3xl text-[14px] leading-7 text-white/64 sm:text-[15px]">
                        {review.body}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#F4F0E8]">
                        {review.name}
                      </p>
                      <p className="mt-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-white/38">
                        {formatReviewDate(review.date)}
                      </p>
                      {review.verified && (
                        <span className="mt-3 inline-flex border border-crimson/50 px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-crimson">
                          VERIFIED PURCHASE
                        </span>
                      )}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative overflow-hidden border border-white/[0.11] bg-[#090909] px-5 py-10 text-center sm:px-8 sm:py-12">
              <span className="absolute left-0 top-0 h-[4px] w-[18%] bg-crimson" />
              <p className="font-display text-2xl font-semibold uppercase tracking-[-0.04em] sm:text-3xl">
                BE THE FIRST SIGNAL.
              </p>
              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-6 text-white/48 sm:text-[15px]">
                No community reviews have been added for this piece yet. Wear it, live in it, then tell the next person what stood out.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const productIdentity = getProductIdentity(product);

  const [image, setImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product?.colors?.[0] ?? '');
  const [qty, setQty] = useState(1);
  const [detailTab, setDetailTab] = useState('details');
  const [localReviews, setLocalReviews] = useState([]);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useShop();


  const seededReviews = useMemo(() => {
    if (!Array.isArray(product?.reviews)) return [];
    return product.reviews.map(normalizeReview).filter(Boolean);
  }, [productIdentity, product?.reviews]);

  const reviews = useMemo(
    () => [...localReviews, ...seededReviews],
    [localReviews, seededReviews],
  );

  const reviewAverage = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const reviewStorageKey = productIdentity ? `zenji-reviews:${productIdentity}` : '';

  const related = useMemo(() => {
    if (!product) return [];

    const sameCategory = products.filter(
      (item) => getProductIdentity(item) !== productIdentity && item.category === product.category,
    );
    const otherCategories = products.filter(
      (item) => getProductIdentity(item) !== productIdentity && item.category !== product.category,
    );

    return [...sameCategory, ...otherCategories].slice(0, 4);
  }, [product, productIdentity]);

  useEffect(() => {
    if (!reviewStorageKey || typeof window === 'undefined') {
      setLocalReviews([]);
      return;
    }

    try {
      const stored = window.localStorage.getItem(reviewStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      const normalized = Array.isArray(parsed) ? parsed.map(normalizeReview).filter(Boolean) : [];
      setLocalReviews(normalized);
    } catch {
      setLocalReviews([]);
    }
  }, [reviewStorageKey]);

  useEffect(() => {
    if (productIdentity) addRecentlyViewed(productIdentity);
    setImage(0);
    setSize('');
    setColor(product?.colors?.[0] ?? '');
    setQty(1);
    setDetailTab('details');
  }, [productIdentity]);

  if (!product) {
    return (
      <section className="bg-[#050505] py-24 text-[#F4F0E8] sm:py-28">
        <div className="site-container">
          <div
            className="mx-auto max-w-xl border border-white/[0.12] bg-[#090909] p-7 sm:p-9"
            style={{ clipPath: EMPTY_STATE_CLIP }}
          >
            <span className="block h-[3px] w-10 bg-crimson" />
            <p className="mt-4 font-mono text-[7px] uppercase tracking-[0.24em] text-white/40">
              ZENJI / PRODUCT SIGNAL LOST
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold uppercase tracking-[-0.05em]">
              Product not found.
            </h1>
            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-12 items-center bg-crimson px-5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white"
              style={{ clipPath: CTA_SLASH_CLIP }}
            >
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : [];
  const colorHex = Array.isArray(product.colorHex) ? product.colorHex : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [];
  const materials = Array.isArray(product.materials) ? product.materials.filter(Boolean) : [];
  const stock = Math.max(0, Number(product.stock ?? 0));
  const wished = Boolean(productIdentity) && isWishlisted(productIdentity);
  const canAdd = stock > 0 && (sizes.length === 0 || Boolean(size));
  const activeColor = color || colors[0] || '';

  const add = () => {
    if (!canAdd || !productIdentity) return;

    addToCart({
      id: productIdentity,
      name: product.name,
      price: product.price,
      size,
      color: activeColor,
      quantity: Math.min(qty, stock),
      image: images[0] ?? '',
      slug: product.slug,
    });
  };

  const submitReview = (review) => {
    const normalized = normalizeReview(review);
    if (!normalized) return;

    setLocalReviews((current) => {
      const next = [normalized, ...current];

      if (reviewStorageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(reviewStorageKey, JSON.stringify(next));
        } catch {
          // Keep the review in memory if storage is unavailable.
        }
      }

      return next;
    });
  };

  const stockLabel =
    stock <= 0 ? 'SOLD OUT' : stock <= 5 ? `LOW STOCK / ${stock} LEFT` : 'IN STOCK';

  return (
    <div className="bg-[#050505] text-[#F4F0E8]">
      <section className="border-b border-white/[0.1]">
        <div className="site-container pb-10 pt-5 sm:pt-6 lg:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-white/55 sm:mb-5 sm:text-[9px]"
          >
            <Link to="/shop" className="transition-colors hover:text-crimson focus-visible:outline-none focus-visible:text-crimson">
              SHOP
            </Link>
            <span aria-hidden="true">/</span>
            <span>{product.collection}</span>
            <span aria-hidden="true">/</span>
            <span className="text-white/65">{product.name}</span>
          </nav>

          <div className="grid gap-6 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.08fr)_minmax(350px,.92fr)] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(390px,.88fr)] xl:gap-10">
            <div className="min-w-0 lg:h-full">
              <Gallery product={product} images={images} image={image} setImage={setImage} />
            </div>

            <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
              <div
                className="relative overflow-hidden border border-white/[0.11] bg-[#080808] p-5 sm:p-6 lg:flex lg:flex-col"
                style={{ clipPath: INFO_SLASH_CLIP }}
              >
                <span className="pointer-events-none absolute right-0 top-0 h-[4px] w-[22%] bg-[#F4F0E8]" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-[4px] w-[18%] bg-crimson" />
                <span className="pointer-events-none absolute left-0 top-[41%] h-[21%] w-[14px] bg-[#050505]" />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="h-[3px] w-6 shrink-0 bg-crimson" />
                      <p className="truncate font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/70 sm:text-[9px]">
                        {product.collection} / {productIdentity}
                      </p>
                    </div>
                    <div className="mt-2.5 inline-flex min-h-8 items-center gap-2 border border-white/[0.12] bg-[#0B0B0B] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#F4F0E8]">
                      <span className={`h-2 w-2 ${stock > 0 ? 'bg-crimson' : 'bg-white/35'}`} />
                      {stockLabel}
                    </div>
                  </div>

                  {product.japanese && (
                    <span className="max-w-[108px] shrink-0 text-right font-jp text-xl leading-none text-crimson sm:text-2xl">
                      {product.japanese}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 max-w-[680px] font-display text-[clamp(2.55rem,8vw,4.6rem)] font-semibold uppercase leading-[0.84] tracking-[-0.06em] text-[#F4F0E8] lg:text-[clamp(2.8rem,4.4vw,4.5rem)]">
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.11] py-3.5">
                  <div className="flex items-end gap-2.5">
                    <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] sm:text-[34px]">
                      {currency(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="pb-0.5 text-[14px] text-white/48 line-through">
                        {currency(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {product.compareAtPrice && (
                    <span className="bg-crimson px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white">
                      SALE
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="mt-4 line-clamp-3 max-w-xl text-[14px] leading-6 text-white/68 sm:text-[15px] sm:leading-7">
                    {product.description}
                  </p>
                )}


                <a
                  href="#reviews"
                  className="group mt-4 flex min-h-11 items-center justify-between gap-4 border-y border-white/[0.1] py-3 outline-none transition-colors hover:border-crimson/50 focus-visible:ring-2 focus-visible:ring-crimson"
                >
                  <div className="flex items-center gap-3">
                    <Stars value={reviewAverage} size="text-[13px]" muted={!reviews.length} />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/58 group-hover:text-[#F4F0E8]">
                      {reviews.length
                        ? `${reviewAverage.toFixed(1)} / ${reviews.length} ${reviews.length === 1 ? 'REVIEW' : 'REVIEWS'}`
                        : 'BE THE FIRST TO REVIEW'}
                    </span>
                  </div>
                  <span aria-hidden="true" className="font-mono text-[11px] text-crimson transition-transform group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>

                <div className="mt-5 border-t border-white/[0.11] pt-5">
                  <div className="grid gap-5">
                    <ColorSelector
                      colors={colors}
                      colorHex={colorHex}
                      color={activeColor}
                      setColor={setColor}
                    />

                    <SizeSelector sizes={sizes} size={size} setSize={setSize} />
                  </div>
                </div>

                <div className="mt-5 border-t border-white/[0.11] pt-5 lg:mt-auto">
                  <div className="grid grid-cols-[132px_minmax(0,1fr)_54px] gap-2.5">
                    <QuantityControl qty={qty} setQty={setQty} stock={stock} />

                    <button
                      type="button"
                      onClick={add}
                      disabled={!canAdd}
                      className="group relative flex min-h-[54px] w-full items-center justify-between overflow-hidden bg-crimson px-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-white outline-none transition-colors duration-300 hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:ring-2 focus-visible:ring-[#F4F0E8] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 sm:text-[11px]"
                      style={{ clipPath: CTA_SLASH_CLIP }}
                    >
                      <span>{stock > 0 ? 'ADD TO BAG' : 'SOLD OUT'}</span>
                      <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => productIdentity && toggleWishlist({ ...product, id: productIdentity })}
                      disabled={!productIdentity}
                      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                      aria-pressed={wished}
                      className={`flex min-h-[54px] items-center justify-center border text-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-crimson disabled:opacity-30 ${
                        wished
                          ? 'border-crimson bg-crimson text-white'
                          : 'border-white/[0.14] bg-[#090909] text-[#F4F0E8] hover:border-white/45 hover:bg-white hover:text-[#050505]'
                      }`}
                    >
                      <span aria-hidden="true">♡</span>
                    </button>
                  </div>

                  <div className="mt-3 flex min-h-7 items-center justify-between gap-3 font-mono text-[8px] font-semibold uppercase tracking-[0.13em]">
                    <span aria-live="polite" className={canAdd ? 'text-white/65' : 'text-crimson'}>
                      {stock <= 0
                        ? 'CURRENTLY UNAVAILABLE'
                        : sizes.length > 0 && !size
                          ? 'SELECT A SIZE TO CONTINUE'
                          : `${activeColor || 'DEFAULT'}${size ? ` / ${size}` : ''} / READY`}
                    </span>
                    <span className="shrink-0 text-white/50">QTY {qty}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* SECONDARY DETAILS — intentionally below purchase zone */}
          <div className="mt-8 lg:mt-10">
            <DetailsTabs
              active={detailTab}
              setActive={setDetailTab}
              product={product}
              materials={materials}
            />
          </div>
        </div>
      </section>


      <ReviewsSection reviews={reviews} onSubmit={submitReview} />

      <section className="border-b border-white/[0.1] py-11 sm:py-12 lg:py-14">
        <div className="site-container">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-7 bg-crimson" />
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/58">
                  CONTINUE / SIGNAL
                </p>
              </div>
              <h2 className="mt-2.5 font-display text-[clamp(2.35rem,6.5vw,4.4rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em]">
                Related <span className="text-crimson">pieces.</span>
              </h2>
            </div>

            <Link
              to="/shop"
              className="inline-flex min-h-10 items-center justify-between gap-5 border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#F4F0E8] transition-colors hover:border-crimson hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              style={{ clipPath: THUMB_SINGLE_CUT }}
            >
              VIEW ALL PIECES
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}
