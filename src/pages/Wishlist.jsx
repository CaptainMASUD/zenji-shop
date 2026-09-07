import { AnimatePresence, motion } from "framer-motion";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const title = "WISHLIST";

const titleContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.055,
    },
  },
};

const titleLetter = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Wishlist() {
  const { items } = useWishlist();
  const count = items.length;

  return (
    <main className="overflow-hidden bg-ink text-ivory">
      {/* ============================================================
          CENTERED WISHLIST INTRO
      ============================================================ */}
      <section className="site-container flex min-h-[38vh] flex-col items-center justify-center px-4 pb-10 pt-16 text-center sm:min-h-[42vh] sm:pb-12 sm:pt-20 lg:min-h-[46vh] lg:pb-14 lg:pt-24">
        <motion.div
          variants={titleContainer}
          initial="hidden"
          animate="visible"
          aria-label="Wishlist"
          className="flex items-end justify-center overflow-hidden"
        >
          {title.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              variants={titleLetter}
              aria-hidden="true"
              className="
                font-display
                text-[clamp(3.35rem,10vw,8.6rem)]
                font-extrabold
                leading-[0.88]
                tracking-[-0.075em]
              "
            >
              {letter}
            </motion.span>
          ))}

          {/* Crimson ending dot */}
          <motion.span
            aria-hidden="true"
            initial={{
              opacity: 0,
              scale: 0.25,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              delay: 0.58,
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              ml-[0.04em]
              font-display
              text-[clamp(3.35rem,10vw,8.6rem)]
              font-extrabold
              leading-[0.88]
              text-crimson
            "
          >
            .
          </motion.span>
        </motion.div>

        {/* ============================================================
            SAVED COUNTER
        ============================================================ */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.64,
            duration: 0.45,
          }}
          className="mt-5 flex items-center gap-3 sm:mt-6"
        >
          <motion.span
            key={count}
            initial={{
              opacity: 0,
              y: 7,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-mono
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-ivory/45
              sm:text-[11px]
            "
          >
            {String(count).padStart(2, "0")} SAVED
          </motion.span>
        </motion.div>

        {/* ============================================================
            ANIMATED LINE
        ============================================================ */}
        <div className="mt-6 h-px w-full max-w-[260px] overflow-hidden bg-ivory/10 sm:mt-7 sm:max-w-[320px]">
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: "0%",
            }}
            transition={{
              delay: 0.4,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full w-full bg-crimson"
          />
        </div>
      </section>

      {/* ============================================================
          WISHLIST CONTENT
      ============================================================ */}
      <section className="site-container pb-16 sm:pb-20 lg:pb-24">
        <AnimatePresence mode="wait">
          {count > 0 ? (
            <motion.div
              key="wishlist-products"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 12,
              }}
              transition={{
                delay: 0.15,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductGrid products={items} />
            </motion.div>
          ) : (
            /* ========================================================
                EMPTY WISHLIST
            ======================================================== */
            <motion.div
              key="wishlist-empty"
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                delay: 0.12,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
                border-t
                border-line
                sm:min-h-[300px]
              "
            >
              <div className="text-center">
                <motion.span
                  animate={{
                    opacity: [0.28, 0.65, 0.28],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    mx-auto
                    mb-5
                    block
                    h-[2px]
                    w-8
                    bg-crimson
                  "
                />

                <p
                  className="
                    font-mono
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-ivory/45
                    sm:text-[12px]
                  "
                >
                  NO SAVED PIECES.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}