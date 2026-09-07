import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
} from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const HERO_IMAGE =
  'https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788784426/ChatGPT_Image_Sep_7_2026_06_33_12_PM_hkspp9.png';

const PEOPLE_IMAGE =
  'https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788784082/ChatGPT_Image_Sep_7_2026_06_27_56_PM_ygzvrl.png';
const INFLUENCE_IMAGE =
  'https://res.cloudinary.com/dwj5oqpqz/image/upload/v1788683542/ChatGPT_Image_Sep_6_2026_02_31_57_PM_mln7v9.png';

const AUDIENCE = [
  { word: 'DREAMERS', text: 'See more than what already exists.' },
  { word: 'FIGHTERS', text: 'Keep moving when the path gets hard.' },
  { word: 'CREATORS', text: 'Turn influence into something personal.' },
  { word: 'OUTSIDERS', text: 'Never needed permission to belong.' },
];

const ABOUT_ROWS = [
  ['WHAT ZENJI IS', 'Australian anime streetwear brand.'],
  ['FOUNDED', '2024.'],
  ['WHAT WE MAKE', 'Limited-edition anime-inspired graphic tees in 100% heavyweight 240gsm cotton.'],
  ['PRICING', 'A$39.99, with selected pieces on sale at A$33.99.'],
  ['SHIPPING', 'Australia-wide. Free shipping on orders over A$100.'],
  ['DELIVERY', 'Standard delivery in 5–10 business days.'],
  ['RESTOCKS', 'Never. Once a piece sells out, it is gone for good.'],
  ['BASED IN', 'Australia, shipping to every state and territory including Sydney, Melbourne, Brisbane, Perth and Adelaide.'],
];

const INFLUENCES = [
  'SAMURAI DISCIPLINE',
  'JAPANESE ICONOGRAPHY',
  'MODERN ANIME ART',
  'OVERSIZED STREETWEAR',
];

function Label({ children, dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[3px] w-7 bg-crimson" />
      <span
        className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
          dark ? 'text-black/52' : 'text-white/54'
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function Reveal({
  children,
  className = '',
  delay = 0,
  x = 0,
  y = 18,
  amount = 0.55,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.68, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Story() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-hidden bg-[#050505] text-[#F4F0E8]">
      {/* INTRO / CLEAN BRAND BANNER */}
      <section className="border-b border-white/[0.1] bg-[#050505]">
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative h-[210px] w-full overflow-hidden bg-[#080808] sm:h-[250px] md:h-[300px] lg:h-[340px] xl:h-[370px] 2xl:h-[390px]"
        >
          <motion.img
            src={HERO_IMAGE}
            alt="ZENJI anime streetwear brand banner"
            initial={reduceMotion ? false : { scale: 1.008 }}
            animate={reduceMotion ? undefined : { scale: 1 }}
            transition={{ duration: 1.05, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </motion.figure>

        <div className="site-container">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] py-5 sm:py-6">
            <Label>ANIME STREETWEAR / AUSTRALIA</Label>

            <div className="flex items-center gap-4 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/42 sm:gap-5 sm:text-[10px]">
              <span>EST. 2024</span>
              <span className="h-3 w-px bg-white/14" />
              <span>AUSTRALIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGIN / STORY SPINE */}
      <section className="relative border-b border-white/[0.1] bg-[#080808] py-14 sm:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <Label>ORIGIN / WHY ZENJI</Label>
              <Reveal className="mt-5 max-w-[420px]">
                <p className="font-display text-[clamp(1.65rem,2.8vw,2.8rem)] font-semibold uppercase leading-[1] tracking-[-0.04em] text-white/90">
                  A STREETWEAR LABEL BUILT AROUND STORY, SYMBOL AND SELF-EXPRESSION.
                </p>
              </Reveal>
            </div>

            <div className="relative pl-7 sm:pl-10">
              <motion.div
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-crimson"
              />

              <div className="space-y-9 sm:space-y-11">
                <Reveal x={18} y={0}>
                  <p className="max-w-[780px] text-[16px] leading-8 text-white/68 sm:text-[17px]">
                    Inspired by samurai discipline, anime art and modern street culture, we create premium streetwear for those who choose their own path.
                  </p>
                </Reveal>

                <Reveal x={18} y={0} delay={0.05}>
                  <p className="max-w-[780px] text-[16px] leading-8 text-white/68 sm:text-[17px]">
                    Every ZENJI piece combines Japanese-inspired artwork, powerful symbolism and oversized silhouettes to express courage, creativity and individuality.
                  </p>
                </Reveal>

                <Reveal x={18} y={0} delay={0.1}>
                  <div className="max-w-[820px] border-y border-white/[0.12] py-6">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-crimson">
                      THE WARRIOR WITHIN
                    </p>
                    <p className="mt-3 text-[16px] leading-8 text-white/72 sm:text-[17px]">
                      ZENJI is more than a name on a shirt. It represents the part of us that keeps moving forward, stays true to itself and refuses to fade into the crowd.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE / PEOPLE INDEX */}
      <section className="border-b border-black/15 bg-[#F4F0E8] py-14 text-[#050505] sm:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-6 border-b border-black/15 pb-6 md:grid-cols-[.72fr_1.28fr] md:items-end md:gap-10">
            <Label dark>WHO WE DESIGN FOR</Label>
            <p className="max-w-xl text-[15px] leading-7 text-black/58 sm:text-[16px] md:justify-self-end md:text-right">
              For people building a future on their own terms — not waiting for one to be handed to them.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:gap-12 xl:grid-cols-[.76fr_1.24fr] xl:gap-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <motion.figure
                initial={reduceMotion ? false : { clipPath: 'inset(0 0 14% 0)', opacity: 0.72 }}
                whileInView={reduceMotion ? undefined : { clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="relative h-[340px] overflow-hidden bg-[#111] sm:h-[390px] lg:h-[440px] xl:h-[460px]"
              >
                <motion.img
                  src={PEOPLE_IMAGE}
                  alt="ZENJI audience in contemporary streetwear"
                  loading="lazy"
                  decoding="async"
                  initial={reduceMotion ? false : { scale: 1.04 }}
                  whileInView={reduceMotion ? undefined : { scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 1.15, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 44%' }}
                />
                <div className="absolute inset-0 bg-black/18" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#050505]/88 px-4 py-3 text-[#F4F0E8] sm:px-5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/58 sm:text-[10px]">
                    PEOPLE / ZENJI
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson sm:text-[10px]">
                    OWN YOUR PATH
                  </span>
                </div>
                <motion.span
                  aria-hidden="true"
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
                  className="absolute left-0 top-0 h-[34%] w-[4px] origin-top bg-crimson"
                />
              </motion.figure>
            </div>

            <div className="border-t border-black/15">
              {AUDIENCE.map((item, index) => (
                <motion.div
                  key={item.word}
                  initial={reduceMotion ? false : { opacity: 0, x: 22 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.58, delay: index * 0.045, ease: EASE }}
                  className="group relative grid gap-3 overflow-hidden border-b border-black/15 py-6 sm:grid-cols-[.68fr_1.32fr] sm:items-center sm:gap-8 sm:py-7 lg:py-8"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.66, delay: 0.08 + index * 0.04, ease: EASE }}
                    className="absolute left-0 top-0 h-[3px] w-10 origin-left bg-crimson transition-all duration-300 group-hover:w-20"
                  />
                  <p className="font-display text-[clamp(1.75rem,3vw,3rem)] font-semibold uppercase leading-none tracking-[-0.045em]">
                    {item.word}
                  </p>
                  <p className="max-w-md text-[15px] leading-7 text-black/58 sm:text-[16px]">
                    {item.text}
                  </p>
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / INFORMATION INDEX */}
      <section className="border-b border-black/15 bg-[#F4F0E8] py-14 text-[#050505] sm:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
            <div>
              <Label dark>ABOUT ZENJI</Label>
              <Reveal className="mt-5">
                <p className="max-w-sm font-display text-[clamp(1.9rem,3.4vw,3.4rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em]">
                  THE BRAND,
                  <br />
                  AT A GLANCE.
                </p>
              </Reveal>
            </div>

            <div className="border-t border-black/15">
              {ABOUT_ROWS.map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.65 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.035, 0.18), ease: EASE }}
                  className="grid gap-2 border-b border-black/15 py-5 sm:grid-cols-[180px_1fr] sm:gap-8 sm:py-6"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/44">
                    {label}
                  </p>
                  <p className="max-w-[760px] text-[15px] leading-7 text-black/70 sm:text-[16px]">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INFLUENCE / DESIGN LANGUAGE */}
      <section className="relative overflow-hidden border-b border-white/[0.1] bg-[#070707] py-14 sm:py-16 lg:py-20">
        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, x: 60 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: EASE }}
          className="pointer-events-none absolute -right-6 top-2 hidden font-display text-[clamp(7rem,14vw,14rem)] font-semibold uppercase leading-none tracking-[-0.07em] text-white/[0.022] lg:block"
        >
          侍
        </motion.div>

        <div className="site-container relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/[0.1] pb-5">
            <Label>INFLUENCE / DESIGN LANGUAGE</Label>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 sm:text-[10px]">
              VISUAL CODE / ZENJI
            </p>
          </div>

          <div className="grid gap-8 pt-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-10 xl:grid-cols-[.86fr_1.14fr] xl:gap-12">
            <motion.figure
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, clipPath: 'inset(0 0 12% 0)' }
              }
              whileInView={
                reduceMotion
                  ? undefined
                  : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
              }
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative min-h-[270px] overflow-hidden bg-[#111] sm:min-h-[330px] lg:min-h-[420px] xl:min-h-[450px]"
              style={{
                clipPath:
                  'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))',
              }}
            >
              <motion.img
                src={INFLUENCE_IMAGE}
                alt="ZENJI anime-inspired streetwear campaign"
                loading="lazy"
                decoding="async"
                initial={reduceMotion ? false : { scale: 1.045 }}
                whileInView={reduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.25, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center center' }}
              />

              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-y-0 right-0 w-px bg-white/20" />

              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
                className="absolute left-0 top-0 h-[34%] w-[4px] origin-top bg-crimson"
              />

              <div className="absolute left-4 top-4 border border-white/15 bg-[#050505]/82 px-3 py-2 backdrop-blur-sm sm:left-5 sm:top-5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/48 sm:text-[9px]">
                  FORM / SYMBOL / ATTITUDE
                </p>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-[#050505]/88 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/52 sm:text-[9px]">
                  CAMPAIGN STUDY / JAPANESE STREET CULTURE
                </p>
                <p className="font-display text-sm font-semibold uppercase tracking-[-0.02em] text-crimson sm:text-base">
                  侍
                </p>
              </div>
            </motion.figure>

            <div className="flex min-h-full flex-col justify-between border-y border-white/[0.12] py-6 sm:py-7 lg:py-6 xl:py-7">
              <div>
                <Reveal>
                  <h2 className="max-w-[560px] font-display text-[clamp(2rem,3.5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
                    DISCIPLINE IN FORM.
                    <br />
                    <span className="text-crimson">IMPACT IN DETAIL.</span>
                  </h2>
                </Reveal>

                <div className="mt-7 border-t border-white/[0.11] sm:mt-8">
                  {INFLUENCES.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.72 }}
                      transition={{ duration: 0.5, delay: index * 0.055, ease: EASE }}
                      className="group relative overflow-hidden border-b border-white/[0.1] py-4 sm:py-5"
                    >
                      <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-crimson transition-transform duration-300 group-hover:scale-y-100" />
                      <p className="pl-0 font-display text-[clamp(1.25rem,2vw,2rem)] font-semibold uppercase leading-none tracking-[-0.035em] text-white/88 transition-all duration-300 group-hover:pl-4 group-hover:text-white">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* LIMITED / BUSINESS MODEL */}
      <section className="relative overflow-hidden border-b border-white/[0.1] bg-[#050505] py-14 sm:py-16 lg:py-20">
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { x: ['0%', '-4%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-[-2%] top-4 whitespace-nowrap font-display text-[clamp(4rem,11vw,10rem)] font-semibold uppercase leading-none tracking-[-0.06em] text-white/[0.025]"
        >
          LIMITED / LIMITED / LIMITED / LIMITED /
        </motion.div>

        <div className="site-container relative z-10">
          <div className="grid gap-8 border-l-[5px] border-crimson pl-5 sm:pl-7 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-14 lg:pl-10">
            <div>
              <Label>LIMITED MEANS LIMITED</Label>
              <Reveal className="mt-5">
                <h2 aria-label="NO RESTOCKS. EVER." className="font-display text-[clamp(2.2rem,4.6vw,4.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
                  NO RESTOCKS. <span className="text-crimson">EVER.</span>
                </h2>
              </Reveal>
              <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-white/62 sm:text-[16px]">
                ZENJI products are limited edition. Once a piece sells out, it is gone for good.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="border-t border-white/[0.14] pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">NEXT DROP</p>
                <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.035em]">ORIGIN DROP</p>
                <p className="mt-2 text-[14px] leading-6 text-white/56">In stock and shipping now.</p>
              </div>
              <div className="border-t border-white/[0.14] pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">SELECTED PIECES</p>
                <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.035em] text-crimson">15% OFF</p>
                <p className="mt-2 text-[14px] leading-6 text-white/56">Current selected styles only.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL / COLLECTION CTA */}
      <section className="relative overflow-hidden bg-[#F4F0E8] py-16 text-[#050505] sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-14">
            <div>
              <Label dark>ZENJI / THE NEXT CHAPTER</Label>
              <Reveal className="mt-6">
                <h2 className="max-w-[820px] font-display text-[clamp(2.25rem,4.7vw,4.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
                  WEAR YOUR STORY.
                  <br />
                  WEAR YOUR SPIRIT.
                  <br />
                  <span className="text-crimson">WEAR ZENJI.</span>
                </h2>
              </Reveal>
            </div>

            <div className="border-t border-black/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="max-w-lg text-[16px] leading-7 text-black/62 sm:text-[17px]">
                For the dreamers. Fighters. Creators. Outsiders.
              </p>

              <Link
                to="/shop"
                className="group mt-7 flex min-h-[52px] w-full items-center justify-between bg-[#050505] px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#F4F0E8] transition-colors hover:bg-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F0E8] sm:max-w-[360px]"
              >
                EXPLORE THE COLLECTION
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
