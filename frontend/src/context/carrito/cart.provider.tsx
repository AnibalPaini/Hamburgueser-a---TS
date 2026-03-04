import { useReducer } from "react";
import { CarritoContext } from "./cart.context";
import { cartReducer, initialCartState } from "./cart.reducer";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrito, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CarritoContext.Provider value={{ carrito, dispatch }}>
      {children}
    </CarritoContext.Provider>
  );
};
