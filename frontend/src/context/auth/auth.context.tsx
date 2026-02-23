import { createContext } from "react";
import type { AuthState } from "./auth.type";

interface AuthContectType {
  state: AuthState;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContectType | undefined>(
  undefined,
);

