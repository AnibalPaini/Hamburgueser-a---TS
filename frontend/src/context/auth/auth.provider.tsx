import { useEffect, useReducer } from "react";
import { authReducer, initialAuthState } from "./auth.reducer";
import { apiClient } from "../../services/api.client";
import { AuthContext } from "./auth.context";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await apiClient.get("/api/usuarios/auth/me");
        if (cancelled) return;
        if (res.data.user) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        if (cancelled) return;
        console.log(error);
        dispatch({ type: "LOGOUT" });
      }
    };
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  //Login
  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // El endpoint de login solo setea la cookie, no devuelve el usuario
      await apiClient.post("/api/usuarios/login", { email, password });
      // Una vez seteada la cookie, buscamos los datos del usuario
      const meRes = await apiClient.get("/api/usuarios/auth/me");
      dispatch({ type: "SET_USER", payload: meRes.data.user });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };
  //Logout
  const logout = async () => {
    try {
      await apiClient.post("/api/usuarios/logout");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
