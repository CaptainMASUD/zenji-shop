import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="border-t border-line bg-[#080808]">
    <div className="site-container py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_.6fr_.6fr_.8fr]">
        <div><p className="font-display text-6xl font-bold tracking-[-.07em] md:text-8xl">ZENJI<span className="text-crimson">.</span></p><p className="mt-5 max-w-sm text-sm leading-7 text-silver">Anime-inspired streetwear for people writing their own arc. Built as a premium frontend assessment concept.</p></div>
        <div><p className="eyebrow mb-5">Explore</p><div className="space-y-3 text-sm">{[['/shop','Shop'],['/drops','Drops'],['/lookbook','Lookbook'],['/community','Community'],['/story','Our Story']].map(([to,l])=><Link key={to} to={to} className="block text-silver hover:text-ivory">{l}</Link>)}</div></div>
        <div><p className="eyebrow mb-5">Account</p><div className="space-y-3 text-sm">{[['/account','My account'],['/wishlist','Wishlist'],['/cart','Cart'],['/account/orders','Orders']].map(([to,l])=><Link key={to} to={to} className="block text-silver hover:text-ivory">{l}</Link>)}</div></div>
        <div><p className="eyebrow mb-5">Signal list</p><p className="mb-4 text-sm text-silver">Get notified before the next transmission drops.</p><div className="flex border-b border-line pb-2"><input className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-silver/60" placeholder="you@email.com"/><button className="font-mono text-[10px] uppercase tracking-[.15em] text-crimson">Join →</button></div></div>
      </div>
      <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[9px] uppercase tracking-[.15em] text-silver sm:flex-row sm:justify-between"><span>© 2026 ZENJI Concept</span><span>Built in React / Context API / Motion</span></div>
    </div>
  </footer>;
}
