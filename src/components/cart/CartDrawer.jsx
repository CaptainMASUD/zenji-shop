import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { currency } from "../../utils/currency.js";
import Button from "../common/Button.jsx";
export default function CartDrawer() {
  const {
    items,
    subtotal,
    drawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeFromCart,
    lineKey,
  } = useCart();
  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col border-l border-line bg-ink p-5 sm:p-7"
          >
            <div className="flex items-center justify-between border-b border-line pb-5">
              <div>
                <p className="eyebrow">YOUR BAG</p>
                <p className="mt-1 text-sm text-silver">
                  {items.length} line{items.length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="eyebrow text-crimson"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {!items.length ? (
                <div className="flex h-full items-center justify-center text-center text-silver">
                  <p>Your bag is waiting for a story.</p>
                </div>
              ) : (
                items.map((item) => {
                  const key = lineKey(item);
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-[82px_1fr] gap-4 border-b border-line py-5"
                    >
                      <img
                        src={item.image || item.images?.[0]}
                        className="h-28 w-20 rounded-xl object-cover"
                        alt=""
                      />
                      <div>
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-display text-lg">{item.name}</p>
                            <p className="mt-1 text-xs text-silver">
                              {item.color} / {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="text-xs text-silver hover:text-crimson"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              onClick={() =>
                                updateQuantity(key, item.quantity - 1)
                              }
                              className="px-3 py-1.5"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(key, item.quantity + 1)
                              }
                              className="px-3 py-1.5"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm">
                            {currency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-line pt-5">
              <div className="mb-4 flex justify-between">
                <span className="text-sm text-silver">Subtotal</span>
                <strong>{currency(subtotal)}</strong>
              </div>
              <div className="mb-5 h-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-crimson"
                  style={{ width: `${Math.min(100, (subtotal / 80) * 100)}%` }}
                />
              </div>
              <p className="mb-5 text-[11px] text-silver">
                {subtotal >= 80
                  ? "You unlocked free shipping."
                  : `${currency(80 - subtotal)} away from free shipping.`}
              </p>
              <Link to="/checkout" onClick={() => setDrawerOpen(false)}>
                <Button className="w-full" disabled={!items.length}>
                  Checkout
                </Button>
              </Link>
              <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 block text-center text-xs uppercase tracking-[.12em] text-silver hover:text-ivory"
              >
                View full bag
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
