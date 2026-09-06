import { categories } from "../../data/products.js";
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "Ivory", "Steel Blue", "Graphite", "Crimson"];
export default function FilterPanel({
  filters,
  setFilters,
  resetFilters,
  onClose,
}) {
  const toggle = (key, value) => {
    const arr = filters[key] || [];
    setFilters({
      [key]: arr.includes(value)
        ? arr.filter((x) => x !== value)
        : [...arr, value],
    });
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="font-display text-3xl">Refine</p>
        <div className="flex gap-3">
          <button onClick={resetFilters} className="eyebrow hover:text-ivory">
            Reset
          </button>
          {onClose && (
            <button onClick={onClose} className="eyebrow text-crimson">
              Close
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-4">Category</p>
        <div className="space-y-2">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center justify-between py-1 text-sm"
            >
              <span>{c.label}</span>
              <input
                type="checkbox"
                checked={filters.categories.includes(c.id)}
                onChange={() => toggle("categories", c.id)}
                className="accent-crimson"
              />
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-4">Size</p>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => toggle("sizes", s)}
              className={`rounded-xl border px-3 py-3 text-xs ${filters.sizes.includes(s) ? "border-crimson bg-crimson text-white" : "border-line hover:border-ivory/50"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-4">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => toggle("colors", c)}
              className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[.1em] ${filters.colors.includes(c) ? "border-ivory bg-ivory text-ink" : "border-line"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex justify-between">
          <p className="eyebrow">Max price</p>
          <span className="text-xs">A${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="30"
          max="140"
          step="2"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
          className="w-full accent-crimson"
        />
      </div>
      <label className="flex cursor-pointer items-center justify-between border-t border-line pt-5 text-sm">
        <span>In stock only</span>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
          className="accent-crimson"
        />
      </label>
    </div>
  );
}
