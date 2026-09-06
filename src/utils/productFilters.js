export function filterProducts(products, options = {}) {
  const { search = '', categories = [], sizes = [], colors = [], inStockOnly = false, maxPrice = Infinity } = options;
  const q = search.trim().toLowerCase();
  return products.filter((product) => {
    const searchable = `${product.name} ${product.collection || ''} ${product.category || ''}`.toLowerCase();
    if (q && !searchable.includes(q)) return false;
    if (categories.length && !categories.includes(product.category)) return false;
    if (sizes.length && !sizes.some((size) => product.sizes?.includes(size))) return false;
    if (colors.length && !colors.some((color) => product.colors?.includes(color))) return false;
    if (inStockOnly && product.stock <= 0) return false;
    if (Number(product.price) > Number(maxPrice)) return false;
    return true;
  });
}

export function sortProducts(products, sort = 'featured') {
  const list = [...products];
  switch (sort) {
    case 'price-asc': return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'newest': return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
    default: return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}
