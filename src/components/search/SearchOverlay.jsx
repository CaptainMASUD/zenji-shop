import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  'Void Hoodie',
  'Demon Blood',
  'Utility Pants',
  'Longsleeve',
  'Cap',
];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, search, setSearch } = useShop();
  const inputRef = useRef(null);

  // Filter products based on search query
  const results = filterProducts(products, { search }).slice(0, 8);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  // Auto-focus input and lock body scroll when search is open
  useEffect(() => {
    if (searchOpen) {
      document.body.classList.add('overflow-hidden');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);

      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSearchOpen(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', onKeyDown);
        document.body.classList.remove('overflow-hidden');
      };
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [searchOpen, setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-[#070707]/98 backdrop-blur-2xl text-ivory"
        >
          {/* TOP CONTROL BAR */}
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#070707]/95 backdrop-blur-xl">
            <div className="site-container flex h-20 items-center justify-between gap-4">
              {/* Left Brand / Context Badge */}
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-crimson shadow-[0_0_8px_#D72638]" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/90 sm:text-xs">
                    ARCHIVE SEARCH / ZENJI
                  </p>
                  <p className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 sm:block">
                    EXPLORE DROPS &amp; PIECES
                  </p>
                </div>
              </div>

              {/* Right Shortcut Hint & Close Button */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50 sm:inline-flex">
                  <kbd className="font-semibold text-white/80">ESC</kbd> TO CLOSE
                </span>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
                >
                  <span>CLOSE</span>
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    strokeWidth={2}
                    className="transition-transform group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN SEARCH AREA */}
          <div className="site-container flex-1 py-8 sm:py-12">
            <div className="mx-auto max-w-4xl">
              {/* PROMINENT SEARCH INPUT */}
              <div className="relative border-b-2 border-white/25 pb-4 transition-colors focus-within:border-crimson">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Search Icon */}
                  <span className="shrink-0 text-crimson">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={32}
                      strokeWidth={2.2}
                      className="drop-shadow-[0_0_8px_rgba(215,38,56,0.6)]"
                    />
                  </span>

                  {/* High-Visibility Text Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search drops, tees, hoodies, pieces..."
                    className="w-full bg-transparent font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-bold leading-tight tracking-[-0.03em] text-ivory outline-none placeholder:font-normal placeholder:text-white/40"
                  />

                  {/* Quick Clear Query Button */}
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        inputRef.current?.focus();
                      }}
                      aria-label="Clear search input"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </div>

              {/* QUICK FILTER PILLS */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                  TRENDING:
                </span>
                {QUICK_TAGS.map((tag) => {
                  const isActive = search.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearch(tag);
                        inputRef.current?.focus();
                      }}
                      className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'border border-crimson bg-crimson text-white shadow-[0_0_10px_rgba(215,38,56,0.5)]'
                          : 'border border-white/20 bg-white/[0.05] text-white/85 hover:border-crimson/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* RESULTS / PREVIEW CONTAINER */}
              <div className="mt-12">
                {/* SECTION HEADER */}
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55 sm:text-xs">
                    {search ? `SEARCH RESULTS` : `FEATURED PIECES FROM CURRENT DROPS`}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-crimson sm:text-xs font-semibold">
                    {search ? `${results.length} PIECES FOUND` : `ARCHIVE HIGHLIGHTS`}
                  </p>
                </div>

                {/* WHEN SEARCHING: SHOW FILTERED RESULTS */}
                {search ? (
                  results.length > 0 ? (
                    <div className="divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/[0.02]">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-white/[0.06] sm:p-5"
                        >
                          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                            {/* Product Thumbnail */}
                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-graphite sm:h-24 sm:w-20">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-crimson">
                                  {product.label || product.japanese}
                                </span>
                                <span className="text-white/30">•</span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
                                  {product.collection}
                                </span>
                              </div>

                              <h4 className="mt-1 truncate font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-crimson sm:text-xl">
                                {product.name}
                              </h4>

                              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                                {product.category} • {product.sizes?.join('/')}
                              </p>
                            </div>
                          </div>

                          {/* Price & Link Arrow */}
                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <div>
                              <p className="font-mono text-base font-bold text-ivory sm:text-lg">
                                {currency(product.price)}
                              </p>
                              {product.compareAtPrice && (
                                <p className="font-mono text-xs text-white/40 line-through">
                                  {currency(product.compareAtPrice)}
                                </p>
                              )}
                            </div>

                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/60 transition-colors group-hover:border-crimson group-hover:bg-crimson group-hover:text-white sm:h-10 sm:w-10">
                              <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                size={16}
                                strokeWidth={2}
                              />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    /* EMPTY SEARCH STATE */
                    <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-8 text-center sm:p-14">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-crimson">
                        <HugeiconsIcon icon={Search01Icon} size={26} strokeWidth={2} />
                      </div>
                      <h4 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                        NO PIECES FOUND FOR &ldquo;{search}&rdquo;
                      </h4>
                      <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                        We couldn&rsquo;t find anything matching your search. Try searching by
                        category (tees, hoodies, pants) or browse our active collection.
                      </p>
                      <div className="mt-6 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            inputRef.current?.focus();
                          }}
                          className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
                        >
                          Clear Search
                        </button>
                        <Link
                          to="/shop"
                          onClick={() => setSearchOpen(false)}
                          className="rounded-full bg-crimson px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(215,38,56,0.4)] transition-colors hover:bg-crimson/90"
                        >
                          View Full Shop
                        </Link>
                      </div>
                    </div>
                  )
                ) : (
                  /* EMPTY QUERY: SHOW POPULAR / FEATURED PIECES */
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-3 transition-colors hover:border-crimson/80 hover:bg-white/[0.06]"
                      >
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-graphite">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-crimson font-medium">
                              {product.collection}
                            </span>
                            <span className="font-mono text-xs font-bold text-ivory">
                              {currency(product.price)}
                            </span>
                          </div>

                          <h5 className="mt-1 truncate font-display text-sm font-semibold tracking-tight text-white group-hover:text-crimson transition-colors">
                            {product.name}
                          </h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
