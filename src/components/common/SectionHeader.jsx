export default function SectionHeader({ kicker, title, action }) {
  return <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-5 md:mb-12">
    <div><p className="eyebrow mb-3">{kicker}</p><h2 className="font-display text-4xl font-semibold tracking-[-.04em] md:text-6xl">{title}</h2></div>
    {action && <div className="hidden md:block">{action}</div>}
  </div>;
}
