import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, ShoppingBag01Icon, UserIcon, FavouriteIcon, Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useShop } from '../../context/ShopContext.jsx';
import IconButton from '../common/IconButton.jsx';

const links = [['/shop','Shop'], ['/drops','Drops'], ['/lookbook','Lookbook'], ['/community','Community'], ['/story','Our Story']];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setSearchOpen } = useShop();
  return <>
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-xl">
      <div className="site-container flex h-[74px] items-center justify-between">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-[-.06em]">ZENJI<span className="text-crimson">.</span></Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([to,label]) => <NavLink key={to} to={to} className={({isActive}) => `text-[12px] font-semibold uppercase tracking-[.12em] transition ${isActive ? 'text-crimson' : 'text-ivory/75 hover:text-ivory'}`}>{label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <IconButton label="Search" onClick={() => setSearchOpen(true)}><HugeiconsIcon icon={Search01Icon} size={17}/></IconButton>
          <Link to="/wishlist" className="relative hidden sm:block"><IconButton label="Wishlist"><HugeiconsIcon icon={FavouriteIcon} size={17}/></IconButton>{wishlistCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-crimson px-1 text-center font-mono text-[9px] text-white">{wishlistCount}</span>}</Link>
          <Link to="/account" className="hidden sm:block"><IconButton label="Account"><HugeiconsIcon icon={UserIcon} size={17}/></IconButton></Link>
          <div className="relative"><IconButton label="Cart" onClick={() => setDrawerOpen(true)}><HugeiconsIcon icon={ShoppingBag01Icon} size={17}/></IconButton>{cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-crimson px-1 text-center font-mono text-[9px] text-white">{cartCount}</span>}</div>
          <IconButton label="Menu" className="lg:hidden" onClick={() => setMobileOpen(true)}><HugeiconsIcon icon={Menu01Icon} size={18}/></IconButton>
        </div>
      </div>
    </header>
    <AnimatePresence>{mobileOpen && <motion.div className="fixed inset-0 z-[80] bg-ink p-5" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="flex items-center justify-between border-b border-line pb-5"><span className="font-display text-2xl font-bold">ZENJI.</span><IconButton label="Close menu" onClick={() => setMobileOpen(false)}><HugeiconsIcon icon={Cancel01Icon} size={18}/></IconButton></div>
      <nav className="mt-12 flex flex-col">{links.map(([to,label], i) => <motion.div key={to} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.06*i}}><Link to={to} onClick={() => setMobileOpen(false)} className="block border-b border-line py-5 font-display text-5xl tracking-[-.05em]">{label}</Link></motion.div>)}</nav>
      <div className="mt-8 grid grid-cols-2 gap-3"><Link to="/wishlist" onClick={()=>setMobileOpen(false)} className="rounded-2xl border border-line p-5 text-sm">Wishlist / {wishlistCount}</Link><Link to="/account" onClick={()=>setMobileOpen(false)} className="rounded-2xl border border-line p-5 text-sm">My account</Link></div>
    </motion.div>}</AnimatePresence>
  </>;
}
