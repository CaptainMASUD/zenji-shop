import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Shield01Icon,
  LockPasswordIcon,
  ViewOffIcon,
  Database01Icon,
} from "@hugeicons/core-free-icons";

const EASE = [0.16, 1, 0.3, 1];

const SECTIONS = [
  {
    id: "collection",
    code: "SEC_01",
    title: "Information We Collect",
    summary:
      "Details regarding personal data provided during checkout, account creation, or device transmission.",
    content: [
      "When you interact with ZENJI — whether placing an order for a finite drop, creating an archive profile, or subscribing to our Signal List — we collect relevant personal details necessary to provide you with our apparel and services.",
      "Direct Information: Includes your name, shipping address, billing address, email, phone number, and account credentials. Payment details (e.g. credit card tokens) are handled exclusively via secure encrypted third-party payment gateways; ZENJI does not store raw payment card data on local servers.",
      "Automated Transmission Data: As you navigate the shop, our systems record technical signals including your IP address, browser type, device identifiers, time-zone preferences, and viewing history. This ensures accurate currency formatting, regional delivery estimates, and stable interface rendering.",
    ],
  },
  {
    id: "usage",
    code: "SEC_02",
    title: "How We Use Your Data",
    summary:
      "Our principles for utilizing signals to power releases, fulfill garments, and secure the storefront.",
    content: [
      "Garment Order Fulfillment: To process your transactions, coordinate courier logistics, dispatch drop alerts, and generate shipment tracking transmissions.",
      "Drop Access & Anti-Bot Protection: We analyze request rates and transaction patterns to prevent automated scalper bots and safeguard fair drop allocations for genuine collectors.",
      "Transmission Communications: If opted into the Signal List, we transmit announcements regarding new collection drops, restock verifications, and editorial showcases. You retain unconditional rights to unsubscribe from marketing dispatches at any time.",
      "Experience Refinement: Anonymized interaction telemetry enables our design and engineering teams to optimize responsiveness, improve page load performance, and eliminate interface bottlenecks.",
    ],
  },
  {
    id: "cookies",
    code: "SEC_03",
    title: "Cookies & Local Storage",
    summary:
      "Transparency regarding browser storage, bag persistence, and session retention.",
    content: [
      "ZENJI employs essential browser cookies and modern web LocalStorage to deliver a seamless shopping journey across devices.",
      "Essential State: Your active shopping bag lines, saved sizing selections, dark aesthetic configurations, and wishlist bookmarks are maintained locally so your curated pieces are never discarded mid-session.",
      "Analytical Signals: We deploy lightweight, privacy-focused telemetry tokens to measure overall storefront health, page traffic trends, and navigational flow without constructing invasive behavioral tracking profiles.",
      "You have full discretion to clear or block cookies through your browser preference dashboard; however, disabling local storage will reset your cart and saved preferences upon page reload.",
    ],
  },
  {
    id: "sharing",
    code: "SEC_04",
    title: "Third-Party Disclosures",
    summary:
      "We never trade or sell your identity. Third-party disclosures are strictly limited to fulfillment partners.",
    content: [
      "ZENJI does not sell, rent, monetize, or trade your personal information to third-party data brokers or marketing conglomerates. Period.",
      "Essential Logistics Partners: Your delivery details are transmitted solely to bonded international carriers (e.g., DHL Express, FedEx, local postal services) for the sole purpose of transporting your drop parcels.",
      "Infrastructure & Security: Trusted cloud providers (hosting environments, Cloudinary media CDN, and transaction processors) process data under strict contractual non-disclosure and security compliance covenants.",
      "Legal Compliance: We disclose data only when explicitly compelled by binding court orders, applicable law, or to protect the safety and property of our community and crew.",
    ],
  },
  {
    id: "rights",
    code: "SEC_05",
    title: "Your Rights & Data Portability",
    summary:
      "Your rights to review, modify, export, or permanently erase your archived records.",
    content: [
      "Right to Access: You may request a complete digital ledger of the personal records ZENJI maintains regarding your identity and order archive.",
      "Right to Rectification: You have full authority to update or correct inaccurate profile credentials, delivery locations, or communication preferences via your Account dashboard or by reaching out to support.",
      "Right to Erasure (The Right to be Forgotten): Upon verified request, we will expunge your personal account ledger and non-transactional identifiers from our live production databases, subject only to mandatory statutory tax and accounting retention laws.",
      "Opt-Out: You can sever marketing transmissions instantly by clicking the unsubscribe token in any email footer or contacting our support desk.",
    ],
  },
  {
    id: "security",
    code: "SEC_06",
    title: "Security & Data Safeguards",
    summary:
      "Defense-in-depth technical protocols safeguarding transmission channels and data storage.",
    content: [
      "All network transmissions between your device and the ZENJI storefront are sealed using TLS 1.3 end-to-end cryptographic encryption.",
      "Access to administrative order databases is restricted by multi-factor authentication and role-based permissions granted strictly to authorized fulfillment personnel.",
      "While no digital architecture can guarantee absolute impenetrability, we continuously audit, patch, and enhance our infrastructure against vulnerabilities, unauthorized access, and tampering.",
    ],
  },
  {
    id: "demo",
    code: "SEC_07",
    title: "Frontend Concept Notice",
    summary:
      "Important context regarding this digital portfolio and commerce assessment concept.",
    content: [
      "ZENJI is developed as an elite digital commerce concept and frontend assessment showcase. All checkout steps, account dashboards, review submissions, and order numbers generated in this build are processed client-side with mock transactional states.",
      "No real credit card charges, recurring subscriptions, or physical fulfillment pipelines are active in this assessment demonstration. Personal demo information submitted into local forms remains stored strictly within your own browser's localStorage.",
    ],
  },
  {
    id: "contact",
    code: "SEC_08",
    title: "Inquiries & Contact Channel",
    summary:
      "How to reach the ZENJI privacy officers or summon support.",
    content: [
      "For questions regarding this Privacy Policy, data privacy requests, or rights enforcement, contact our legal and privacy operations desk:",
      "Signal: legal@zenji.store\nSubject: ATTN: Privacy Operations Officer\nArchive Hub: Shibuya, Tokyo / Sydney, Australia",
      "You can also initiate a live summon through the on-site Shikigami Assistant widget at any time for immediate navigational or sizing guidance.",
    ],
  },
];

const HIGHLIGHTS = [
  {
    icon: ViewOffIcon,
    title: "ZERO DATA SALES",
    desc: "We never monetize, rent, or vend your private personal signals to marketing brokers.",
  },
  {
    icon: LockPasswordIcon,
    title: "TLS ENCRYPTION",
    desc: "All transmissions and checkouts are sealed with bank-grade transport-layer cryptography.",
  },
  {
    icon: Database01Icon,
    title: "LOCAL CONTROL",
    desc: "Cart, sizing bookmarks, and aesthetic states remain stored safely in your own browser.",
  },
  {
    icon: Shield01Icon,
    title: "RIGHT TO FORGET",
    desc: "Full autonomy to export, alter, or permanently expunge your account data upon request.",
  },
];

export default function PrivacyPolicy() {
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#F4F0E8]">
      {/* BACKGROUND GRAPHIC ACCENT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-20 select-none opacity-[0.02]"
      >
        <span className="font-display text-[26vw] font-black uppercase leading-none tracking-tighter text-white">
          POLICY
        </span>
      </div>

      {/* TOP CRIMSON ACCENT LINE */}
      <div className="flex h-[3px] w-full">
        <div className="w-[18%] bg-crimson" />
        <div className="flex-1 bg-white/[0.04]" />
        <div className="w-[6%] bg-crimson" />
      </div>

      {/* HERO BANNER */}
      <section className="border-b border-white/[0.08] bg-[#070707] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          {/* BREADCRUMB & METADATA */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-wrap items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40"
          >
            <Link to="/" className="transition-colors hover:text-white">
              ZENJI
            </Link>
            <span className="text-crimson">/</span>
            <span>LEGAL ARCHIVE</span>
            <span className="text-crimson">/</span>
            <span className="text-white/70">PRIVACY POLICY</span>

            <div className="ml-auto hidden items-center gap-4 sm:flex">
              <span className="border border-white/10 px-2 py-0.5 text-[8px] text-white/50">
                DOC_ID: ZNJ-LEGAL-PRIVACY-01
              </span>
              <span className="border border-crimson/40 bg-crimson/10 px-2 py-0.5 text-[8px] text-crimson">
                STATUS: RATIFIED
              </span>
            </div>
          </motion.div>

          {/* MAIN HEADLINE */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="h-[3px] w-8 bg-crimson" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-crimson sm:text-[10px]">
                  PRIVACY PROTOCOLS / 個人情報保護
                </p>
              </motion.div>

              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="mt-4 font-display text-[clamp(2.8rem,7vw,6.4rem)] font-bold uppercase leading-[0.85] tracking-[-0.06em] text-[#F4F0E8]"
              >
                PRIVACY <br />
                <span className="text-white/40">POLICY</span>
                <span className="text-crimson">.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
              className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            >
              <p className="text-[14px] leading-7 text-white/60 sm:text-[15px]">
                ZENJI respects the boundaries of your digital autonomy. This policy
                codifies what telemetry and personal identity data is captured, how
                it is protected, and the unconditional rights you possess over your
                records.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">
                <span>EFFECTIVE: SEPTEMBER 2026</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>VERSION: 2.4.0</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>JURISDICTION: GLOBAL</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS GRID */}
      <section className="border-b border-white/[0.08] bg-[#090909] py-10 sm:py-12">
        <div className="site-container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
                className="group relative border border-white/[0.08] bg-white/[0.015] p-5 transition-all duration-300 hover:border-crimson/50 hover:bg-white/[0.03]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center border border-white/10 bg-[#121212] text-crimson">
                    <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[8px] font-bold text-white/20">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#F4F0E8]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[12px] leading-5 text-white/50">
                  {item.desc}
                </p>

                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WITH STICKY QUICK-NAV */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            {/* SIDEBAR NAVIGATION */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <div className="border border-white/10 bg-[#080808] p-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-crimson">
                    INDEX / PROTOCOL
                  </p>
                  <p className="mt-1 font-display text-xl font-bold uppercase tracking-[-0.03em] text-[#F4F0E8]">
                    TABLE OF CONTENTS
                  </p>

                  <nav className="mt-5 space-y-1.5 border-t border-white/[0.08] pt-4">
                    {SECTIONS.map((sec) => {
                      const active = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => scrollToSection(sec.id)}
                          className={`group flex w-full items-center justify-between px-2.5 py-2 text-left font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 ${
                            active
                              ? "bg-crimson/15 text-white border-l-2 border-crimson font-bold"
                              : "text-white/45 hover:bg-white/[0.03] hover:text-white"
                          }`}
                        >
                          <span className="truncate pr-2">{sec.title}</span>
                          <span className="text-[8px] opacity-40 group-hover:opacity-100">
                            {sec.code}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* QUICK ASSISTANCE CARD */}
                <div className="border border-white/10 bg-[#0A0A0A] p-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
                    DIRECT SUPPORT
                  </p>
                  <p className="mt-1 font-display text-base font-bold uppercase tracking-[-0.02em] text-[#F4F0E8]">
                    NEED DATA ASSISTANCE?
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-white/50">
                    Reach out for record deletion, address amendments, or data export requests.
                  </p>
                  <a
                    href="mailto:legal@zenji.store"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson transition-colors hover:text-white"
                  >
                    <span>LEGAL@ZENJI.STORE</span>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </aside>

            {/* SECTIONS BODY */}
            <div className="space-y-14 sm:space-y-16 lg:space-y-20">
              {SECTIONS.map((sec, idx) => (
                <article
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-28 border-b border-white/[0.08] pb-12 sm:pb-14 lg:pb-16"
                >
                  {/* SECTION HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-6 bg-crimson" />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-crimson">
                        {sec.code} // PROTOCOL
                      </span>
                    </div>

                    <span className="font-mono text-[8px] font-semibold tracking-[0.18em] text-white/30">
                      SYS_SEC_{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-[#F4F0E8]">
                    {sec.title}
                  </h2>

                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
                    {sec.summary}
                  </p>

                  {/* SECTION PARAGRAPHS */}
                  <div className="mt-6 space-y-4 text-[14px] leading-7 text-white/70 sm:text-[15px] sm:leading-8">
                    {sec.content.map((para, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </article>
              ))}

              {/* BOTTOM NAVIGATION LINKS */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                    NEXT DOCUMENT
                  </p>
                  <Link
                    to="/terms"
                    className="group mt-1 inline-flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[-0.03em] text-[#F4F0E8] transition-colors hover:text-crimson"
                  >
                    <span>TERMS & CONDITIONS</span>
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={18}
                      strokeWidth={2}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                <Link
                  to="/shop"
                  className="border border-white/15 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#F4F0E8] transition-colors hover:border-crimson hover:bg-crimson hover:text-white"
                >
                  RETURN TO ARCHIVE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
