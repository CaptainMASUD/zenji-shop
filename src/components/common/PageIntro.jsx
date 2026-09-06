import { motion } from "framer-motion";
export default function PageIntro({ kicker, title, text }) {
  return (
    <section className="site-container border-b border-line pb-12 pt-16 md:pb-16 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 0.8, 0.22, 1] }}
      >
        <p className="eyebrow mb-5">{kicker}</p>
        <h1 className="display-tight max-w-5xl text-[clamp(4.5rem,10vw,10rem)] font-semibold">
          {title}
        </h1>
        {text && (
          <p className="mt-7 max-w-2xl text-sm leading-7 text-silver md:text-base">
            {text}
          </p>
        )}
      </motion.div>
    </section>
  );
}
