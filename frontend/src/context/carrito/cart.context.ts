import { createContext } from "react";
import type { Carrito, CartAction } from "./orden.type";

interface CarritoContextType {
  carrito: Carrito;
  dispatch: React.Dispatch<CartAction>;
}

export const CarritoContext = createContext<CarritoContextType | undefined>(undefined)