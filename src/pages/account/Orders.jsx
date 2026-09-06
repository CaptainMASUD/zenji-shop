import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext.jsx';
import { currency } from '../../utils/currency.js';

const EASE = [0.16, 1, 0.3, 1];

const STATUS_TONE = {
  Processing: 'text-crimson border-crimson/50 bg-crimson/10',
  Confirmed: 'text-white/78 border-white/20 bg-white/[0.04]',
  Shipped: 'text-white/78 border-white/20 bg-white/[0.04]',
  'Out for Delivery': 'text-white/78 border-white/20 bg-white/[0.04]',
  Delivered: 'text-white/55 border-white/15 bg-white/[0.03]',
  Cancelled: 'text-white/35 border-white/10 bg-white/[0.02]',
};

export default function Orders() {
  const { orders } = useOrders();
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="text-[#F4F0E8]">
      <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              ORDER / ARCHIVE
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Your orders.
          </h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-white/34">ORDER HISTORY</p>
          <p className="mt-1 font-display text-2xl font-semibold">{String(safeOrders.length).padStart(2, '0')}</p>
        </div>
      </div>

      {safeOrders.length ? (
        <div className="border-b border-white/[0.1]">
          {safeOrders.map((order, index) => {
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
              >
                <Link
                  to={`/account/orders/${order.id}`}
                  className="group grid gap-5 border-t border-white/[0.1] py-5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-center sm:px-3"
                >
                  <div className="flex min-h-[82px] items-center -space-x-5">
                    {items.slice(0, 2).map((item, itemIndex) => (
                      <div
                        key={`${item.name ?? 'item'}-${itemIndex}`}
                        className="h-[82px] w-[66px] overflow-hidden border-2 border-[#050505] bg-[#0A0A0A]"
                      >
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold uppercase tracking-[-0.03em] sm:text-2xl">
                      {order.id}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/38">
                      {order.date} / {items.length} ITEM{items.length === 1 ? '' : 'S'}
                    </p>
                    <span
                      className={`mt-4 inline-flex min-h-8 items-center border px-3 font-mono text-[8px] font-bold uppercase tracking-[0.12em] ${
                        STATUS_TONE[order.status] ?? STATUS_TONE.Confirmed
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-6 border-t border-white/[0.08] pt-4 sm:min-w-[150px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <span className="text-[15px] font-semibold">{currency(order.total)}</span>
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/34 transition-colors group-hover:text-crimson">
                      VIEW ORDER →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="border-b border-white/[0.1] py-10">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">NO ORDERS YET</p>
          <p className="mt-3 max-w-md text-[14px] leading-6 text-white/48">
            Your order history will appear here after your first purchase.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex min-h-[44px] items-center border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] hover:border-crimson hover:text-crimson"
          >
            EXPLORE THE SHOP →
          </Link>
        </div>
      )}
    </div>
  );
}
