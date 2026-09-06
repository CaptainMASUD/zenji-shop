import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

const animeWorlds = [
  {
    slug: "jujutsu-kaisen",
    title: "JUJUTSU KAISEN",
    short: "JJK",
    native: "呪術廻戦",
    signal: "CURSED ENERGY / LIMITLESS",
    line: "ENTER A WORLD WHERE POWER IS A CURSE BEFORE IT IS A GIFT.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_05_11_AM_x9or1z.png",
    objectPosition: "center 43%",
  },
  {
    slug: "solo-leveling",
    title: "SOLO LEVELING",
    short: "ARISE",
    native: "俺だけレベルアップな件",
    signal: "SHADOWS / ASCENSION",
    line: "FROM THE WEAKEST HUNTER TO THE ONE EVERY SHADOW ANSWERS TO.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_04_41_AM_yqo1s5.png",
    objectPosition: "center 42%",
  },
  {
    slug: "demon-slayer",
    title: "DEMON SLAYER",
    short: "KNY",
    native: "鬼滅の刃",
    signal: "BREATHING / BLADE",
    line: "FOLLOW THE BLADE, THE BREATH, AND THE WILL THAT REFUSES TO BREAK.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_52_06_AM_sqylpj.png",
    objectPosition: "center 42%",
  },
  {
    slug: "naruto",
    title: "NARUTO",
    short: "NINJA",
    native: "NARUTO -ナルト-",
    signal: "SHINOBI / WILL OF FIRE",
    line: "WEAR THE WILL TO KEEP MOVING EVEN WHEN THE WHOLE WORLD DOUBTS YOU.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573283/ChatGPT_Image_Sep_5_2026_07_51_34_AM_e707zd.png",
    objectPosition: "center 40%",
  },
  {
    slug: "attack-on-titan",
    title: "ATTACK ON TITAN",
    short: "AOT",
    native: "進撃の巨人",
    signal: "WALLS / FREEDOM",
    line: "KEEP MOVING FORWARD UNTIL THE WORLD BEYOND THE WALLS IS YOURS.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_51_44_AM_lv0lsa.png",
    objectPosition: "center 41%",
  },
  {
    slug: "one-piece",
    title: "ONE PIECE",
    short: "OP",
    native: "ワンピース",
    signal: "GRAND LINE / FREEDOM",
    line: "CHASE THE HORIZON WITH A CREW THAT MADE FREEDOM A WAY OF LIFE.",
    image:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788685146/ChatGPT_Image_Sep_6_2026_02_58_55_PM_oefw3f.png",
    objectPosition: "center 42%",
  },
];

const EASE = [0.16, 1, 0.3, 1];
const CARD_CLIP =
  "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))";
const CTA_CLIP =
  "polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px))";
const NAV_CLIP =
  "polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)";

function HoverReveal() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 -translate-x-[101%] transform-gpu bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none"
    >
      <span className="absolute inset-y-0 right-0 w-[3px] bg-[#F4F0E8]" />
    </span>
  );
}

function AnimeRailArrow({ direction, onClick, disabled = false, compact = false }) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ArrowLeft01Icon : ArrowRight01Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Previous anime" : "Next anime"}
      className={`group relative inline-flex shrink-0 items-center justify-center overflow-hidden border bg-[#080808] text-[#F4F0E8] outline-none transition-[opacity,border-color,transform] duration-300 focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
        compact ? "h-12 w-12" : "h-[62px] w-[62px] xl:h-[68px] xl:w-[68px]"
      } ${
        disabled
          ? "cursor-not-allowed border-white/[0.08] opacity-25"
          : "border-white/[0.22] hover:scale-[1.035] hover:border-[#F4F0E8]"
      }`}
      style={{ clipPath: NAV_CLIP }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isLeft ? "translate-x-[102%]" : "-translate-x-[102%]"
        } ${disabled ? "" : "group-hover:translate-x-0 group-focus-visible:translate-x-0"}`}
      />

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 h-[3px] bg-[#F4F0E8] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLeft ? "right-0 w-[44%] group-hover:w-[72%]" : "left-0 w-[44%] group-hover:w-[72%]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 h-[3px] bg-crimson transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLeft ? "left-0 w-[24%] group-hover:w-[44%]" : "right-0 w-[24%] group-hover:w-[44%]"
        }`}
      />

      <span
        className={`relative z-10 inline-flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          disabled
            ? ""
            : isLeft
              ? "group-hover:-translate-x-1.5 group-focus-visible:-translate-x-1.5"
              : "group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
        }`}
      >
        <HugeiconsIcon
          icon={Icon}
          size={compact ? 20 : 24}
          strokeWidth={1.55}
        />
      </span>
    </button>
  );
}

function ExploreButton({ world, compact = false }) {
  return (
    <Link
      to={`/collections/${world.slug}`}
      aria-label={`Explore ${world.title} collection`}
      className={`group relative inline-flex items-center justify-between overflow-hidden bg-[#F4F0E8] font-mono font-bold uppercase tracking-[0.16em] text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
        compact
          ? "min-h-11 min-w-[158px] gap-5 px-4 text-[9px]"
          : "min-h-[52px] min-w-[190px] gap-7 px-5 text-[10px]"
      }`}
      style={{ clipPath: CTA_CLIP }}
    >
      <HoverReveal />
      <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-white group-focus-visible:translate-x-1 group-focus-visible:text-white motion-reduce:transition-none">
        EXPLORE DROP
      </span>
      <span className="relative z-10 inline-flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:text-white motion-reduce:transition-none">
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={17} strokeWidth={1.8} />
      </span>
    </Link>
  );
}

function DesktopAnimePanel({ world, active, onActivate, reduceMotion }) {
  return (
    <motion.article
      layout
      onMouseEnter={onActivate}
      onFocus={onActivate}
      animate={{
        flexGrow: active ? 5.4 : 1,
        opacity: active ? 1 : 0.62,
      }}
      transition={{
        flexGrow: { duration: reduceMotion ? 0 : 0.72, ease: EASE },
        opacity: { duration: reduceMotion ? 0 : 0.32 },
        layout: { duration: reduceMotion ? 0 : 0.72, ease: EASE },
      }}
      className="group relative min-w-0 overflow-hidden border border-white/[0.09] bg-[#0A0A0A] outline-none focus-within:border-white/[0.28]"
      style={{ flexBasis: 0, clipPath: CARD_CLIP }}
      tabIndex={0}
      aria-label={`${world.title} anime collection`}
    >
      <motion.img
        src={world.image}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        loading="lazy"
        animate={{
          scale: active ? 1.025 : 1.09,
          x: active ? 0 : -8,
          opacity: active ? 1 : 0.58,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.82, ease: EASE }}
        className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform,opacity]"
        style={{ objectPosition: world.objectPosition }}
      />

      <motion.div
        aria-hidden="true"
        animate={{ opacity: active ? 0.32 : 0.72 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
        className="pointer-events-none absolute inset-0 bg-[#050505]"
      />

      <motion.div
        aria-hidden="true"
        animate={{ width: active ? "4px" : "7px" }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
        className="absolute left-0 top-0 z-10 h-full bg-crimson"
      />
      <div className="absolute right-0 top-0 z-10 h-[5px] w-[28%] bg-[#F4F0E8]" />

      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.div
            key="open"
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 18 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: EASE }}
            className="absolute inset-0 z-20 flex flex-col p-7 lg:p-8 xl:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-9 bg-crimson" />
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-[#F4F0E8]">
                  ZENJI / FANDOM ARCHIVE
                </p>
              </div>
              <p className="max-w-[180px] text-right font-mono text-[7px] uppercase tracking-[0.2em] text-white/55">
                {world.signal}
              </p>
            </div>

            <div className="mt-auto max-w-[720px]">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.08, ease: EASE }}
                className="font-mono text-[11px] font-semibold tracking-[0.12em] text-crimson lg:text-xs"
              >
                {world.native}
              </motion.p>

              <motion.h3
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.58, delay: 0.12, ease: EASE }}
                className="display-tight mt-3 max-w-[780px] text-[clamp(3rem,6vw,7rem)] font-semibold uppercase leading-[0.76] tracking-[-0.07em] text-[#F4F0E8]"
              >
                {world.title}
              </motion.h3>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.54, delay: 0.2, ease: EASE }}
                className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
              >
                <p className="max-w-[560px] text-[12px] font-semibold uppercase leading-5 tracking-[0.035em] text-[#E6E1D8] lg:text-[13px] lg:leading-6">
                  {world.line}
                </p>
                <ExploreButton world={world} />
              </motion.div>
            </div>

            <motion.span
              aria-hidden="true"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.72, delay: 0.18, ease: EASE }}
              className="absolute bottom-0 left-0 h-[5px] w-[34%] origin-left bg-crimson"
            />
          </motion.div>
        ) : (
          <motion.div
            key="spine"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-between px-4 py-6"
          >
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-crimson">
              {world.short}
            </span>

            <div className="flex flex-1 items-center justify-center py-5">
              <p
                className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#F4F0E8]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {world.title}
              </p>
            </div>

            <span
              className="max-h-[104px] overflow-hidden font-semibold text-white/50"
              style={{ writingMode: "vertical-rl" }}
              aria-hidden="true"
            >
              {world.native}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function MobileAnimeCard({ world, reduceMotion }) {
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
      className="relative h-[64svh] min-h-[500px] max-h-[620px] w-[86vw] shrink-0 snap-start overflow-hidden border border-white/[0.09] bg-[#0A0A0A] sm:w-[72vw]"
      style={{ clipPath: CARD_CLIP }}
    >
      <motion.img
        src={world.image}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        loading="lazy"
        whileInView={reduceMotion ? undefined : { scale: [1.06, 1.015] }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{ objectPosition: world.objectPosition }}
      />

      <div className="absolute inset-0 bg-[#050505]/[0.48]" />
      <div className="absolute left-0 top-0 h-full w-[5px] bg-crimson" />
      <div className="absolute right-0 top-0 h-[5px] w-[30%] bg-[#F4F0E8]" />

      <div className="absolute inset-0 z-10 flex flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-crimson">
            {world.signal}
          </span>
          <span className="font-semibold text-white/55">{world.native}</span>
        </div>

        <div className="mt-auto">
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-[#F4F0E8]">
            ZENJI / FANDOM ARCHIVE
          </p>
          <h3 className="display-tight mt-3 text-[clamp(2.8rem,14vw,5.4rem)] font-semibold uppercase leading-[0.76] tracking-[-0.07em] text-[#F4F0E8]">
            {world.title}
          </h3>
          <p className="mt-4 max-w-[430px] text-[11px] font-semibold uppercase leading-5 tracking-[0.035em] text-[#E6E1D8] sm:text-xs">
            {world.line}
          </p>
          <div className="mt-5">
            <ExploreButton world={world} compact />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ExploreByAnime() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileRailRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const scrollMobileToIndex = (index) => {
    const rail = mobileRailRef.current;
    if (!rail) return;

    const card = rail.children[index];
    if (!card) return;

    rail.scrollTo({
      left: Math.max(0, card.offsetLeft - 16),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const setArchiveIndex = (nextIndex) => {
    const clampedIndex = Math.min(
      animeWorlds.length - 1,
      Math.max(0, nextIndex)
    );

    setActiveIndex(clampedIndex);
    scrollMobileToIndex(clampedIndex);
  };

  const goPrevious = () => setArchiveIndex(activeIndex - 1);
  const goNext = () => setArchiveIndex(activeIndex + 1);

  const handleMobileScroll = () => {
    const rail = mobileRailRef.current;
    if (!rail || !rail.children.length) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(rail.children).forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - railCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
  };

  return (
    <section className="relative overflow-x-clip border-b border-[#1D1D1D] bg-[#050505] py-16 text-[#F4F0E8] md:py-20 lg:py-24">
      <div className="site-container">
        <div className="mx-auto max-w-[1420px] md:w-[88vw]">
          <motion.header
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease: EASE }}
            className="mb-7 flex flex-col gap-5 md:mb-9 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-9 bg-crimson" />
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-[#8F8F8F]">
                  EXPLORE BY ANIME
                </p>
              </div>
              <h2 className="display-tight mt-3 max-w-[900px] text-[clamp(2.6rem,5.8vw,6rem)] font-semibold uppercase leading-[0.8] tracking-[-0.065em] text-[#F4F0E8]">
                FIND WHAT YOU'RE
                <span className="text-crimson"> A FAN OF.</span>
              </h2>
            </div>

            <div className="hidden max-w-[280px] border-l border-white/[0.12] pl-5 md:block">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#F4F0E8]">
                  CHOOSE YOUR WORLD
                </p>
                <p className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-crimson">
                  {String(animeWorlds.length).padStart(2, "0")} WORLDS
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#858585]">
                Hover a title on desktop or swipe the rail on mobile. Open the world that matches your fandom.
              </p>
            </div>
          </motion.header>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between">
              <div className="pointer-events-auto -translate-x-1/2">
                <AnimeRailArrow
                  direction="left"
                  onClick={goPrevious}
                  disabled={activeIndex === 0}
                />
              </div>
              <div className="pointer-events-auto translate-x-1/2">
                <AnimeRailArrow
                  direction="right"
                  onClick={goNext}
                  disabled={activeIndex === animeWorlds.length - 1}
                />
              </div>
            </div>

            <div
              className="h-[560px] gap-1.5 md:flex lg:gap-2 xl:h-[620px]"
              onMouseLeave={() => setActiveIndex((current) => current)}
            >
              {animeWorlds.map((world, index) => (
                <DesktopAnimePanel
                  key={world.slug}
                  world={world}
                  active={index === activeIndex}
                  onActivate={() => setActiveIndex(index)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>

          <div className="relative md:hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-1">
              <div className="pointer-events-auto -translate-x-1">
                <AnimeRailArrow
                  direction="left"
                  onClick={goPrevious}
                  disabled={activeIndex === 0}
                  compact
                />
              </div>
              <div className="pointer-events-auto translate-x-1">
                <AnimeRailArrow
                  direction="right"
                  onClick={goNext}
                  disabled={activeIndex === animeWorlds.length - 1}
                  compact
                />
              </div>
            </div>

            <div
              ref={mobileRailRef}
              onScroll={handleMobileScroll}
              className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {animeWorlds.map((world) => (
                <MobileAnimeCard
                  key={world.slug}
                  world={world}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
