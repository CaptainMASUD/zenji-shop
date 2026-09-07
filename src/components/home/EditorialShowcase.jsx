import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const HERO_CLIP =
  'polygon(26px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 26px)';

const IMAGE_CLIP =
  'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 16px 100%, 0 calc(100% - 16px))';

const BUTTON_CLIP =
  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, calc(100% - 8px) 100%, 0 100%)';

/* =========================================================
   IMAGES
========================================================= */

const DEFAULT_HERO_IMAGE =
  'https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788802503/bn_fr7rie.png';

const DEFAULT_DETAIL_IMAGE =
  '/t-shirt/Demon Slayer/DS-TS-001-rengoku-flame-hashira.png';

/* =========================================================
   CONTENT
========================================================= */

const REASONS = [
  {
    number: '01',
    title: 'BETTER WEIGHT',
    text: 'Structured fabric with a cleaner drape.',
  },
  {
    number: '02',
    title: 'OVERSIZED FIT',
    text: 'Relaxed proportions without feeling shapeless.',
  },
  {
    number: '03',
    title: 'DAILY READY',
    text: 'Made for repeat wear, styling and comfort.',
  },
];

const TRUST_POINTS = [
  'OVERSIZED FIT',
  'SIZE GUIDANCE',
  'EASY CARE',
];

/* =========================================================
   ARROW
========================================================= */

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex text-[16px] leading-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
    >
      ↗
    </span>
  );
}

/* =========================================================
   QUALITY ITEM
========================================================= */

function QualityItem({ item, index, reduceMotion }) {
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: EASE,
      }}
      className="group grid grid-cols-[46px_minmax(0,1fr)] gap-4 border-t border-white/[0.09] py-5 sm:grid-cols-[58px_minmax(0,1fr)] sm:py-6"
    >
      {/* Number */}
      <div className="pt-1">
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-crimson">
          {item.number}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h4 className="font-display text-[20px] font-semibold uppercase leading-none tracking-[-0.03em] text-[#F4F0E8] sm:text-[23px]">
          {item.title}
        </h4>

        <p className="max-w-[330px] text-[13px] leading-5 text-white/50 sm:text-right sm:text-[14px] sm:leading-6">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

/* =========================================================
   FIT OPTION
========================================================= */

function FitOption({ label, caption, active = false }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <span
        className={`relative z-10 block transition-all duration-300 ${
          active
            ? 'h-3.5 w-3.5 bg-crimson ring-[5px] ring-crimson/10'
            : 'h-2.5 w-2.5 border border-white/30 bg-[#080808]'
        }`}
      />

      <p
        className={`mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px] ${
          active ? 'text-[#F4F0E8]' : 'text-white/48'
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-[11px] text-white/34 sm:text-[12px]">
        {caption}
      </p>
    </div>
  );
}

/* =========================================================
   QUALITY + FIT
========================================================= */

export default function QualityFit({
  heroImage = DEFAULT_HERO_IMAGE,
  detailImage = DEFAULT_DETAIL_IMAGE,
  sizeGuidePath = '/size-guide',
  shopPath = '/shop',
  modelHeight = '178 CM',
  modelSize = 'L',
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#050505] py-14 text-[#F4F0E8] sm:py-16 lg:py-20">
      {/* Side accents */}
      <span className="pointer-events-none absolute left-0 top-0 h-[4px] w-[12%] bg-crimson" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-[4px] w-[9%] bg-[#F4F0E8]" />

      <div className="site-container">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-6 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-crimson" />

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
                QUALITY + FIT
              </p>
            </div>

            <p className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-white/30 sm:block">
              BUILT TO WEAR
            </p>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={
              reduceMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.55,
              ease: EASE,
            }}
            className="mt-4"
          >
            <h2 className="max-w-[1050px] font-display text-[clamp(2rem,5.3vw,4.8rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em]">
              MADE TO FEEL
              <span className="text-crimson"> RIGHT.</span>
            </h2>
          </motion.div>
        </div>

        {/* =====================================================
            THIN HERO BANNER
        ===================================================== */}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={
            reduceMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            ease: EASE,
          }}
          className="relative overflow-hidden border border-white/[0.09] bg-[#090909]"
          style={{ clipPath: HERO_CLIP }}
        >
          <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
            <img
              src={heroImage}
              alt="ZENJI streetwear fit"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* subtle readability */}
            <div className="pointer-events-none absolute inset-0 bg-black/10" />

            {/* Bottom strip */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/[0.09] bg-[#050505]/95 px-4 py-3 backdrop-blur-md sm:px-6">
              <div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-crimson sm:text-[9px]">
                  ZENJI / FIT STANDARD
                </p>

                <p className="mt-1 font-display text-[17px] font-semibold uppercase tracking-[-0.02em] text-[#F4F0E8] sm:text-[20px]">
                  BUILT FOR THE SILHOUETTE.
                </p>
              </div>

              <Link
                to={shopPath}
                className="group hidden min-h-[40px] items-center gap-5 bg-crimson px-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#F4F0E8] hover:text-[#050505] sm:inline-flex"
                style={{ clipPath: BUTTON_CLIP }}
              >
                SHOP
                <Arrow />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            QUALITY DETAILS
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.32fr)] lg:gap-7">
          {/* =================================================
              SMALLER IMAGE
          ================================================= */}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            whileInView={
              reduceMotion ? undefined : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              ease: EASE,
            }}
            className="relative mx-auto w-full max-w-[460px] overflow-hidden border border-white/[0.09] bg-[#090909] lg:mx-0 lg:max-w-none"
            style={{ clipPath: IMAGE_CLIP }}
          >
            <div className="relative h-[390px] sm:h-[450px] lg:h-[470px] xl:h-[500px]">
              <img
                src={detailImage}
                alt="ZENJI oversized streetwear detail"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Bottom caption */}
              <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.08] bg-[#050505]/95 px-4 py-4 backdrop-blur-md sm:px-5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/42 sm:text-[9px]">
                  ZENJI / DETAIL
                </p>

                <p className="mt-1.5 font-display text-[19px] font-semibold uppercase leading-none tracking-[-0.025em] sm:text-[22px]">
                  CUT FOR STREETWEAR.
                </p>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              CLEAN INFORMATION PANEL
          ================================================= */}

          <div className="flex flex-col border border-white/[0.09] bg-[#070707] px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
            {/* Title */}
            <div className="border-b border-white/[0.09] pb-6">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-crimson sm:text-[10px]">
                WHY IT WORKS
              </p>

              <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
                <h3 className="max-w-[620px] font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.045em]">
                  CLEAN FIT.
                  <br />
                  STRONG SHAPE.
                </h3>

                <p className="max-w-[320px] text-[13px] leading-6 text-white/48 sm:text-[14px]">
                  A simple oversized silhouette designed for comfort,
                  proportion and everyday styling.
                </p>
              </div>
            </div>

            {/* Compact benefits */}
            <div>
              {REASONS.map((item, index) => (
                <QualityItem
                  key={item.number}
                  item={item}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>

            {/* Bottom metadata */}
            <div className="mt-auto flex flex-col gap-4 border-t border-white/[0.09] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/32">
                  MODEL
                </p>

                <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.04em] text-white/72">
                  {modelHeight} / SIZE {modelSize}
                </p>
              </div>

              <Link
                to={sizeGuidePath}
                className="group inline-flex min-h-[42px] items-center justify-between gap-6 border border-white/[0.13] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white/75 transition-all hover:border-white/60 hover:bg-white hover:text-black"
                style={{ clipPath: BUTTON_CLIP }}
              >
                SIZE GUIDE
                <Arrow />
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            COMPACT FIT CHECK
        ===================================================== */}

        <div className="mt-6 border border-white/[0.09] bg-[#070707] px-5 py-6 sm:mt-7 sm:px-7 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            {/* Copy */}
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-crimson">
                FIT CHECK
              </p>

              <h3 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
                CHOOSE YOUR SHAPE.
              </h3>

              <p className="mt-2 max-w-[410px] text-[13px] leading-6 text-white/44 sm:text-[14px]">
                Normal size gives the intended oversized fit.
              </p>
            </div>

            {/* Fit scale */}
            <div>
              <div className="relative px-2 sm:px-6">
                <span className="absolute left-[16.5%] right-[16.5%] top-[6px] h-px bg-white/[0.12]" />

                <div className="relative grid grid-cols-3 gap-2">
                  <FitOption
                    label="SIZE DOWN"
                    caption="Relaxed"
                  />

                  <FitOption
                    label="NORMAL SIZE"
                    caption="Oversized"
                    active
                  />

                  <FitOption
                    label="SIZE UP"
                    caption="Extra loose"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/38 sm:text-[9px]"
                >
                  <span className="h-1 w-1 bg-crimson" />
                  {point}
                </span>
              ))}
            </div>

            <Link
              to={shopPath}
              className="group inline-flex min-h-[42px] items-center justify-between gap-7 bg-crimson px-5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#F4F0E8] hover:text-[#050505]"
              style={{ clipPath: BUTTON_CLIP }}
            >
              SHOP THE DROP
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}