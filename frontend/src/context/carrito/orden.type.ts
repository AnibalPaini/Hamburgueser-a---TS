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
  // Campos exclusivos para combos
  esCombo?: boolean;
  comboId?: string; // id de la Promocion tipo "combo"
  nombreCombo?: string;
  imagenCombo?: string;
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

// Clave única por item: combos → combo:<id>; productos → productoId|extras
export const itemKey = (
  productoId: string,
  extras?: ExtraItem[],
  comboId?: string,
): string => {
  if (comboId) return `combo:${comboId}`;
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
      payload: { productoId: string; extras?: ExtraItem[]; comboId?: string };
    }
  | {
      type: "INCREMENT_ITEM";
      payload: { productoId: string; extras?: ExtraItem[]; comboId?: string };
    }
  | {
      type: "DECREMENT_ITEM";
      payload: { productoId: string; extras?: ExtraItem[]; comboId?: string };
    }
  | { type: "CLEAR_CART" };
