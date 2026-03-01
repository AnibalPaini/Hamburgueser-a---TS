import { useAuth } from "../../context/auth/auth.hook";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, state } = useAuth();

  if (state.isAuthenticated) return <Navigate to="/admin" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Credenciales incorrectas. Intentá de nuevo.");
    }
  };

  return (
    <main
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/Firefly.png")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-secondary/60" />

      {/* Card */}
      <div className="relative z-10 bg-claro/95 p-10 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-primary">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-md mb-3">
            <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-primary">
            Franky
          </span>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-secondary">
            Burguer
          </span>
          <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              className="block text-xs font-black uppercase tracking-[0.15em] text-secondary mb-2"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-primary/20 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-black uppercase tracking-[0.15em] text-secondary mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-primary/20 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-primary text-center bg-primary/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={state.loading}
            className="w-full py-3 text-sm font-black uppercase tracking-[0.18em] text-white bg-primary rounded-lg hover:bg-secondary active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state.loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
