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
import { useCart } from "../../context/CartContext.jsx";
import { products } from "../../data/products.js";

const chapters = [
  {
    slug: "sukuna-shibuya-acidwash-tee",
    anime: "JUJUTSU KAISEN",
    character: "RYOMEN SUKUNA",
    jp: "両面 宿儺",
    impact: "DISMANTLE.",
    eyebrow: "SHIBUYA CROSSING / KING OF CURSES",
    techniqueJp: "「伏魔御廚子」",
    technique: "MALEVOLENT SHRINE",
    impactLine: "AT THE SHIBUYA 109 CROSSING, HE REWRITES THE STREETS.",
    statement: "HEAVYWEIGHT MINERAL-WASHED COTTON HONORS THE DISASTER CURSE.",
    phases: ["MINERAL WASH", "CURSED SEAL", "DESTRUCTION"],
    story: [
      "Custom 260 GSM acid-washed mineral cotton gives each piece a distinct, weathered texture.",
      "Blood-crimson cursed domain seals screenprinted across the back shoulder blade.",
      "Heavy drop-shoulder silhouette cut for late-night Tokyo street presence.",
    ],
    product: "Sukuna Acid-Wash Shibuya Tee",
    fit: "260 GSM / ACID-WASH OVERSIZED",
    color: "MINERAL GREY",
    mainImage:
      "/t-shirt/Jujutsu Kaisen/JJK-TS-002-sukuna-acidwash-shibuya.png",
    altImage:
      "/t-shirt/Jujutsu Kaisen/JJK-TS-003-sukuna-lookbook-grid.png",
    composition: "right",
    backgroundPosition: "center 42%",
    framePosition: "center 38%",
    mobilePosition: "center 38%",
  },
  {
    slug: "blue-flame-oversized-tee",
    anime: "DEMON SLAYER",
    character: "KYOJURO RENGOKU",
    jp: "煉獄 杏寿郎",
    impact: "SET YOUR HEART ABLAZE.",
    eyebrow: "FLAME HASHIRA / NINTH FORM",
    techniqueJp: "「心を燃やせ」",
    technique: "PURGATORY FLAME",
    impactLine: "STAND TALL AND SET YOUR HEART ABLAZE.",
    statement: "A MONUMENTAL HEAVYWEIGHT TEE DEDICATED TO THE FLAME HASHIRA.",
    phases: ["HEAT", "BLAZE", "PURGATORY"],
    story: [
      "250 GSM combed cotton base with flame gradient calligraphy across the back.",
      "Minimal chest flame insignia balanced with massive rear typographic print.",
      "Pre-shrunk boxy cut designed for effortless Tokyo street layering.",
    ],
    product: "Flame Hashira Oversized Tee",
    fit: "250 GSM / BOX FIT",
    color: "WASHED BLACK",
    mainImage:
      "/t-shirt/Demon Slayer/DS-TS-001-rengoku-flame-hashira.png",
    altImage:
      "/t-shirt/Demon Slayer/DS-TS-002-squad-four-elements.png",
    composition: "left",
    backgroundPosition: "center 43%",
    framePosition: "center 40%",
    mobilePosition: "center 40%",
  },
  {
    slug: "fourth-hokage-legacy-tee",
    anime: "NARUTO",
    character: "MINATO & NARUTO",
    jp: "四代目 火影",
    impact: "YELLOW FLASH.",
    eyebrow: "WILL OF FIRE / HOKAGE LEGACY",
    techniqueJp: "「飛雷神の術」",
    technique: "FLYING THUNDER GOD",
    impactLine: "FROM FATHER TO SON, THE WILL OF FIRE NEVER EXTINGUISHES.",
    statement: "HONORING THE FOURTH HOKAGE STANDING TALL OVER THE HIDDEN LEAF.",
    phases: ["FLASH", "HERITAGE", "FIRE"],
    story: [
      "Red Konoha crest embroidered cleanly at the left chest.",
      "Monumental back portrait of Minato Namikaze protecting young Naruto.",
      "250 GSM ringspun cotton with soft-touch crack-resistant ink.",
    ],
    product: "Fourth Hokage Legacy Oversized Tee",
    fit: "250 GSM / RELAXED FIT",
    color: "OBSIDIAN BLACK",
    mainImage:
      "/t-shirt/Naruto/NAR-TS-001-naruto-minato-hokage.png",
    altImage:
      "/t-shirt/Naruto/NAR-TS-001-naruto-minato-hokage.png",
    composition: "right",
    backgroundPosition: "center 42%",
    framePosition: "center 39%",
    mobilePosition: "center 39%",
  },
  {
    slug: "luffy-straw-hat-heavy-tee",
    anime: "ONE PIECE",
    character: "MONKEY D. LUFFY",
    jp: "モンキー・D・ルフィ",
    impact: "KING OF THE PIRATES.",
    eyebrow: "STRAW HAT CREW / NEW ERA",
    techniqueJp: "「海賊王」",
    technique: "STRAW HAT RESOLVE",
    impactLine: "THE HORIZON ONLY MATTERS IF YOU KEEP MOVING TOWARD IT.",
    statement: "THE DEFINITIVE STRAW HAT STREETWEAR UNIFORM WITH MONUMENTAL BACK ART.",
    phases: ["DAWN", "CREW", "FREEDOM"],
    story: [
      "Iconic visual of Luffy pulling down the Straw Hat rendered in high contrast.",
      "Front minimal Japanese Katakana branding with expansive back composition.",
      "250 GSM heavy jersey engineered to withstand daily city wear.",
    ],
    product: "Luffy Straw Hat Heavyweight Tee",
    fit: "250 GSM / OVERSIZED FIT",
    color: "VINTAGE BLACK",
    mainImage:
      "/t-shirt/One Piece/OP-TS-003-luffy-straw-hat.png",
    altImage:
      "/t-shirt/One Piece/OP-TS-001-luffy-manga-panels.png",
    composition: "left",
    backgroundPosition: "center 43%",
    framePosition: "center 40%",
    mobilePosition: "center 42%",
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
  const { addToCart } = useCart();
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

  const matchedProduct = products.find((p) => p.slug === chapter.slug);
  const unavailable = !matchedProduct;

  const handleSelectSize = (size) => {
    if (!matchedProduct) return;

    setSelected(size);
    setAdded(true);
    addToCart({
        id: matchedProduct.id,
        slug: matchedProduct.slug,
        name: matchedProduct.name,
        price: matchedProduct.price,
        size,
        color: matchedProduct.colors?.[0] || chapter.color,
        image: chapter.mainImage || matchedProduct.images?.[0],
        quantity: 1,
      });
  };

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
                onClick={() => handleSelectSize(size)}
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
          if (!added && !unavailable) setOpen((value) => !value);
        }}
        disabled={unavailable}
        aria-disabled={unavailable}
        aria-expanded={unavailable ? false : open}
        className={`group relative flex items-center justify-between overflow-hidden border border-[#F4F0E8] bg-[#F4F0E8] font-mono font-bold uppercase text-[#050505] transition-colors duration-300 hover:border-crimson hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:cursor-not-allowed disabled:border-[#343434] disabled:bg-[#171717] disabled:text-[#666] disabled:hover:border-[#343434] disabled:hover:text-[#666] ${
          compact
            ? "min-h-12 w-full gap-3 px-3 py-3 text-[8px] tracking-[0.12em]"
            : "min-h-[52px] min-w-[150px] gap-5 px-5 py-3.5 text-[10px] tracking-[0.16em] sm:min-w-[165px]"
        }`}
        style={{ clipPath: MINI_CLIP }}
      >
        <ButtonHoverSweep direction="ltr" tone="crimson" />
        <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none">
          {unavailable ? "UNAVAILABLE" : added ? `ADDED / ${selected} ✓` : "SELECT SIZE"}
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
      className={`flex items-center gap-3 ${alignRight ? "justify-end text-right" : ""}`}
    >
      {!alignRight && <span className="h-[3px] w-9 shrink-0 bg-crimson" />}

      <div
        className={`flex min-w-0 items-center gap-3 ${alignRight ? "flex-row-reverse" : ""}`}
      >
        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#F4F0E8] sm:text-[8px]">
          {chapter.anime}
        </p>
        <span className="h-3 w-px shrink-0 bg-white/15" />
        <span className="shrink-0 text-[12px] font-semibold leading-none text-[#F4F0E8]/65 sm:text-[13px]">
          {chapter.jp}
        </span>
      </div>

      {alignRight && <span className="h-[3px] w-9 shrink-0 bg-crimson" />}
    </div>
  );
}

function StoryLine({ text, progress, range, alignRight = false }) {
  const [start, enter, hold, exit] = range;
  const opacity = useTransform(progress, [start, enter, hold, exit], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, enter, hold, exit], [10, 0, 0, -7]);
  const x = useTransform(
    progress,
    [start, enter, hold, exit],
    [alignRight ? -6 : 6, 0, 0, alignRight ? 5 : -5]
  );
  const railScale = useTransform(progress, [start, enter, hold], [0.08, 0.55, 1]);

  return (
    <motion.div
      style={{ opacity, y, x }}
      className={`absolute inset-0 flex flex-col [will-change:transform,opacity] ${
        alignRight ? "items-end text-right" : "items-start"
      }`}
    >
      <div className={`h-[2px] w-8 overflow-hidden bg-white/10 ${alignRight ? "ml-auto" : ""}`}>
        <motion.span
          aria-hidden="true"
          style={{ scaleX: railScale, transformOrigin: alignRight ? "right center" : "left center" }}
          className="block h-full w-full bg-crimson"
        />
      </div>

      <p className="mt-3 max-w-[360px] text-[11px] font-medium leading-[1.55] text-[#D8D3C9] sm:text-[12px]">
        {text}
      </p>
    </motion.div>
  );
}

function StoryFocus({
  chapter,
  progress,
  reduceMotion,
  alignRight = false,
  storyInitiallyVisible = false,
}) {
  const ranges = [
    [0.0, 0.1, 0.29, 0.38],
    [0.28, 0.38, 0.58, 0.67],
    [0.57, 0.67, 0.92, 1.0],
  ];

  if (reduceMotion || storyInitiallyVisible) {
    return (
      <div className={alignRight ? "text-right" : ""}>
        <div className={`h-[2px] w-8 bg-crimson ${alignRight ? "ml-auto" : ""}`} />
        <p className={`mt-3 max-w-[360px] text-[11px] font-medium leading-[1.55] text-[#D8D3C9] ${alignRight ? "ml-auto" : ""}`}>
          {chapter.story[0]}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative h-[74px] max-w-[390px] sm:h-[80px] ${alignRight ? "ml-auto" : ""}`}>
      {chapter.story.map((text, index) => (
        <StoryLine
          key={text}
          text={text}
          progress={progress}
          range={ranges[index]}
          alignRight={alignRight}
        />
      ))}
    </div>
  );
}

function HeroFrame({
  chapter,
  artProgress,
  reduceMotion,
  artInitiallyVisible = false,
  priority = false,
}) {
  const [showAlt, setShowAlt] = useState(false);
  const isRight = chapter.composition === "right";
  const hasAlt = Boolean(chapter.altImage && chapter.altImage !== chapter.mainImage);

  const frameOpacity = useTransform(
    artProgress,
    [0, 0.12, 0.36],
    artInitiallyVisible ? [1, 1, 1] : [0, 0.86, 1],
  );
  const frameScale = useTransform(
    artProgress,
    [0, 0.52, 1],
    artInitiallyVisible ? [1.025, 1.012, 1] : [1.055, 1.014, 1],
  );
  const frameX = useTransform(
    artProgress,
    [0, 0.44, 1],
    artInitiallyVisible ? [isRight ? 8 : -8, isRight ? 4 : -4, 0] : [isRight ? 38 : -38, isRight ? 8 : -8, 0],
  );
  const frameY = useTransform(
    artProgress,
    [0, 0.5, 1],
    artInitiallyVisible ? [4, 2, 0] : [14, 4, 0],
  );
  const veilX = useTransform(
    artProgress,
    [0.02, 0.46],
    ["0%", isRight ? "108%" : "-108%"],
  );
  const markScale = useTransform(artProgress, [0.16, 0.56], [0, 1]);

  return (
    <button
      type="button"
      disabled={!hasAlt}
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
      className={`absolute z-10 overflow-hidden bg-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-inset disabled:cursor-default
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
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
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
            loading="lazy"
            className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform,opacity]"
            style={{ objectPosition: chapter.framePosition }}
            animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, ease: EASE }}
          />
        )}
      </motion.div>

      {!reduceMotion && !artInitiallyVisible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[#050505] [will-change:transform]"
          style={{ x: veilX }}
        />
      )}

      <motion.span
        aria-hidden="true"
        style={reduceMotion || artInitiallyVisible ? { scaleX: 1 } : { scaleX: markScale }}
        className="pointer-events-none absolute left-0 top-0 z-30 h-[5px] w-[28%] origin-left bg-crimson"
      />
      <span className="pointer-events-none absolute bottom-0 right-0 z-30 h-[5px] w-[20%] bg-[#F4F0E8]" />

      {hasAlt && (
        <span
          className="pointer-events-none absolute bottom-4 right-4 z-30 bg-[#050505] px-3 py-2 font-mono text-[7px] font-semibold uppercase tracking-[0.18em] text-[#F4F0E8]"
          style={{ clipPath: MINI_CLIP }}
        >
          HOVER / ALT
        </span>
      )}
    </button>
  );
}

function MobileStoryLine({
  text,
  progress,
  range,
  persist = false,
  startsVisible = false,
}) {
  const [start, enter, hold, exit] = range;

  const opacity = useTransform(
    progress,
    persist
      ? [start, enter]
      : startsVisible
        ? [start, hold, exit]
        : [start, enter, hold, exit],
    persist
      ? [0, 1]
      : startsVisible
        ? [1, 1, 0]
        : [0, 1, 1, 0],
  );

  const y = useTransform(
    progress,
    persist
      ? [start, enter]
      : startsVisible
        ? [start, hold, exit]
        : [start, enter, hold, exit],
    persist
      ? [5, 0]
      : startsVisible
        ? [0, 0, -4]
        : [5, 0, 0, -4],
  );

  const lineScale = useTransform(
    progress,
    startsVisible ? [start, hold] : [start, enter],
    startsVisible ? [1, 1] : [0.2, 1],
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 [will-change:transform,opacity]"
    >
      <motion.span
        aria-hidden="true"
        style={{ scaleX: lineScale }}
        className="block h-[2px] w-6 origin-left bg-crimson"
      />

      <p className="mt-2 max-w-[340px] text-[10.25px] font-medium leading-[1.45] text-[#CFCAC1] min-[390px]:text-[10.75px]">
        {text}
      </p>
    </motion.div>
  );
}

function MobileStoryFocus({
  chapter,
  progress,
  reduceMotion,
  storyInitiallyVisible = false,
}) {
  const ranges = [
    [0.0, 0.08, 0.27, 0.34],
    [0.34, 0.41, 0.6, 0.67],
    [0.67, 0.74, 0.93, 1.0],
  ];

  if (reduceMotion) {
    return (
      <div>
        <span className="block h-[2px] w-6 bg-crimson" />
        <p className="mt-2 max-w-[340px] text-[10.25px] font-medium leading-[1.45] text-[#CFCAC1] min-[390px]:text-[10.75px]">
          {chapter.story[0]}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[52px] max-w-[350px] max-[359px]:h-[60px]">
      {chapter.story.map((text, index) => (
        <MobileStoryLine
          key={text}
          text={text}
          progress={progress}
          range={ranges[index]}
          startsVisible={storyInitiallyVisible && index === 0}
          persist={index === chapter.story.length - 1}
        />
      ))}
    </div>
  );
}

function MobileArtFrame({
  chapter,
  artProgress,
  reduceMotion,
  artInitiallyVisible = false,
  priority = false,
}) {
  const [showAlt, setShowAlt] = useState(false);
  const hasAlt = Boolean(chapter.altImage && chapter.altImage !== chapter.mainImage);
  const frameOpacity = useTransform(
    artProgress,
    [0, 0.1, 0.34],
    artInitiallyVisible ? [1, 1, 1] : [0.35, 0.9, 1],
  );
  const frameScale = useTransform(
    artProgress,
    [0, 0.55, 1],
    artInitiallyVisible ? [1.025, 1.015, 1.005] : [1.06, 1.025, 1.01],
  );
  const frameY = useTransform(
    artProgress,
    [0, 1],
    artInitiallyVisible ? [3, 0] : [10, 0],
  );
  const veilX = useTransform(artProgress, [0.02, 0.46], ["0%", "108%"]);

  return (
    <button
      type="button"
      disabled={!hasAlt}
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
      className="absolute inset-x-0 top-0 h-[44%] overflow-hidden bg-[#090909] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson disabled:cursor-default"
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
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={{ objectPosition: chapter.mobilePosition || chapter.backgroundPosition }}
          animate={{ opacity: showAlt ? 0 : 1, scale: showAlt ? 1.025 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
        />
        {hasAlt && (
          <motion.img
            src={chapter.altImage}
            alt={`${chapter.anime} alternate ${chapter.character} artwork`}
            draggable={false}
            decoding="async"
            loading="lazy"
            className="absolute inset-0 h-full w-full select-none object-cover"
            style={{ objectPosition: chapter.mobilePosition || chapter.framePosition }}
            animate={{ opacity: showAlt ? 1 : 0, scale: showAlt ? 1 : 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: EASE }}
          />
        )}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[#050505]/[0.16]" />

      {!reduceMotion && !artInitiallyVisible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[#050505]"
          style={{ x: veilX }}
        />
      )}

      <span className="pointer-events-none absolute left-0 top-0 z-30 h-full w-[4px] bg-crimson" />
      <span className="pointer-events-none absolute right-0 top-0 z-30 h-[4px] w-[22%] bg-[#F4F0E8]" />

    </button>
  );
}

function MobileContentActions({ chapter, reduceMotion }) {
  return (
    <div className="border-t border-white/[0.1] pt-3.5">
      <div className="min-w-0">
        <p className="line-clamp-2 text-[10.75px] font-semibold uppercase leading-[1.22] tracking-[0.015em] text-[#F4F0E8] min-[390px]:text-[11.25px]">
          {chapter.product}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[6.5px] font-semibold uppercase tracking-[0.11em] text-[#77756F]">
          <span>{chapter.fit}</span>
          <span aria-hidden="true" className="h-2.5 w-px bg-white/15" />
          <span>{chapter.color}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-2">
        <SizePicker chapter={chapter} compact />

        <Link
          to={`/product/${chapter.slug}`}
          className="group relative inline-flex min-h-12 w-full items-center justify-between gap-3 overflow-hidden bg-crimson px-3.5 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
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
  artInitiallyVisible = false,
  storyInitiallyVisible = false,
  priority = false,
  isLast = false,
}) {
  const contentIsStatic = reduceMotion || contentAlwaysVisible;
  const compactImpactTitle = chapter.impact.length > 17;

  const identityOpacity = useTransform(contentProgress, [0, 0.2], [0, 1]);
  const identityY = useTransform(contentProgress, [0, 0.2], [7, 0]);
  const titleOpacity = useTransform(contentProgress, [0.03, 0.3], [0, 1]);
  const titleY = useTransform(contentProgress, [0.03, 0.3], [12, 0]);
  const copyOpacity = useTransform(contentProgress, [0.1, 0.4], [0, 1]);
  const copyY = useTransform(contentProgress, [0.1, 0.4], [7, 0]);
  const actionOpacity = useTransform(contentProgress, [0.15, 0.48], [0, 1]);
  const actionY = useTransform(contentProgress, [0.15, 0.48], [7, 0]);

  return (
    <div className="absolute inset-0 lg:hidden sm:landscape:hidden">
      <MobileArtFrame
        chapter={chapter}
        artProgress={artProgress}
        reduceMotion={reduceMotion}
        artInitiallyVisible={artInitiallyVisible}
        priority={priority}
      />

      <div
        className={`absolute inset-x-0 bottom-0 top-[43%] min-h-0 bg-[#070707] px-5 ${
          isLast ? "overflow-visible pb-6" : "overflow-hidden pb-3.5"
        } ${compactImpactTitle ? "pt-[4.05rem]" : "pt-[3.45rem]"} max-[359px]:px-4`}
      >
        <motion.div
          style={contentIsStatic ? undefined : { opacity: identityOpacity, y: identityY }}
          className="[will-change:transform,opacity]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="h-[2px] w-6 shrink-0 bg-crimson" />
              <p className="truncate font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#F4F0E8]">
                {chapter.anime}
              </p>
            </div>

            <span className="shrink-0 text-right text-[10.5px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#F4F0E8]/55 min-[390px]:text-[11.5px]">
              {chapter.jp}
            </span>
          </div>
        </motion.div>

        <motion.p
          style={contentIsStatic ? undefined : { opacity: copyOpacity, y: copyY }}
          className="mt-4 max-w-[350px] text-[10px] font-semibold uppercase leading-[1.32] tracking-[0.008em] text-[#F4F0E8] min-[390px]:text-[10.75px] [will-change:transform,opacity]"
        >
          {chapter.impactLine}
        </motion.p>

        <motion.div
          style={contentIsStatic ? undefined : { opacity: copyOpacity, y: copyY }}
          className="mt-3.5 [will-change:transform,opacity]"
        >
          <MobileStoryFocus
            chapter={chapter}
            progress={storyProgress}
            reduceMotion={reduceMotion}
            storyInitiallyVisible={storyInitiallyVisible}
          />
        </motion.div>

        <motion.div
          style={contentIsStatic || isLast ? undefined : { opacity: actionOpacity, y: actionY }}
          className={`mt-4 [will-change:transform,opacity] ${isLast ? "relative z-20 pb-1" : ""}`}
        >
          <MobileContentActions chapter={chapter} reduceMotion={reduceMotion} />
        </motion.div>
      </div>

      <motion.div
        style={contentIsStatic ? undefined : { opacity: titleOpacity, y: titleY }}
        className="pointer-events-none absolute left-5 right-7 top-[38.2%] z-30 [will-change:transform,opacity] max-[359px]:left-4"
      >
        <h3
          className={`display-tight max-w-[350px] font-semibold uppercase text-[#F4F0E8] [text-shadow:0_8px_28px_#000] ${
            compactImpactTitle
              ? "text-[clamp(1.75rem,8.8vw,2.85rem)] leading-[0.92] tracking-[-0.045em]"
              : "text-[clamp(2.12rem,11vw,3.4rem)] leading-[0.84] tracking-[-0.058em]"
          }`}
        >
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
  artInitiallyVisible = false,
  storyInitiallyVisible = false,
  priority = false,
  isLast = false,
}) {
  const isRight = chapter.composition === "right";
  const alignRight = !isRight;
  const compactImpactTitle = chapter.impact.length > 17;

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
  const teaserOpacity = useTransform(contentProgress, [0, 0.22, 0.42], [1, 0.72, 0]);

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
        artInitiallyVisible={artInitiallyVisible}
        storyInitiallyVisible={storyInitiallyVisible}
        priority={priority}
        isLast={isLast}
      />

      {teaser && (
        <motion.div
          style={{ opacity: teaserOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[34px] items-center gap-3 border-b border-white/10 bg-[#080808]/95 px-4 lg:hidden sm:landscape:hidden"
        >
          {/* MOBILE NEXT-CHAPTER TEASER */}
          <span className="h-[2px] w-5 shrink-0 bg-crimson" />
          <span className="truncate font-mono text-[7px] font-semibold uppercase tracking-[0.18em] text-[#F4F0E8]">
            NEXT CHAPTER / {chapter.anime}
          </span>
        </motion.div>
      )}

      {/* DESKTOP / WIDE-LANDSCAPE COMPOSITION */}
      <div className="hidden h-full lg:block sm:landscape:block">
        <motion.img
          src={chapter.mainImage}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full select-none object-cover [will-change:transform]"
          style={{
            objectPosition: chapter.backgroundPosition,
            scale: reduceMotion || artInitiallyVisible ? 1.02 : backgroundScale,
            x: reduceMotion || artInitiallyVisible ? 0 : backgroundX,
            y: reduceMotion || artInitiallyVisible ? 0 : backgroundY,
            filter: "brightness(0.56) saturate(0.9) contrast(1.06)",
          }}
        />

        <div className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-[4px] bg-crimson" />
        <div className="pointer-events-none absolute right-0 top-0 z-[2] h-[5px] w-[16%] bg-[#F4F0E8]" />

        <motion.span
          aria-hidden="true"
          style={reduceMotion || artInitiallyVisible ? { opacity: 0.12 } : { opacity: jpOpacity }}
          className={`pointer-events-none absolute top-[5%] z-[3] hidden select-none font-black text-[clamp(5rem,9vw,9rem)] leading-none tracking-[-0.12em] text-[#F4F0E8] lg:block sm:landscape:block ${
            isRight ? "right-[1%]" : "left-[1%]"
          }`}
        >
          {chapter.jp}
        </motion.span>

        <HeroFrame
          chapter={chapter}
          artProgress={artProgress}
          reduceMotion={reduceMotion}
          artInitiallyVisible={artInitiallyVisible}
          priority={priority}
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
          className={`absolute bottom-[8%] top-[9%] z-20 flex min-h-0 w-[54%] flex-col overflow-hidden sm:bottom-[9%] sm:top-[10%] sm:w-[43%] md:w-[40%] ${
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
            <h3
              className={`display-tight mt-4 font-semibold uppercase tracking-[-0.072em] text-[#F4F0E8] sm:mt-5 ${
                compactImpactTitle
                  ? "text-[clamp(2.15rem,4.7vw,4.8rem)] leading-[0.79]"
                  : "text-[clamp(2.55rem,5.7vw,5.85rem)] leading-[0.76]"
              }`}
            >
              {chapter.impact}
            </h3>
          </motion.div>

          <motion.div
            style={contentIsStatic ? undefined : { opacity: copyOpacity, y: copyY }}
            className="relative mt-4 min-h-0 flex-1 overflow-hidden [will-change:transform,opacity] sm:mt-5"
          >
            <div className={alignRight ? "text-right" : ""}>
              <p
                className={`max-w-[390px] text-[13px] font-semibold uppercase leading-[1.28] tracking-[0.012em] text-[#F4F0E8] sm:text-[14px] ${
                  alignRight ? "ml-auto" : ""
                }`}
              >
                {chapter.impactLine}
              </p>

              <div className="mt-5 sm:mt-6">
                <StoryFocus
                  chapter={chapter}
                  progress={storyProgress}
                  reduceMotion={reduceMotion}
                  alignRight={alignRight}
                  storyInitiallyVisible={storyInitiallyVisible}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            style={contentIsStatic ? undefined : { opacity: actionOpacity, y: actionY }}
            className="mt-auto shrink-0 [will-change:transform,opacity]"
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
  const isLast = index === total - 1;
  const segment = 1 / Math.max(total - 1, 1);

  /*
   * RESTORED ORIGINAL STACK CHOREOGRAPHY
   * ------------------------------------
   * The first Latest Drop version was built around one deliberate handoff:
   * content first -> artwork second -> next chapter rises last.
   *
   * For multiple cards we repeat that exact two-card timing inside each
   * chapter segment instead of using the newer generic stack interpolation.
   */

  const enterStart = isFirst ? 0 : (index - 1) * segment;
  const enterEnd = isFirst ? segment : index * segment;

  const enterLocal = useTransform(
    progress,
    isFirst ? [0, segment] : [enterStart, enterEnd],
    [0, 1],
  );

  const enterHandoffRaw = useTransform(
    enterLocal,
    [0.22, 0.94],
    [0, 1],
  );
  const enterHandoff = useTransform(enterHandoffRaw, smootherStep);

  // Keep every future chapter fully below the sticky frame until its own
  // handoff actually begins. No teaser strip is visible while the current
  // chapter is resting.
  const enterY = useTransform(
    enterLocal,
    [0, 0.22, 0.94],
    ["100%", "100%", "0%"],
  );

  // The final chapter settles earlier than the regular incoming cards. This
  // keeps its bottom commerce controls fully inside the sticky frame before
  // the stack releases into the archive footer.
  const lastEnterY = useTransform(
    enterLocal,
    [0, 0.22, 0.82],
    ["100%", "100%", "0%"],
  );
  const enterScale = useTransform(
    enterHandoff,
    [0, 0.6, 1],
    [0.992, 0.997, 1],
  );
  const enterOpacity = useTransform(
    enterHandoff,
    [0, 0.18, 1],
    [0.95, 1, 1],
  );

  /*
   * Once a chapter is established, the next segment uses the original
   * outgoing-card motion: a tiny lift, a restrained scale-down and only
   * a slight opacity loss. This keeps the "stack" visible without making
   * the current campaign feel like it is shrinking away.
   */
  const exitStart = index * segment;
  const exitEnd = Math.min(1, (index + 1) * segment);

  const exitLocal = useTransform(
    progress,
    isLast ? [0, 1] : [exitStart, Math.max(exitStart + 0.0001, exitEnd)],
    isLast ? [0, 0] : [0, 1],
  );

  const exitHandoffRaw = useTransform(
    exitLocal,
    [0.22, 0.94],
    [0, 1],
  );
  const exitHandoff = useTransform(exitHandoffRaw, smootherStep);

  const exitScale = useTransform(
    exitHandoff,
    [0, 0.58, 1],
    [1, 0.995, 0.982],
  );
  const exitY = useTransform(
    exitHandoff,
    [0, 0.6, 1],
    [0, -3, -9],
  );
  const exitOpacity = useTransform(
    exitHandoff,
    [0, 0.72, 1],
    [1, 1, 0.9],
  );

  /*
   * ORIGINAL CONTENT / ART / STORY ORDER
   * First card gets the exact first-card wake-up values.
   * Every following card gets the exact old second-card values,
   * normalized to its own transition segment.
   */
  const contentRaw = useTransform(
    enterLocal,
    isFirst ? [0, 0.08] : [0.23, 0.47],
    [0, 1],
  );

  const artRaw = useTransform(
    enterLocal,
    isFirst ? [0.06, 0.34] : [0.36, 0.7],
    [0, 1],
  );

  const storyRaw = useTransform(
    enterLocal,
    isFirst ? [0.15, 0.6] : [0.5, 0.99],
    [0, 1],
  );

  const contentProgress = useTransform(contentRaw, smootherStep);
  const artProgress = useTransform(artRaw, smootherStep);
  const storyProgress = useTransform(storyRaw, smootherStep);

  const cardStyle = reduceMotion
    ? {
        zIndex: 10 + index,
        y: 0,
        scale: 1,
        opacity: 1,
      }
    : {
        zIndex: 10 + index,
        y: isFirst ? exitY : isLast ? lastEnterY : enterY,
        scale: isFirst ? exitScale : isLast ? 1 : enterScale,
        opacity: isFirst ? exitOpacity : isLast ? 1 : enterOpacity,
        transformOrigin: isFirst ? "50% 18%" : "50% 100%",
      };

  /*
   * For middle chapters we need both halves of the old transition:
   * first they rise in, then they gently recede while the following card
   * takes over. Motion values are composed into a single transform so the
   * original visual rhythm survives across an arbitrary number of chapters.
   */
  const middleY = useTransform(
    [enterLocal, enterHandoff, exitHandoff],
    ([local, entered, exiting]) => {
      // Before this card's own handoff starts it remains completely below
      // the sticky viewport. It only becomes visible once scrolling drives
      // enterHandoff past its start point.
      if (local <= 0.22) return "100%";

      const enterPixels = (1 - entered) * 100;
      const exitPixels = -9 * exiting;

      if (entered < 0.999) {
        return `${enterPixels}%`;
      }

      return `${exitPixels}px`;
    },
  );

  const middleScale = useTransform(
    [enterHandoff, exitHandoff],
    ([entered, exiting]) => {
      const incoming = 0.992 + 0.008 * smootherStep(entered);
      const outgoing = 1 - 0.018 * smootherStep(exiting);
      return Math.min(incoming, outgoing);
    },
  );

  const middleOpacity = useTransform(
    [enterHandoff, exitHandoff],
    ([entered, exiting]) => {
      const incoming = 0.95 + 0.05 * smootherStep(Math.min(1, entered / 0.18));
      const outgoing = 1 - 0.1 * smootherStep(exiting);
      return Math.min(incoming, outgoing);
    },
  );

  if (!reduceMotion && !isFirst && !isLast) {
    cardStyle.y = middleY;
    cardStyle.scale = middleScale;
    cardStyle.opacity = middleOpacity;
  }

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
      artInitiallyVisible={isFirst}
      storyInitiallyVisible={isFirst}
      priority={isFirst}
      isLast={isLast}
    />
  );
}

export default function LatestDrops() {
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();

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

  // Keep the existing chapter-transition distance, then reserve a final dwell
  // so the last card can be read before the sticky stack releases into the archive footer.
  const FINAL_DWELL_SVH = 42;
  const baseStackHeight = 78 + Math.max(chapters.length - 1, 1) * 87;
  const baseStackHeightDesktop = 58 + Math.max(chapters.length - 1, 1) * 92;
  const stackHeight = `${baseStackHeight + FINAL_DWELL_SVH}svh`;
  const stackHeightDesktop = `${baseStackHeightDesktop + FINAL_DWELL_SVH}svh`;
  const stackProgressEnd = baseStackHeight / (baseStackHeight + FINAL_DWELL_SVH);
  const chapterProgress = useTransform(
    smoothProgress,
    [0, stackProgressEnd, 1],
    [0, 1, 1],
  );

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
              className="relative h-[78svh] min-h-[540px] max-h-[700px] sm:landscape:h-[calc(100svh-1rem)] sm:landscape:min-h-0 sm:landscape:max-h-none lg:h-[58svh] lg:min-h-[500px] lg:max-h-[610px] lg:landscape:h-[58svh] lg:landscape:min-h-[500px] lg:landscape:max-h-[610px]"
            >
              <ChapterCard
                chapter={chapter}
                artProgress={scrollYProgress}
                contentProgress={scrollYProgress}
                storyProgress={scrollYProgress}
                cardStyle={{ zIndex: 10 + index }}
                reduceMotion
                contentAlwaysVisible
                artInitiallyVisible
                storyInitiallyVisible
                priority={index === 0}
                isLast={index === chapters.length - 1}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="relative h-[var(--stack-h)] lg:h-[var(--stack-h-md)]"
          style={{
            "--stack-h": stackHeight,
            "--stack-h-md": stackHeightDesktop,
          }}
        >
          <div className="sticky top-[10svh] mx-auto h-[78svh] min-h-[540px] max-h-[700px] w-[calc(100%_-_1.25rem)] max-w-[1380px] overflow-hidden sm:landscape:top-2 sm:landscape:h-[calc(100svh-1rem)] sm:landscape:min-h-0 sm:landscape:max-h-none lg:top-[17svh] lg:h-[58svh] lg:min-h-[500px] lg:max-h-[610px] lg:w-[86vw] lg:landscape:top-[17svh] lg:landscape:h-[58svh] lg:landscape:min-h-[500px] lg:landscape:max-h-[610px]">
            {chapters.map((chapter, index) => (
              <StackedChapter
                key={chapter.slug}
                chapter={chapter}
                index={index}
                total={chapters.length}
                progress={chapterProgress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      )}

      <div className="site-container">
        <div className="mx-auto mt-10 flex max-w-[1380px] items-center justify-between border-t border-[#252525] pt-6 md:mt-9 md:pt-5 md:w-[86vw]">
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
