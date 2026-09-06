export default function ShopToolbar({ count, sort, setSort, onFilter }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onFilter}
          className="rounded-full border border-line px-4 py-2 text-[11px] uppercase tracking-[.12em] hover:border-ivory/50"
        >
          Filters
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-silver">
          {count} results
        </span>
      </div>
      <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-silver">
        Sort
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-ink px-4 py-2 text-ivory outline-none"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price low → high</option>
          <option value="price-desc">Price high → low</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  );
}
