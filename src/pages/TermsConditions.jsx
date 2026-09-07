import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  ShoppingBag01Icon,
  SecurityCheckIcon,
  GlobalIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

const EASE = [0.16, 1, 0.3, 1];

const SECTIONS = [
  {
    id: "acceptance",
    code: "SEC_01",
    title: "Agreement & Scope",
    summary:
      "Conditions governing access to the ZENJI platform, digital drops, and purchasing channels.",
    content: [
      "By accessing the ZENJI website, creating an archive profile, or acquiring any limited apparel piece, you unconditionally consent to be bound by these Terms and Conditions of Sale and Service.",
      "These terms constitute a legally binding covenant between you ('the Collector' or 'User') and ZENJI Apparel ('ZENJI', 'we', 'our'). If you do not consent to every provision herein, you must immediately terminate access to our transmissions and storefront.",
      "Eligibility: You must be at least the age of legal majority in your country or province of residence, or possess authenticated parental/guardian authorization, to execute transactions on this platform.",
    ],
  },
  {
    id: "finite-drops",
    code: "SEC_02",
    title: "Finite Drops & Allocation Limits",
    summary:
      "Our small-batch manufacturing ethos, non-restock protocols, and per-customer limits.",
    content: [
      "The Finite Principle: Every ZENJI release is engineered in strictly limited manufacturing batches. Garments exist as chapters within finite narrative arcs rather than perpetual warehouse inventory.",
      "Once an allocated drop sells through, production tooling is archived. Restocks are never promised, and back-orders cannot be guaranteed unless a specific piece is formally designated as an open pre-order window.",
      "Per-Customer Allocation: To protect genuine community collectors against commercial scalping, we enforce maximum quantity restrictions (typically 2 pieces per product variant per household/IP address). Orders exceeding these caps are subject to automatic algorithmic cancellation without prior warning.",
    ],
  },
  {
    id: "anti-bot",
    code: "SEC_03",
    title: "Anti-Bot Verification & Integrity",
    summary:
      "Measures to prevent automated scripts, automated checkout tools, and unfair advantages.",
    content: [
      "ZENJI employs real-time traffic analysis, device fingerprinting, and behavioral validation to detect automated checkout software ('bots') during high-velocity drop windows.",
      "Any transaction identified as originating from an automated script, headless browser, or proxy-relay network will be nullified instantly.",
      "Accounts associated with persistent bot activity, card-testing attacks, or denial-of-service attempts will be blacklisted across all future ZENJI drops and physical pop-up registries.",
    ],
  },
  {
    id: "pricing-demo",
    code: "SEC_04",
    title: "Pricing, Currency & Demo Notice",
    summary:
      "Currency display, valuation accuracy, and essential notice regarding this frontend concept.",
    content: [
      "Currency Display: Product prices are quoted in USD ($) by default unless our geolocator presents your native local currency. All displayed prices exclude destination import tariffs, VAT, or local customs levies where applicable.",
      "Concept Demonstration Notice: ZENJI is deployed as an elite digital commerce concept and frontend assessment showcase. Any prices, checkout summaries, card payment simulations, and order ID tokens generated are mock transactions executed client-side.",
      "No actual monetary charges, banking transactions, or physical shipment dispatches will occur through this demonstration platform. All simulated user records reside locally within your current device browser session.",
    ],
  },
  {
    id: "intellectual-property",
    code: "SEC_05",
    title: "Intellectual Property & Tribute Art",
    summary:
      "Original streetwear typography, brand graphics, and respectful tribute to anime culture.",
    content: [
      "Brand Assets: All brand names, wordmarks ('ZENJI', 'WEAR YOUR NEXT ARC'), logos, typography hierarchies, layout graphics, UI animations, and custom vector systems are proprietary to ZENJI.",
      "Anime Inspiration & Tribute Art: ZENJI celebrates anime, manga, and gaming culture through transformative, original contemporary streetwear design, silhouette innovation, and artistic visual translation. All interpretations are crafted with deep artistic reverence for the master storytellers and animators whose seminal works inspire global youth culture.",
      "You are prohibited from copying, reproducing, scraping, reverse engineering, or commercializing any digital artwork, product renders, photography, or copy from this domain without prior written authorization.",
    ],
  },
  {
    id: "shipping",
    code: "SEC_06",
    title: "Transmissions & Global Delivery",
    summary:
      "Fulfillment times, courier handoffs, and international import responsibilities.",
    content: [
      "Dispatch Schedule: In-stock drop items typically process within 2 to 4 business days. Pre-order garments adhere to the bespoke timeline published on the respective product editorial card.",
      "Courier Handoff: Orders are shipped via tracked commercial logistics carriers. Once the parcel is transferred to the carrier, risk of transit loss passes to the customer; however, ZENJI will actively assist in carrier investigations for lost transmissions.",
      "Customs & Import Duties: For international deliveries, the recipient acts as the importer of record and is liable for all statutory duty, clearance fees, and regional import taxes assessed by destination border authorities.",
    ],
  },
  {
    id: "sizing-returns",
    code: "SEC_07",
    title: "Sizing, Exchanges & Flaw Protocol",
    summary:
      "Oversized silhouette guidance, inspection upon arrival, and replacement conditions.",
    content: [
      "Oversized Fit Intent: ZENJI tees are deliberately tailored with relaxed shoulders, extended chest volume, and substantial fabric weight (240-280 GSM). Please consult our interactive Size Guide and Shikigami Assistant before confirming sizing.",
      "Manufacturing Flaws: If your garment arrives with a demonstrable structural flaw, fabric defect, or printing error, transmit photographic evidence within 7 days of delivery receipt to support@zenji.store for immediate replacement or store credit.",
      "Finite Exchanges: Because drop inventory is finite, size exchanges are strictly contingent on remaining archive availability. If your requested replacement size is exhausted, store credit or refund will be issued upon return of the unworn piece with original tags intact.",
    ],
  },
  {
    id: "conduct",
    code: "SEC_08",
    title: "Community Code of Conduct",
    summary:
      "Standards of respect across community lookbooks, product reviews, and communications.",
    content: [
      "The ZENJI crew is bonded by mutual passion for anime storytelling, streetwear discipline, and artistic individuality.",
      "Community Submissions: Any user-generated reviews, editorial photo submissions, or community forum contributions containing hate speech, harassment, counterfeit promotion, or explicit material will be permanently purged.",
      "We reserve the right to revoke account access, cancel pending drop allocations, or restrict interactive privileges for any user who violates this code of conduct.",
    ],
  },
  {
    id: "liability",
    code: "SEC_09",
    title: "Limitation of Liability & Law",
    summary:
      "Statutory limitations, warranty disclaimers, and governing jurisdiction.",
    content: [
      "To the maximum extent permitted by applicable law, ZENJI shall not be liable for any indirect, incidental, punitive, or consequential damages arising from your access to or inability to use this storefront.",
      "Our total aggregate liability for any claim arising out of a product acquisition is strictly limited to the actual purchase price paid for the specific garment at issue.",
      "Governing Law: These terms shall be governed by and construed in accordance with the substantive laws of Tokyo, Japan and the state of New South Wales, Australia, without regard to conflict of law principles.",
    ],
  },
  {
    id: "inquiries",
    code: "SEC_10",
    title: "Amendments & Legal Inquiries",
    summary:
      "Protocols for revising terms and reaching out to the legal advisory desk.",
    content: [
      "We reserve the right to revise these Terms and Conditions at our sole discretion to reflect operational changes, manufacturing updates, or evolving regulatory mandates.",
      "Any material modifications will be posted directly to this URL with an updated Effective Ratification date. Continued usage of the shop constitutes acceptance of the amended terms.",
      "For official legal communications or clarification regarding these terms, transmit inquiries to: legal@zenji.store.",
    ],
  },
];

const HIGHLIGHTS = [
  {
    icon: ShoppingBag01Icon,
    title: "FINITE DROPS",
    desc: "Small-run capsule releases. Once archived, pieces are never restocked perpetually.",
  },
  {
    icon: SecurityCheckIcon,
    title: "ANTI-BOT INTEGRITY",
    desc: "Strict per-collector allocation limits to safeguard real human enthusiasts against scalpers.",
  },
  {
    icon: GlobalIcon,
    title: "GLOBAL CARRIERS",
    desc: "Tracked international shipping dispatched via bonded express courier networks.",
  },
  {
    icon: AlertCircleIcon,
    title: "CONCEPT SHOWCASE",
    desc: "All checkouts and payments in this build operate client-side as a design demonstration.",
  },
];

export default function TermsConditions() {
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
          TERMS
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
            <span className="text-white/70">TERMS & CONDITIONS</span>

            <div className="ml-auto hidden items-center gap-4 sm:flex">
              <span className="border border-white/10 px-2 py-0.5 text-[8px] text-white/50">
                DOC_ID: ZNJ-LEGAL-TERMS-01
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
                  TERMS OF SERVICE / 利用規約
                </p>
              </motion.div>

              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="mt-4 font-display text-[clamp(2.8rem,7vw,6.4rem)] font-bold uppercase leading-[0.85] tracking-[-0.06em] text-[#F4F0E8]"
              >
                TERMS & <br />
                <span className="text-white/40">CONDITIONS</span>
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
                These terms govern your access to limited drop allocations,
                purchasing channels, community participation, and interaction with
                the ZENJI streetwear archive.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">
                <span>EFFECTIVE: SEPTEMBER 2026</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>RATIFIED VERSION: 2.4.0</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>CODE: ZNJ-TERMS</span>
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

                {/* HELP BOX */}
                <div className="border border-white/10 bg-[#0A0A0A] p-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
                    DROP QUESTIONS
                  </p>
                  <p className="mt-1 font-display text-base font-bold uppercase tracking-[-0.02em] text-[#F4F0E8]">
                    NEED CLARIFICATION?
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-white/50">
                    Reach out for allocation inquiries, sizing support, or shipping estimates.
                  </p>
                  <a
                    href="mailto:support@zenji.store"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson transition-colors hover:text-white"
                  >
                    <span>SUPPORT@ZENJI.STORE</span>
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
                        {sec.code} // COVENANT
                      </span>
                    </div>

                    <span className="font-mono text-[8px] font-semibold tracking-[0.18em] text-white/30">
                      TERMS_SEC_{String(idx + 1).padStart(2, "0")}
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
                    RELATED DOCUMENT
                  </p>
                  <Link
                    to="/privacy"
                    className="group mt-1 inline-flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[-0.03em] text-[#F4F0E8] transition-colors hover:text-crimson"
                  >
                    <span>PRIVACY POLICY</span>
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
