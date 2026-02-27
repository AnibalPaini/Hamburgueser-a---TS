import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/auth.hook";
import { useEffect } from 'react';

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

  useEffect(() => {
    console.log(state.user);
    
  }, [state.user]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="font-bold text-amber-500 text-sm">Panel Admin</p>
              <p className="text-xs text-gray-400">{state.user?.nombre}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6">
          <h1 className="text-sm text-gray-400">
            Bienvenido, <span className="text-white font-medium">{state.user?.nombre}</span>
          </h1>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
