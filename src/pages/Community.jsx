import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const STORAGE_KEY = 'zenji-community-fits-v1';

const HERO_FITS = [
  {
    id: 'hero-01',
    image:
      'https://lovecraftgift.com/cdn/shop/files/personalized_anime_college_wear_shirt.jpg?v=1771392430&width=1780',
    handle: '@night.ronin',
    city: 'MELBOURNE',
    tag: 'ORIGIN DROP',
  },
  {
    id: 'hero-02',
    image:
      'https://fensofashion.com/wp-content/uploads/2024/09/Anime-sanemi-Back-scaled.webp',
    handle: '@kaizen.exe',
    city: 'SYDNEY',
    tag: 'CURSED ENERGY',
  },
  {
    id: 'hero-03',
    image:
      'https://rigo.in/cdn/shop/files/WCT05241662MainPic_190eadfc-cff1-4642-bf53-0589753d564f.jpg?v=1745844445',
    handle: '@zero.frame',
    city: 'BRISBANE',
    tag: 'NIGHT RUN',
  },
];

const SEED_FITS = [
  {
    id: 'fit-01',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdXTfjXxveRpY-JTxlIILSAvTmk6n3siRL_169XgM_80-IGbio1b5ipY00&s=10',
    handle: '@akira.afterdark',
    city: 'MELBOURNE',
    drop: 'AWAKENING',
    likes: 184,
    quote: 'Heavy enough to feel like a real piece, not convention merch.',
    aspect: 'tall',
  },
  {
    id: 'fit-02',
    image:
      'https://www.emonke.in/cdn/shop/files/Oversize_-_Women_Black_-_Jujutsu_Kaisen_2.png?v=1757954465',
    handle: '@shonen.studio',
    city: 'SYDNEY',
    drop: 'ORIGIN',
    likes: 129,
    quote: 'The reference is there, but the fit still works on its own.',
    aspect: 'wide',
  },
  {
    id: 'fit-03',
    image:
      'https://i.etsystatic.com/62913397/r/il/7bf46a/8240714293/il_fullxfull.8240714293_d5bf.jpg',
    handle: '@mika.moves',
    city: 'PERTH',
    drop: 'SAMURAI / 01',
    likes: 98,
    quote: 'Wore it to a late screening. Three people caught the detail.',
    aspect: 'square',
  },
  {
    id: 'fit-04',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaN4XAGynfkzeWAHq2BHf0ExZoQxtoLKoO2D1o15gblAaLqpibEw8U1r7n&s=10',
    handle: '@domain.expansion',
    city: 'BRISBANE',
    drop: 'CURSED SIGNAL',
    likes: 241,
    quote: 'Exactly the type of anime streetwear I wanted to actually style.',
    aspect: 'tall',
  },
  {
    id: 'fit-05',
    image:
      'https://lovecraftgift.com/cdn/shop/files/personalized_anime_college_wear_shirt.jpg?v=1771392430&width=1780',
    handle: '@sora.archive',
    city: 'ADELAIDE',
    drop: 'ORIGIN',
    likes: 155,
    quote: 'Oversized without looking lazy. That was the difference for me.',
    aspect: 'wide',
  },
  {
    id: 'fit-06',
    image:
      'https://fensofashion.com/wp-content/uploads/2024/09/Anime-sanemi-Back-scaled.webp',
    handle: '@voidwalker.au',
    city: 'GOLD COAST',
    drop: 'AWAKENING',
    likes: 112,
    quote: 'Subtle enough for everyday. Anime fans still know.',
    aspect: 'square',
  },
  {
    id: 'fit-07',
    image:
      'https://rigo.in/cdn/shop/files/WCT05241662MainPic_190eadfc-cff1-4642-bf53-0589753d564f.jpg?v=1745844445',
    handle: '@ronin.frame',
    city: 'CANBERRA',
    drop: 'SAMURAI / 01',
    likes: 76,
    quote: 'The back print hits hardest when the rest of the fit stays quiet.',
    aspect: 'tall',
  },
  {
    id: 'fit-08',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdXTfjXxveRpY-JTxlIILSAvTmk6n3siRL_169XgM_80-IGbio1b5ipY00&s=10',
    handle: '@zenmode.jpg',
    city: 'SYDNEY',
    drop: 'ORIGIN',
    likes: 203,
    quote: 'Anime influence without feeling like costume energy.',
    aspect: 'wide',
  },
];

const PULSE_ITEMS = [
  'NEW FIT / MELBOURNE',
  'ORIGIN DROP SPOTTED / SYDNEY',
  'NEW CREW MEMBER / PERTH',
  'AWAKENING FIT / BRISBANE',
  'SAMURAI 01 / ADELAIDE',
];

const CREW_STORIES = [
  ['@night.ronin', 'MEL'],
  ['@kaizen.exe', 'SYD'],
  ['@voidwalker.au', 'GC'],
  ['@sora.archive', 'ADL'],
  ['@mika.moves', 'PER'],
];

function Label({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[3px] w-7 bg-crimson" />
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/58 sm:text-[10px]">
        {children}
      </p>
    </div>
  );
}

function FitMeta({ fit, inverse = false }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p
          className={`truncate font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
            inverse ? 'text-[#050505]' : 'text-[#F4F0E8]'
          }`}
        >
          {fit.handle}
        </p>
        <p
          className={`mt-1 font-mono text-[8px] font-semibold uppercase tracking-[0.15em] ${
            inverse ? 'text-black/50' : 'text-white/50'
          }`}
        >
          {fit.city} · {fit.drop ?? fit.tag}
        </p>
      </div>
      {typeof fit.likes === 'number' && (
        <span
          className={`shrink-0 font-mono text-[9px] font-bold tracking-[0.08em] ${
            inverse ? 'text-black/60' : 'text-white/62'
          }`}
        >
          ♡ {fit.likes}
        </span>
      )}
    </div>
  );
}

function HeroTile({ fit, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      initial={reduceMotion ? false : { opacity: 0, y: 24, clipPath: 'inset(8% 0 8% 0)' }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, clipPath: 'inset(0% 0 0% 0)' }}
      transition={{ duration: 0.78, delay, ease: EASE }}
      className={`group relative overflow-hidden bg-[#111] text-left ${className}`}
    >
      <motion.img
        src={fit.image}
        alt={`${fit.handle} ZENJI community fit in ${fit.city}`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={reduceMotion ? undefined : { scale: 1.035 }}
        transition={{ duration: 0.75, ease: EASE }}
      />
      <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/34" />
      <span className="absolute left-0 top-0 h-[4px] w-[24%] bg-crimson" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <FitMeta fit={fit} />
      </div>
    </motion.button>
  );
}

function FitCard({ fit, index, onOpen }) {
  const reduceMotion = useReducedMotion();
  const heightClass =
    fit.aspect === 'tall'
      ? 'min-h-[440px] sm:min-h-[540px]'
      : fit.aspect === 'wide'
        ? 'min-h-[300px] sm:min-h-[360px]'
        : 'min-h-[360px] sm:min-h-[430px]';

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: index % 2 === 0 ? 26 : 38 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, delay: Math.min(index * 0.035, 0.18), ease: EASE }}
      className={`group relative overflow-hidden border border-white/[0.1] bg-[#0B0B0B] ${heightClass}`}
    >
      <button
        type="button"
        onClick={() => onOpen(fit)}
        className="absolute inset-0 z-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson"
        aria-label={`Open community fit by ${fit.handle}`}
      />

      <motion.img
        src={fit.image}
        alt={`${fit.handle} wearing ZENJI in ${fit.city}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={reduceMotion ? undefined : { scale: 1.028 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-400 group-hover:bg-black/38" />
      <span className="absolute left-0 top-0 h-[4px] w-[18%] bg-crimson transition-all duration-500 group-hover:w-[36%]" />

      <div className="absolute inset-x-0 bottom-0 translate-y-[52px] p-4 transition-transform duration-500 group-hover:translate-y-0 sm:p-5">
        <div className="bg-[#050505]/95 p-4">
          <FitMeta fit={fit} />
          <p className="mt-3 max-w-[420px] text-[13px] leading-6 text-white/70 sm:text-[14px]">
            “{fit.quote}”
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function PulseStrip({ reduceMotion }) {
  const items = [...PULSE_ITEMS, ...PULSE_ITEMS];

  return (
    <section className="overflow-hidden border-y border-white/[0.1] bg-[#F4F0E8] py-3 text-[#050505]">
      <div className="site-container mb-2 flex items-center justify-between gap-4">
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-black/48">
          COMMUNITY PULSE
        </p>
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-crimson">
          SIMULATED LIVE
        </p>
      </div>
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex w-max items-center gap-8 whitespace-nowrap px-5"
      >
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-3">
            <span className="h-2 w-2 bg-crimson" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function SubmitFit({ onSubmit }) {
  const reduceMotion = useReducedMotion();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ handle: '', city: '', drop: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setError('');
    setStatus('');

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Keep the image under 4MB for this frontend demo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result ?? ''));
    reader.onerror = () => setError('Could not read that image. Try another one.');
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!preview) {
      setError('Add a fit photo first.');
      return;
    }
    if (!form.handle.trim() || !form.city.trim()) {
      setError('Add your handle and city.');
      return;
    }

    onSubmit({
      id: `community-${Date.now()}`,
      image: preview,
      handle: form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
      city: form.city.trim().toUpperCase(),
      drop: form.drop.trim().toUpperCase() || 'ZENJI FIT',
      likes: 0,
      quote: 'Fresh from the crew.',
      aspect: 'tall',
    });

    setPreview('');
    setForm({ handle: '', city: '', drop: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatus('FIT ADDED TO YOUR LOCAL COMMUNITY WALL.');
  };

  return (
    <section id="share-your-fit" className="border-b border-white/[0.1] bg-[#080808] py-12 sm:py-14 lg:py-18">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:gap-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.62, ease: EASE }}
          >
            <Label>YOUR TURN</Label>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
              SHARE YOUR <span className="text-crimson">FIT.</span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-7 text-white/58 sm:text-[15px]">
              Add a photo to this frontend community wall. Nothing is uploaded to a server in this demo.
            </p>
          </motion.div>

          <form onSubmit={submit} className="grid gap-4 border-t border-white/[0.12] pt-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex min-h-[280px] w-full items-center justify-center overflow-hidden border border-dashed border-white/20 bg-[#0B0B0B] text-left outline-none transition-colors hover:border-crimson focus-visible:ring-2 focus-visible:ring-crimson sm:min-h-[340px]"
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Your fit preview" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/18 transition-colors group-hover:bg-black/38" />
                    <span className="absolute bottom-4 left-4 bg-[#050505] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                      CHANGE PHOTO
                    </span>
                  </>
                ) : (
                  <div className="text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center border border-white/20 text-2xl text-crimson">+</span>
                    <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#F4F0E8]">
                      ADD YOUR FIT
                    </p>
                    <p className="mt-2 text-[13px] text-white/42">JPG / PNG / WEBP · MAX 4MB</p>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="sr-only"
                aria-label="Upload your ZENJI fit photo"
              />
            </div>

            <label className="block">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">HANDLE</span>
              <input
                value={form.handle}
                onChange={(event) => update('handle', event.target.value)}
                placeholder="@yourname"
                className="mt-2 min-h-12 w-full border border-white/[0.14] bg-[#050505] px-4 text-[14px] text-white outline-none placeholder:text-white/24 focus:border-crimson"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">CITY</span>
              <input
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                placeholder="Melbourne"
                className="mt-2 min-h-12 w-full border border-white/[0.14] bg-[#050505] px-4 text-[14px] text-white outline-none placeholder:text-white/24 focus:border-crimson"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">ANIME / DROP</span>
              <input
                value={form.drop}
                onChange={(event) => update('drop', event.target.value)}
                placeholder="Origin Drop / Awakening / Gojo fit..."
                className="mt-2 min-h-12 w-full border border-white/[0.14] bg-[#050505] px-4 text-[14px] text-white outline-none placeholder:text-white/24 focus:border-crimson"
              />
            </label>

            <div className="sm:col-span-2">
              <AnimatePresence mode="wait">
                {(error || status) && (
                  <motion.p
                    key={error || status}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
                      error ? 'text-crimson' : 'text-white/58'
                    }`}
                    aria-live="polite"
                  >
                    {error || status}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="group flex min-h-[54px] w-full items-center justify-between bg-crimson px-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#F4F0E8] hover:text-[#050505] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                SHARE WITH THE CREW
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function FitModal({ fit, onClose }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!fit) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fit, onClose]);

  return (
    <AnimatePresence>
      {fit && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) onClose();
          }}
          role="presentation"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.32, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label={`Community fit by ${fit.handle}`}
            className="grid max-h-[92svh] w-full max-w-[1040px] overflow-auto border border-white/[0.14] bg-[#050505] sm:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]"
          >
            <div className="relative min-h-[420px] bg-[#0A0A0A] sm:min-h-[620px]">
              <img src={fit.image} alt={`${fit.handle} community fit`} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-0 top-0 h-[5px] w-[26%] bg-crimson" />
            </div>
            <div className="flex flex-col justify-between p-5 sm:p-7">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <Label>CREW FIT</Label>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center border border-white/[0.14] text-lg text-white/70 transition-colors hover:border-crimson hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                    aria-label="Close fit preview"
                  >
                    ×
                  </button>
                </div>
                <h3 className="mt-8 font-display text-[clamp(2.1rem,4vw,4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
                  {fit.handle}
                </h3>
                <p className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-crimson">
                  {fit.city} / {fit.drop}
                </p>
                <p className="mt-8 text-[15px] leading-7 text-white/68 sm:text-[16px]">“{fit.quote}”</p>
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-white/[0.1] pt-4">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">ZENJI / COMMUNITY</span>
                <span className="font-mono text-[10px] font-bold text-white/65">♡ {fit.likes ?? 0}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Community() {
  const reduceMotion = useReducedMotion();
  const [submittedFits, setSubmittedFits] = useState([]);
  const [selectedFit, setSelectedFit] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setSubmittedFits(saved);
    } catch {
      setSubmittedFits([]);
    }
  }, []);

  const fits = useMemo(() => [...submittedFits, ...SEED_FITS], [submittedFits]);

  const addFit = (fit) => {
    setSubmittedFits((current) => {
      const next = [fit, ...current].slice(0, 12);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Keep the post in session when browser storage quota is unavailable.
      }
      return next;
    });
  };

  return (
    <main className="overflow-hidden bg-[#050505] text-[#F4F0E8]">
      {/* LIVE CREW / VISUAL OPENING */}
      <section className="border-b border-white/[0.1] pb-7 pt-5 sm:pb-9 sm:pt-6 lg:pb-12">
        <div className="site-container">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.1] pb-4">
            <Label>ZENJI / COMMUNITY</Label>
            <div className="flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/48">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-crimson opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 bg-crimson" />
              </span>
              LIVE WALL
            </div>
          </div>

          <div className="grid gap-5 py-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-10 lg:py-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: EASE }}
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-crimson">REAL FITS / AUSTRALIA</p>
              <h1 aria-label="THE CREW, IN THE WILD." className="mt-4 max-w-[760px] font-display text-[clamp(2.9rem,6.4vw,6.4rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em]">
                THE CREW,
                <br />
                <span className="text-crimson">IN THE WILD.</span>
              </h1>
            </motion.div>
            <div className="lg:pb-1 lg:text-right">
              <p className="max-w-md text-[15px] leading-7 text-white/60 sm:text-[16px] lg:ml-auto">
                Real people. Real fits. Same energy.
              </p>
              <a
                href="#share-your-fit"
                className="mt-4 inline-flex min-h-11 items-center gap-5 border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-crimson hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                SHARE YOUR FIT <span>↘</span>
              </a>
            </div>
          </div>

          <div className="mb-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
            {CREW_STORIES.map(([handle, city], index) => (
              <div key={handle} className="shrink-0 text-center">
                <div className="mx-auto h-14 w-14 border border-crimson p-[3px]">
                  <img
                    src={HERO_FITS[index % HERO_FITS.length].image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 max-w-[70px] truncate font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-white/62">
                  {handle}
                </p>
                <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/35">{city}</p>
              </div>
            ))}
          </div>

          <div className="grid min-h-[620px] gap-3 sm:grid-cols-2 lg:min-h-[680px] lg:grid-cols-[1.4fr_.6fr_.6fr] lg:grid-rows-2 lg:gap-4">
            <HeroTile fit={HERO_FITS[0]} className="min-h-[400px] sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-0" />
            <HeroTile fit={HERO_FITS[1]} delay={0.08} className="min-h-[300px] lg:min-h-0" />
            <HeroTile fit={HERO_FITS[2]} delay={0.14} className="min-h-[300px] lg:min-h-0" />
            <div className="hidden border-y border-white/[0.11] p-5 lg:col-span-2 lg:flex lg:items-end lg:justify-between">
              <p className="font-display text-[clamp(1.6rem,2.5vw,2.8rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em]">
                FIT CHECKS. NIGHT RUNS. CON DAYS. <span className="text-crimson">EVERYDAY ZENJI.</span>
              </p>
              <span className="ml-6 shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">CREW / 2026</span>
            </div>
          </div>
        </div>
      </section>

      <PulseStrip reduceMotion={reduceMotion} />

      {/* LIVE FIT WALL */}
      <section className="border-b border-white/[0.1] py-10 sm:py-12 lg:py-16">
        <div className="site-container">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-9">
            <div>
              <Label>LIVE FIT WALL</Label>
              <h2 className="mt-3 font-display text-[clamp(2.25rem,4.8vw,4.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
                SPOTTED <span className="text-crimson">OUTSIDE.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-6 text-white/50 sm:text-[15px]">
              Tap a fit for the full frame.
            </p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {fits.map((fit, index) => (
              <div key={fit.id} className="mb-4 break-inside-avoid">
                <FitCard fit={fit} index={index} onOpen={setSelectedFit} />
              </div>
            ))}
          </div>
        </div>
      </section>


      <SubmitFit onSubmit={addFit} />

      {/* CLOSING / COMMUNITY SIGNAL */}
      <section className="bg-[#050505] py-14 sm:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-8 border-y border-white/[0.12] py-8 lg:grid-cols-[1fr_auto] lg:items-end lg:py-10">
            <div>
              <Label>ZENJI / CREW</Label>
              <p className="mt-4 max-w-[900px] font-display text-[clamp(2.1rem,4.8vw,4.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
                WE MAKE THE PIECE. <span className="text-crimson">YOU GIVE IT A LIFE.</span>
              </p>
            </div>
            <a
              href="#share-your-fit"
              className="inline-flex min-h-[50px] items-center justify-between gap-8 bg-[#F4F0E8] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-crimson hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            >
              JOIN THE WALL <span>↑</span>
            </a>
          </div>
        </div>
      </section>

      <FitModal fit={selectedFit} onClose={() => setSelectedFit(null)} />
    </main>
  );
}
