import { useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  UserIcon,
  Location01Icon,
  ViewIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOrders } from "../../context/OrderContext.jsx";
import { useShop } from "../../context/ShopContext.jsx";

export default function AccountLayout() {
  const { user, addresses, logout } = useAuth();
  const { orders } = useOrders();
  const { recentlyViewed } = useShop();
  const nav = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const doLogout = () => {
    logout();
    nav("/");
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeAddresses = Array.isArray(addresses) ? addresses : [];
  const safeRecentlyViewed = Array.isArray(recentlyViewed) ? recentlyViewed : [];

  const navItems = [
    {
      to: "/account",
      label: "Overview",
      icon: DashboardSquare01Icon,
      end: true,
      badge: null,
    },
    {
      to: "/account/orders",
      label: "Orders",
      icon: ShoppingBag01Icon,
      end: false,
      badge: safeOrders.length > 0 ? safeOrders.length : null,
    },
    {
      to: "/account/profile",
      label: "Profile",
      icon: UserIcon,
      end: false,
      badge: null,
    },
    {
      to: "/account/addresses",
      label: "Addresses",
      icon: Location01Icon,
      end: false,
      badge: safeAddresses.length > 0 ? safeAddresses.length : null,
    },
    {
      to: "/account/recently-viewed",
      label: "Recently viewed",
      icon: ViewIcon,
      end: false,
      badge: safeRecentlyViewed.length > 0 ? safeRecentlyViewed.length : null,
    },
  ];

  // Auto-scroll active mobile tab into view smoothly when navigating
  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector('[aria-current="page"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [location.pathname]);

  const firstName = user?.name?.trim()?.split(" ")[0] || "Member";
  const userInitial = firstName.charAt(0).toUpperCase();

  return (
    <section className="site-container py-6 sm:py-10 md:py-14">
      {/* ============================================================
          RESPONSIVE USER IDENTITY HEADER
      ============================================================ */}
      <div className="mb-6 border-b border-line pb-6 sm:mb-8 sm:pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* User Avatar Initial */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-crimson/60 bg-crimson/10 font-display text-lg font-bold text-crimson sm:h-14 sm:w-14 sm:text-xl">
              {userInitial}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                <p className="eyebrow text-[9px] tracking-[0.2em] text-white/50">
                  ZENJI / ARCHIVE
                </p>
              </div>
              <h1 className="truncate font-display text-2xl font-semibold uppercase leading-tight tracking-[-0.04em] text-[#F4F0E8] sm:text-4xl md:text-5xl lg:text-6xl">
                Hello, {firstName}.
              </h1>
              <p className="truncate font-mono text-[10px] tracking-[0.08em] text-silver/60 sm:text-[11px]">
                {user?.email || "verified_member@zenji.shop"}
              </p>
            </div>
          </div>

          <button
            onClick={doLogout}
            className="hidden items-center gap-2 border border-line/80 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-silver transition hover:border-crimson hover:text-crimson sm:inline-flex"
          >
            <HugeiconsIcon icon={Logout01Icon} size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          MAIN ACCOUNT GRID: STICKY MOBILE TABS + DESKTOP SIDEBAR
      ============================================================ */}
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0">
          {/* Mobile & Tablet: Sticky Horizontally Scrollable Tab Bar */}
          {/* Desktop: Vertical Sticky Navigation Column */}
          <nav
            ref={navRef}
            aria-label="Account navigation"
            className="
              no-scrollbar
              -mx-4 flex gap-1.5 overflow-x-auto border-y border-line/70 bg-ink/95 px-4 py-2.5 backdrop-blur-md
              sm:-mx-6 sm:px-6
              lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:border-y-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none
            "
          >
            {navItems.map(({ to, label, icon, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `group flex shrink-0 items-center justify-between gap-2.5 rounded-lg border px-3.5 py-2.5 text-[12px] font-semibold tracking-[0.02em] transition-all duration-200 sm:px-4 sm:py-3 sm:text-[13px] lg:w-full ${
                    isActive
                      ? "border-crimson bg-crimson text-white shadow-[0_0_20px_rgba(215,38,56,0.25)]"
                      : "border-line/70 bg-[#0c0c0c] text-silver hover:border-white/20 hover:text-ivory lg:bg-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <HugeiconsIcon
                        icon={icon}
                        size={16}
                        className={`transition-colors ${
                          isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                        }`}
                      />
                      <span className="whitespace-nowrap">{label}</span>
                    </div>

                    {badge !== null && (
                      <span
                        className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 font-mono text-[8px] font-bold ${
                          isActive
                            ? "bg-white text-crimson"
                            : "bg-white/[0.08] text-white/60 group-hover:bg-white/15"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Mobile-only Logout button in navigation bar */}
            <button
              onClick={doLogout}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-line/70 bg-[#0c0c0c] px-3.5 py-2.5 text-[12px] font-semibold text-silver transition-all hover:border-crimson hover:text-crimson sm:px-4 sm:py-3 sm:text-[13px] lg:hidden"
            >
              <HugeiconsIcon icon={Logout01Icon} size={15} />
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </nav>
        </aside>

        {/* ============================================================
            CHILD COMPONENT OUTLET
        ============================================================ */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

