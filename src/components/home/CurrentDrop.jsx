import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

const chapters = [
  {
    slug: "limitless-oversized-tee",
    anime: "JUJUTSU KAISEN",
    character: "GOJO SATORU",
    jp: "五条 悟",
    impact: "LIMITLESS.",
    eyebrow: "THE STRONGEST / INFINITY",
    techniqueJp: "「無下限」",
    technique: "INFINITY TECHNIQUE",
    impactLine: "NO ONE TOUCHES WHAT THEY CAN NEVER REACH.",
    statement: "THE SPACE BETWEEN YOU AND IMPACT BELONGS TO HIM.",
    phases: ["PRESENCE", "INFINITY", "AFTERIMAGE"],
    story: [
      "Presence changes the room before anything happens.",
      "Infinity turns distance itself into control.",
      "By the time the frame settles, the outcome already feels decided.",
    ],
    product: "Limitless Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_05_11_AM_x9or1z.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_11_42_AM_uhjlqf.png",
    composition: "right",
    backgroundPosition: "center 42%",
    framePosition: "center 38%",
  },
  {
    slug: "shadow-monarch-oversized-tee",
    anime: "SOLO LEVELING",
    character: "SUNG JIN-WOO",
    jp: "影の君主",
    impact: "ARISE.",
    eyebrow: "SHADOW MONARCH / ASCENSION",
    techniqueJp: "「影の君主」",
    technique: "SHADOW SOVEREIGN",
    impactLine: "ONE COMMAND, AND THE FALLEN STAND BEHIND HIM.",
    statement: "HE DOESN'T ENTER THE BATTLEFIELD ALONE ANYMORE.",
    phases: ["AWAKENING", "COMMAND", "MONARCH"],
    story: [
      "Every gate leaves less of the hunter who entered.",
      "One command turns defeat into an army.",
      "The shadows stop following the fight and start following him.",
    ],
    product: "Shadow Monarch Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_04_41_AM_yqo1s5.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_05_02_AM_h8aqok.png",
    composition: "left",
    backgroundPosition: "center 44%",
    framePosition: "center 40%",
  },

  {
    slug: "demon-slayer-oversized-tee",
    anime: "DEMON SLAYER",
    character: "TANJIRO KAMADO",
    jp: "竈門 炭治郎",
    impact: "BREATHE.",
    eyebrow: "SUN BREATHING / RESOLVE",
    techniqueJp: "「ヒノカミ神楽」",
    technique: "HINOKAMI KAGURA",
    impactLine: "EVERY STEP FORWARD IS CARRIED BY DISCIPLINE.",
    statement: "A QUIETER KIND OF STRENGTH, BUILT TO KEEP MOVING.",
    phases: ["FOCUS", "FLAME", "RESOLVE"],
    story: [
      "The frame starts calm, controlled and deliberate.",
      "Heat rises through motion without losing restraint.",
      "The final silhouette holds its ground without needing noise.",
    ],
    product: "Demon Slayer Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_52_06_AM_sqylpj.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_52_06_AM_sqylpj.png",
    composition: "right",
    backgroundPosition: "center 43%",
    framePosition: "center 40%",
  },
  {
    slug: "naruto-oversized-tee",
    anime: "NARUTO",
    character: "NARUTO UZUMAKI",
    jp: "うずまき ナルト",
    impact: "ENDURE.",
    eyebrow: "NINJA WAY / WILL",
    techniqueJp: "「螺旋丸」",
    technique: "RASENGAN",
    impactLine: "THE ENERGY IS LOUD. THE DIRECTION IS ABSOLUTE.",
    statement: "BUILT AROUND MOMENTUM, WILL AND THE REFUSAL TO STOP.",
    phases: ["WILL", "MOTION", "ASCENT"],
    story: [
      "The chapter opens with raw forward momentum.",
      "Movement tightens until every detail points in one direction.",
      "What remains is persistence turned into identity.",
    ],
    product: "Naruto Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573283/ChatGPT_Image_Sep_5_2026_07_51_34_AM_e707zd.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573283/ChatGPT_Image_Sep_5_2026_07_51_34_AM_e707zd.png",
    composition: "left",
    backgroundPosition: "center 42%",
    framePosition: "center 39%",
  },
  {
    slug: "attack-on-titan-oversized-tee",
    anime: "ATTACK ON TITAN",
    character: "EREN YEAGER",
    jp: "エレン・イェーガー",
    impact: "ADVANCE.",
    eyebrow: "TITAN / FREEDOM",
    techniqueJp: "「進撃」",
    technique: "ATTACK TITAN",
    impactLine: "THE FRAME FEELS HEAVIER WHEN RETREAT IS NO LONGER AN OPTION.",
    statement: "A CHAPTER BUILT AROUND SCALE, PRESSURE AND FORWARD MOTION.",
    phases: ["PRESSURE", "BREAK", "ADVANCE"],
    story: [
      "Tension arrives before the silhouette fully settles.",
      "The composition pushes against every visible boundary.",
      "The final beat leaves only one direction: forward.",
    ],
    product: "Attack on Titan Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_51_44_AM_lv0lsa.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788573284/ChatGPT_Image_Sep_5_2026_07_51_44_AM_lv0lsa.png",
    composition: "right",
    backgroundPosition: "center 44%",
    framePosition: "center 41%",
  },
  {
    slug: "one-piece-oversized-tee",
    anime: "ONE PIECE",
    character: "MONKEY D. LUFFY",
    jp: "モンキー・D・ルフィ",
    impact: "FREEDOM.",
    eyebrow: "STRAW HAT / DAWN",
    techniqueJp: "「ギア5」",
    technique: "GEAR FIVE",
    impactLine: "THE HORIZON ONLY MATTERS IF YOU KEEP MOVING TOWARD IT.",
    statement: "A CHAPTER BUILT AROUND FREEDOM, MOMENTUM AND THE NEXT HORIZON.",
    phases: ["HORIZON", "FREEDOM", "DAWN"],
    story: [
      "The frame opens with motion pointed toward the horizon.",
      "Freedom becomes the loudest detail without overwhelming the silhouette.",
      "The final beat feels less like an ending and more like the start of the next voyage.",
    ],
    product: "One Piece Oversized Tee",
    fit: "240 GSM / OVERSIZED FIT",
    color: "WASHED BLACK",
    mainImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788685146/ChatGPT_Image_Sep_6_2026_02_58_55_PM_oefw3f.png",
    altImage:
      "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788685146/ChatGPT_Image_Sep_6_2026_02_58_55_PM_oefw3f.png",
    composition: "left",
    backgroundPosition: "center 43%",
    framePosition: "center 40%",
  },

];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const EASE = [0.16, 1, 0.3, 1];

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smootherStep = (value) => {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const CARD_CLIP =
  "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))";
const HERO_CLIP =
  "polygon(0 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%)";
const CONTENT_CLIP =
  "polygon(22px 0, 100% 0, 100% 100%, 0 100%, 0 22px)";
const MINI_CLIP =
  "polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px))";

function ButtonHoverSweep({ direction = "ltr", tone = "crimson" }) {
  const fromClass =
    direction === "rtl" ? "translate-x-[101%]" : "-translate-x-[101%]";
  const edgeClass = direction === "rtl" ? "left-0" : "right-0";
  const fillClass = tone === "ivory" ? "bg-[#F4F0E8]" : "bg-crimson";
  const edgeTone = tone === "ivory" ? "bg-crimson" : "bg-[#F4F0E8]";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 transform-gpu ${fromClass} ${fillClass} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 motion-reduce:transition-none`}
    >
      <span
        className={`absolute inset-y-0 ${edgeClass} w-[3px] ${edgeTone}`}
      />
    </span>
  );
}

function SizePicker({ chapter, alignRight = false, compact = false }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => {
      setAdded(false);
      setOpen(false);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <div className={compact ? "relative w-full" : "relative"}>
      <AnimatePresence>
        {open && !added && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={
              compact
                ? "absolute bottom-[calc(100%+8px)] left-0 z-50 grid w-[calc(200%+0.5rem)] max-w-[320px] grid-cols-5 gap-1.5 bg-[#090909] p-2 shadow-[0_16px_45px_#000]"
                : `absolute bottom-[calc(100%+9px)] z-50 flex gap-1.5 bg-[#090909] p-2.5 shadow-[0_16px_45px_#000] ${alignRight ? "right-0" : "left-0"}`
            }
            style={{ clipPath: MINI_CLIP }}
          >
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelected(size);
                  setAdded(true);
                }}
                className={`flex items-center justify-center border font-mono font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                  compact ? "h-10 min-w-0 text-[8px]" : "h-11 min-w-11 text-[9px]"
                } ${
                  selected === size
                    ? "border-crimson bg-crimson text-white"
                    : "border-[#343434] bg-[#121212] text-[#F4F0E8] hover:border-[#F4F0E8]"
                }`}
                aria-label={`Add ${chapter.product} in size ${size}`}
              >
                {size}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (!added) setOpen((value) => !value);
        }}
        aria-expanded={open}
        className={`group relative flex items-center justify-between overflow-hidden border border-[#F4F0E8] bg-[#F4F0E8] font-mono font-bold uppercase text-[#050505] transition-colors duration-300 hover:border-crimson hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
          compact
            ? "min-h-12 w-full gap-3 px-3 py-3 text-[8px] tracking-[0.12em]"
            : "min-h-[52px] min-w-[150px] gap-5 px-5 py-3.5 text-[10px] tracking-[0.16em] sm:min-w-[165px]"
        }`}
        style={{ clipPath: MINI_CLIP }}
      >
        <ButtonHoverSweep direction="ltr" tone="crimson" />
        <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none">
          {added ? `ADDED / ${selected} ✓` : "SELECT SIZE"}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open && !added ? 45 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="relative z-10 text-lg font-light leading-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none"
        >
          +
        </motion.span>
      </button>
    </div>
  );
}

function EpisodeIdentity({ chapter, alignRight = false }) {
  return (
    <div
      className={`flex items-start gap-3 ${alignRight ? "justify-end text-right" : ""}`}
    >
      {!alignRight && <span className="mt-1 h-[3px] w-9 shrink-0 bg-crimson" />}

      <div className="min-w-0">
        <p className="font-mono text-[6px] font-bold uppercase tracking-[0.24em] text-[#F4F0E8] sm:text-[7px]">
          {chapter.anime}
        </p>
        <div
          className={`mt-1 flex items-center gap-2.5 ${alignRight ? "justify-end" : ""}`}
        >
          <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.16em] text-[#9D9A93] sm:text-[8px]">
            {chapter.character}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-[12px] font-semibold leading-none text-[#F4F0E8]/70 sm:text-[13px]">
            {chapter.jp}
          </span>
        </div>
      </div>

      {alignRight && <span className="mt-1 h-[3px] w-9 shrink-0 bg-crimson" />}
    </div>
  );
}

function StoryLine({ text, label, index, progress, range, alignRight = false }) {
  const [start, enter, hold, exit] = range;
  const opacity = useTransform(progress, [start, enter, hold, exit], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, enter, hold, exit], [12, 0, 0, -9]);
  const x = useTransform(
    progress,
    [start, enter, hold, exit],
    [alignRight ? -8 : 8, 0, 0, alignRight ? 6 : -6]
  );
  const railScale = useTransform(progress, [start, enter, hold], [0.08, 0.5, 1]);

  return (
    <motion.div
      style={{ opacity, y, x }}
      className={`absolute inset-0 flex flex-col [will-change:transform,opacity] ${
        alignRight ? "items-end text-right" : "items-start"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 ${alignRight ? "flex-row-reverse" : ""}`}
      >
        <span className="font-mono text-[8px] font-bold tracking-[0.08em] text-[#F4F0E8]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[6px] font-bold uppercase tracking-[0.23em] text-crimson sm:text-[7px]">
          {label}
        </span>
        <span className="font-mono text-[5px] uppercase tracking-[0.2em] text-white/30">
          SCENE BEAT
        </span>
      </div>

      <div className={`mt-2 h-px w-full max-w-[310px] overflow-hidden bg-white/12 ${alignRight ? "ml-auto" : ""}`}>
        <motion.span
          aria-hidden="true"
          style={{ scaleX: railScale, transformOrigin: alignRight ? "right center" : "left center" }}
          className="block h-full w-full bg-crimson"
        />
      </div>

      <p className="mt-2.5 max-w-[360px] text-[11px] font-medium leading-[1.55] text-[#D8D3C9] sm:text-[12px]">
        {text}
      </p>
    </motion.div>
  );
}

function StoryFocus({ chapter, progress, reduceMotion, alignRight = false }) {
  const ranges = [
    [0.0, 0.1, 0.29, 0.38],
    [0.28, 0.38, 0.58, 0.67],
    [0.57, 0.67, 0.92, 1.0],
  ];

  if (reduceMotion) {
    return (
      <div className={alignRight ? "text-right" : ""}>
        <div
          className={`flex items-center gap-2.5 ${alignRight ? "justify-end flex-row-reverse" : ""}`}
        >
          <span className="font-mono text-[8px] font-bold text-[#F4F0E8]">01</span>
          <span className="font-mono text-[6px] font-bold uppercase tracking-[0.23em] text-crimson">
            {chapter.phases[0]}
          </span>
          <span className="font-mono text-[5px] uppercase tracking-[0.2em] text-white/30">
            SCENE BEAT
          </span>
        </div>
        <div className={`mt-2 h-px w-full max-w-[310px] bg-crimson ${alignRight ? "ml-auto" : ""}`} />
        <p className={`mt-2.5 max-w-[360px] text-[11px] font-medium leading-[1.55] text-[#D8D3C9] ${alignRight ? "ml-auto" : ""}`}>
          {chapter.story[0]}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative h-[82px] max-w-[390px] sm:h-[86px] ${alignRight ? "ml-auto" : ""}`}>
      {chapter.story.map((text, index) => (
        <StoryLine
          key={text}
          text={text}
          label={chapter.phases[index]}
          index={index}
          progress={progress}
          range={ranges[index]}
          alignRight={alignRight}
        />
      ))}
    </div>
  );
}

function HeroFrame({ chapter, artProgress, reduceMotion }) {
  const [showAlt, setShowAlt] = useState(false);
  const isRight = chapter.composition === "right";
  const hasAlt = Boolean(chapter.altImage && chapter.altImage !== chapter.mainImage);

  const frameOpacity = useTransform(artProgress, [0, 0.12, 0.36], [0, 0.86, 1]);
  const frameScale = useTransform(artProgress, [0, 0.52, 1], [1.055, 1.014, 1]);
  const frameX = useTransform(
    artProgress,
    [0, 0.44, 1],
    [isRight ? 38 : -38, isRight ? 8 : -8, 0]
  );
  const frameY = useTransform(artProgress, [0, 0.5, 1], [14, 4, 0]);
  const veilX = useTransform(
    artProgress,
    [0.02, 0.46],
    ["0%", isRight ? "108%" : "-108%"]
  );
  const markScale = useTransform(artProgress, [0.16, 0.56], [0, 1]);

  return (
    <button
      type="button"
      onPointerEnter={(event) => {
        if (hasAlt && event.pointerType === "mouse") setShowAlt(true);
      }}
      onPointerLeave={() => setShowAlt(false)}
      onPointerUp={(event) => {
        if (hasAlt && event.pointerType !== "mouse") setShowAlt((value) => !value);
      }}
      onClick={(event) => {
        if (hasAlt && event.detail === 0) setShowAlt((value) => !value);
      }}
      aria-label={
        hasAlt
          ? `${chapter.anime}: ${showAlt ? "show main" : "show alternate"} artwork`
          : `${chapter.anime} artwork`
      }
      aria-pressed={hasAlt ? showAlt : undefined}
      className={`absolute z-10 overflow-hidden bg-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-inset
        left-[22%] top-[12%] h-[49%] w-[74%]
        sm:top-[9%] sm:h-[68%] sm:w-[55%]
        md:top-[8%] md:h-[82%] md:w-[48%]
        ${isRight ? "sm:right-[3.5%] sm:left-auto" : "sm:left-[3.5%] sm:right-auto"}`}
      style={{ clipPath: HERO_CLIP }}
    >
      <motion.div
        className="absolute inset-0 [will-change:transform,opacity]"
        style={
          reduceMotion
            ? undefined
            : {
                opacity: frameOpacity,
                scale: frameScale,
                x: frameX,
                y: frameY,
              }
        }
      >
        <motion.img
          src={chapter.mainImage}
          alt={`${chapter.anime} ${chapter.character}`}
          draggable={false}
          decoding="async"
          loading="eager"
          className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform,opacity]"
          style={{ objectPosition: chapter.framePosition }}
          animate={{ opacity: showAlt ? 0 : 1, scale: showAlt ? 1.02 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.46, ease: EASE }}
        />
        {hasAlt && (
          <motion.img
            src={chapter.altImage}
            alt={`${chapter.anime} alternate ${chapter.character} artwork`}
            draggable={false}
            decoding="async"
            loading="eager"
            className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform,opacity]"
            style={{ objectPosition: chapter.framePosition }}
            animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, ease: EASE }}
          />
        )}
      </motion.div>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[#050505] [will-change:transform]"
          style={{ x: veilX }}
        />
      )}

      <motion.span
        aria-hidden="true"
        style={reduceMotion ? undefined : { scaleX: markScale }}
        className="pointer-events-none absolute left-0 top-0 z-30 h-[5px] w-[28%] origin-left bg-crimson"
      />
      <span className="pointer-events-none absolute bottom-0 right-0 z-30 h-[5px] w-[20%] bg-[#F4F0E8]" />

      {hasAlt && (
        <span
          className="pointer-events-none absolute bottom-4 right-4 z-30 bg-[#050505] px-3 py-2 font-mono text-[6px] font-semibold uppercase tracking-[0.2em] text-[#F4F0E8]"
          style={{ clipPath: MINI_CLIP }}
        >
          <span className="hidden sm:inline">HOVER / ALT</span>
          <span className="sm:hidden">TAP / ALT</span>
        </span>
      )}
    </button>
  );
}


function MobileStoryLine({ text, label, progress, range }) {
  const [start, enter, hold, exit] = range;
  const opacity = useTransform(progress, [start, enter, hold, exit], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, enter, hold, exit], [8, 0, 0, -6]);
  const lineScale = useTransform(progress, [start, enter, hold], [0.15, 0.65, 1]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 [will-change:transform,opacity]"
    >
      <div className="flex items-center gap-2.5">
        <motion.span
          aria-hidden="true"
          style={{ scaleX: lineScale }}
          className="h-[2px] w-7 origin-left bg-crimson"
        />
        <span className="font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-crimson">
          {label}
        </span>
      </div>
      <p className="mt-1.5 max-w-[300px] text-[10px] font-medium leading-[1.45] text-[#CFCAC1]">
        {text}
      </p>
    </motion.div>
  );
}

// MOBILE STORY — NO NUMBERS: the episode beat changes with scroll but stays editorial.
function MobileStoryFocus({ chapter, progress, reduceMotion }) {
  const ranges = [
    [0.0, 0.1, 0.29, 0.38],
    [0.28, 0.38, 0.58, 0.67],
    [0.57, 0.67, 0.92, 1.0],
  ];

  if (reduceMotion) {
    return (
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-[2px] w-7 bg-crimson" />
          <span className="font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-crimson">
            {chapter.phases[0]}
          </span>
        </div>
        <p className="mt-1.5 max-w-[300px] text-[10px] font-medium leading-[1.45] text-[#CFCAC1]">
          {chapter.story[0]}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[48px] max-w-[320px]">
      {chapter.story.map((text, index) => (
        <MobileStoryLine
          key={text}
          text={text}
          label={chapter.phases[index]}
          progress={progress}
          range={ranges[index]}
        />
      ))}
    </div>
  );
}

function MobileArtFrame({ chapter, artProgress, reduceMotion }) {
  const [showAlt, setShowAlt] = useState(false);
  const hasAlt = Boolean(chapter.altImage && chapter.altImage !== chapter.mainImage);
  const frameOpacity = useTransform(artProgress, [0, 0.1, 0.34], [0.35, 0.9, 1]);
  const frameScale = useTransform(artProgress, [0, 0.55, 1], [1.06, 1.025, 1.01]);
  const frameY = useTransform(artProgress, [0, 1], [10, 0]);
  const veilX = useTransform(artProgress, [0.02, 0.46], ["0%", "108%"]);

  return (
    <button
      type="button"
      onPointerUp={(event) => {
        if (hasAlt && event.pointerType !== "mouse") setShowAlt((value) => !value);
      }}
      onClick={(event) => {
        if (hasAlt && event.detail === 0) setShowAlt((value) => !value);
      }}
      aria-label={
        hasAlt
          ? `${chapter.anime}: ${showAlt ? "show main" : "show alternate"} artwork`
          : `${chapter.anime} artwork`
      }
      aria-pressed={hasAlt ? showAlt : undefined}
      className="absolute inset-x-0 top-0 h-[45%] overflow-hidden bg-[#090909] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson"
    >
      <motion.div
        className="absolute inset-0 [will-change:transform,opacity]"
        style={
          reduceMotion
            ? undefined
            : { opacity: frameOpacity, scale: frameScale, y: frameY }
        }
      >
        <motion.img
          src={chapter.mainImage}
          alt={`${chapter.anime} ${chapter.character}`}
          draggable={false}
          decoding="async"
          loading="eager"
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={{ objectPosition: chapter.backgroundPosition }}
          animate={{ opacity: showAlt ? 0 : 1, scale: showAlt ? 1.025 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
        />
        {hasAlt && (
          <motion.img
            src={chapter.altImage}
            alt={`${chapter.anime} alternate ${chapter.character} artwork`}
            draggable={false}
            decoding="async"
            loading="eager"
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{ objectPosition: chapter.framePosition }}
            animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
          />
        )}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[#050505]/[0.18]" />
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[#050505]"
          style={{ x: veilX }}
        />
      )}

      <span className="pointer-events-none absolute left-0 top-0 z-30 h-full w-[4px] bg-crimson" />
      <span className="pointer-events-none absolute right-0 top-0 z-30 h-[4px] w-[22%] bg-[#F4F0E8]" />

      <span className="pointer-events-none absolute bottom-4 left-5 z-30 text-[clamp(1.6rem,9vw,2.8rem)] font-black leading-none tracking-[-0.06em] text-[#F4F0E8]/75">
        {chapter.jp}
      </span>
      {hasAlt && (
        <span
          className="pointer-events-none absolute right-4 top-4 z-30 bg-[#050505] px-2.5 py-2 font-mono text-[5px] font-bold uppercase tracking-[0.2em] text-[#F4F0E8]"
          style={{ clipPath: MINI_CLIP }}
        >
          TAP / ALT
        </span>
      )}
    </button>
  );
}

function MobileContentActions({ chapter, reduceMotion }) {
  return (
    <div className="border-t border-white/[0.11] pt-2.5">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.035em] text-[#F4F0E8]">
            {chapter.product}
          </p>
          <p className="mt-1 font-mono text-[5px] font-semibold uppercase tracking-[0.17em] text-[#858585]">
            {chapter.fit} / {chapter.color}
          </p>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <SizePicker chapter={chapter} compact />
        <Link
          to={`/product/${chapter.slug}`}
          className="group relative inline-flex min-h-12 w-full items-center justify-between gap-3 overflow-hidden bg-crimson px-3 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          style={{ clipPath: MINI_CLIP }}
        >
          <ButtonHoverSweep direction="rtl" tone="ivory" />
          <span className="relative z-10">VIEW DROP</span>
          <motion.span
            aria-hidden="true"
            className="relative z-10 inline-flex"
            whileTap={reduceMotion ? undefined : { x: 2, y: -2 }}
            transition={{ duration: 0.16, ease: EASE }}
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} strokeWidth={1.8} />
          </motion.span>
        </Link>
      </div>
    </div>
  );
}

function MobileChapterLayout({
  chapter,
  artProgress,
  contentProgress,
  storyProgress,
  reduceMotion,
  contentAlwaysVisible = false,
}) {
  const contentIsStatic = reduceMotion || contentAlwaysVisible;
  const identityOpacity = useTransform(contentProgress, [0, 0.2], [0, 1]);
  const identityY = useTransform(contentProgress, [0, 0.2], [7, 0]);
  const titleOpacity = useTransform(contentProgress, [0.03, 0.3], [0, 1]);
  const titleY = useTransform(contentProgress, [0.03, 0.3], [14, 0]);
  const copyOpacity = useTransform(contentProgress, [0.11, 0.42], [0, 1]);
  const copyY = useTransform(contentProgress, [0.11, 0.42], [8, 0]);
  const actionOpacity = useTransform(contentProgress, [0.16, 0.5], [0, 1]);
  const actionY = useTransform(contentProgress, [0.16, 0.5], [8, 0]);

  return (
    <div className="absolute inset-0 md:hidden">
      <MobileArtFrame
        chapter={chapter}
        artProgress={artProgress}
        reduceMotion={reduceMotion}
      />

      <div className="absolute inset-x-0 bottom-0 top-[45%] bg-[#070707] px-5 pb-4 pt-[3.25rem]">
        <motion.div
          style={contentIsStatic ? undefined : { opacity: identityOpacity, y: identityY }}
          className="flex items-center justify-between gap-3 [will-change:transform,opacity]"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="h-[2px] w-6 shrink-0 bg-crimson" />
              <p className="truncate font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-[#F4F0E8]">
                {chapter.anime}
              </p>
            </div>
            <p className="mt-1.5 pl-[34px] font-mono text-[6px] font-semibold uppercase tracking-[0.16em] text-[#858585]">
              {chapter.character}
            </p>
          </div>
          <span className="shrink-0 text-[12px] font-semibold text-[#F4F0E8]/60">
            {chapter.jp}
          </span>
        </motion.div>

        <motion.div
          style={contentIsStatic ? undefined : { opacity: copyOpacity, y: copyY }}
          className="mt-3 [will-change:transform,opacity]"
        >
          <div className="flex items-end gap-2.5">
            <span className="text-[13px] font-semibold leading-none text-crimson">
              {chapter.techniqueJp}
            </span>
            <span className="font-mono text-[5px] font-bold uppercase tracking-[0.2em] text-[#B9B5AC]">
              {chapter.technique}
            </span>
          </div>

          <p className="mt-2 max-w-[330px] text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.012em] text-[#F4F0E8]">
            {chapter.impactLine}
          </p>

          <div className="mt-2.5">
            <MobileStoryFocus
              chapter={chapter}
              progress={storyProgress}
              reduceMotion={reduceMotion}
            />
          </div>
        </motion.div>

        <motion.div
          style={contentIsStatic ? undefined : { opacity: actionOpacity, y: actionY }}
          className="absolute inset-x-5 bottom-4 [will-change:transform,opacity]"
        >
          <MobileContentActions chapter={chapter} reduceMotion={reduceMotion} />
        </motion.div>
      </div>

      {/* MOBILE EPISODE TITLE — bridges artwork and editorial panel. */}
      <motion.div
        style={contentIsStatic ? undefined : { opacity: titleOpacity, y: titleY }}
        className="pointer-events-none absolute left-5 right-5 top-[39.5%] z-30 [will-change:transform,opacity]"
      >
        <h3 className="display-tight text-[clamp(2.75rem,14.5vw,4.3rem)] font-semibold uppercase leading-[0.72] tracking-[-0.075em] text-[#F4F0E8] [text-shadow:0_8px_28px_#000]">
          {chapter.impact}
        </h3>
      </motion.div>
    </div>
  );
}

function ContentActions({ chapter, reduceMotion, alignRight = false }) {
  return (
    <div
      className={`mt-auto border-t border-white/[0.14] pt-4 ${
        alignRight ? "md:ml-auto md:text-right" : ""
      }`}
    >
      <div className={alignRight ? "md:ml-auto" : ""}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.035em] text-[#F4F0E8] sm:text-[13px]">
          {chapter.product}
        </p>
        <div
          className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 ${
            alignRight ? "md:justify-end" : ""
          }`}
        >
          <span className="font-mono text-[6px] font-semibold uppercase tracking-[0.18em] text-[#B7B7B7] sm:text-[7px]">
            {chapter.fit}
          </span>
          <span className="hidden h-3 w-px bg-[#444444] sm:block" />
          <span className="font-mono text-[6px] font-semibold uppercase tracking-[0.18em] text-[#858585] sm:text-[7px]">
            {chapter.color}
          </span>
        </div>
      </div>

      <div
        className={`mt-4 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:flex-col lg:flex-row ${
          alignRight ? "md:items-end md:justify-end" : "md:items-start"
        }`}
      >
        <SizePicker chapter={chapter} alignRight={alignRight} />

        <Link
          to={`/product/${chapter.slug}`}
          className="group relative inline-flex min-h-[52px] min-w-[160px] items-center justify-between gap-6 overflow-hidden bg-crimson px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:min-w-[174px] sm:px-6"
          style={{ clipPath: MINI_CLIP }}
        >
          <ButtonHoverSweep direction="rtl" tone="ivory" />
          <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1 motion-reduce:transition-none">
            VIEW DROP
          </span>
          <motion.span
            aria-hidden="true"
            className="relative z-10 inline-flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
            whileHover={reduceMotion ? undefined : { x: -2, y: -2 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={17} strokeWidth={1.8} />
          </motion.span>
        </Link>
      </div>
    </div>
  );
}

function ChapterCard({
  chapter,
  artProgress,
  contentProgress,
  storyProgress,
  cardStyle,
  reduceMotion,
  teaser = false,
  contentAlwaysVisible = false,
}) {
  const isRight = chapter.composition === "right";
  const alignRight = !isRight;

  const backgroundScale = useTransform(artProgress, [0, 1], [1.04, 1.012]);
  const backgroundX = useTransform(artProgress, [0, 1], [isRight ? -8 : 8, 0]);
  const backgroundY = useTransform(artProgress, [0, 1], [4, 0]);

  const metaOpacity = useTransform(contentProgress, [0, 0.22], [0, 1]);
  const metaY = useTransform(contentProgress, [0, 0.22], [7, 0]);
  const titleOpacity = useTransform(contentProgress, [0.04, 0.32], [0, 1]);
  const titleY = useTransform(contentProgress, [0.04, 0.32], [14, 0]);
  const copyOpacity = useTransform(contentProgress, [0.12, 0.42], [0, 1]);
  const copyY = useTransform(contentProgress, [0.12, 0.42], [8, 0]);
  const actionOpacity = useTransform(contentProgress, [0.18, 0.5], [0, 1]);
  const actionY = useTransform(contentProgress, [0.18, 0.5], [8, 0]);
  const jpOpacity = useTransform(artProgress, [0.08, 0.55], [0, 0.12]);
  const panelOpacity = useTransform(contentProgress, [0, 0.36], [0.58, 0.8]);

  const contentIsStatic = reduceMotion || contentAlwaysVisible;

  return (
    <motion.article
      style={{
        ...cardStyle,
        clipPath: CARD_CLIP,
        willChange: "transform, opacity",
      }}
      className="absolute inset-0 overflow-hidden bg-[#050505] shadow-[0_30px_90px_#000]"
    >
      <MobileChapterLayout
        chapter={chapter}
        artProgress={artProgress}
        contentProgress={contentProgress}
        storyProgress={storyProgress}
        reduceMotion={reduceMotion}
        contentAlwaysVisible={contentAlwaysVisible}
      />

      {/* DESKTOP / TABLET COMPOSITION — intentionally unchanged. */}
      <div className="hidden h-full md:block">
        <motion.img
          src={chapter.mainImage}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          loading="eager"
          className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform]"
          style={{
            objectPosition: chapter.backgroundPosition,
            scale: reduceMotion ? 1.02 : backgroundScale,
            x: reduceMotion ? 0 : backgroundX,
            y: reduceMotion ? 0 : backgroundY,
            filter: "brightness(0.56) saturate(0.9) contrast(1.06)",
          }}
        />

        <div className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-[4px] bg-crimson" />
        <div className="pointer-events-none absolute right-0 top-0 z-[2] h-[5px] w-[16%] bg-[#F4F0E8]" />

        <motion.span
          aria-hidden="true"
          style={reduceMotion ? { opacity: 0.12 } : { opacity: jpOpacity }}
          className={`pointer-events-none absolute top-[5%] z-[3] hidden select-none font-black text-[clamp(5rem,9vw,9rem)] leading-none tracking-[-0.12em] text-[#F4F0E8] md:block ${
            isRight ? "right-[1%]" : "left-[1%]"
          }`}
        >
          {chapter.jp}
        </motion.span>

        <HeroFrame
          chapter={chapter}
          artProgress={artProgress}
          reduceMotion={reduceMotion}
        />

        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[5%] top-[6%] z-[8] bg-[#050505] ${
            isRight
              ? "left-3 w-[61%] sm:left-[4%] sm:w-[48%] md:left-[4%] md:w-[44%]"
              : "right-3 w-[61%] sm:right-[4%] sm:w-[48%] md:right-[4%] md:w-[44%]"
          }`}
          style={{
            opacity: contentIsStatic ? 0.8 : panelOpacity,
            clipPath: CONTENT_CLIP,
          }}
        />

        <div
          className={`absolute bottom-[8%] top-[9%] z-20 flex w-[54%] flex-col sm:bottom-[9%] sm:top-[10%] sm:w-[43%] md:w-[40%] ${
            isRight
              ? "left-5 sm:left-[6%]"
              : "right-5 text-right sm:right-[6%]"
          }`}
        >
          <motion.div
            style={contentIsStatic ? undefined : { opacity: metaOpacity, y: metaY }}
            className="[will-change:transform,opacity]"
          >
            <EpisodeIdentity chapter={chapter} alignRight={alignRight} />
          </motion.div>

          <motion.div
            style={contentIsStatic ? undefined : { opacity: titleOpacity, y: titleY }}
            className="[will-change:transform,opacity]"
          >
            <h3 className="display-tight mt-4 text-[clamp(2.55rem,5.7vw,5.85rem)] font-semibold uppercase leading-[0.76] tracking-[-0.072em] text-[#F4F0E8] sm:mt-5">
              {chapter.impact}
            </h3>
          </motion.div>

          <motion.div
            style={contentIsStatic ? undefined : { opacity: copyOpacity, y: copyY }}
            className="relative mt-4 [will-change:transform,opacity] sm:mt-5"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -top-3 select-none text-[clamp(2.6rem,4.8vw,4.6rem)] font-black leading-none tracking-[-0.08em] text-white/[0.035] ${
                alignRight ? "right-0" : "left-0"
              }`}
            >
              {chapter.techniqueJp}
            </span>

            <div className={`relative z-10 ${alignRight ? "text-right" : ""}`}>
              <div
                className={`flex items-end gap-2.5 ${alignRight ? "justify-end" : ""}`}
              >
                <span className="text-[15px] font-semibold leading-none text-crimson sm:text-base">
                  {chapter.techniqueJp}
                </span>
                <span className="font-mono text-[6px] font-bold uppercase tracking-[0.22em] text-[#B9B5AC] sm:text-[7px]">
                  {chapter.technique}
                </span>
              </div>

              <p
                className={`mt-3 max-w-[390px] text-[13px] font-semibold uppercase leading-[1.25] tracking-[0.015em] text-[#F4F0E8] sm:text-[14px] ${
                  alignRight ? "ml-auto" : ""
                }`}
              >
                {chapter.impactLine}
              </p>

              <div className="mt-4 sm:mt-5">
                <StoryFocus
                  chapter={chapter}
                  progress={storyProgress}
                  reduceMotion={reduceMotion}
                  alignRight={alignRight}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            style={contentIsStatic ? undefined : { opacity: actionOpacity, y: actionY }}
            className="mt-auto [will-change:transform,opacity]"
          >
            <ContentActions
              chapter={chapter}
              reduceMotion={reduceMotion}
              alignRight={alignRight}
            />
          </motion.div>
        </div>

        {teaser && (
          <div className="pointer-events-none absolute left-6 top-3 z-40 flex items-center gap-3 sm:left-8">
            <span className="h-[3px] w-6 bg-crimson" />
            <span className="font-mono text-[6px] font-semibold uppercase tracking-[0.22em] text-[#F4F0E8]">
              NEXT CHAPTER / {chapter.anime}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function StackedChapter({
  chapter,
  index,
  total,
  progress,
  reduceMotion,
}) {
  const isFirst = index === 0;
  const segment = 1 / Math.max(total - 1, 1);

  const enterStart = isFirst ? 0 : Math.max(0, (index - 1) * segment);
  const enterEnd = isFirst ? segment * 0.22 : Math.min(1, index * segment);
  const nextStart = Math.min(1, index * segment);
  const nextEnd = Math.min(1, (index + 1) * segment);

  const y = useTransform(
    progress,
    isFirst ? [0, 1] : [enterStart, enterEnd],
    isFirst ? [0, 0] : ["calc(100% - 34px)", "0%"],
  );

  const scale = useTransform(
    progress,
    index === total - 1
      ? [0, 1]
      : [nextStart, Math.max(nextStart + 0.0001, nextEnd)],
    index === total - 1 ? [1, 1] : [1, 0.982],
  );

  const opacity = useTransform(
    progress,
    index === total - 1
      ? [0, 1]
      : [nextStart, Math.max(nextStart + 0.0001, nextEnd)],
    index === total - 1 ? [1, 1] : [1, 0.9],
  );

  const contentStart = isFirst ? 0 : enterStart + segment * 0.08;
  const contentEnd = isFirst
    ? Math.min(1, segment * 0.34)
    : Math.min(1, enterStart + segment * 0.48);

  const artStart = isFirst
    ? Math.min(1, segment * 0.1)
    : Math.min(1, enterStart + segment * 0.28);
  const artEnd = isFirst
    ? Math.min(1, segment * 0.72)
    : Math.min(1, enterStart + segment * 0.86);

  const storyStart = isFirst
    ? Math.min(1, segment * 0.18)
    : Math.min(1, enterStart + segment * 0.38);
  const storyEnd = Math.min(
    1,
    isFirst ? segment * 0.94 : enterEnd + segment * 0.18,
  );

  const contentRaw = useTransform(progress, [contentStart, contentEnd], [0, 1]);
  const artRaw = useTransform(progress, [artStart, artEnd], [0, 1]);
  const storyRaw = useTransform(progress, [storyStart, storyEnd], [0, 1]);

  const contentProgress = useTransform(contentRaw, smootherStep);
  const artProgress = useTransform(artRaw, smootherStep);
  const storyProgress = useTransform(storyRaw, smootherStep);

  const cardStyle = reduceMotion
    ? { zIndex: 10 + index, y: 0 }
    : {
        zIndex: 10 + index,
        y,
        scale,
        opacity,
        transformOrigin: isFirst ? "50% 18%" : "50% 100%",
      };

  return (
    <ChapterCard
      chapter={chapter}
      artProgress={artProgress}
      contentProgress={contentProgress}
      storyProgress={storyProgress}
      cardStyle={cardStyle}
      reduceMotion={reduceMotion}
      teaser={!isFirst}
      contentAlwaysVisible={isFirst}
    />
  );
}

export default function LatestDrops() {
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sources = new Set();

    chapters.forEach((chapter) => {
      [chapter.mainImage, chapter.altImage].filter(Boolean).forEach((src) => {
        if (sources.has(src)) return;
        sources.add(src);

        const image = new Image();
        image.src = src;
      });
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 112,
    damping: 29,
    mass: 0.58,
    restDelta: 0.0004,
    restSpeed: 0.0004,
  });

  const stackHeight = `${115 + chapters.length * 58}vh`;
  const stackHeightDesktop = `${105 + chapters.length * 50}vh`;

  return (
    <section className="relative overflow-x-clip border-b border-line bg-[#050505] pb-14 pt-7 text-[#F4F0E8] md:pb-20 md:pt-9">
      <div className="site-container">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.58, ease: EASE }}
          className="mx-auto mb-4 max-w-[1380px] md:mb-5 md:w-[86vw]"
        >
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-9 bg-crimson" />
            <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.26em] text-[#8F8F8F]">
              ZENJI / LATEST DROP
            </p>
          </div>

          <h2 className="display-tight mt-2 whitespace-nowrap text-[clamp(2rem,4.7vw,4.55rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em]">
            NEXT CHAPTER<span className="text-crimson">.</span>
          </h2>
        </motion.header>
      </div>

      {reduceMotion ? (
        <div
          ref={trackRef}
          className="mx-auto w-[calc(100%_-_1.25rem)] max-w-[1380px] space-y-6 md:w-[86vw]"
        >
          {chapters.map((chapter, index) => (
            <div
              key={chapter.slug}
              className="relative h-[78svh] min-h-[540px] max-h-[620px] md:h-[58svh] md:min-h-[500px] md:max-h-[610px]"
            >
              <ChapterCard
                chapter={chapter}
                artProgress={scrollYProgress}
                contentProgress={scrollYProgress}
                storyProgress={scrollYProgress}
                cardStyle={{ zIndex: 10 + index }}
                reduceMotion
                contentAlwaysVisible
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="relative h-[var(--stack-h)] md:h-[var(--stack-h-md)]"
          style={{
            "--stack-h": stackHeight,
            "--stack-h-md": stackHeightDesktop,
          }}
        >
          <div className="sticky top-[11svh] mx-auto h-[78svh] min-h-[540px] max-h-[620px] w-[calc(100%_-_1.25rem)] max-w-[1380px] md:top-[17svh] md:h-[58svh] md:min-h-[500px] md:max-h-[610px] md:w-[86vw]">
            {chapters.map((chapter, index) => (
              <StackedChapter
                key={chapter.slug}
                chapter={chapter}
                index={index}
                total={chapters.length}
                progress={smoothProgress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      )}

      <div className="site-container">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between border-t border-[#252525] pt-5 md:w-[86vw]">
          <p className="font-mono text-[6px] uppercase tracking-[0.22em] text-[#696969]">
            {chapters.length} STORIES / ONE DROP
          </p>

          <Link
            to="/drops"
            className="group inline-flex items-center gap-3 font-mono text-[7px] font-semibold uppercase tracking-[0.2em] text-[#F4F0E8] transition-colors hover:text-crimson"
          >
            OPEN ARCHIVE
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={13}
              strokeWidth={1.7}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
