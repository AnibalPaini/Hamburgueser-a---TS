import { useAuth } from "../../context/auth/auth.hook";

const Header = () => {
  const { state } = useAuth();
  return (
    <header className="flex w-full items-center justify-between px-10 py-3 bg-claro border-b-2 border-primary shadow-sm">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 object-contain drop-shadow"
          />
        </div>
        <div className="leading-none">
          <span className="block text-2xl font-black tracking-tight text-primary">
            Franky
          </span>
          <span className="block text-xs font-black tracking-[0.2em] uppercase text-secondary">
            Burguer
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {["Hamburguesas", "Promos", "Combos", "Info"].map((label) => (
          <a
            key={label}
            href=""
            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/10"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div>
        <button className="px-6 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white bg-primary rounded-md shadow-md hover:bg-secondary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
          🍔 Ordenar
        </button>
        {state.user?.rol === "admin" && (
          <a
            href="/admin"
            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/10 ml-2"
          >
            Admin
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
