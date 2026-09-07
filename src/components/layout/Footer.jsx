import { Link } from 'react-router-dom';

const exploreLinks = [
  ['/shop', 'Shop'],
  ['/drops', 'Drops'],
  ['/lookbook', 'Lookbook'],
  ['/community', 'Community'],
  ['/story', 'Our Story'],
];

const accountLinks = [
  ['/account', 'My Account'],
  ['/wishlist', 'Wishlist'],
  ['/cart', 'Cart'],
  ['/account/orders', 'Orders'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms & Conditions'],
];

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'instagram',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: 'facebook',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: 'tiktok',
  },
];

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="
        group
        inline-flex
        items-center
        gap-2
        text-[13px]
        text-white/48
        transition-colors
        duration-300
        hover:text-[#F4F0E8]
      "
    >
      <span
        className="
          h-[2px]
          w-0
          bg-crimson
          transition-all
          duration-300
          group-hover:w-3
        "
      />

      <span>{children}</span>
    </Link>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="instagramFooterGradient"
          x1="3"
          y1="21"
          x2="21"
          y2="3"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD600" />
          <stop offset="0.35" stopColor="#FF7A00" />
          <stop offset="0.68" stopColor="#FF0169" />
          <stop offset="1" stopColor="#D300C5" />
        </linearGradient>
      </defs>

      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5.25"
        stroke="url(#instagramFooterGradient)"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4.1"
        stroke="url(#instagramFooterGradient)"
        strokeWidth="1.8"
      />

      <circle
        cx="17.45"
        cy="6.75"
        r="1.1"
        fill="#FF3C8E"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M13.62 21v-8.2h2.75l.41-3.2h-3.16V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.29-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.49-4.13 4.24V9.6H7.54v3.2h2.77V21h3.31Z"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.1 4.4c.42 1.65 1.5 2.85 3.2 3.35v2.43a6.1 6.1 0 0 1-3.2-.95v5.04c0 3.18-2.12 5.28-4.9 5.28a4.72 4.72 0 0 1-4.7-4.72c0-2.63 2.02-4.62 4.55-4.71v2.53a2.2 2.2 0 0 0-2.05 2.18 2.2 2.2 0 0 0 2.2 2.2c1.33 0 2.35-.98 2.35-2.46V4.4h2.55Z"
        fill="white"
      />

      <path
        d="M13.45 4.7c.52 1.5 1.56 2.54 3.03 2.98"
        stroke="#25F4EE"
        strokeWidth="1.15"
        strokeLinecap="round"
      />

      <path
        d="M8.75 12.36c-1.18.2-2.04 1.17-2.04 2.33 0 1.25.96 2.23 2.18 2.28"
        stroke="#FE2C55"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return <InstagramIcon />;
  }

  if (type === 'facebook') {
    return <FacebookIcon />;
  }

  return <TikTokIcon />;
}

function SocialLink({ label, href, icon }) {
  const iconStyles = {
    instagram:
      'border-[#E1306C]/35 bg-[#E1306C]/10',

    facebook:
      'border-[#1877F2]/35 bg-[#1877F2]/12 text-[#1877F2]',

    tiktok:
      'border-white/10 bg-white/[0.05]',
  };

  const cardStyles = {
    instagram:
      'hover:border-[#E1306C]/60',

    facebook:
      'hover:border-[#1877F2]/60',

    tiktok:
      'hover:border-[#25F4EE]/45',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`
        group
        flex
        min-w-0
        items-center
        justify-between
        gap-2.5
        border
        border-white/[0.09]
        bg-white/[0.018]
        px-3
        py-2
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-white/[0.035]
        ${cardStyles[icon]}
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            ${iconStyles[icon]}
          `}
        >
          <SocialIcon type={icon} />
        </span>

        <span
          className="
            truncate
            font-mono
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-white/72
            transition-colors
            group-hover:text-white
            sm:text-[11px]
          "
        >
          {label}
        </span>
      </div>

      <span
        className="
          shrink-0
          font-mono
          text-[11px]
          text-white/32
          transition-all
          duration-300
          group-hover:translate-x-0.5
          group-hover:text-white/70
        "
      >
        →
      </span>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-white/[0.08]
        bg-[#070707]
        text-[#F4F0E8]
      "
    >
      {/* BACKDROP ZENJI */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          flex
          items-center
          justify-center
          overflow-hidden
          select-none
        "
      >
        <span
          className="
            translate-y-6
            whitespace-nowrap
            font-display
            text-[clamp(7rem,20vw,20rem)]
            font-bold
            uppercase
            leading-none
            tracking-[-0.09em]
            text-white/[0.022]
          "
        >
          ZENJI
        </span>
      </div>

      {/* TOP ACCENT */}
      <div className="relative z-10 flex h-[3px] w-full">
        <div className="w-[16%] bg-crimson" />
        <div className="flex-1 bg-white/[0.035]" />
      </div>

      <div className="site-container relative z-10">
        <div
          className="
            grid
            gap-12
            py-12
            sm:py-14
            md:py-16
            lg:grid-cols-[1.08fr_.42fr_.42fr_1.42fr]
            lg:gap-8
            xl:gap-12
          "
        >
          {/* BRAND */}
          <div>
            <Link
              to="/"
              aria-label="ZENJI home"
              className="inline-block"
            >
              <p
                className="
                  font-display
                  text-[clamp(4.2rem,8vw,7.8rem)]
                  font-bold
                  uppercase
                  leading-[0.78]
                  tracking-[-0.075em]
                  text-[#F4F0E8]
                "
              >
                ZENJI
                <span className="text-crimson">.</span>
              </p>
            </Link>

            <p
              className="
                mt-7
                max-w-[380px]
                text-[14px]
                leading-7
                text-white/46
                sm:text-[15px]
              "
            >
              Anime-inspired streetwear built around story,
              symbolism and individuality.
            </p>

            <div
              className="
                mt-7
                flex
                max-w-[380px]
                items-center
                gap-3
                border-t
                border-white/[0.08]
                pt-4
              "
            >
              <span className="h-[2px] w-7 bg-crimson" />

              <p
                className="
                  font-mono
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                  sm:text-[9px]
                "
              >
                WEAR YOUR STORY / OWN YOUR PATH
              </p>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <p
              className="
                mb-5
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/30
              "
            >
              Explore
            </p>

            <div className="flex flex-col items-start gap-3.5">
              {exploreLinks.map(([to, label]) => (
                <FooterLink
                  key={to}
                  to={to}
                >
                  {label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* ACCOUNT */}
          <div>
            <p
              className="
                mb-5
                font-mono
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/30
              "
            >
              Account
            </p>

            <div className="flex flex-col items-start gap-3.5">
              {accountLinks.map(([to, label]) => (
                <FooterLink
                  key={to}
                  to={to}
                >
                  {label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* SIGNAL LIST */}
          <div className="min-w-0 lg:pl-2">
            <div className="flex items-center justify-between gap-4">
              <p
                className="
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                Signal List
              </p>

              <span
                className="
                  border
                  border-crimson/30
                  px-2
                  py-1
                  font-mono
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-crimson
                "
              >
                Drop Alerts
              </span>
            </div>

            <p
              className="
                mt-5
                max-w-[520px]
                text-[13px]
                leading-6
                text-white/44
              "
            >
              Be first to know when a new ZENJI transmission,
              limited piece or collection goes live.
            </p>

            {/* EMAIL */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-6 w-full"
            >
              <div
                className="
                  group
                  flex
                  min-h-[50px]
                  w-full
                  items-center
                  border
                  border-white/[0.1]
                  bg-white/[0.018]
                  px-3
                  transition-all
                  duration-300
                  focus-within:border-crimson/70
                  focus-within:bg-white/[0.028]
                "
              >
                <input
                  type="email"
                  required
                  aria-label="Email address"
                  placeholder="YOU@EMAIL.COM"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    py-3
                    pr-3
                    font-mono
                    text-[12px]
                    tracking-[0.06em]
                    text-[#F4F0E8]
                    outline-none
                    placeholder:text-white/24
                    sm:text-[13px]
                  "
                />

                <button
                  type="submit"
                  className="
                    flex
                    h-8
                    shrink-0
                    items-center
                    gap-1.5
                    border-l
                    border-white/[0.08]
                    pl-3
                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-crimson
                    transition-colors
                    hover:text-[#F4F0E8]
                    sm:text-[11px]
                  "
                >
                  Join

                  <span
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </button>
              </div>
            </form>

            {/* SOCIAL */}
            <div className="mt-8">
              <p
                className="
                  mb-3
                  font-mono
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/34
                  sm:text-[10px]
                "
              >
                Follow the Signal
              </p>

              <div
                className="
                  grid
                  gap-2.5
                  sm:grid-cols-3
                  lg:grid-cols-1
                  xl:grid-cols-3
                "
              >
                {socials.map((social) => (
                  <SocialLink
                    key={social.label}
                    {...social}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            relative
            flex
            flex-col
            gap-5
            border-t
            border-white/[0.08]
            py-6
            font-mono
            text-[8px]
            font-bold
            uppercase
            tracking-[0.17em]
            text-white/25
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-[9px]
          "
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {year} ZENJI</span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <Link
              to="/terms"
              className="transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="text-crimson/70">
              AU / JP / GLOBAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}