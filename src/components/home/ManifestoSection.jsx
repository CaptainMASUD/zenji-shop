import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const BACKGROUND_IMAGE =
  "https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788545713/ChatGPT_Image_Sep_5_2026_12_04_41_AM_yqo1s5.png";

const principles = [
  "LIMITED DROPS",
  "HEAVYWEIGHT BUILD",
  "ANIME, REINTERPRETED",
];

export default function ManifestoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#050505] text-[#F4F0E8]">
      {/* BACKGROUND IMAGE */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={BACKGROUND_IMAGE}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-[1.025] select-none object-cover"
          style={{ objectPosition: "center 42%" }}
        />

        <div className="absolute inset-0 bg-[#050505]/70" />
        <div className="absolute inset-y-0 right-0 w-[82%] bg-[#050505]/38 sm:w-[76%] lg:w-[72%]" />
        <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#050505]/24" />
      </div>

      {/* CONTENT */}
      <div className="site-container relative z-10 py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-8 lg:grid-cols-[0.28fr_1fr] lg:gap-14 xl:gap-20">
            {/* LEFT SIGNAL */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
              className="flex items-start lg:pt-2"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-8 bg-crimson" />
                  <p className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-white/40">
                    ZENJI / MANIFESTO
                  </p>
                </div>

                <p className="mt-4 max-w-[210px] font-mono text-[7px] uppercase leading-5 tracking-[0.17em] text-white/25">
                  BUILT FOR THE VERSION OF YOU THAT COMES NEXT.
                </p>
              </div>
            </motion.div>

            {/* MAIN BRAND STATEMENT */}
            <div className="min-w-0">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: reduceMotion ? 0 : 0.62, ease: EASE }}
                className="relative"
              >
                <p className="font-jp text-[clamp(1.1rem,2.4vw,1.8rem)] font-semibold tracking-[-0.03em] text-crimson">
                  次の自分を着る
                </p>

                <h2 className="mt-3 font-display text-[clamp(3.8rem,9vw,9rem)] font-semibold uppercase leading-[0.76] tracking-[-0.075em] text-[#F4F0E8]">
                  WEAR
                  <br />
                  THE ARC<span className="text-crimson">.</span>
                </h2>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.58,
                  delay: reduceMotion ? 0 : 0.08,
                  ease: EASE,
                }}
                className="mt-8 border-t border-white/[0.10] pt-5 sm:mt-10 sm:pt-6"
              >
                <div className="grid gap-2 sm:grid-cols-3">
                  {principles.map((principle) => (
                    <div
                      key={principle}
                      className="group relative overflow-hidden border border-white/[0.08] bg-[#090909]/78 px-4 py-4 backdrop-blur-[2px] transition-colors duration-300 hover:border-white/[0.20] sm:px-5 sm:py-5"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-full w-[3px] origin-bottom scale-y-[0.2] bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                      />

                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#F4F0E8] sm:text-[9px]">
                        {principle}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[560px] text-[12px] leading-6 text-white/42 sm:text-[13px]">
                    Not costume. Not merch. A uniform for the next version of you.
                  </p>

                  <p className="font-mono text-[6px] font-bold uppercase tracking-[0.20em] text-white/20">
                    ZENJI / BUILT TO EVOLVE
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FRAME DETAILS */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 h-[3px] w-[18%] bg-crimson"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[3px] w-[12%] bg-[#F4F0E8]"
      />
    </section>
  );
}
