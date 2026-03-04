import type { PromocionAplicada } from "../../types/promocion.types";
export type EstadoOrden =
  | "pendiente"
  | "en_preparacion"
  | "listo_para_entregar"
  | "entregado"
  | "cancelado";

export interface ExtraItem {
  extraId: string;
  cantidad: number;
}

export interface ItemOrden {
  productoId: string;
  cantidad: number;
  precioUnitario: number; // precio base + extras al momento de agregar
  extras?: ExtraItem[]; // solo si es hamburguesa
}

export interface Orden {
  id: string;
  items: ItemOrden[];
  promocionesAplicadas: PromocionAplicada[];
  subtotal: number; // suma de items sin descuentos
  descuentoTotal: number; // suma de todos los descuentos
  total: number; // subtotal - descuentoTotal
  estado: EstadoOrden;
  envio: boolean;
}

export type Carrito = {
  items: ItemOrden[];
};

// Clave única por item: mismo producto + misma combinación de extras
export const itemKey = (productoId: string, extras?: ExtraItem[]): string => {
  const extrasKey = (extras ?? [])
    .slice()
    .sort((a, b) => a.extraId.localeCompare(b.extraId))
    .map((e) => `${e.extraId}:${e.cantidad}`)
    .join(",");
  return `${productoId}|${extrasKey}`;
};

export type CartAction =
  | { type: "ADD_ITEM"; payload: ItemOrden }
  | {
      type: "REMOVE_ITEM";
      payload: { productoId: string; extras?: ExtraItem[] };
    }
  | {
      type: "INCREMENT_ITEM";
      payload: { productoId: string; extras?: ExtraItem[] };
    }
  | {
      type: "DECREMENT_ITEM";
      payload: { productoId: string; extras?: ExtraItem[] };
    }
  | { type: "CLEAR_CART" };
