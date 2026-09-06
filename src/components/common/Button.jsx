import { motion } from "framer-motion";
export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-ivory text-ink border-ivory hover:bg-crimson hover:border-crimson hover:text-ivory",
    dark: "bg-ink text-ivory border-line hover:border-ivory/60",
    ghost:
      "bg-transparent text-ivory border-line hover:bg-ivory hover:text-ink",
    crimson:
      "bg-crimson text-white border-crimson hover:bg-[#b91e2d] hover:border-[#b91e2d]",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      <span aria-hidden>↗</span>
    </motion.button>
  );
}
