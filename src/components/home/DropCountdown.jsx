import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const TARGET_TIME = new Date('2026-09-07T23:59:00+06:00').getTime();
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

function calculateTimeLeft() {
  const total = Math.max(0, TARGET_TIME - Date.now());

  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor(total / 3600000) % 24,
    mins: Math.floor(total / 60000) % 60,
    secs: Math.floor(total / 1000) % 60,
  };
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

function MovingPosterType({ reduceMotion }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[12%] overflow-hidden">
      <motion.div
        animate={reduceMotion ? undefined : { x: ['0%', '-34%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex w-max whitespace-nowrap font-display text-[clamp(6rem,17vw,15rem)] font-semibold uppercase leading-none tracking-[-0.075em] text-white/[0.025]"
      >
        <span>NEXT DROP / ZENJI /&nbsp;</span>
        <span>NEXT DROP / ZENJI /&nbsp;</span>
        <span>NEXT DROP / ZENJI /&nbsp;</span>
      </motion.div>
    </div>
  );
}

export default function DropCountdown() {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    const update = () => setTime(calculateTimeLeft());
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hasEnded = time.total <= 0;

  const formattedTime = useMemo(
    () => TIME_PARTS.map(({ key }) => String(time[key]).padStart(2, '0')).join(':'),
    [time.days, time.hours, time.mins, time.secs],
  );

  return (
    <section className="relative overflow-hidden border-y border-white/[0.1] bg-[#050505] text-[#F4F0E8]">
      <MovingPosterType reduceMotion={reduceMotion} />

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
              ZENJI / NEXT RELEASE
            </p>
          </div>

          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 sm:text-[10px]">
            07 SEP / 23:59 BDT
          </p>
        </motion.div>

        <div className="mx-auto max-w-[1220px] py-10 text-center sm:py-14 lg:py-16">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, delay: 0.08, ease: EASE }}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-crimson sm:text-[11px]"
          >
            {hasEnded ? 'ACCESS / ACTIVE' : 'LIMITED DROP / ACCESS AT ZERO'}
          </motion.p>

          <h2 className="mt-4 font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.065em] text-[#F4F0E8]">
            <RevealWords reduceMotion={reduceMotion}>
              {hasEnded ? 'DROP OPEN.' : 'THE GATE OPENS.'}
            </RevealWords>
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: reduceMotion ? 0 : 0.52, delay: 0.22, ease: EASE }}
            className="mx-auto mt-5 max-w-[620px] text-[14px] leading-6 text-white/60 sm:text-[15px] sm:leading-7"
          >
            {hasEnded
              ? 'The release is live. Enter the drop while availability lasts.'
              : 'A limited ZENJI release. Access unlocks the moment the clock reaches zero.'}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 22 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.68, delay: 0.12, ease: EASE }}
            className="relative mx-auto mt-9 max-w-[940px] overflow-hidden border border-white/[0.12] bg-[#080808] px-4 py-6 sm:mt-11 sm:px-7 sm:py-8 lg:px-10 lg:py-10"
            style={{ clipPath: POSTER_CLIP }}
          >
            <span aria-hidden="true" className="absolute left-0 top-0 h-[4px] w-[18%] bg-crimson" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 h-[4px] w-[14%] bg-[#F4F0E8]" />

            {hasEnded ? (
              <div className="flex flex-col items-center gap-6 py-2 sm:py-5">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
                  className="font-display text-[clamp(3.2rem,9vw,7rem)] font-semibold uppercase leading-none tracking-[-0.065em] text-[#F4F0E8]"
                >
                  DROP <span className="text-crimson">OPEN</span>
                </motion.div>

                <a
                  href="/shop"
                  className="group inline-flex min-h-12 items-center justify-center gap-6 bg-crimson px-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0E8] sm:text-[11px]"
                  style={{ clipPath: CTA_CLIP }}
                >
                  ENTER DROP
                  <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </div>
            ) : (
              <div
                role="timer"
                aria-label="Countdown to the next ZENJI release"
                aria-live="off"
              >
                <span className="sr-only">{formattedTime}</span>

                <div className="flex items-start justify-center">
                  {TIME_PARTS.map((part, index) => (
                    <div key={part.key} className="flex items-start">
                      <div className="min-w-0 text-center">
                        <div className="font-display text-[clamp(2.6rem,10vw,6.8rem)] font-semibold leading-none tracking-[-0.07em] text-[#F4F0E8]">
                          <PosterDigit value={time[part.key]} reduceMotion={reduceMotion} />
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

          {!hasEnded && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.4 }}
              className="mx-auto mt-7 flex max-w-[940px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                <motion.span
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-2 w-2 bg-crimson"
                />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 sm:text-[10px]">
                  DROP STATUS / LOCKED
                </span>
              </div>

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white/34 sm:text-[9px]">
                LIMITED RELEASE / 07 SEP
              </span>
            </motion.div>
          )}
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
