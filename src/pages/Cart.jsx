import { Link } from "react-router-dom";
import PageIntro from "../components/common/PageIntro.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Button from "../components/common/Button.jsx";
import { useCart } from "../context/CartContext.jsx";
import { currency } from "../utils/currency.js";
export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart, lineKey } =
    useCart();
  if (!items.length)
    return (
      <>
        <PageIntro kicker="BAG / 00" title="YOUR BAG." />
        <EmptyState eyebrow="BAG_EMPTY" title="Nothing in the bag." />
      </>
    );
  const shipping = subtotal >= 80 ? 0 : 8;
  return (
    <>
      <PageIntro
        kicker={`BAG / ${String(items.length).padStart(2, "0")}`}
        title="YOUR BAG."
      />
      <section className="site-container grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        {" "}
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const key = lineKey(item);
            return (
              <div
                key={key}
                className="grid grid-cols-[100px_1fr] gap-5 py-6 sm:grid-cols-[130px_1fr_auto]"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-36 w-28 rounded-2xl object-cover sm:h-44 sm:w-32"
                />
                <div>
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-display text-2xl tracking-[-.04em] hover:text-crimson"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-xs text-silver">
                    {item.color} / {item.size}
                  </p>
                  <div className="mt-6 flex w-max items-center rounded-full border border-line">
                    <button
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      className="px-4 py-2"
                    >
                      −
                    </button>
                    <span className="min-w-7 text-center text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      className="px-4 py-2"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(key)}
                    className="mt-4 text-[10px] uppercase tracking-[.12em] text-silver hover:text-crimson"
                  >
                    Remove
                  </button>
                </div>
                <div className="col-span-2 text-right text-sm font-semibold sm:col-span-1">
                  {currency(item.price * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>
        <aside className="h-max rounded-[24px] border border-line bg-graphite p-6 lg:sticky lg:top-28">
          <p className="font-display text-3xl">Order summary</p>
          <div className="mt-6 space-y-4 border-y border-line py-5 text-sm">
            <div className="flex justify-between text-silver">
              <span>Subtotal</span>
              <span className="text-ivory">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-silver">
              <span>Shipping</span>
              <span className="text-ivory">
                {shipping ? currency(shipping) : "Free"}
              </span>
            </div>
          </div>
          <div className="flex justify-between py-5 text-lg font-semibold">
            <span>Total</span>
            <span>{currency(subtotal + shipping)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
          <Link
            to="/shop"
            className="mt-4 block text-center text-[10px] uppercase tracking-[.12em] text-silver"
          >
            Continue shopping
          </Link>
        </aside>
      </section>
    </>
  );
}
