import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext.jsx';
import { currency } from '../../utils/currency.js';

const EASE = [0.16, 1, 0.3, 1];
const stages = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const STATUS_TONE = {
  Processing: 'border-crimson/50 bg-crimson/10 text-crimson',
  Confirmed: 'border-white/20 bg-white/[0.04] text-white/78',
  Shipped: 'border-white/20 bg-white/[0.04] text-white/78',
  'Out for Delivery': 'border-white/20 bg-white/[0.04] text-white/78',
  Delivered: 'border-white/15 bg-white/[0.03] text-white/55',
  Cancelled: 'border-white/10 bg-white/[0.02] text-white/35',
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const { getOrder, cancelOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="border-y border-white/[0.1] py-10 text-[#F4F0E8]">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson">
          ORDER / SIGNAL LOST
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[-0.04em]">
          Order not found.
        </h1>
        <Link
          to="/account/orders"
          className="mt-5 inline-flex min-h-[44px] items-center border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] hover:border-crimson hover:text-crimson"
        >
          ← BACK TO ORDERS
        </Link>
      </div>
    );
  }

  const current = Math.max(0, stages.indexOf(order.status));
  const cancelled = order.status === 'Cancelled';
  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shippingAddress ?? {};

  return (
    <div className="text-[#F4F0E8]">
      <Link
        to="/account/orders"
        className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/48 transition-colors hover:text-crimson"
      >
        ← Orders
      </Link>

      <div className="mt-5 flex flex-col gap-5 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              ORDER / DETAIL
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            {order.id}
          </h1>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/38">
            PLACED {order.date}
          </p>
        </div>

        <span
          className={`inline-flex min-h-9 w-max items-center border px-4 font-mono text-[9px] font-bold uppercase tracking-[0.13em] ${
            STATUS_TONE[order.status] ?? STATUS_TONE.Confirmed
          }`}
        >
          {order.status}
        </span>
      </div>

      <section className="border-b border-white/[0.1] py-7 sm:py-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-crimson">
            ORDER PROGRESS
          </p>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/32">
            {cancelled ? 'ORDER CANCELLED' : `${current + 1} / ${stages.length}`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {stages.map((stage, index) => {
            const complete = !cancelled && index <= current;
            const active = !cancelled && index === current;

            return (
              <div key={stage} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[8px] font-bold ${
                      complete
                        ? 'border-crimson bg-crimson text-white'
                        : 'border-white/[0.12] bg-[#080808] text-white/30'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {index < stages.length - 1 && (
                    <span className={`h-[2px] flex-1 ${index < current && !cancelled ? 'bg-crimson' : 'bg-white/[0.1]'}`} />
                  )}
                </div>
                <p className={`mt-2 hidden font-mono text-[8px] font-bold uppercase tracking-[0.08em] sm:block ${active ? 'text-crimson' : 'text-white/40'}`}>
                  {stage}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[-0.04em] sm:text-3xl">
            Pieces in this order
          </h2>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/35">
            {items.length} ITEM{items.length === 1 ? '' : 'S'}
          </span>
        </div>

        <div className="border-b border-white/[0.1]">
          {items.map((item, index) => (
            <motion.div
              key={`${item.name ?? 'item'}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
              className="grid grid-cols-[74px_minmax(0,1fr)_auto] gap-4 border-t border-white/[0.1] py-5 sm:grid-cols-[88px_minmax(0,1fr)_auto]"
            >
              <div className="relative h-24 overflow-hidden border border-white/[0.1] bg-[#0A0A0A] sm:h-28">
                {item.image ? (
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center font-mono text-[7px] uppercase tracking-[0.12em] text-white/25">
                    NO IMAGE
                  </span>
                )}
              </div>
              <div className="min-w-0 py-1">
                <p className="font-display text-lg font-semibold uppercase leading-tight tracking-[-0.03em] sm:text-xl">
                  {item.name}
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.09em] text-white/42">
                  {[item.size, item.color].filter(Boolean).join(' / ')}
                  {(item.size || item.color) ? ' / ' : ''}QTY {item.quantity}
                </p>
              </div>
              <span className="pt-1 text-[14px] font-semibold">
                {currency(Number(item.price ?? 0) * Number(item.quantity ?? 0))}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 border-t border-white/[0.1] pt-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="border border-white/[0.11] bg-[#080808] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">SHIP TO</p>
          </div>
          <p className="mt-5 text-[14px] leading-7 text-white/66">
            {shipping.fullName || '—'}
            <br />
            {shipping.address || '—'}
            <br />
            {[shipping.city, shipping.region, shipping.postalCode].filter(Boolean).join(' ') || '—'}
            <br />
            {shipping.country || '—'}
          </p>
        </section>

        <section className="border border-white/[0.11] bg-[#080808] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">TOTALS</p>
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">AUD</span>
          </div>
          <div className="mt-5 space-y-3 text-[14px]">
            <div className="flex justify-between text-white/48">
              <span>Subtotal</span>
              <span className="text-[#F4F0E8]">{currency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/48">
              <span>Shipping</span>
              <span className="text-[#F4F0E8]">{order.shipping ? currency(order.shipping) : 'Free'}</span>
            </div>
            <div className="flex items-end justify-between border-t border-white/[0.1] pt-4">
              <span className="font-display text-xl font-semibold uppercase">Total</span>
              <span className="font-display text-2xl font-semibold">{currency(order.total)}</span>
            </div>
          </div>
        </section>
      </div>

      {order.status === 'Processing' && (
        <div className="mt-6 border-t border-white/[0.1] pt-5">
          <button
            type="button"
            onClick={() => cancelOrder(order.id)}
            className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-crimson transition-opacity hover:opacity-70"
          >
            CANCEL THIS DEMO ORDER
          </button>
        </div>
      )}
    </div>
  );
}
