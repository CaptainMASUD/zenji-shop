import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { currency } from '../../utils/currency.js';

const EASE = [0.16, 1, 0.3, 1];

const STATUS_TONE = {
  Processing: 'border-crimson/50 bg-crimson/10 text-crimson',
  Confirmed: 'border-white/20 bg-white/[0.04] text-white/80',
  Shipped: 'border-white/20 bg-white/[0.04] text-white/80',
  'Out for Delivery': 'border-white/20 bg-white/[0.04] text-white/80',
  Delivered: 'border-white/15 bg-white/[0.03] text-white/55',
  Cancelled: 'border-white/10 bg-white/[0.02] text-white/35',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-h-8 w-max items-center border px-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
        STATUS_TONE[status] ?? STATUS_TONE.Confirmed
      }`}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();

  const safeOrders = Array.isArray(orders) ? orders : [];
  const active = safeOrders.filter(
    (order) => !['Delivered', 'Cancelled'].includes(order.status),
  ).length;

  const cards = [
    ['TOTAL ORDERS', safeOrders.length, 'All purchases'],
    ['SAVED PIECES', wishlistCount, 'Wishlist'],
    ['ACTIVE ORDERS', active, 'In progress'],
  ];

  return (
    <div className="text-[#F4F0E8]">
      <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              ACCOUNT / OVERVIEW
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,5vw,3.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Your account.
          </h1>
        </div>
        <p className="max-w-sm text-[14px] leading-6 text-white/48 sm:text-right">
          Orders, saved pieces and active deliveries in one place.
        </p>
      </div>

      <div className="grid border-x border-b border-white/[0.1] sm:grid-cols-3">
        {cards.map(([label, value, note], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
            className={`relative px-5 py-5 sm:px-6 sm:py-6 ${
              index > 0 ? 'border-t border-white/[0.1] sm:border-l sm:border-t-0' : ''
            }`}
          >
            <span className="absolute left-0 top-0 h-[3px] w-8 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/46">
              {label}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="font-display text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-5xl">
                {String(value).padStart(2, '0')}
              </p>
              <span className="pb-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/35">
                {note}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-10 sm:mt-12">
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/[0.1] pb-4">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-crimson">
              ORDER / SIGNALS
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.04em] sm:text-3xl">
              Recent orders
            </h2>
          </div>
          <Link
            to="/account/orders"
            className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/52 transition-colors hover:text-crimson focus-visible:outline-none focus-visible:text-crimson"
          >
            View all →
          </Link>
        </div>

        {safeOrders.length ? (
          <div className="border-b border-white/[0.1]">
            {safeOrders.slice(0, 3).map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
              >
                <Link
                  to={`/account/orders/${order.id}`}
                  className="group grid gap-4 border-t border-white/[0.1] py-5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 shrink-0 bg-crimson" />
                      <p className="truncate text-[14px] font-semibold uppercase tracking-[0.03em] text-[#F4F0E8]">
                        {order.id}
                      </p>
                    </div>
                    <p className="mt-2 pl-5 font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                      {order.date} / {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="flex items-center justify-between gap-4 sm:min-w-[120px] sm:justify-end">
                    <span className="text-[14px] font-semibold">{currency(order.total)}</span>
                    <span className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-crimson">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border-y border-white/[0.1] py-8">
            <p className="text-[14px] leading-6 text-white/48">No orders yet.</p>
            <Link
              to="/shop"
              className="mt-4 inline-flex min-h-[44px] items-center border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-crimson hover:text-crimson"
            >
              EXPLORE THE SHOP →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
