import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/auth.hook";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/ordenes", label: "Órdenes activas", icon: "🔔" },
  { to: "/admin/pedidos", label: "Pedidos", icon: "📋" },
  { to: "/admin/productos", label: "Productos", icon: "🍔" },
  { to: "/admin/promociones", label: "Promociones", icon: "🏷️" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "👥" },
];

export function AdminLayout() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-claro">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-claro/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md">
              <a href="/">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-7 h-7 object-contain"
                />
              </a>
            </div>
            <div className="leading-none">
              <p className="font-black text-claro tracking-tight">Franky</p>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-claro/60">
                Panel Admin
              </p>
            </div>
          </div>
          <p className="text-xs text-claro/50 mt-3 truncate">
            {state.user?.nombre}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-claro shadow-md"
                    : "text-claro/60 hover:bg-claro/10 hover:text-claro"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-claro/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-claro/60 hover:bg-primary/80 hover:text-claro transition-all duration-200"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-claro border-b-2 border-primary/20 flex items-center px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-sm text-secondary/70 font-semibold">
              Bienvenido,{" "}
              <span className="text-secondary font-black">
                {state.user?.nombre}
              </span>
            </h1>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
