import { Link } from "react-router-dom";
import { products } from "../../data/products.js";
import SectionHeader from "../common/SectionHeader.jsx";
import ProductGrid from "../product/ProductGrid.jsx";
export default function FeaturedProducts() {
  return (
    <section className="site-container section-pad">
      <SectionHeader
        kicker="CURATED / 04"
        title="Pieces with presence."
        action={
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[.14em] hover:text-crimson"
          >
            View all →
          </Link>
        }
      />
      <ProductGrid products={products.filter((p) => p.featured).slice(0, 4)} />
    </section>
  );
}
