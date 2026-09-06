import ProductCard from './ProductCard.jsx';
export default function ProductGrid({ products, columns = 'four' }) { return <div className={`grid gap-x-4 gap-y-12 ${columns==='three'?'sm:grid-cols-2 xl:grid-cols-3':'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`}>{products.map((product,i)=><ProductCard key={product.id} product={product} priority={i<2}/>)}</div>; }
