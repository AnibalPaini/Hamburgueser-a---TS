import { useEffect, useReducer } from "react";
import { authReducer, initialAuthState } from "./auth.reducer";
import { apiClient } from '../../services/api.client';
import { AuthContext } from "./auth.context";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get('/api/usuarios/auth/me');
        if (res.data.user) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "LOGOUT"});
      }
    };
    checkAuth();
  }, []);

  //Login
  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await apiClient.post(
        "/api/usuarios/login",
        { email, password },
      );
      console.log(res);
      
      dispatch({ type: "SET_USER", payload: res.data.user });
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
