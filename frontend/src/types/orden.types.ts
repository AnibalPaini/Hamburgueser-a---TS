// Espejo de: backend/src/types.d.ts
import type { Cliente, TipoEntrega } from "./cliente.type";

export type { Cliente, TipoEntrega };

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
  precioUnitario: number;
  extras?: ExtraItem[];
}

export interface PromocionAplicada {
  promocionId: string;
  nombre: string;
  tipo: string;
  montoDescontado: number;
  itemsAfectados: string[];
}

export interface Orden {
  id: string;
  items: ItemOrden[];
  cliente: Cliente;
  tipoEntrega: TipoEntrega;
  promocionesAplicadas: PromocionAplicada[];
  subtotal: number;
  descuentoTotal: number;
  total: number;
  estado: EstadoOrden;
  createdAt: string;
  updatedAt: string;
}

export type ActualizarEstadoOrdenDTO = {
  estado: EstadoOrden;
};
