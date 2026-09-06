import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, columns = "four" }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-2.5 gap-y-8 sm:gap-x-4 sm:gap-y-12 ${
        columns === "three"
          ? "xl:grid-cols-3"
          : "lg:grid-cols-3 2xl:grid-cols-4"
      }`}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 2}
        />
      ))}
    </div>
  );
}
