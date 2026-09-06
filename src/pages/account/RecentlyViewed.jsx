import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../../data/products.js';
import { useShop } from '../../context/ShopContext.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';

const EASE = [0.16, 1, 0.3, 1];

function identity(product) {
  return product?.id ?? product?._id ?? product?.slug ?? '';
}

export default function RecentlyViewed() {
  const { recentlyViewed } = useShop();
  const ids = Array.isArray(recentlyViewed) ? recentlyViewed : [];
  const list = ids
    .map((id) => products.find((product) => identity(product) === id))
    .filter(Boolean);

  return (
    <div className="text-[#F4F0E8]">
      <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              RECENT / SIGNALS
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Recently viewed.
          </h1>
        </div>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-white/30">
          {String(list.length).padStart(2, '0')} PIECES
        </span>
      </div>

      {list.length ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="pt-7 sm:pt-8"
        >
          <ProductGrid products={list} columns="three" />
        </motion.div>
      ) : (
        <div className="border-b border-white/[0.1] py-10">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
            NO RECENT SIGNALS
          </p>
          <p className="mt-3 max-w-md text-[14px] leading-6 text-white/48">
            Open a product and it will appear here so you can find it again quickly.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex min-h-[44px] items-center border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-crimson hover:text-crimson"
          >
            CONTINUE EXPLORING →
          </Link>
        </div>
      )}
    </div>
  );
}
