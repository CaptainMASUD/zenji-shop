import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";
export default function NotFound() {
  return (
    <div className="site-container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">ERROR / 404</p>
      <h1 className="display-tight mt-4 text-8xl font-semibold md:text-[12rem]">
        LOST SIGNAL.
      </h1>
      <p className="mt-5 text-sm text-silver">
        This route does not exist in the current arc.
      </p>
      <Link to="/" className="mt-8">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
