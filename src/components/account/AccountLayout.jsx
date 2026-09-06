import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
export default function AccountLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const doLogout = () => {
    logout();
    nav("/");
  };
  const links = [
    ["/account", "Overview"],
    ["/account/orders", "Orders"],
    ["/account/profile", "Profile"],
    ["/account/addresses", "Addresses"],
    ["/account/recently-viewed", "Recently viewed"],
  ];
  return (
    <section className="site-container py-12 md:py-16">
      <div className="mb-10 border-b border-line pb-8">
        <p className="eyebrow">MY / ZENJI</p>
        <h1 className="mt-3 font-display text-6xl tracking-[-.055em]">
          Hello, {user?.name?.split(" ")[0]}.
        </h1>
      </div>
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col">
            {links.map(([to, label]) => (
              <NavLink
                end={to === "/account"}
                key={to}
                to={to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl border px-4 py-3 text-sm transition ${isActive ? "border-crimson bg-crimson text-white" : "border-line text-silver hover:text-ivory"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={doLogout}
              className="whitespace-nowrap rounded-xl border border-line px-4 py-3 text-left text-sm text-silver hover:border-crimson hover:text-crimson"
            >
              Logout
            </button>
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
