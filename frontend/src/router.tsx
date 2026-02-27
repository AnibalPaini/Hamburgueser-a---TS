import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/dashboard/DashboardPage";
import { ProductosPage } from "./pages/admin/productos/ProductosPage";
import { OrdenesPage } from "./pages/admin/ordenes/OrdenesPage";
import { PedidosPage } from "./pages/admin/pedidos/PedidosPage";
import { UsuariosPage } from "./pages/admin/usuarios/UsuariosPage";
import { PromocionesPage } from "./pages/admin/promociones/PromocionesPage";
import Login from "./pages/login/login";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // reemplazar con tu App actual
  },
  {
    path: "/login",
    element: <Login />,
  },
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
]);
