import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { currency } from "../utils/currency.js";
import Button from "../components/common/Button.jsx";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "Australia",
    shipping: "standard",
    payment: "Card •••• 4242",
  });
  const shipping = form.shipping === "express" ? 16 : subtotal >= 80 ? 0 : 8;
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  if (!items.length) return <Navigate to="/cart" replace />;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: "/checkout" }} />;
  const place = () => {
    const order = placeOrder({
      items: items.map((i) => ({ ...i })),
      subtotal,
      shipping,
      discount: 0,
      total,
      shippingAddress: {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        region: form.region,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod: form.payment,
    });
    clearCart();
    nav(`/order-success/${order.id}`);
  };
  const input = (key, label, type = "text") => (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        type={type}
        className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 outline-none focus:border-crimson"
      />
    </label>
  );
  return (
    <section className="site-container py-10 md:py-16">
      <div className="mb-10 flex flex-wrap gap-2">
        {["Information", "Shipping", "Payment", "Review"].map((label, i) => (
          <button
            key={label}
            onClick={() => i + 1 < step && setStep(i + 1)}
            className={`rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[.12em] ${step === i + 1 ? "border-crimson bg-crimson" : "border-line text-silver"}`}
          >
            {String(i + 1).padStart(2, "0")} {label}
          </button>
        ))}
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
        <div className="rounded-[28px] border border-line p-6 md:p-8">
          <p className="eyebrow">
            CHECKOUT / STEP {String(step).padStart(2, "0")}
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-[-.05em]">
            {
              [
                "Customer information",
                "Choose delivery",
                "Payment method",
                "Review order",
              ][step - 1]
            }
          </h1>
          {step === 1 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {input("fullName", "Full name")}{" "}
              {input("email", "Email", "email")} {input("phone", "Phone")}{" "}
              {input("address", "Address")} {input("city", "City")}{" "}
              {input("region", "Region / State")}{" "}
              {input("postalCode", "Postal code")} {input("country", "Country")}
            </div>
          )}
          {step === 2 && (
            <div className="mt-8 grid gap-3">
              <button
                onClick={() => setForm({ ...form, shipping: "standard" })}
                className={`flex justify-between rounded-2xl border p-5 text-left ${form.shipping === "standard" ? "border-crimson" : "border-line"}`}
              >
                <span>
                  <strong>Standard Delivery</strong>
                  <small className="mt-1 block text-silver">
                    3–7 business days
                  </small>
                </span>
                <span>{subtotal >= 80 ? "Free" : currency(8)}</span>
              </button>
              <button
                onClick={() => setForm({ ...form, shipping: "express" })}
                className={`flex justify-between rounded-2xl border p-5 text-left ${form.shipping === "express" ? "border-crimson" : "border-line"}`}
              >
                <span>
                  <strong>Express Delivery</strong>
                  <small className="mt-1 block text-silver">
                    1–3 business days
                  </small>
                </span>
                <span>{currency(16)}</span>
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="mt-8 grid gap-3">
              {["Card •••• 4242", "Cash on Delivery", "Mobile Payment"].map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, payment: p })}
                    className={`rounded-2xl border p-5 text-left ${form.payment === p ? "border-crimson" : "border-line"}`}
                  >
                    {p}
                    <small className="mt-1 block text-silver">
                      Frontend demo selection — no real payment is processed.
                    </small>
                  </button>
                ),
              )}
            </div>
          )}
          {step === 4 && (
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-line p-5">
                <p className="eyebrow mb-3">Deliver to</p>
                <p className="text-sm leading-6">
                  {form.fullName}
                  <br />
                  {form.address || "Address not supplied"}
                  <br />
                  {form.city} {form.region} {form.postalCode}
                </p>
              </div>
              <div className="rounded-2xl border border-line p-5">
                <p className="eyebrow mb-3">Payment</p>
                <p className="text-sm">{form.payment}</p>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-between gap-3">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Link to="/cart" className="self-center text-xs text-silver">
                Back to bag
              </Link>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button variant="crimson" onClick={place}>
                Place order
              </Button>
            )}
          </div>
        </div>
        <aside className="h-max rounded-[28px] border border-line bg-graphite p-6 lg:sticky lg:top-28">
          <p className="font-display text-3xl">Your order</p>
          <div className="mt-5 divide-y divide-line">
            {items.map((i, idx) => (
              <div key={`${i.id}-${idx}`} className="flex gap-3 py-4">
                <img
                  src={i.image}
                  alt=""
                  className="h-20 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm">{i.name}</p>
                  <p className="mt-1 text-[10px] text-silver">
                    {i.size} / {i.color} × {i.quantity}
                  </p>
                </div>
                <span className="text-xs">
                  {currency(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
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
            <div className="flex justify-between border-t border-line pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
