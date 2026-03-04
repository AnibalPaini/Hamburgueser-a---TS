import { useContext } from "react";
import { CarritoContext } from "./cart.context";

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito must be used within CartProvider");
  }

  const { carrito, dispatch } = context;

  const subtotal = carrito.items.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0,
  );

  const totalItems = carrito.items.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );

  return { carrito, dispatch, subtotal, totalItems };
};
