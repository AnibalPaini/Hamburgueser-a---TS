import type { PromocionAplicada } from "../../types/promocion.types";
export type EstadoOrden =
  | "pendiente"
  | "en_preparacion"
  | "listo_para_entregar"
  | "entregado"
  | "cancelado";

export interface ItemOrden {
  productoId: string;
  cantidad: number;
  precioUnitario: number; // precio base al momento de agregar
  extrasIds?: string[]; // solo si es hamburguesa
}

export interface Orden {
  id: string;
  items: ItemOrden[];
  promocionesAplicadas: PromocionAplicada[];
  subtotal: number; // suma de items sin descuentos
  descuentoTotal: number; // suma de todos los descuentos
  total: number; // subtotal - descuentoTotal
  estado: EstadoOrden;
}

export interface AddToCartPayload {
  productoId: string;
  precioUnitario: number;
  extrasIds?: string[];
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: AddToCartPayload }
  | { type: "REMOVE_ITEM"; payload: { productoId: string; extrasIds?: string[] } }
  | { type: "INCREMENT_ITEM"; payload: { productoId: string; extrasIds?: string[] } }
  | { type: "DECREMENT_ITEM"; payload: { productoId: string; extrasIds?: string[] } }
  | { type: "CLEAR_CART" };