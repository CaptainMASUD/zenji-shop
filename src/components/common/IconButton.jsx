export default function IconButton({
  label,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      aria-label={label}
      className={`focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink/70 text-ivory transition hover:border-ivory/50 hover:bg-ivory hover:text-ink ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
