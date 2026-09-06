import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import DropCountdown from "../components/home/DropCountdown.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { products } from "../data/products.js";

const EASE = [0.16, 1, 0.3, 1];

const HERO_SLIDE_DURATION = 6500;

const AWAKENING_HERO_SLIDES = [
  {
    id: "01",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788679262/ChatGPT_Image_Sep_6_2026_01_20_48_PM_zb0qcf.png",
    alt: "Awakening collection campaign banner",
    objectPosition: "center 38%",
  },
  {
    id: "02",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788679510/ChatGPT_Image_Sep_6_2026_01_24_57_PM_aduztz.png",
    alt: "Awakening collection alternate campaign banner",
    objectPosition: "center center",
  },
  {
    id: "03",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788680030/ChatGPT_Image_Sep_6_2026_01_33_40_PM_f2x1ri.png",
    alt: "Awakening collection alternate campaign banner",
    objectPosition: "center center",
  },
];

const AWAKENING_DETAIL_IMAGE =
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=90";

const HERO_CLIP =
  "polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 32px 100%, 0 calc(100% - 32px))";

const DETAIL_CLIP =
  "polygon(0 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%)";

const SIGNALS = ["HEAVYWEIGHT", "RELAXED FORM", "LIMITED RELEASE"];

export default function Drops() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const activeHeroSlide = AWAKENING_HERO_SLIDES[activeSlideIndex];

  const awakening = products.filter((product) =>
    String(product?.collection ?? "").includes("Awakening"),
  );

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 44]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -22]);

  const changeHeroSlide = useCallback((direction) => {
    setSlideDirection(direction);
    setActiveSlideIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) return AWAKENING_HERO_SLIDES.length - 1;
      if (nextIndex >= AWAKENING_HERO_SLIDES.length) return 0;

      return nextIndex;
    });
  }, []);

  useEffect(() => {
    if (isDragging) return undefined;

    const timer = window.setTimeout(() => {
      changeHeroSlide(1);
    }, HERO_SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeSlideIndex, changeHeroSlide, isDragging]);

  const handleHeroDragEnd = (_, info) => {
    setIsDragging(false);

    const swipeDistance = info.offset.x;
    const swipeVelocity = info.velocity.x;
    const shouldAdvance = swipeDistance < -55 || swipeVelocity < -520;
    const shouldGoBack = swipeDistance > 55 || swipeVelocity > 520;

    if (shouldAdvance) changeHeroSlide(1);
    if (shouldGoBack) changeHeroSlide(-1);
  };

  return (
    <main className="overflow-hidden bg-ink text-[#F4F0E8]">
      {/* =====================================================
          THICK CINEMATIC DROP BANNER
      ====================================================== */}
      <section
        ref={heroRef}
        className="relative border-b border-white/[0.09] bg-[#050505] pb-8 pt-4 sm:pb-10 sm:pt-5 lg:pb-12 lg:pt-6"
      >
        <div className="site-container">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: EASE }}
            className="relative"
          >
            <div
              className="relative min-h-[320px] overflow-hidden bg-[#090909] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[460px] xl:min-h-[500px]"
              style={{ clipPath: HERO_CLIP }}
            >
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={activeHeroSlide.id}
                  custom={slideDirection}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: slideDirection > 0 ? "6%" : "-6%",
                          scale: 1.018,
                        }
                  }
                  animate={{ opacity: 1, x: "0%", scale: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: slideDirection > 0 ? "-4%" : "4%",
                          scale: 1.012,
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0.18 : 0.68,
                    ease: EASE,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.08}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleHeroDragEnd}
                  style={{ touchAction: "pan-y" }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <motion.img
                    src={activeHeroSlide.image}
                    alt={activeHeroSlide.alt}
                    draggable={false}
                    loading={activeSlideIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    style={{
                      y: reduceMotion ? 0 : imageY,
                      objectPosition: activeHeroSlide.objectPosition,
                    }}
                    initial={
                      reduceMotion ? false : { opacity: 0.84, scale: 1.035 }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : { opacity: 1, scale: 1.012 }
                    }
                    transition={{ duration: 1, ease: EASE }}
                    className="absolute inset-0 h-[108%] w-full select-none object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-black/24" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-black/48" />

              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={reduceMotion ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.72, delay: 0.16, ease: EASE }}
                className="pointer-events-none absolute left-0 top-0 h-[5px] w-[28%] origin-left bg-crimson"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 h-[5px] w-[16%] bg-[#F4F0E8]"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-5 md:p-6">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
                  className="inline-flex items-center gap-2.5 bg-[#050505] px-3 py-2.5 sm:px-4"
                >
                  <span className="h-2 w-2 bg-crimson" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#F4F0E8] sm:text-[10px]">
                    ZENJI / DROP 002
                  </span>
                </motion.div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
                  className="inline-flex items-center gap-2 border border-white/[0.14] bg-[#080808] px-3 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/78 sm:text-[10px]"
                >
                  <span className="h-1.5 w-1.5 bg-crimson" />
                  <span>LIMITED / ACTIVE</span>
                  <span className="h-3 w-px bg-white/16" aria-hidden="true" />
                  <span
                    className="tabular-nums text-white/48"
                    aria-live="polite"
                    aria-label={`Campaign image ${activeSlideIndex + 1} of ${AWAKENING_HERO_SLIDES.length}`}
                  >
                    {String(activeSlideIndex + 1).padStart(2, "0")} / {String(AWAKENING_HERO_SLIDES.length).padStart(2, "0")}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.24, ease: EASE }}
                style={reduceMotion ? undefined : { y: titleY }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 pb-5 sm:p-5 sm:pb-6 md:p-7 md:pb-8 lg:p-8 lg:pb-9"
              >
                <div className="flex items-end justify-between gap-5">
                  <div className="min-w-0">
                    <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/62 sm:text-[10px]">
                      TRANSMISSION / 002
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-end gap-5 text-right sm:flex">
                    <p className="font-jp text-[clamp(2.6rem,6vw,5.6rem)] font-bold leading-none text-crimson" aria-hidden="true">
                      覚醒
                    </p>
                    <div className="border-l border-white/[0.16] pl-4">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/42 sm:text-[9px]">
                        RELEASE
                      </p>
                      <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#F4F0E8] sm:text-[13px]">
                        07 SEP / 23:59 BDT
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.14] pt-3 sm:hidden">
                  <p className="font-jp text-3xl font-bold leading-none text-crimson" aria-hidden="true">
                    覚醒
                  </p>
                  <div className="text-right">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/42">
                      RELEASE
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#F4F0E8]">
                      07 SEP / 23:59 BDT
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          EDITORIAL STATEMENT
      ====================================================== */}
      <section className="border-b border-white/[0.09] bg-[#080808] py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)] lg:items-end lg:gap-14 xl:gap-20">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.64, ease: EASE }}
            >
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-8 bg-crimson" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52 sm:text-[10px]">
                  DROP NOTE / AWAKENING
                </p>
              </div>

              <h2 className="mt-5 max-w-[980px] font-display text-[clamp(2.8rem,7vw,6.7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.065em] text-[#F4F0E8]">
                THE UNIFORM
                <br />
                AFTER THE
                <br />
                <span className="text-crimson">TURNING POINT.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.62, delay: 0.06, ease: EASE }}
              className="border-t border-white/[0.12] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-10"
            >
              <p className="max-w-[560px] text-[15px] leading-7 text-white/70 sm:text-[16px] sm:leading-8">
                Awakening strips the collection back to its strongest signals:
                weight, restraint and silhouettes built with room to move. The
                result is quieter, sharper and designed to feel intentional
                before it feels loud.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {SIGNALS.map((signal) => (
                  <div key={signal} className="border-t border-white/[0.12] pt-3">
                    <span className="mb-2 block h-1.5 w-1.5 bg-crimson" />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#F4F0E8]">
                      {signal}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COUNTDOWN / DROP SIGNAL
      ====================================================== */}
      <DropCountdown />

      {/* =====================================================
          THE PIECES — CHAPTER BREAK
      ====================================================== */}
      <section className="border-y border-white/[0.09] bg-[#050505] py-8 sm:py-9 md:py-10">
        <div className="site-container">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:items-stretch">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, ease: EASE }}
              className="flex min-h-[190px] flex-col justify-between border-y border-white/[0.12] py-5 sm:min-h-[220px] sm:py-6 lg:min-h-[250px]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52 sm:text-[10px]">
                  AVAILABLE / NOW
                </p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-crimson sm:text-[10px]">
                  {String(awakening.length).padStart(2, "0")} PIECES
                </p>
              </div>

              <div>
                <h2 aria-label="THE PIECES." className="font-display text-[clamp(3.1rem,8vw,7.3rem)] font-semibold uppercase leading-[0.8] tracking-[-0.065em] text-[#F4F0E8]">
                  THE PIECES<span className="text-crimson">.</span>
                </h2>
                <p className="mt-3 max-w-[620px] text-[14px] leading-6 text-white/56 sm:text-[15px] sm:leading-7">
                  The Awakening transmission, available from the live archive.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, delay: 0.05, ease: EASE }}
              className="relative min-h-[210px] overflow-hidden bg-[#0A0A0A] sm:min-h-[240px] lg:min-h-[250px]"
              style={{ clipPath: DETAIL_CLIP }}
            >
              <img
                src={AWAKENING_DETAIL_IMAGE}
                alt="Awakening collection detail"
                draggable={false}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/24" />
              <span className="pointer-events-none absolute left-0 top-0 h-[4px] w-[30%] bg-crimson" />
              <div className="absolute bottom-4 left-4 bg-[#050505] px-3 py-2.5">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#F4F0E8]">
                  AWAKENING / DETAIL
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT GRID
      ====================================================== */}
      <section className="site-container py-10 sm:py-12 md:py-14 lg:py-16">
        <ProductGrid products={awakening} />
      </section>
    </main>
  );
}
