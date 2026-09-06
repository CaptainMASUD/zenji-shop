import React, { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Cancel01Icon,
  ArrowUpRight01Icon,
} from '@hugeicons/core-free-icons';

import { products } from '../../data/products.js';
import { useShop } from '../../context/ShopContext.jsx';
import { filterProducts } from '../../utils/productFilters.js';
import { currency } from '../../utils/currency.js';

const QUICK_TAGS = [
  'Oversized Tee',
  'One Piece',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'Naruto',
  'Sukuna',
  'Rengoku',
  'Zoro',
];

const EASE = [0.16, 1, 0.3, 1];

const SEARCH_PANEL_CLIP =
  'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))';

const RESULT_CLIP =
  'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))';

const BUTTON_CLIP =
  'polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px))';

function ProductImage({ product, className = '' }) {
  const image = Array.isArray(product?.images)
    ? product.images.find(Boolean)
    : null;

  if (!image) {
    return (
      <div
        className={`flex items-center justify-center bg-[#0D0D0D] ${className}`}
      >
        <div className="text-center">
          <span className="mx-auto block h-[3px] w-7 bg-crimson" />
          <span className="mt-2 block font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-white/35">
            IMAGE PENDING
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product.name}
      draggable={false}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close search"
      className="
        group
        relative
        flex
        h-11
        items-center
        gap-2.5
        overflow-hidden
        border
        border-white/[0.16]
        bg-[#0A0A0A]
        px-3.5
        font-mono
        text-[8px]
        font-bold
        uppercase
        tracking-[0.16em]
        text-[#F4F0E8]
        outline-none
        transition-colors
        duration-300
        hover:border-crimson
        focus-visible:ring-2
        focus-visible:ring-crimson
        sm:px-4
        sm:text-[9px]
      "
      style={{ clipPath: BUTTON_CLIP }}
    >
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -translate-x-[102%]
          bg-crimson
          transition-transform
          duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-x-0
          group-focus-visible:translate-x-0
        "
      />

      <span className="relative z-10 hidden sm:inline">CLOSE</span>

      <HugeiconsIcon
        icon={Cancel01Icon}
        size={16}
        strokeWidth={1.8}
        className="
          relative
          z-10
          transition-transform
          duration-300
          group-hover:rotate-90
          group-focus-visible:rotate-90
        "
      />
    </button>
  );
}

function QuickTag({ tag, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        relative
        min-h-9
        overflow-hidden
        border
        px-3
        font-mono
        text-[7px]
        font-bold
        uppercase
        tracking-[0.14em]
        outline-none
        transition-colors
        duration-300
        focus-visible:ring-2
        focus-visible:ring-crimson
        sm:px-3.5
        sm:text-[8px]
        ${
          active
            ? 'border-crimson bg-crimson text-white'
            : 'border-white/[0.14] bg-[#0A0A0A] text-white/55 hover:border-white/40 hover:text-white'
        }
      `}
      style={{ clipPath: BUTTON_CLIP }}
    >
      {tag}
    </button>
  );
}

function SearchResultRow({ product, onSelect, index, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.36,
        delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.18),
        ease: EASE,
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        onClick={onSelect}
        className="
          group
          relative
          grid
          min-h-[106px]
          grid-cols-[78px_minmax(0,1fr)_auto]
          items-center
          gap-3
          overflow-hidden
          border
          border-white/[0.10]
          bg-[#090909]
          p-2.5
          outline-none
          transition-[border-color,background-color,transform]
          duration-300
          hover:-translate-y-px
          hover:border-white/[0.24]
          hover:bg-[#0D0D0D]
          focus-visible:ring-2
          focus-visible:ring-crimson
          sm:min-h-[122px]
          sm:grid-cols-[92px_minmax(0,1fr)_auto]
          sm:gap-5
          sm:p-3
        "
        style={{ clipPath: RESULT_CLIP }}
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            h-full
            w-[3px]
            origin-bottom
            scale-y-[0.35]
            bg-crimson
            transition-transform
            duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover:scale-y-100
          "
        />

        <div
          className="
            relative
            aspect-[4/5]
            overflow-hidden
            border
            border-white/[0.08]
            bg-[#0D0D0D]
          "
          style={{ clipPath: RESULT_CLIP }}
        >
          <ProductImage
            product={product}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:scale-[1.045]
            "
          />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-[6px] font-bold uppercase tracking-[0.17em] text-crimson sm:text-[7px]">
              {product.collection || 'ZENJI'}
            </span>

            <span className="h-3 w-px shrink-0 bg-white/[0.12]" />

            <span className="truncate font-mono text-[6px] uppercase tracking-[0.14em] text-white/35 sm:text-[7px]">
              {product.category || 'PIECE'}
            </span>
          </div>

          <h4
            className="
              mt-2
              overflow-hidden
              font-display
              text-[1.05rem]
              font-semibold
              uppercase
              leading-[0.94]
              tracking-[-0.035em]
              text-[#F4F0E8]
              transition-colors
              duration-300
              group-hover:text-crimson
              sm:text-[1.35rem]
            "
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {product.name}
          </h4>

          <p className="mt-2 hidden truncate font-mono text-[6px] font-semibold uppercase tracking-[0.14em] text-white/32 sm:block">
            {product.sizes?.length
              ? `SIZES / ${product.sizes.join(' · ')}`
              : 'READY / ARCHIVE'}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="text-right">
            <p className="text-[13px] font-semibold leading-none tracking-[-0.03em] text-[#F4F0E8] sm:text-[16px]">
              {currency(product.price)}
            </p>

            {product.compareAtPrice && (
              <p className="mt-1.5 font-mono text-[8px] leading-none text-white/30 line-through sm:text-[9px]">
                {currency(product.compareAtPrice)}
              </p>
            )}
          </div>

          <span
            className="
              hidden
              h-10
              w-10
              items-center
              justify-center
              border
              border-white/[0.14]
              text-white/50
              transition-[border-color,background-color,color,transform]
              duration-300
              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
              group-hover:border-crimson
              group-hover:bg-crimson
              group-hover:text-white
              sm:flex
            "
            style={{ clipPath: BUTTON_CLIP }}
          >
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={15}
              strokeWidth={1.8}
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedCard({ product, onSelect, index, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.44,
        delay: reduceMotion ? 0 : index * 0.055,
        ease: EASE,
      }}
      className="min-w-0"
    >
      <Link
        to={`/product/${product.slug}`}
        onClick={onSelect}
        className="
          group
          relative
          block
          overflow-hidden
          border
          border-white/[0.10]
          bg-[#090909]
          p-2
          outline-none
          transition-[border-color,transform]
          duration-300
          hover:-translate-y-1
          hover:border-white/[0.26]
          focus-visible:ring-2
          focus-visible:ring-crimson
          sm:p-2.5
        "
        style={{ clipPath: RESULT_CLIP }}
      >
        <div
          className="
            relative
            aspect-[4/5]
            overflow-hidden
            bg-[#0D0D0D]
          "
          style={{ clipPath: RESULT_CLIP }}
        >
          <ProductImage
            product={product}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:scale-[1.045]
            "
          />

          <div className="pointer-events-none absolute inset-0 bg-black/10" />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              h-[4px]
              w-[30%]
              bg-crimson
              transition-[width]
              duration-500
              group-hover:w-[48%]
            "
          />

          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
            <span
              className="
                max-w-[65%]
                truncate
                bg-[#050505]
                px-2
                py-1.5
                font-mono
                text-[6px]
                font-bold
                uppercase
                tracking-[0.13em]
                text-white/70
                sm:text-[7px]
              "
            >
              {product.collection || 'ZENJI'}
            </span>

            <span
              className="
                bg-[#F4F0E8]
                px-2
                py-1.5
                text-[10px]
                font-semibold
                leading-none
                text-[#050505]
                sm:text-[11px]
              "
            >
              {currency(product.price)}
            </span>
          </div>
        </div>

        <div className="px-0.5 pb-1 pt-2.5">
          <h5
            className="
              overflow-hidden
              font-display
              text-[0.95rem]
              font-semibold
              uppercase
              leading-[0.95]
              tracking-[-0.035em]
              text-[#F4F0E8]
              transition-colors
              duration-300
              group-hover:text-crimson
              sm:text-[1.05rem]
            "
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {product.name}
          </h5>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-2">
            <span className="truncate font-mono text-[5px] font-semibold uppercase tracking-[0.14em] text-white/30 sm:text-[6px]">
              {product.category || 'ARCHIVE PIECE'}
            </span>

            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={13}
              strokeWidth={1.7}
              className="shrink-0 text-crimson"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SearchOverlay() {
  const {
    searchOpen,
    setSearchOpen,
    search,
    setSearch,
  } = useShop();

  const inputRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const normalizedSearch = search.trim();

  const results = useMemo(
    () =>
      normalizedSearch
        ? filterProducts(products, {
            search: normalizedSearch,
          }).slice(0, 8)
        : [],
    [normalizedSearch],
  );

  const featuredProducts = useMemo(
    () =>
      products
        .filter((product) => product.featured)
        .slice(0, 4),
    [],
  );

  const closeSearch = () => {
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!searchOpen) {
      document.body.classList.remove('overflow-hidden');
      return undefined;
    }

    document.body.classList.add('overflow-hidden');

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [searchOpen, setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search ZENJI products"
          initial={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
          }}
          className="
            fixed
            inset-0
            z-[90]
            overflow-y-auto
            bg-[#050505]
            text-[#F4F0E8]
          "
        >
          {/* =====================================================
              CINEMATIC FRAME DETAILS
          ====================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              fixed
              inset-0
              opacity-[0.018]
            "
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,.5) 0px, rgba(255,255,255,.5) 1px, transparent 1px, transparent 5px)',
            }}
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              fixed
              inset-x-0
              top-0
              z-[1]
              h-[3px]
              bg-crimson
            "
          />

          {/* =====================================================
              TOP CONTROL BAR
          ====================================================== */}

          <header
            className="
              sticky
              top-0
              z-40
              border-b
              border-white/[0.08]
              bg-[#050505]/95
              backdrop-blur-xl
            "
          >
            <div
              className="
                site-container
                flex
                h-[68px]
                items-center
                justify-between
                gap-4
                sm:h-[76px]
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2 w-2 shrink-0 bg-crimson" />

                <div className="min-w-0">
                  <p className="truncate font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#F4F0E8] sm:text-[8px]">
                    ZENJI / ARCHIVE SEARCH
                  </p>

                  <p className="mt-1 hidden font-mono text-[6px] uppercase tracking-[0.16em] text-white/28 sm:block">
                    SEARCH / DISCOVER / ENTER
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className="
                    hidden
                    border
                    border-white/[0.10]
                    bg-[#090909]
                    px-3
                    py-2
                    font-mono
                    text-[6px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-white/35
                    md:block
                  "
                  style={{ clipPath: BUTTON_CLIP }}
                >
                  ESC / CLOSE
                </span>

                <CloseButton onClick={closeSearch} />
              </div>
            </div>
          </header>

          {/* =====================================================
              MAIN SEARCH EXPERIENCE
          ====================================================== */}

          <main
            className="
              site-container
              relative
              z-10
              pb-12
              pt-6
              sm:pb-16
              sm:pt-8
              lg:pb-20
              lg:pt-10
            "
          >
            <div className="mx-auto max-w-[1220px]">
              {/* =================================================
                  SEARCH COMMAND PANEL
              ================================================== */}

              <motion.section
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 16,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.58,
                  ease: EASE,
                }}
                className="
                  relative
                  overflow-hidden
                  border
                  border-white/[0.10]
                  bg-[#080808]
                  p-4
                  sm:p-6
                  lg:p-8
                "
                style={{
                  clipPath: SEARCH_PANEL_CLIP,
                }}
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    h-[4px]
                    w-[28%]
                    bg-crimson
                  "
                />

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    right-0
                    h-[4px]
                    w-[18%]
                    bg-[#F4F0E8]
                  "
                />

                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-white/34 sm:text-[7px]">
                    TYPE A SIGNAL
                  </p>

                  <p className="font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-crimson sm:text-[7px]">
                    {normalizedSearch
                      ? `${results.length} / 08 FOUND`
                      : 'ARCHIVE READY'}
                  </p>
                </div>

                {/* SEARCH INPUT */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-[auto_minmax(0,1fr)_auto]
                    items-center
                    gap-3
                    border-b
                    border-white/[0.18]
                    pb-3
                    transition-colors
                    duration-300
                    focus-within:border-crimson
                    sm:mt-6
                    sm:gap-5
                    sm:pb-5
                  "
                >
                  <span className="text-crimson">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={26}
                      strokeWidth={1.7}
                    />
                  </span>

                  <input
                    ref={inputRef}
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="SEARCH DROPS, TEES, HOODIES..."
                    autoComplete="off"
                    spellCheck="false"
                    className="
                      min-w-0
                      bg-transparent
                      font-display
                      text-[clamp(1.7rem,5vw,4.6rem)]
                      font-semibold
                      uppercase
                      leading-[0.88]
                      tracking-[-0.045em]
                      text-[#F4F0E8]
                      outline-none
                      placeholder:text-white/18
                    "
                  />

                  <AnimatePresence initial={false}>
                    {search && (
                      <motion.button
                        type="button"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.9,
                              }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                        }}
                        onClick={() => {
                          setSearch('');
                          inputRef.current?.focus();
                        }}
                        aria-label="Clear search input"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          border
                          border-white/[0.14]
                          bg-[#0A0A0A]
                          text-white/45
                          outline-none
                          transition-colors
                          hover:border-crimson
                          hover:bg-crimson
                          hover:text-white
                          focus-visible:ring-2
                          focus-visible:ring-crimson
                          sm:h-10
                          sm:w-10
                        "
                        style={{
                          clipPath: BUTTON_CLIP,
                        }}
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={15}
                          strokeWidth={1.8}
                        />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* QUICK TAGS */}

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                    sm:mt-5
                    sm:gap-2
                  "
                >
                  <span className="mr-1 font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-white/28 sm:text-[7px]">
                    QUICK /
                  </span>

                  {QUICK_TAGS.map((tag) => {
                    const active =
                      normalizedSearch.toLowerCase() ===
                      tag.toLowerCase();

                    return (
                      <QuickTag
                        key={tag}
                        tag={tag}
                        active={active}
                        onClick={() => {
                          setSearch(tag);
                          inputRef.current?.focus();
                        }}
                      />
                    );
                  })}
                </div>
              </motion.section>

              {/* =================================================
                  RESULTS HEADER
              ================================================== */}

              <section className="mt-8 sm:mt-10">
                <div
                  className="
                    mb-4
                    flex
                    items-end
                    justify-between
                    gap-4
                    border-b
                    border-white/[0.09]
                    pb-3
                    sm:mb-5
                  "
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="h-[3px] w-7 bg-crimson sm:w-9" />

                      <p className="font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-white/36 sm:text-[7px]">
                        {normalizedSearch
                          ? 'SEARCH RESULTS'
                          : 'FEATURED ARCHIVE'}
                      </p>
                    </div>

                    <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3.4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.045em]">
                      {normalizedSearch
                        ? 'MATCHING PIECES'
                        : 'START HERE'}
                      <span className="text-crimson">.</span>
                    </h2>
                  </div>

                  <p className="shrink-0 pb-1 text-right font-mono text-[6px] font-bold uppercase tracking-[0.16em] text-white/28 sm:text-[7px]">
                    {normalizedSearch
                      ? `${results.length} PIECES`
                      : `${featuredProducts.length} HIGHLIGHTS`}
                  </p>
                </div>

                {/* =================================================
                    SEARCH RESULTS
                ================================================== */}

                <AnimatePresence mode="wait">
                  {normalizedSearch ? (
                    results.length > 0 ? (
                      <motion.div
                        key={`results-${normalizedSearch}`}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0 }
                        }
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-2.5"
                      >
                        {results.map((product, index) => (
                          <SearchResultRow
                            key={product.id}
                            product={product}
                            index={index}
                            reduceMotion={reduceMotion}
                            onSelect={closeSearch}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty-search"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 12,
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: reduceMotion
                            ? 0
                            : 0.42,
                          ease: EASE,
                        }}
                        className="
                          relative
                          overflow-hidden
                          border
                          border-white/[0.10]
                          bg-[#080808]
                          px-5
                          py-10
                          text-center
                          sm:px-8
                          sm:py-14
                        "
                        style={{
                          clipPath: SEARCH_PANEL_CLIP,
                        }}
                      >
                        <span className="mx-auto block h-[3px] w-9 bg-crimson" />

                        <p className="mt-5 font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-crimson sm:text-[7px]">
                          SIGNAL / NO MATCH
                        </p>

                        <h3 className="mx-auto mt-3 max-w-[700px] font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em] text-[#F4F0E8]">
                          NOTHING FOUND FOR
                          <br />
                          <span className="text-white/40">
                            “{normalizedSearch}”
                          </span>
                        </h3>

                        <p className="mx-auto mt-4 max-w-md text-[12px] leading-6 text-white/42 sm:text-[13px]">
                          Try another product name, anime,
                          category, or one of the quick search
                          signals above.
                        </p>

                        <div
                          className="
                            mt-6
                            flex
                            flex-col
                            justify-center
                            gap-2
                            sm:flex-row
                          "
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSearch('');
                              inputRef.current?.focus();
                            }}
                            className="
                              min-h-11
                              border
                              border-white/[0.16]
                              bg-[#0A0A0A]
                              px-5
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-[#F4F0E8]
                              transition-colors
                              hover:border-white/40
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-crimson
                            "
                            style={{
                              clipPath: BUTTON_CLIP,
                            }}
                          >
                            CLEAR SEARCH
                          </button>

                          <Link
                            to="/shop"
                            onClick={closeSearch}
                            className="
                              inline-flex
                              min-h-11
                              items-center
                              justify-center
                              gap-3
                              bg-crimson
                              px-5
                              font-mono
                              text-[7px]
                              font-bold
                              uppercase
                              tracking-[0.16em]
                              text-white
                              transition-colors
                              hover:bg-[#F4F0E8]
                              hover:text-[#050505]
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-[#F4F0E8]
                            "
                            style={{
                              clipPath: BUTTON_CLIP,
                            }}
                          >
                            OPEN SHOP

                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              size={14}
                              strokeWidth={1.8}
                            />
                          </Link>
                        </div>
                      </motion.div>
                    )
                  ) : (
                    /* =================================================
                        FEATURED PRODUCTS
                    ================================================== */

                    <motion.div
                      key="featured"
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0 }
                      }
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="
                        grid
                        grid-cols-2
                        gap-2.5
                        sm:gap-3.5
                        lg:grid-cols-4
                      "
                    >
                      {featuredProducts.map(
                        (product, index) => (
                          <FeaturedCard
                            key={product.id}
                            product={product}
                            index={index}
                            reduceMotion={
                              reduceMotion
                            }
                            onSelect={closeSearch}
                          />
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =================================================
                    BOTTOM ARCHIVE LINK
                ================================================== */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-white/[0.08]
                    pt-4
                    sm:mt-8
                  "
                >
                  <p className="font-mono text-[5px] font-bold uppercase tracking-[0.17em] text-white/20 sm:text-[6px]">
                    ZENJI / SEARCH INDEX
                  </p>

                  <Link
                    to="/shop"
                    onClick={closeSearch}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      font-mono
                      text-[6px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#F4F0E8]
                      transition-colors
                      hover:text-crimson
                      sm:text-[7px]
                    "
                  >
                    VIEW ALL PIECES

                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={13}
                      strokeWidth={1.7}
                      className="
                        transition-transform
                        duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>
                </div>
              </section>
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
