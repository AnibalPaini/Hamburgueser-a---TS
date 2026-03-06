import type { Carrito, CartAction } from "./orden.type";
import { itemKey } from "./orden.type";

export const initialCartState: Carrito = {
  items: [],
};

export const cartReducer = (state: Carrito, action: CartAction): Carrito => {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = itemKey(
        action.payload.productoId,
        action.payload.extras,
        action.payload.comboId,
      );
      const existe = state.items.find(
        (i) => itemKey(i.productoId, i.extras, i.comboId) === key,
      );
      if (existe) {
        return {
          ...state,
          items: state.items.map((i) =>
            itemKey(i.productoId, i.extras, i.comboId) === key
              ? { ...i, cantidad: i.cantidad + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cantidad: 1 }],
      };
    }

    case "REMOVE_ITEM": {
      const key = itemKey(
        action.payload.productoId,
        action.payload.extras,
        action.payload.comboId,
      );
      return {
        ...state,
        items: state.items.filter(
          (i) => itemKey(i.productoId, i.extras, i.comboId) !== key,
        ),
      };
    }

    case "INCREMENT_ITEM": {
      const key = itemKey(
        action.payload.productoId,
        action.payload.extras,
        action.payload.comboId,
      );
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.productoId, i.extras, i.comboId) === key
            ? { ...i, cantidad: i.cantidad + 1 }
            : i,
        ),
      };
    }

    case "DECREMENT_ITEM": {
      const key = itemKey(
        action.payload.productoId,
        action.payload.extras,
        action.payload.comboId,
      );
      return {
        ...state,
        items: state.items
          .map((i) =>
            itemKey(i.productoId, i.extras, i.comboId) === key
              ? { ...i, cantidad: i.cantidad - 1 }
              : i,
          )
          .filter((i) => i.cantidad > 0),
      };
    }

    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
};
