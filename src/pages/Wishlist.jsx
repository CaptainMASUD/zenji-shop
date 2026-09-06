import PageIntro from "../components/common/PageIntro.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
export default function Wishlist() {
  const { items } = useWishlist();
  return (
    <>
      <PageIntro
        kicker="PERSONAL / ARCHIVE"
        title="WISHLIST."
        text="Save the pieces you want to revisit before the drop disappears."
      />
      <section className="site-container py-12 md:py-16">
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <EmptyState eyebrow="ARCHIVE_EMPTY" title="No saved pieces." />
        )}
      </section>
    </>
  );
}
