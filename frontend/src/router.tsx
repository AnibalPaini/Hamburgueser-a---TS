import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/auth/auth.provider";
import { CartProvider } from "./context/carrito/cart.provider";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/dashboard/DashboardPage";
import { ProductosPage } from "./pages/admin/productos/ProductosPage";
import { OrdenesPage } from "./pages/admin/ordenes/OrdenesPage";
import { PedidosPage } from "./pages/admin/pedidos/PedidosPage";
import { UsuariosPage } from "./pages/admin/usuarios/UsuariosPage";
import { PromocionesPage } from "./pages/admin/promociones/PromocionesPage";
import HamburguesaDetail from "./components/Menu/hamburuesas/HamburguesaDetail";
import Login from "./pages/login/Login";
import App from "./App";

export const router = createBrowserRouter([
  {
    // ← sin path, es el layout raíz
    element: (
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    ),
    children: [
      { path: "/", element: <App /> },
      { path: "/login", element: <Login /> },
      {
        path: "/admin",
        element: (
          <ProtectedRoute rol="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "productos", element: <ProductosPage /> },
          { path: "ordenes", element: <OrdenesPage /> },
          { path: "pedidos", element: <PedidosPage /> },
          { path: "usuarios", element: <UsuariosPage /> },
          { path: "promociones", element: <PromocionesPage /> },
        ],
      },
      {
        path: "/menu/hamburguesas/:id",
        element: <HamburguesaDetail />,
      },
    ],
  },
]);
