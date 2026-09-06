import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../components/common/PageIntro.jsx";
import { lookbookItems } from "../data/lookbook.js";
import { products } from "../data/products.js";
export default function Lookbook() {
  const [filter, setFilter] = useState("all");
  const items = useMemo(
    () =>
      filter === "all"
        ? lookbookItems
        : lookbookItems.filter((i) => i.type === filter),
    [filter],
  );
  const tabs = ["all", "front", "back", "on-model"];
  return (
    <>
      <PageIntro
        kicker="VISUAL / ARCHIVE"
        title="LOOKBOOK."
        text="Editorial studies of the pieces in motion. Use the filters to view front, back and on-model references."
      />
      <section className="site-container py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[.12em] ${filter === t ? "border-crimson bg-crimson" : "border-line text-silver"}`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, idx) => {
            const p = products.find((x) => x.id === item.productId);
            return (
              <Link
                key={item.id}
                to={`/product/${p.slug}`}
                className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-[24px]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${idx % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"}`}
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-between bg-black/75 p-5 font-mono text-[9px] uppercase tracking-[.12em] transition duration-300 group-hover:translate-y-0">
                  <span>{item.title}</span>
                  <span>{p.name} ↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
