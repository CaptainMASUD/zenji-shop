import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Button from "../common/Button.jsx";

const SLIDE_DURATION = 6500;
const GATE_CLOSE_MS = 430;
const GATE_HOLD_MS = 130;
const GATE_OPEN_MS = 560;

const slides = [
  {
    id: "01",
    system: "DROP_002 / AWAKENING",
    location: "MELBOURNE — 37.8136° S",
    japanese: "覚醒",
    description:
      "A new chapter in anime-inspired streetwear — heavyweight silhouettes, disciplined detail, and limited pieces made to leave an afterimage.",
    cta: "Enter the drop",
    to: "/shop",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788683542/ChatGPT_Image_Sep_6_2026_02_31_57_PM_mln7v9.png",
    position: "center center",
    align: "left",
  },
  {
    id: "02",
    system: "SYSTEM_003 / ORIGIN",
    location: "TOKYO SIGNAL — 35.6762° N",
    japanese: "起源",
    description:
      "Oversized structure, quiet Japanese signals, premium fabric weight, and a visual language built beyond trend cycles.",
    cta: "Explore origin",
    to: "/shop",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788683676/ChatGPT_Image_Sep_6_2026_02_34_24_PM_jaysxd.png",
    position: "center center",
    align: "right",
  },
  {
    id: "03",
    system: "ARCHIVE_004 / LIMITED",
    location: "SIGNAL LOST — 03:17",
    japanese: "限定",
    description:
      "Small runs, controlled releases, and garments designed as chapters rather than permanent inventory.",
    cta: "View archive",
    to: "/lookbook",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788680523/ChatGPT_Image_Sep_6_2026_01_41_55_PM_emwua4.png",
    position: "center center",
    align: "left",
  },
];

function SlideCounter({ activeIndex }) {
  return (
    <div className="flex items-baseline gap-2 font-mono">
      <span className="text-[18px] tracking-[-0.05em] text-white">
        {String(activeIndex + 1).padStart(2, "0")}
      </span>
      <span className="text-[8px] text-white/25">/</span>
      <span className="text-[8px] tracking-[0.18em] text-white/35">
        {String(slides.length).padStart(2, "0")}
      </span>
    </div>
  );
}

function CinemaGate({ closed, booting, label }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ y: closed ? "0%" : "-100%" }}
        transition={{
          duration: booting ? 0.82 : GATE_CLOSE_MS / 1000,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute left-0 top-0 h-1/2 w-full bg-[#050505]"
      />

      <motion.div
        initial={false}
        animate={{ y: closed ? "0%" : "100%" }}
        transition={{
          duration: booting ? 0.82 : GATE_CLOSE_MS / 1000,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute bottom-0 left-0 h-1/2 w-full bg-[#050505]"
      />

      <AnimatePresence>
        {closed && (
          <>
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.72, opacity: 0 }}
              transition={{
                scaleX: {
                  duration: booting ? 0.66 : 0.28,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.16 },
              }}
              className="absolute left-[10%] right-[10%] top-1/2 h-px origin-center bg-crimson"
            />

            <motion.div
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ delay: booting ? 0.18 : 0.06 }}
              className="absolute left-1/2 top-[calc(50%+17px)] -translate-x-1/2 whitespace-nowrap text-center"
            >
              <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/40">
                {booting ? "ZENJI // CINEMA SIGNAL" : "FRAME SYNC"}
              </p>
              <p className="mt-1.5 font-mono text-[6px] uppercase tracking-[0.22em] text-white/20">
                {label}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [booting, setBooting] = useState(true);
  const [gateClosed, setGateClosed] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timersRef = useRef([]);

  const activeSlide = slides[activeIndex];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setBooting(false);
      setGateClosed(false);
      return undefined;
    }

    const openTimer = window.setTimeout(() => {
      setGateClosed(false);
    }, 650);

    const finishTimer = window.setTimeout(() => {
      setBooting(false);
    }, 650 + GATE_OPEN_MS);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(finishTimer);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const switchTo = useCallback(
    (nextIndex, nextDirection) => {
      if (
        nextIndex === activeIndex ||
        isTransitioning ||
        booting
      ) {
        return;
      }

      if (shouldReduceMotion) {
        setDirection(nextDirection);
        setActiveIndex(nextIndex);
        return;
      }

      clearTimers();

      setDirection(nextDirection);
      setIsTransitioning(true);
      setGateClosed(true);

      const swapTimer = window.setTimeout(() => {
        setActiveIndex(nextIndex);
      }, GATE_CLOSE_MS);

      const openTimer = window.setTimeout(() => {
        setGateClosed(false);
      }, GATE_CLOSE_MS + GATE_HOLD_MS);

      const finishTimer = window.setTimeout(() => {
        setIsTransitioning(false);
      }, GATE_CLOSE_MS + GATE_HOLD_MS + GATE_OPEN_MS);

      timersRef.current = [swapTimer, openTimer, finishTimer];
    },
    [
      activeIndex,
      booting,
      clearTimers,
      isTransitioning,
      shouldReduceMotion,
    ]
  );

  const goNext = useCallback(() => {
    const nextIndex =
      activeIndex === slides.length - 1 ? 0 : activeIndex + 1;

    switchTo(nextIndex, 1);
  }, [activeIndex, switchTo]);

  const goPrevious = useCallback(() => {
    const nextIndex =
      activeIndex === 0 ? slides.length - 1 : activeIndex - 1;

    switchTo(nextIndex, -1);
  }, [activeIndex, switchTo]);

  const goToSlide = (index) => {
    if (index === activeIndex) return;

    switchTo(index, index > activeIndex ? 1 : -1);
  };

  useEffect(() => {
    if (booting || isTransitioning) {
      return undefined;
    }

    const timer = window.setTimeout(goNext, SLIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [activeIndex, booting, goNext, isTransitioning]);

  const handleDragEnd = (_, info) => {
    if (booting || isTransitioning) return;

    if (info.offset.x < -70) goNext();
    if (info.offset.x > 70) goPrevious();
  };

  return (
    <section
      className="
        relative
        h-[66svh]
        min-h-[535px]
        max-h-[700px]
        overflow-hidden
        border-b
        border-line
        bg-ink
        md:h-[68svh]
        md:min-h-[575px]
        md:max-h-[730px]
        xl:h-[70svh]
        xl:max-h-[760px]
      "
    >
      {/* =========================================================
          CAMPAIGN IMAGE
      ========================================================== */}

      <AnimatePresence
        initial={false}
        custom={direction}
        mode="sync"
      >
        <motion.div
          key={activeSlide.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
          drag={
            shouldReduceMotion || booting || isTransitioning
              ? false
              : "x"
          }
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.07}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        >
          <motion.img
            src={activeSlide.image}
            alt={`${activeSlide.system} ZENJI campaign`}
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: activeSlide.position }}
            initial={false}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1.015, 1.065],
                    x:
                      activeSlide.align === "right"
                        ? ["0%", "-1.1%"]
                        : ["0%", "1.1%"],
                  }
            }
            transition={{
              duration: SLIDE_DURATION / 1000 + 1,
              ease: "linear",
            }}
          />

          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-0 w-[40%] bg-black/15" />
          <div className="absolute inset-x-0 bottom-0 h-[26%] bg-black/24" />
        </motion.div>
      </AnimatePresence>

      {/* =========================================================
          SUBTLE FRAME — NOT A UI BOX
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-black/[0.03]" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.018]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,.5) 0px, rgba(255,255,255,.5) 1px, transparent 1px, transparent 5px)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-2 bg-[#050505] md:h-2.5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2 bg-[#050505] md:h-2.5" />

      <div className="pointer-events-none absolute inset-5 z-[4] hidden border border-white/10 lg:block" />

      {/* =========================================================
          JAPANESE AFTERIMAGE
      ========================================================== */}

      <AnimatePresence mode="wait">
        <motion.span
          key={activeSlide.japanese}
          initial={{
            opacity: 0,
            scale: 0.92,
            x: 18,
          }}
          animate={{
            opacity: 0.035,
            scale: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
            x: -14,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            pointer-events-none
            absolute
            right-[6vw]
            top-[48%]
            z-[4]
            -translate-y-1/2
            select-none
            font-black
            text-[clamp(6rem,14vw,14rem)]
            leading-none
            text-white
          "
        >
          {activeSlide.japanese}
        </motion.span>
      </AnimatePresence>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="site-container relative z-10 flex h-full flex-col py-7 md:py-8 lg:py-9">
        {/* TOP BAR */}

        <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.id}-system`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2.5"
            >
              <span className="h-1.5 w-1.5 bg-crimson" />

              <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/60 md:text-[9px]">
                {activeSlide.system}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSlide.location}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-white/32 sm:block"
              >
                {activeSlide.location}
              </motion.p>
            </AnimatePresence>

            <div className="hidden items-center gap-2 lg:flex">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-1.5 w-1.5 rounded-full bg-crimson"
              />

              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/28">
                SIGNAL ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* IMAGE-FIRST BREATHING SPACE — campaign headlines intentionally removed */}
        <div className="flex-1" />

        {/* =========================================================
            BOTTOM CONTROL STRIP
        ========================================================== */}

        <div className="grid gap-4 border-t border-white/10 pt-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.id}-bottom`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{
                duration: 0.4,
                delay: 0.16,
              }}
              className="flex max-w-2xl flex-col gap-3 md:flex-row md:items-end md:gap-6"
            >
              <p className="max-w-lg text-xs leading-6 text-white/56 md:text-sm md:leading-7">
                {activeSlide.description}
              </p>

              <Link to={activeSlide.to} className="shrink-0">
                <Button className="w-full sm:w-auto">
                  {activeSlide.cta}
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-end justify-between gap-5 lg:justify-end">
            <div className="hidden sm:block">
              <SlideCounter activeIndex={activeIndex} />
            </div>

            <div className="min-w-0 flex-1 lg:w-[320px] lg:flex-none">
              <div className="mb-3 flex gap-1.5">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    disabled={booting || isTransitioning}
                    aria-label={`Go to campaign ${index + 1}`}
                    className="relative h-[2px] flex-1 overflow-hidden bg-white/14 disabled:cursor-not-allowed"
                  >
                    {index < activeIndex && (
                      <span className="absolute inset-0 bg-white/42" />
                    )}

                    {index === activeIndex && (
                      <motion.span
                        key={`progress-${activeSlide.id}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration:
                            booting || isTransitioning
                              ? 0
                              : SLIDE_DURATION / 1000,
                          ease: "linear",
                        }}
                        className="absolute inset-0 origin-left bg-crimson"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="hidden font-mono text-[7px] uppercase tracking-[0.2em] text-white/22 md:block">
                  DRAG / SWIPE
                </p>

                <div className="ml-auto flex">
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={booting || isTransitioning}
                    aria-label="Previous campaign"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      border
                      border-white/18
                      text-white
                      transition
                      duration-300
                      hover:border-white
                      hover:bg-white
                      hover:text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <motion.span
                      whileHover={
                        booting || isTransitioning
                          ? undefined
                          : { x: -3 }
                      }
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        size={16}
                        strokeWidth={1.7}
                      />
                    </motion.span>
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={booting || isTransitioning}
                    aria-label="Next campaign"
                    className="
                      -ml-px
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      border
                      border-white/18
                      text-white
                      transition
                      duration-300
                      hover:border-white
                      hover:bg-white
                      hover:text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <motion.span
                      whileHover={
                        booting || isTransitioning
                          ? undefined
                          : { x: 3 }
                      }
                    >
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        strokeWidth={1.7}
                      />
                    </motion.span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE COUNTER */}

      <div className="pointer-events-none absolute bottom-[5rem] right-5 z-20 sm:hidden">
        <SlideCounter activeIndex={activeIndex} />
      </div>

      {/* =========================================================
          CINEMA FRAME TRANSITION
      ========================================================== */}

      <CinemaGate
        closed={gateClosed}
        booting={booting}
        label={activeSlide.system}
      />
    </section>
  );
}
