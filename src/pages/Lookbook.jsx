import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { lookbookItems } from "../data/lookbook.js";
import { products } from "../data/products.js";

const FILTERS = [
  { value: "all", label: "ALL" },
  { value: "front", label: "FRONT" },
  { value: "back", label: "BACK" },
  { value: "on-model", label: "ON MODEL" },
];

const CARD_CLIP =
  "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))";

const TAB_CLIP =
  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))";

const EASE = [0.16, 1, 0.3, 1];
const HERO_TITLE = "LOOKBOOK.";
const HERO_WIDTHS = [640, 960, 1280, 1600, 1920];
const CARD_WIDTHS = [360, 540, 720, 900];

function buildCloudinaryUrl(url, width, quality = "q_auto:good") {
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/upload/")
  ) {
    return url;
  }

  const safeWidth = Math.max(1, Math.round(width));
  const transform = `f_auto,${quality},c_limit,w_${safeWidth}`;

  return url.replace("/upload/", `/upload/${transform}/`);
}

function getResponsiveImageSources(
  url,
  widths,
  preferredWidth,
  quality = "q_auto:good",
) {
  const isCloudinary =
    typeof url === "string" &&
    url.includes("res.cloudinary.com") &&
    url.includes("/upload/");

  if (!isCloudinary) {
    return { src: url, srcSet: undefined };
  }

  return {
    src: buildCloudinaryUrl(url, preferredWidth, quality),
    srcSet: widths
      .map((width) => `${buildCloudinaryUrl(url, width, quality)} ${width}w`)
      .join(", "),
  };
}

const heroLetterVariants = {
  hidden: (index) => ({
    opacity: 0,
    y: index % 2 === 0 ? 30 : -24,
    rotateX: index % 2 === 0 ? 14 : -12,
  }),
  visible: (index) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.58,
      delay: 0.06 + index * 0.045,
      ease: EASE,
    },
  }),
};

export default function Lookbook() {
  const [filter, setFilter] = useState("all");
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const preparedLookbookItems = useMemo(
    () =>
      lookbookItems.map((item) => ({
        ...item,
        responsiveImage: getResponsiveImageSources(
          item.image,
          CARD_WIDTHS,
          720,
          "q_auto:eco",
        ),
      })),
    [],
  );

  const heroImage = preparedLookbookItems[0];
  const heroImageSources = useMemo(
    () =>
      getResponsiveImageSources(
        heroImage?.image,
        HERO_WIDTHS,
        1600,
        "q_auto:good",
      ),
    [heroImage?.image],
  );

  const items = useMemo(() => {
    if (filter === "all") return preparedLookbookItems;
    return preparedLookbookItems.filter((item) => item.type === filter);
  }, [filter, preparedLookbookItems]);

  const filterCounts = useMemo(() => {
    return FILTERS.reduce((result, tab) => {
      result[tab.value] =
        tab.value === "all"
          ? preparedLookbookItems.length
          : preparedLookbookItems.filter((item) => item.type === tab.value).length;
      return result;
    }, {});
  }, [preparedLookbookItems]);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [],
  );

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.32,
    restDelta: 0.001,
  });

  const heroMediaY = useTransform(heroScroll, [0, 1], [0, 24]);
  const heroMediaScale = useTransform(heroScroll, [0, 1], [1.015, 1]);
  const heroShadeOpacity = useTransform(heroScroll, [0, 0.82, 1], [0.18, 0.22, 0.34]);
  const titleY = useTransform(heroScroll, [0, 1], [0, -28]);
  const titleScale = useTransform(heroScroll, [0, 1], [1, 0.975]);
  const titleOpacity = useTransform(heroScroll, [0, 0.74, 1], [1, 0.94, 0.32]);

  return (
    <>
      {/* PERFORMANCE-OPTIMIZED CINEMATIC HERO */}
      <section
        ref={heroRef}
        className="relative isolate h-[52svh] min-h-[410px] max-h-[610px] overflow-hidden bg-[#050505] text-ivory sm:h-[58svh] sm:min-h-[470px] sm:max-h-[680px] lg:h-[66svh] lg:min-h-[540px] lg:max-h-[740px]"
      >
        {heroImage && (
          <motion.div
            className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:translateZ(0)] [will-change:transform]"
            style={
              reduceMotion
                ? undefined
                : {
                    y: heroMediaY,
                    scale: heroMediaScale,
                  }
            }
          >
            <img
              src={heroImageSources.src}
              srcSet={heroImageSources.srcSet}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable="false"
              className="absolute left-0 top-[-2%] h-[104%] w-full select-none object-cover object-center"
            />
          </motion.div>
        )}

        {/* Static fades are cheaper than animating masks while keeping the banner dissolve effect. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(to_bottom,#050505_0%,rgba(5,5,5,0.52)_36%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,5,5,0.58)_56%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[16%] bg-[linear-gradient(to_right,rgba(5,5,5,0.52),transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[16%] bg-[linear-gradient(to_left,rgba(5,5,5,0.52),transparent)]" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black"
          style={reduceMotion ? { opacity: 0.2 } : { opacity: heroShadeOpacity }}
        />

        <div className="relative z-10 flex h-full items-center justify-center overflow-hidden px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            aria-label={HERO_TITLE}
            initial={false}
            style={
              reduceMotion
                ? undefined
                : {
                    y: titleY,
                    scale: titleScale,
                    opacity: titleOpacity,
                  }
            }
            className="display-tight flex whitespace-nowrap text-[clamp(3rem,13.2vw,5.2rem)] font-semibold uppercase leading-none tracking-[-0.055em] text-ivory [backface-visibility:hidden] [text-shadow:0_10px_34px_rgba(0,0,0,0.64)] [transform:translateZ(0)] sm:text-[clamp(4.8rem,10.7vw,7.6rem)] lg:text-[clamp(6.3rem,9vw,10.4rem)]"
          >
            {HERO_TITLE.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                custom={index}
                variants={heroLetterVariants}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "visible"}
                className={letter === "." ? "inline-block text-crimson" : "inline-block"}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>
      </section>

      <section className="border-t border-line bg-ink">
        {/* COMPACT FILTER BAR */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.38, ease: EASE }}
          className="sticky top-[74px] z-30 border-b border-line bg-[#050505]"
        >
          <div className="site-container">
            <div className="flex min-h-[56px] items-center py-1.5 sm:min-h-[58px]">
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
                {FILTERS.map((tab) => {
                  const active = filter === tab.value;

                  return (
                    <motion.button
                      key={tab.value}
                      type="button"
                      onClick={() => setFilter(tab.value)}
                      aria-pressed={active}
                      whileTap={{ scale: 0.98 }}
                      style={{ clipPath: TAB_CLIP }}
                      className={`group relative flex min-h-[40px] min-w-[104px] shrink-0 items-center justify-between gap-3.5 border px-3.5 py-2 font-mono uppercase transition-[border-color,background-color,color] duration-200 sm:min-w-[126px] sm:px-4 ${
                        active
                          ? "border-crimson bg-crimson/[0.05] text-ivory"
                          : "border-line bg-[#080808] text-ivory/66 hover:border-ivory/25 hover:text-ivory"
                      }`}
                    >
                      <span className="text-[10px] font-bold tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]">
                        {tab.label}
                      </span>

                      <motion.span
                        key={`${tab.value}-${filterCounts[tab.value] || 0}`}
                        initial={reduceMotion ? false : { opacity: 0.45, y: 2 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className={`min-w-[16px] text-right text-[8px] font-semibold tracking-[0.08em] ${
                          active ? "text-crimson" : "text-ivory/35"
                        }`}
                      >
                        {filterCounts[tab.value] || 0}
                      </motion.span>

                      <span
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-crimson transition-transform duration-200 ${
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-40"
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* GALLERY SECTION REVEAL */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.04 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="site-container py-6 sm:py-8 lg:py-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            {items.length > 0 ? (
              <motion.div
                key={filter}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:gap-5"
              >
                {items.map((item, index) => {
                  const product = productById.get(item.productId);
                  const destination = product ? `/product/${product.slug}` : "/shop";
                  const tallCard = index % 5 === 1 || index % 5 === 4;

                  return (
                    <motion.div
                      key={item.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.06, margin: "0px 0px -5% 0px" }}
                      transition={{
                        duration: 0.32,
                        delay: reduceMotion ? 0 : Math.min((index % 3) * 0.035, 0.07),
                        ease: EASE,
                      }}
                      className="mb-3 break-inside-avoid [contain-intrinsic-size:560px] [content-visibility:auto] sm:mb-4 xl:mb-5"
                    >
                      <Link
                        to={destination}
                        className="group relative block overflow-hidden bg-[#090909] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                        style={{ clipPath: CARD_CLIP }}
                      >
                        <div
                          className={`relative overflow-hidden ${
                            tallCard ? "aspect-[4/5]" : "aspect-[3/4]"
                          }`}
                        >
                          <img
                            src={item.responsiveImage.src}
                            srcSet={item.responsiveImage.srcSet}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                            className="h-full w-full select-none object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                          />

                          <div className="pointer-events-none absolute inset-0 bg-black/[0.06] transition-colors duration-300 group-hover:bg-black/25" />

                          <span className="pointer-events-none absolute left-0 top-0 h-[3px] w-[20%] origin-left bg-crimson transition-transform duration-300 group-hover:scale-x-[1.22]" />
                          <span className="pointer-events-none absolute right-0 top-0 h-[3px] w-[9%] bg-ivory/90" />

                          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 sm:left-5 sm:top-5">
                            <span className="bg-black/70 px-2 py-1.5 font-mono text-[7px] font-semibold tracking-[0.16em] text-ivory">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.16em] text-white/75 [text-shadow:0_2px_8px_#000]">
                              {item.type?.replace("-", " ")}
                            </span>
                          </div>

                          {/* DESKTOP HOVER MICROINTERACTION */}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-black/78 px-5 pb-5 pt-7 opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                            <div className="flex items-end justify-between gap-5">
                              <div className="min-w-0">
                                <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.18em] text-crimson">
                                  {item.type?.replace("-", " ")}
                                </p>

                                <h3 className="mt-1.5 line-clamp-2 text-[13px] font-semibold uppercase leading-[1.1] tracking-[0.015em] text-ivory lg:text-[14px]">
                                  {item.title}
                                </h3>

                                {product && (
                                  <p className="mt-1.5 line-clamp-1 font-mono text-[7px] uppercase tracking-[0.11em] text-ivory/50">
                                    {product.name}
                                  </p>
                                )}
                              </div>

                              <span className="shrink-0 text-[19px] font-light text-ivory transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                ↗
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* MOBILE CAPTION */}
                        <div className="border-t border-white/[0.08] bg-[#080808] px-4 py-3.5 sm:hidden">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.17em] text-crimson">
                                {item.type?.replace("-", " ")}
                              </p>

                              <h3 className="mt-1 line-clamp-2 text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.012em] text-ivory">
                                {item.title}
                              </h3>

                              {product && (
                                <p className="mt-1 line-clamp-1 font-mono text-[7px] uppercase tracking-[0.1em] text-ivory/40">
                                  {product.name}
                                </p>
                              )}
                            </div>

                            <span className="mt-0.5 shrink-0 text-[16px] text-ivory/70 transition-transform duration-200 group-active:translate-x-0.5">
                              ↗
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                className="flex min-h-[300px] items-center justify-center border border-line bg-[#080808]"
                style={{ clipPath: CARD_CLIP }}
              >
                <div className="text-center">
                  <span className="mx-auto block h-[3px] w-8 bg-crimson" />
                  <p className="mt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/40">
                    NO VISUALS FOUND
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* FINAL CTA REVEAL */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="site-container pb-10 sm:pb-14 lg:pb-20"
        >
          <div className="flex items-center justify-end border-t border-line pt-5">
            <Link
              to="/shop"
              className="group flex items-center gap-2.5 font-mono text-[8px] font-semibold uppercase tracking-[0.17em] text-ivory transition-colors duration-200 hover:text-crimson"
            >
              SHOP COLLECTION
              <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
