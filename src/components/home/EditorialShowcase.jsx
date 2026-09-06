import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const HERO_CLIP =
  'polygon(34px 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%, 0 34px)';
const DETAIL_CLIP =
  'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 18px 100%, 0 calc(100% - 18px))';
const CTA_CLIP =
  'polygon(0 0, calc(100% - 14px) 0, 100% 14px, calc(100% - 10px) 100%, 0 100%)';

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=88';
const DEFAULT_DETAIL_IMAGE =
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=88';

const REASONS = [
  {
    eyebrow: 'WEIGHT / STRUCTURE',
    title: 'Feels substantial. Falls cleaner.',
    body:
      'A more substantial fabric gives the tee a stronger drape and helps the oversized silhouette keep its shape instead of collapsing on-body.',
  },
  {
    eyebrow: 'FIT / PROPORTION',
    title: 'Oversized by design—not by accident.',
    body:
      'Room through the body, a relaxed shoulder line and added sleeve volume create the intended streetwear proportion without making the tee feel shapeless.',
  },
  {
    eyebrow: 'FINISH / EVERYDAY WEAR',
    title: 'Made to become the tee you reach for.',
    body:
      'The garment is designed around repeat wear, easy styling and straightforward care so the piece works beyond the first outfit or first photo.',
  },
];

const TRUST_POINTS = [
  'FIT EXPLAINED BEFORE CHECKOUT',
  'CLEAR SIZE GUIDANCE',
  'CARE GUIDANCE INCLUDED',
];

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex text-[17px] leading-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
    >
      ↗
    </span>
  );
}

function ReasonRow({ reason, index, reduceMotion }) {
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.65 }}
      transition={{ duration: 0.48, delay: index * 0.06, ease: EASE }}
      className="grid gap-3 border-t border-white/[0.11] py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-7 sm:py-5"
    >
      <div className="flex items-start gap-2.5 pt-0.5">
        <span className="mt-[5px] h-[3px] w-7 shrink-0 bg-crimson" />
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/62 sm:text-[11px]">
          {reason.eyebrow}
        </p>
      </div>

      <div className="min-w-0">
        <h3 className="max-w-[600px] font-display text-[20px] font-semibold uppercase leading-[0.98] tracking-[-0.035em] text-[#F4F0E8] sm:text-[24px]">
          {reason.title}
        </h3>
        <p className="mt-2.5 max-w-[690px] text-[14px] leading-6 text-white/68 sm:text-[15px] sm:leading-7">
          {reason.body}
        </p>
      </div>
    </motion.article>
  );
}

function FitChoice({ title, body, active = false }) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex h-5 items-center justify-center">
        <span
          className={`block ${
            active
              ? 'h-3.5 w-3.5 bg-crimson ring-4 ring-crimson/15'
              : 'h-2.5 w-2.5 border border-white/40 bg-[#090909]'
          }`}
        />
      </div>
      <p
        className={`mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.11em] sm:text-[10px] ${
          active ? 'text-[#F4F0E8]' : 'text-white/55'
        }`}
      >
        {title}
      </p>
      <p className="mx-auto mt-1 max-w-[150px] text-[12px] leading-5 text-white/46 sm:text-[13px]">
        {body}
      </p>
    </div>
  );
}

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
    <section className="relative overflow-hidden border-y border-white/[0.10] bg-[#050505] py-14 text-[#F4F0E8] sm:py-18 lg:py-22">
      <span className="pointer-events-none absolute left-0 top-0 h-[5px] w-[16%] bg-crimson" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-[5px] w-[12%] bg-[#F4F0E8]" />

      <div className="site-container">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 border-b border-white/[0.10] pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-9 bg-crimson" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/62 sm:text-[10px]">
                QUALITY + FIT
              </p>
            </div>

            <p className="max-w-[520px] text-[13px] leading-6 text-white/58 sm:text-right sm:text-[14px]">
              Built around how the tee feels, falls and fits into real outfits—not just how it looks in one photo.
            </p>
          </div>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.58, ease: EASE }}
            aria-label="QUALITY YOU FEEL. FIT YOU NOTICE."
            className="mt-3 whitespace-nowrap font-display text-[clamp(1.05rem,5vw,4.7rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-[#F4F0E8]"
          >
            QUALITY YOU FEEL. FIT YOU <span className="text-crimson">NOTICE.</span>
          </motion.h2>
        </div>

        {/* HERO IMAGE */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden border border-white/[0.11] bg-[#0A0A0A]"
          style={{ clipPath: HERO_CLIP }}
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8.2]">
            <img
              src={heroImage}
              alt="Model wearing an oversized streetwear tee"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <span className="pointer-events-none absolute left-0 top-0 h-[6px] w-[22%] bg-crimson" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-[6px] w-[18%] bg-[#F4F0E8]" />

            <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.12] bg-[#050505] px-4 py-4 sm:px-6 sm:py-5 lg:flex lg:items-end lg:justify-between lg:gap-8 lg:px-8">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson sm:text-[10px]">
                  REAL FIT / REAL PROPORTION
                </p>
                <p className="mt-2 max-w-[690px] font-display text-[24px] font-semibold uppercase leading-[0.95] tracking-[-0.035em] text-[#F4F0E8] sm:text-[30px] lg:text-[36px]">
                  Designed to look intentional from every angle.
                </p>
              </div>

              <Link
                to={shopPath}
                className="group mt-4 inline-flex min-h-[46px] items-center justify-between gap-7 bg-crimson px-5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-white outline-none transition-colors hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:ring-2 focus-visible:ring-[#F4F0E8] lg:mt-0"
                style={{ clipPath: CTA_CLIP }}
              >
                SHOP THE DROP
                <Arrow />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* WHY IT FEELS BETTER */}
        <div className="mt-7 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(300px,.82fr)_minmax(0,1.18fr)] lg:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative overflow-hidden border border-white/[0.11] bg-[#090909]"
            style={{ clipPath: DETAIL_CLIP }}
          >
            <div className="relative aspect-[5/6] min-h-[420px] lg:h-full lg:min-h-[610px]">
              <img
                src={detailImage}
                alt="Close fashion detail showing the tee fit and fabric"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute bottom-0 left-0 max-w-[88%] bg-[#050505] px-4 py-4 sm:px-5">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/52">
                  THE DETAILS MATTER
                </p>
                <p className="mt-2 font-display text-[24px] font-semibold uppercase leading-[0.94] tracking-[-0.035em] text-[#F4F0E8] sm:text-[28px]">
                  Better basics make better outfits.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="border border-white/[0.11] bg-[#080808] px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-4 border-b border-white/[0.11] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-crimson sm:text-[11px]">
                  WHY THIS ONE FEELS BETTER
                </p>
                <h3 className="mt-2 max-w-[650px] font-display text-[clamp(1.85rem,3.7vw,3.15rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em]">
                  GOOD FIT STARTS WITH GOOD PROPORTION.
                </h3>
              </div>

              <p className="max-w-[310px] text-[14px] leading-6 text-white/54 sm:text-[15px]">
                No mystery sizing language. No tiny spec dump. Just the information that helps you decide how this tee will actually sit on you.
              </p>
            </div>

            <div>
              {REASONS.map((reason, index) => (
                <ReasonRow
                  key={reason.eyebrow}
                  reason={reason}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FIT CHECK */}
        <div className="mt-7 border border-white/[0.11] bg-[#080808] px-5 py-6 sm:mt-10 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-crimson sm:text-[11px]">
                FIT CHECK
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.9rem,4vw,3.35rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em]">
                PICK THE SHAPE YOU WANT.
              </h3>
              <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-white/64 sm:text-[16px]">
                Take your normal size for the intended oversized silhouette. Size down once for a cleaner relaxed fit. Size up only when you want extra volume through the body and sleeve.
              </p>
            </div>

            <div className="border-l-0 border-white/[0.12] pt-1 lg:border-l lg:pl-7">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
                MODEL REFERENCE
              </p>
              <p className="mt-2 text-[16px] font-semibold uppercase tracking-[0.04em] text-[#F4F0E8]">
                {modelHeight} / WEARING {modelSize}
              </p>
            </div>
          </div>

          <div className="relative mt-8 px-1 sm:px-6">
            <span className="absolute left-[16.5%] right-[16.5%] top-[9px] h-px bg-white/[0.18]" />
            <div className="relative grid grid-cols-3 gap-2">
              <FitChoice title="SIZE DOWN" body="Cleaner relaxed fit" />
              <FitChoice title="YOUR NORMAL SIZE" body="INTENDED OVERSIZED" active />
              <FitChoice title="SIZE UP" body="Extra volume" />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.11] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_POINTS.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-white/52 sm:text-[10px]"
                >
                  <span className="h-1.5 w-1.5 bg-crimson" />
                  {point}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to={sizeGuidePath}
                className="group inline-flex min-h-[44px] items-center justify-between gap-5 border border-white/[0.16] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#F4F0E8] transition-colors hover:border-[#F4F0E8] hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                style={{ clipPath: CTA_CLIP }}
              >
                VIEW SIZE GUIDE
                <Arrow />
              </Link>

              <Link
                to={shopPath}
                className="group inline-flex min-h-[44px] items-center justify-between gap-5 bg-crimson px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8]"
                style={{ clipPath: CTA_CLIP }}
              >
                SHOP THE DROP
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
