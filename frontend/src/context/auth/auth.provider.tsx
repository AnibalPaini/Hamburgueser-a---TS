import { useEffect, useReducer } from "react";
import { authReducer, initialAuthState } from "./auth.reducer";
import { AuthContext } from "./auth.context";
import axios from "axios";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        if (res.data.user) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    checkAuth();
  }, []);

  //Login
  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await axios.post(
        "/api/usuarios/login",
        { email, password },
        { withCredentials: true },
      );
      dispatch({ type: "SET_USER", payload: res.data.user });
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };
  //Logout
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
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
