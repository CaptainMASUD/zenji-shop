import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  ShoppingBag01Icon,
  UserIcon,
  FavouriteIcon,
  Menu01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'framer-motion';

import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useShop } from '../../context/ShopContext.jsx';
import IconButton from '../common/IconButton.jsx';

const links = [
  ['/shop', 'Shop'],
  ['/drops', 'Drops'],
  ['/lookbook', 'Lookbook'],
  ['/community', 'Community'],
  ['/story', 'Our Story'],
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

const linkVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartCount, setDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { setSearchOpen } = useShop();

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}
      <header
        className={`
          sticky top-0 z-50 border-b
          transition-[background-color,border-color,box-shadow,backdrop-filter]
          duration-300 ease-out
          ${
            isScrolled
              ? 'border-line bg-ink/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
              : 'border-transparent bg-transparent backdrop-blur-none shadow-none'
          }
        `}
      >
        <div className="site-container flex h-[74px] items-center justify-between">
          {/* Logo - ORIGINAL FONT */}
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-[-.06em]"
          >
            ZENJI
            <span className="text-crimson">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                    relative
                    py-1.5
                    font-mono
                    text-[13px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    transition-all
                    duration-300
                    after:absolute
                    after:-bottom-0.5
                    after:left-0
                    after:h-px
                    after:w-full
                    after:origin-left
                    after:transition-transform
                    after:duration-300
                    ${
                      isActive
                        ? 'text-crimson after:scale-x-100 after:bg-crimson'
                        : 'text-ivory/70 after:scale-x-0 after:bg-ivory/50 hover:text-ivory hover:after:scale-x-100'
                    }
                  `
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <HugeiconsIcon icon={Search01Icon} size={17} />
            </IconButton>

            <Link
              to="/wishlist"
              className="relative hidden sm:block"
            >
              <IconButton label="Wishlist">
                <HugeiconsIcon icon={FavouriteIcon} size={17} />
              </IconButton>

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-crimson px-1 text-center font-mono text-[9px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/account"
              className="hidden sm:block"
            >
              <IconButton label="Account">
                <HugeiconsIcon icon={UserIcon} size={17} />
              </IconButton>
            </Link>

            <div className="relative">
              <IconButton
                label="Cart"
                onClick={() => setDrawerOpen(true)}
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} size={17} />
              </IconButton>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-crimson px-1 text-center font-mono text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </div>

            <IconButton
              label="Menu"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <HugeiconsIcon icon={Menu01Icon} size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-ink text-ivory"
          >
            <div className="mx-auto flex min-h-[100dvh] w-full max-w-[520px] flex-col px-5 pb-5 sm:px-7">
              {/* ==================================================
                  HEADER
              ================================================== */}
              <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-line">
                {/* Logo - ORIGINAL FONT */}
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="font-display text-[21px] font-extrabold tracking-[-.06em]"
                >
                  ZENJI
                  <span className="text-crimson">.</span>
                </Link>

                <motion.button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border border-line
                    text-ivory/65
                    transition-all duration-300
                    hover:border-ivory/30
                    hover:bg-white/[0.04]
                    hover:text-ivory
                  "
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={18}
                    strokeWidth={1.6}
                  />
                </motion.button>
              </div>

              {/* ==================================================
                  NAVIGATION
              ================================================== */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 pt-7"
              >
                {/* Original utility font */}
                <motion.div
                  variants={linkVariants}
                  className="mb-2 flex items-center justify-between"
                >
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-ivory/30">
                    Explore
                  </span>

                  <span className="h-px w-9 bg-line" />
                </motion.div>

                <nav>
                  {links.map(([to, label], index) => (
                    <motion.div
                      key={to}
                      variants={linkVariants}
                    >
                      <NavLink
                        to={to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `
                            group
                            relative
                            flex
                            min-h-[64px]
                            items-center
                            border-b
                            border-line
                            transition-colors
                            duration-300
                            ${
                              isActive
                                ? 'text-ivory'
                                : 'text-ivory/72 hover:text-ivory'
                            }
                          `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active crimson line */}
                            <span
                              className={`
                                absolute
                                left-0
                                top-1/2
                                h-6
                                w-[2px]
                                -translate-y-1/2
                                bg-crimson
                                transition-all
                                duration-300
                                ${
                                  isActive
                                    ? 'scale-y-100 opacity-100'
                                    : 'scale-y-0 opacity-0'
                                }
                              `}
                            />

                            {/* Number - ORIGINAL FONT */}
                            <span
                              className={`
                                w-[38px]
                                shrink-0
                                font-mono
                                text-[9px]
                                tracking-[0.08em]
                                transition-colors
                                duration-300
                                ${
                                  isActive
                                    ? 'text-crimson'
                                    : 'text-ivory/22 group-hover:text-crimson/70'
                                }
                              `}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* NAV ITEM ONLY - SAME MONO STYLE AS TOP ANNOUNCEMENT BAR */}
                            <span
                              className="
                                font-mono
                                text-[22px]
                                font-bold
                                uppercase
                                leading-[1.05]
                                tracking-[0.075em]
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:tracking-[0.095em]

                                min-[390px]:text-[24px]
                                sm:text-[26px]
                              "
                            >
                              {label}
                            </span>

                            {/* Active dot */}
                            <span
                              className={`
                                ml-auto
                                h-[5px]
                                w-[5px]
                                rounded-full
                                bg-crimson
                                transition-all
                                duration-300
                                ${
                                  isActive
                                    ? 'scale-100 opacity-100'
                                    : 'scale-0 opacity-0'
                                }
                              `}
                            />
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>

              {/* ==================================================
                  QUICK ACCESS
              ================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.32,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6"
              >
                {/* Original font */}
                <div className="mb-3">
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-ivory/30">
                    Quick Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* ==============================================
                      WISHLIST
                  ============================================== */}
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="
                      group
                      relative
                      flex
                      min-h-[76px]
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-[15px]
                      border
                      border-line
                      bg-white/[0.015]
                      px-3.5
                      transition-all
                      duration-300
                      hover:border-ivory/20
                      hover:bg-white/[0.035]
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-line
                        text-ivory/60
                        transition-all
                        duration-300
                        group-hover:border-crimson/40
                        group-hover:text-crimson
                      "
                    >
                      <HugeiconsIcon
                        icon={FavouriteIcon}
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0">
                      {/* Original font */}
                      <p className="text-[12px] font-semibold text-ivory">
                        Wishlist
                      </p>

                      <p className="mt-0.5 font-mono text-[9px] text-ivory/30">
                        {wishlistCount}{' '}
                        {wishlistCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    {wishlistCount > 0 && (
                      <span
                        className="
                          absolute
                          right-2.5
                          top-2.5
                          flex
                          h-[18px]
                          min-w-[18px]
                          items-center
                          justify-center
                          rounded-full
                          bg-crimson
                          px-1
                          font-mono
                          text-[8px]
                          font-semibold
                          text-white
                        "
                      >
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* ==============================================
                      ACCOUNT
                  ============================================== */}
                  <Link
                    to="/account"
                    onClick={closeMobileMenu}
                    className="
                      group
                      flex
                      min-h-[76px]
                      items-center
                      gap-3
                      rounded-[15px]
                      border
                      border-line
                      bg-white/[0.015]
                      px-3.5
                      transition-all
                      duration-300
                      hover:border-ivory/20
                      hover:bg-white/[0.035]
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-line
                        text-ivory/60
                        transition-all
                        duration-300
                        group-hover:border-crimson/40
                        group-hover:text-crimson
                      "
                    >
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0">
                      {/* Original font */}
                      <p className="whitespace-nowrap text-[12px] font-semibold text-ivory">
                        My Account
                      </p>

                      <p className="mt-0.5 font-mono text-[9px] text-ivory/30">
                        Profile
                      </p>
                    </div>
                  </Link>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}
                <div className="mt-5 flex items-center justify-between border-t border-line py-4">
                  {/* Original font */}
                  <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-ivory/20">
                    Japanese Culture / Streetwear
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-ivory/20" />
                    <span className="h-1 w-1 rounded-full bg-ivory/20" />
                    <span className="h-1 w-1 rounded-full bg-crimson" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}