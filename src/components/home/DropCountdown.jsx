import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { products } from '../../data/products.js';

// ============================================================================
// ZENJI DROP SYSTEM CONFIGURATION
// - 10-minute live window when countdown finishes
// - Drop options displayed during live window
// - Automatic navigation to /drops upon drop unlock
// - Rollover to the NEXT scheduled drop after 10 minutes elapse
// ============================================================================

const DROP_WINDOW_DURATION = 10 * 60 * 1000; // 10 minutes (600,000 ms)
const CYCLE_INTERVAL = 12 * 60 * 60 * 1000;  // 12 hours between scheduled drops
const BASE_ANCHOR_TIME = new Date('2026-09-07T23:59:00+06:00').getTime();

const EASE = [0.16, 1, 0.3, 1];

const POSTER_CLIP =
  'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))';

const CTA_CLIP =
  'polygon(0 0, calc(100% - 14px) 0, 100% 14px, calc(100% - 9px) 100%, 0 100%)';

const TIME_PARTS = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HRS' },
  { key: 'mins', label: 'MIN' },
  { key: 'secs', label: 'SEC' },
];

const DROPS_ROSTER = [
  {
    id: '01',
    code: 'ZNJ-DROP-01',
    name: 'AWAKENING TRANSMISSION',
    japanese: '覚醒の伝達',
    description: 'Heavyweight mineral-wash acid streetwear celebrating Tokyo underground anime aesthetics.',
    slugs: ['sukuna-shibuya-acidwash-tee', 'blue-flame-oversized-tee', 'jinwoo-monarch-tee'],
  },
  {
    id: '02',
    code: 'ZNJ-DROP-02',
    name: 'SHADOW MONARCH EMERGENCE',
    japanese: '影の君主の出現',
    description: 'Necromancer domain collection featuring cold-black silhouettes and high-density ink print.',
    slugs: ['jinwoo-monarch-tee', 'demon-blood-tee', 'sukuna-shibuya-acidwash-tee'],
  },
  {
    id: '03',
    code: 'ZNJ-DROP-03',
    name: 'FLAME HASHIRA PURGATORY',
    japanese: '炎柱の煉獄',
    description: 'High-visibility flame calligraphy tees cut in 260 GSM oversized combed jersey.',
    slugs: ['blue-flame-oversized-tee', 'sukuna-shibuya-acidwash-tee', 'demon-blood-tee'],
  },
];

function calculateDropState(nowMs = Date.now()) {
  const elapsed = nowMs - BASE_ANCHOR_TIME;

  if (elapsed < 0) {
    const total = -elapsed;
    return {
      phase: 'countdown',
      drop: DROPS_ROSTER[0],
      total,
      days: Math.floor(total / 86400000),
      hours: Math.floor(total / 3600000) % 24,
      mins: Math.floor(total / 60000) % 60,
      secs: Math.floor(total / 1000) % 60,
      targetTime: BASE_ANCHOR_TIME,
      windowLeft: 0,
      windowMins: 0,
      windowSecs: 0,
    };
  }

  const cycle = Math.floor(elapsed / CYCLE_INTERVAL);
  const cycleOffset = elapsed % CYCLE_INTERVAL;

  if (cycleOffset < DROP_WINDOW_DURATION) {
    // ACTIVE 10-MINUTE LIVE DROP
    const windowLeft = DROP_WINDOW_DURATION - cycleOffset;
    const currentDropIndex = cycle % DROPS_ROSTER.length;
    return {
      phase: 'live',
      drop: DROPS_ROSTER[currentDropIndex],
      total: 0,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      targetTime: BASE_ANCHOR_TIME + cycle * CYCLE_INTERVAL,
      windowLeft,
      windowMins: Math.floor(windowLeft / 60000),
      windowSecs: Math.floor(windowLeft / 1000) % 60,
    };
  } else {
    // 10-MINUTE WINDOW EXPIRED -> COUNTDOWN TO NEXT DROP
    const nextCycle = cycle + 1;
    const nextTargetTime = BASE_ANCHOR_TIME + nextCycle * CYCLE_INTERVAL;
    const total = Math.max(0, nextTargetTime - nowMs);
    const nextDropIndex = nextCycle % DROPS_ROSTER.length;
    return {
      phase: 'countdown',
      drop: DROPS_ROSTER[nextDropIndex],
      total,
      days: Math.floor(total / 86400000),
      hours: Math.floor(total / 3600000) % 24,
      mins: Math.floor(total / 60000) % 60,
      secs: Math.floor(total / 1000) % 60,
      targetTime: nextTargetTime,
      windowLeft: 0,
      windowMins: 0,
      windowSecs: 0,
    };
  }
}

function PosterDigit({ value, reduceMotion }) {
  const formatted = String(value).padStart(2, '0');

  return (
    <span className="relative block h-[0.92em] min-w-[1.62em] overflow-hidden leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={formatted}
          initial={reduceMotion ? false : { y: '72%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={reduceMotion ? undefined : { y: '-72%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: reduceMotion ? 0 : 0.34, ease: EASE }}
          className="block tabular-nums"
          aria-hidden="true"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RevealWords({ children, reduceMotion }) {
  const words = String(children).split(' ');

  return (
    <span aria-label={String(children)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            aria-hidden="true"
            initial={reduceMotion ? false : { y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: reduceMotion ? 0 : 0.62, delay: index * 0.075, ease: EASE }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {index < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function MovingPosterType({ text = 'NEXT DROP / ZENJI / ', reduceMotion }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[12%] overflow-hidden">
      <motion.div
        animate={reduceMotion ? undefined : { x: ['0%', '-34%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex w-max whitespace-nowrap font-display text-[clamp(6rem,17vw,15rem)] font-semibold uppercase leading-none tracking-[-0.075em] text-white/[0.025]"
      >
        <span>{text}&nbsp;</span>
        <span>{text}&nbsp;</span>
        <span>{text}&nbsp;</span>
      </motion.div>
    </div>
  );
}

export default function DropCountdown() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState(() => calculateDropState());
  const [redirecting, setRedirecting] = useState(false);
  const prevPhaseRef = useRef(state.phase);

  useEffect(() => {
    const update = () => {
      const next = calculateDropState();
      setState(next);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Automatic navigation to /drops when the countdown unlocks into the live drop
  useEffect(() => {
    if (prevPhaseRef.current === 'countdown' && state.phase === 'live') {
      if (location.pathname !== '/drops') {
        setRedirecting(true);
        const redirectTimer = setTimeout(() => {
          navigate('/drops');
        }, 1500);
        return () => clearTimeout(redirectTimer);
      }
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, location.pathname, navigate]);

  const isLive = state.phase === 'live';

  const formattedCountdown = useMemo(
    () => TIME_PARTS.map(({ key }) => String(state[key]).padStart(2, '0')).join(':'),
    [state.days, state.hours, state.mins, state.secs]
  );

  const formattedWindowTimer = useMemo(
    () => `${String(state.windowMins).padStart(2, '0')}:${String(state.windowSecs).padStart(2, '0')}`,
    [state.windowMins, state.windowSecs]
  );

  // Featured pieces for the active drop
  const featuredPieces = useMemo(() => {
    const slugs = state.drop?.slugs || [];
    return products.filter((p) => slugs.includes(p.slug)).slice(0, 3);
  }, [state.drop]);

  const dropDateLabel = useMemo(() => {
    const d = new Date(state.targetTime);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }, [state.targetTime]);

  return (
    <section id="drop-countdown" className="relative overflow-hidden border-y border-white/[0.1] bg-[#050505] text-[#F4F0E8]">
      <MovingPosterType
        text={isLive ? 'DROP LIVE / ACCESS OPEN / ' : 'NEXT DROP / ZENJI / '}
        reduceMotion={reduceMotion}
      />

      <motion.span
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE }}
        className="absolute left-0 top-0 h-[4px] w-[32%] origin-left bg-crimson sm:w-[20%]"
      />

      <motion.span
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ['-20vw', '110vw'] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.1 }}
        className="absolute bottom-0 left-0 h-[3px] w-[18vw] bg-crimson"
      />

      <div className="site-container relative z-10 py-12 sm:py-14 lg:py-16 xl:py-20">
        {/* Top Meta Bar */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.75 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.11] pb-4"
        >
          <div className="flex items-center gap-3">
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.82, 1, 0.82] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-2 bg-crimson"
            />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/68 sm:text-[10px]">
              {isLive ? 'ZENJI / LIVE DROP ACTIVE' : 'ZENJI / NEXT RELEASE SIGNAL'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-crimson sm:text-[10px]">
              {state.drop.code}
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 sm:text-[10px]">
              {dropDateLabel} / 12H CYCLE
            </span>
          </div>
        </motion.div>

        {/* Center Main Stage */}
        <div className="mx-auto max-w-[1220px] py-10 text-center sm:py-14 lg:py-16">
          {/* Eyebrow Label */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, delay: 0.08, ease: EASE }}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-crimson sm:text-[11px]"
          >
            {isLive ? '10-MINUTE ALLOCATION WINDOW / ACTIVE' : 'LIMITED DROP / ACCESS UNLOCKS AT ZERO'}
          </motion.p>

          {/* Heading */}
          <h2 className="mt-4 font-display text-[clamp(2.8rem,7.5vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.065em] text-[#F4F0E8]">
            <RevealWords reduceMotion={reduceMotion}>
              {isLive ? 'THE GATE IS OPEN.' : 'THE GATE OPENS.'}
            </RevealWords>
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: reduceMotion ? 0 : 0.52, delay: 0.22, ease: EASE }}
            className="mx-auto mt-4 max-w-[640px] text-[14px] leading-6 text-white/60 sm:text-[15px] sm:leading-7"
          >
            {isLive ? (
              <span>
                <strong className="text-crimson">{state.drop.name}</strong> is live for a 10-minute transmission window.
                Explore drop pieces below or enter the drop before allocation locks.
              </span>
            ) : (
              <span>
                Next scheduled release:{' '}
                <strong className="text-[#F4F0E8]">{state.drop.name}</strong> ({state.drop.japanese}).
                Access unlocks the moment the countdown finishes.
              </span>
            )}
          </motion.p>

          {/* Redirecting Banner */}
          {redirecting && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-6 max-w-md rounded border border-crimson/40 bg-crimson/10 px-4 py-2 text-center"
            >
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-crimson">
                GATE UNLOCKED // TRANSMITTING TO DROPS...
              </p>
            </motion.div>
          )}

          {/* ==============================================================
              POSTER CONTAINER (LIVE OPTIONS VS COUNTDOWN)
              ============================================================== */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 22 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: 0.12, ease: EASE }}
            className="relative mx-auto mt-9 max-w-[960px] overflow-hidden border border-white/[0.12] bg-[#080808] px-4 py-6 sm:mt-11 sm:px-7 sm:py-8 lg:px-10 lg:py-10"
            style={{ clipPath: POSTER_CLIP }}
          >
            <span aria-hidden="true" className="absolute left-0 top-0 h-[4px] w-[18%] bg-crimson" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 h-[4px] w-[14%] bg-[#F4F0E8]" />

            {isLive ? (
              /* ==========================================================
                 LIVE DROP OPTIONS VIEW (Active 10-minute window)
                 ========================================================== */
              <div className="flex flex-col items-center gap-6 py-2 sm:py-4">
                {/* Live Closing Timer */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-crimson" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/70 sm:text-[10px]">
                      CLOSES IN: <span className="text-[#FFD166]">{formattedWindowTimer}</span>
                    </span>
                  </div>
                </div>

                {/* Big Live Announcement */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                  className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold uppercase leading-none tracking-[-0.065em] text-[#F4F0E8]"
                >
                  DROP <span className="text-crimson">OPEN</span>
                </motion.div>

                {/* Drop Options Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Link
                    to="/drops"
                    className="group inline-flex min-h-12 items-center justify-center gap-4 bg-crimson px-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8] sm:text-[11px]"
                    style={{ clipPath: CTA_CLIP }}
                  >
                    ENTER LIVE DROP
                    <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">
                      ↗
                    </span>
                  </Link>

                  <Link
                    to="/shop"
                    className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/20 bg-white/5 px-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#F4F0E8] transition-colors duration-300 hover:border-crimson hover:bg-crimson/10 hover:text-white sm:text-[11px]"
                  >
                    BROWSE STORE ARCHIVE
                  </Link>
                </div>

                {/* Drop Pieces Preview Options Grid */}
                {featuredPieces.length > 0 && (
                  <div className="mt-4 w-full border-t border-white/[0.08] pt-6">
                    <p className="mb-4 text-left font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
                      DROP PIECES AVAILABLE NOW ({featuredPieces.length})
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {featuredPieces.map((piece) => (
                        <Link
                          key={piece.id}
                          to={`/product/${piece.slug}`}
                          className="group relative flex items-center gap-3 border border-white/[0.09] bg-[#0c0c0e] p-2.5 text-left transition-all duration-300 hover:border-crimson hover:bg-[#121216]"
                        >
                          <div className="h-14 w-12 flex-shrink-0 overflow-hidden bg-black/60">
                            <img
                              src={piece.images?.[0]}
                              alt={piece.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#F4F0E8] group-hover:text-crimson">
                              {piece.name}
                            </p>
                            <p className="mt-1 font-mono text-[9px] text-white/50">
                              ${piece.price} AUD
                            </p>
                          </div>
                          <span className="font-mono text-xs text-white/40 group-hover:text-crimson">
                            ↗
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ==========================================================
                 COUNTDOWN TIMER VIEW (Counting down to next drop)
                 ========================================================== */
              <div
                role="timer"
                aria-label={`Countdown to ${state.drop.name}`}
                aria-live="off"
              >
                <span className="sr-only">{formattedCountdown}</span>

                <div className="flex items-start justify-center">
                  {TIME_PARTS.map((part, index) => (
                    <div key={part.key} className="flex items-start">
                      <div className="min-w-0 text-center">
                        <div className="font-display text-[clamp(2.6rem,10vw,6.8rem)] font-semibold leading-none tracking-[-0.07em] text-[#F4F0E8]">
                          <PosterDigit value={state[part.key]} reduceMotion={reduceMotion} />
                        </div>
                        <p className="mt-3 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/42 sm:mt-4 sm:text-[9px] lg:text-[10px]">
                          {part.label}
                        </p>
                      </div>

                      {index < TIME_PARTS.length - 1 && (
                        <motion.span
                          aria-hidden="true"
                          animate={reduceMotion ? undefined : { opacity: [0.2, 0.75, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                          className="mx-1 mt-[0.04em] font-display text-[clamp(2.4rem,8vw,5.7rem)] font-medium leading-none text-crimson sm:mx-2 lg:mx-3"
                        >
                          :
                        </motion.span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Status Bar */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.4 }}
            className="mx-auto mt-7 flex max-w-[960px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="h-2 w-2 bg-crimson"
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 sm:text-[10px]">
                {isLive ? 'ALLOCATION WINDOW (10 MIN)' : 'DROP STATUS / LOCKED (COUNTING DOWN)'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 sm:justify-end">
              <Link
                to="/drops"
                className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-crimson"
              >
                VIEW DROP INTEL ↗
              </Link>
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white/34 sm:text-[9px]">
                CYCLE INTERVAL / 12H
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.85, delay: 0.15, ease: EASE }}
          className="h-px origin-left bg-white/[0.12]"
        />
      </div>
    </section>
  );
}
