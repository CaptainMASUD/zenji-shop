import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { currency } from '../../utils/currency.js';

const PRODUCT_CLIP =
  'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))';

const WISHLIST_CLIP =
  'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

const ACTION_CLIP =
  'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))';

const CTA_CLIP =
  'polygon(0 0, calc(100% - 14px) 0, 100% 14px, calc(100% - 9px) 100%, 0 100%)';

export default function ProductCard({ product, priority = false }) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Keep hooks unconditional, then normalize product data before reading fields.
  const productId = product?.id ?? product?._id ?? product?.slug ?? null;
  const wished = productId ? Boolean(isWishlisted(productId)) : false;

  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];
  const primaryImage = images[0] ?? null;
  const secondaryImage = images[1] ?? null;

  const colors = Array.isArray(product.colors)
    ? product.colors.filter(Boolean).join(' / ')
    : typeof product.colors === 'string'
      ? product.colors
      : '';

  const numericStock = Number(product.stock);
  const hasStockValue = Number.isFinite(numericStock);
  const soldOut = hasStockValue && numericStock <= 0;
  const lowStock = hasStockValue && numericStock > 0 && numericStock <= 5;
  const hasSale =
    product.compareAtPrice !== null && product.compareAtPrice !== undefined;
  const hasPrice = product.price !== null && product.price !== undefined;

  const productName = product.name || 'UNTITLED DROP';
  const collectionName = product.collection || 'ZENJI';
  const productPath = product.slug
    ? `/product/${product.slug}`
    : productId
      ? `/product/${productId}`
      : '#';
  const hasDestination = productPath !== '#';

  const wishlistProduct = product.id
    ? product
    : productId
      ? { ...product, id: productId }
      : product;

  const stockLabel = soldOut
    ? 'SOLD OUT'
    : lowStock
      ? `LOW STOCK / ${numericStock}`
      : hasStockValue
        ? `IN STOCK / ${numericStock}`
        : 'AVAILABLE';

  const stopEmptyLink = (event) => {
    if (!hasDestination) event.preventDefault();
  };

  return (
    <motion.article
      layout
      className="group relative min-w-0"
      initial={false}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* PRODUCT VISUAL */}
      <div
        className="relative overflow-hidden border border-white/[0.10] bg-[#0A0A0A] transition-colors duration-500 group-hover:border-white/[0.24]"
        style={{ clipPath: PRODUCT_CLIP }}
      >
        <Link
          to={productPath}
          onClick={stopEmptyLink}
          aria-label={`View ${productName}`}
          aria-disabled={!hasDestination}
          className="relative block aspect-[5/6] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson"
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              alt={productName}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="h-[3px] w-10 bg-crimson" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  IMAGE PENDING
                </span>
              </div>
            </div>
          )}

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full translate-x-[4%] scale-[1.025] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[#050505]/38"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-full w-[4px] origin-bottom scale-y-[0.28] bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-[4px] w-[28%] bg-[#F4F0E8] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[42%]"
          />
        </Link>

        {/* WISHLIST */}
        <button
          type="button"
          aria-label={
            productId
              ? wished
                ? 'Remove from wishlist'
                : 'Add to wishlist'
              : 'Wishlist unavailable'
          }
          aria-pressed={productId ? wished : undefined}
          disabled={!productId}
          onClick={() => {
            if (!productId) return;
            toggleWishlist(wishlistProduct);
          }}
          className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center border text-[18px] leading-none transition-[background-color,border-color,color,transform,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:right-3.5 sm:top-3.5 ${
            !productId
              ? 'cursor-not-allowed border-white/[0.10] bg-[#090909] text-white/20 opacity-60'
              : wished
                ? 'border-crimson bg-crimson text-white hover:scale-[1.04]'
                : 'border-white/[0.22] bg-[#090909] text-[#F4F0E8] hover:scale-[1.04] hover:border-[#F4F0E8] hover:bg-[#F4F0E8] hover:text-[#050505]'
          }`}
          style={{ clipPath: WISHLIST_CLIP }}
        >
          <span
            aria-hidden="true"
            className="-translate-y-px transition-transform duration-300 group-hover:scale-105"
          >
            {wished ? '♥' : '♡'}
          </span>
        </button>

        {/* STOCK / SALE */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1.5 sm:bottom-3.5 sm:left-3.5">
          <span
            className={`border px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.13em] sm:text-[9px] ${
              soldOut
                ? 'border-white/[0.20] bg-[#080808] text-[#C9C9C9]'
                : lowStock
                  ? 'border-crimson bg-[#080808] text-[#F4F0E8]'
                  : 'border-white/[0.16] bg-[#080808] text-[#F4F0E8]'
            }`}
            style={{ clipPath: ACTION_CLIP }}
          >
            {stockLabel}
          </span>

          {hasSale && (
            <span
              className="border border-crimson bg-crimson px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-white sm:text-[9px]"
              style={{ clipPath: ACTION_CLIP }}
            >
              SALE
            </span>
          )}
        </div>
      </div>

      {/* EDITORIAL COMMERCE INFO */}
      <div className="flex min-h-[148px] flex-col pt-3.5 sm:min-h-[158px] sm:pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-[3px] w-6 shrink-0 bg-crimson transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-8" />
          <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#A8A8A8] sm:text-[9px]">
            {collectionName}
          </p>
        </div>

        <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="min-w-0">
            <Link
              to={productPath}
              onClick={stopEmptyLink}
              aria-disabled={!hasDestination}
              className="block min-h-[44px] line-clamp-2 font-display text-[1.25rem] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-[#F4F0E8] transition-colors duration-300 hover:text-crimson sm:text-[1.45rem]"
            >
              {productName}
            </Link>
          </div>

          {(hasPrice || hasSale) && (
            <div className="shrink-0 pt-px text-right">
              {hasPrice && (
                <p className="text-[17px] font-semibold leading-none tracking-[-0.03em] text-[#F4F0E8] sm:text-[19px]">
                  {currency(product.price)}
                </p>
              )}
              {hasSale && (
                <p className="mt-1.5 font-mono text-[10px] leading-none text-[#8B8B8B] line-through sm:text-[11px]">
                  {currency(product.compareAtPrice)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 flex min-h-4 items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.11em] sm:text-[9px]">
          <span className="text-white/40">COLOR /</span>
          <span className="truncate text-[#BEBEBE]">{colors || 'STANDARD'}</span>
        </div>

        <div className="mt-auto pt-3">
          <Link
            to={productPath}
            onClick={stopEmptyLink}
            aria-label={`View ${productName}`}
            aria-disabled={!hasDestination}
            className={`group/action flex min-h-[46px] w-full items-center justify-between border px-4 font-mono text-[9px] font-bold uppercase tracking-[0.13em] outline-none transition-[background-color,border-color,color] duration-300 sm:px-4.5 sm:text-[10px] ${
              hasDestination
                ? 'border-[#F4F0E8] bg-[#F4F0E8] text-[#050505] hover:border-crimson hover:bg-crimson hover:text-white focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]'
                : 'cursor-default border-white/[0.10] bg-[#0A0A0A] text-white/25'
            }`}
            style={{ clipPath: CTA_CLIP }}
          >
            <span>VIEW PRODUCT</span>
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center text-[15px] transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-1"
            >
              ↗
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
