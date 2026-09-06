import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductGrid from "../components/product/ProductGrid.jsx";
import ShopToolbar from "../components/shop/ShopToolbar.jsx";
import FilterPanel from "../components/shop/FilterPanel.jsx";
import { products } from "../data/products.js";
import { useShop } from "../context/ShopContext.jsx";
import { filterProducts, sortProducts } from "../utils/productFilters.js";

const SHOP_BANNER_IMAGES = [
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788680790/ChatGPT_Image_Sep_6_2026_01_46_00_PM_s3eklh.png",
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788680908/ChatGPT_Image_Sep_6_2026_01_48_19_PM_phf7ue.png",
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788681436/ChatGPT_Image_Sep_6_2026_01_57_08_PM_c92nwv.png",
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788681510/ChatGPT_Image_Sep_6_2026_01_58_22_PM_eftvmg.png",
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788681956/ChatGPT_Image_Sep_6_2026_02_05_44_PM_olrbgz.png",
];

const SLIDE_DURATION = 6500;

const BANNER_CLIP =
  "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 34px 100%, 0 calc(100% - 34px))";

const EASE = [0.16, 1, 0.3, 1];

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "4%" : "-4%",
    scale: 1.025,
  }),
  center: {
    opacity: 1,
    x: "0%",
    scale: 1,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "-3%" : "3%",
    scale: 1.012,
  }),
};

export default function Shop() {
  const { search, filters, setFilters, resetFilters, sort, setSort } =
    useShop();

  const [mobileFilters, setMobileFilters] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const filtered = useMemo(
    () => sortProducts(filterProducts(products, { ...filters, search }), sort),
    [search, filters, sort],
  );

  const goToSlide = useCallback((index) => {
    if (index === activeSlide) return;

    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }, [activeSlide]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveSlide((current) =>
      current === SHOP_BANNER_IMAGES.length - 1 ? 0 : current + 1,
    );
  }, []);

  const goPrevious = useCallback(() => {
    setDirection(-1);
    setActiveSlide((current) =>
      current === 0 ? SHOP_BANNER_IMAGES.length - 1 : current - 1,
    );
  }, []);

  useEffect(() => {
    if (SHOP_BANNER_IMAGES.length <= 1) return undefined;

    const timer = window.setTimeout(goNext, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeSlide, goNext]);

  useEffect(() => {
    if (SHOP_BANNER_IMAGES.length <= 1 || mobileFilters) return undefined;

    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target;
      const tagName = target?.tagName;
      const isTypingTarget =
        target?.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT";

      if (isTypingTarget) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious, mobileFilters]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x <= -70 || info.velocity.x <= -500) {
      goNext();
      return;
    }

    if (info.offset.x >= 70 || info.velocity.x >= 500) {
      goPrevious();
    }
  };

  return (
    <>
      {/* =====================================================
          SHOP BANNER
      ====================================================== */}
      <section className="border-b border-line bg-ink">
        <div className="site-container pb-5 pt-4 sm:pb-6 sm:pt-5 lg:pb-7 lg:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            role="region"
            aria-roledescription="carousel"
            aria-label="ZENJI store campaign banners. Swipe, drag, or use the left and right arrow keys to change slides."
            className="relative overflow-hidden border border-white/[0.11] bg-[#090909]"
            style={{ clipPath: BANNER_CLIP }}
          >
            <div className="relative h-[240px] sm:h-[290px] md:h-[330px] lg:aspect-[16/6] lg:h-auto xl:aspect-[16/5]">
              {/* IMAGE-ONLY SLIDER LAYER */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={SHOP_BANNER_IMAGES[activeSlide]}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.72, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.08}
                  onDragEnd={handleDragEnd}
                  style={{ touchAction: "pan-y" }}
                  className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
                >
                  <motion.img
                    src={SHOP_BANNER_IMAGES[activeSlide]}
                    alt={`ZENJI store collection banner ${activeSlide + 1}`}
                    draggable={false}
                    loading={activeSlide === 0 ? "eager" : "lazy"}
                    decoding="async"
                    initial={{ scale: 1.03 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.05, ease: EASE }}
                    className="h-full w-full select-none object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* restrained contrast overlay — intentionally not a gradient */}
              <div className="pointer-events-none absolute inset-0 z-[2] bg-black/35" />

              {/* editorial edge language */}
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
                className="pointer-events-none absolute left-0 top-0 z-10 h-[5px] w-[32%] origin-left bg-crimson"
              />

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, delay: 0.3, ease: EASE }}
                className="pointer-events-none absolute bottom-0 right-0 z-10 h-[5px] w-[22%] origin-right bg-[#F4F0E8]"
              />

              {/* EXISTING COPY — KEPT IN THE CURRENT BOTTOM LAYOUT */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-5 md:p-6 lg:p-7">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
                  className="inline-flex items-center gap-2.5 bg-[#050505] px-3 py-2.5 sm:px-4"
                >
                  <span className="h-2 w-2 shrink-0 bg-crimson" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#F4F0E8] sm:text-[10px]">
                    ZENJI / STORE
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.34, ease: EASE }}
                  className="hidden bg-[#050505] px-3 py-2.5 text-right sm:block sm:px-4"
                >
                  <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-white/60 sm:text-[9px]">
                    CURRENT ARCHIVE
                  </p>
                  <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#F4F0E8] sm:text-[11px]">
                    {products.length} PIECES / LIVE
                  </p>
                </motion.div>
              </div>

              {/* BOTTOM-CENTER SLIDER NAVIGATION */}
              {SHOP_BANNER_IMAGES.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 sm:bottom-5 md:bottom-6 lg:bottom-7">
                  <div className="flex items-center gap-1.5 bg-[#050505]/90 px-2.5 py-2 backdrop-blur-sm">
                    {SHOP_BANNER_IMAGES.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        aria-label={`Show store banner ${index + 1}`}
                        aria-current={index === activeSlide ? "true" : undefined}
                        onClick={() => goToSlide(index)}
                        className="relative h-[3px] w-8 overflow-hidden bg-white/20 transition-colors hover:bg-white/35 sm:w-10"
                      >
                        {index === activeSlide && (
                          <motion.span
                            key={`shop-progress-${activeSlide}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                            className="absolute inset-0 origin-left bg-crimson"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SHOP CONTENT
      ====================================================== */}
      <section className="site-container py-8 md:py-10 lg:py-12">
        <ShopToolbar
          count={filtered.length}
          sort={sort}
          setSort={setSort}
          onFilter={() => setMobileFilters(true)}
        />

        <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          <div className="min-w-0">
            {filtered.length ? (
              <ProductGrid products={filtered} columns="three" />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center border border-line bg-[#080808] px-6 text-center">
                <div>
                  <span className="mx-auto block h-[3px] w-9 bg-crimson" />
                  <p className="mt-4 text-sm leading-6 text-silver sm:text-[15px]">
                    No pieces match this signal.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-crimson transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ====================================================== */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[70] bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMobileFilters(false)}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Shop filters"
              className="fixed bottom-0 left-0 right-0 z-[80] max-h-[88vh] overflow-y-auto rounded-t-[28px] border-t border-line bg-ink p-6 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.36, ease: EASE }}
            >
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                onClose={() => setMobileFilters(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
