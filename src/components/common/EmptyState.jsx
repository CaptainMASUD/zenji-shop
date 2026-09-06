import { Link } from "react-router-dom";
import Button from "./Button.jsx";
export default function EmptyState({
  eyebrow = "ARCHIVE_EMPTY",
  title = "Nothing here yet.",
  text = "Keep exploring the current drop and save the pieces that feel like you.",
}) {
  return (
    <div className="mx-auto flex min-h-[45vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="font-display text-5xl tracking-[-.05em] md:text-7xl">
        {title}
      </h2>
      <p className="mt-5 max-w-lg text-sm leading-7 text-silver">{text}</p>
      <Link to="/shop" className="mt-8">
        <Button>Explore the store</Button>
      </Link>
    </div>
  );
}
