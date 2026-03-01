import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/auth.hook";

interface ProtectedRouteProps {
  children: React.ReactNode;
  rol?: "admin" | "cliente";
}

export function ProtectedRoute({ children, rol }: ProtectedRouteProps) {
  const { state } = useAuth();

  // Mientras verifica la cookie, no redirigir todavía
  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-claro">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" replace />;
  }

  if (rol && state.user.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
