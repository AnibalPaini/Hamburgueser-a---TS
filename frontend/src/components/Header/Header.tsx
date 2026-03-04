import { useAuth } from "../../context/auth/auth.hook";
import { useCarrito } from "../../context/carrito/cart.hook";

interface Props {
  onCartOpen: () => void;
}

const Header = ({ onCartOpen }: Props) => {
  const { state } = useAuth();
  const { totalItems } = useCarrito();
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
      <div className="flex items-center gap-2">
        {/* Carrito */}
        <button
          onClick={onCartOpen}
          className="relative px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          🛒 Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        <button className="px-6 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white bg-primary rounded-md shadow-md hover:bg-secondary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
          🍔 Ordenar
        </button>
        {state.user?.rol === "admin" && (
          <a
            href="/admin"
            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-primary/10"
          >
            Admin
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
