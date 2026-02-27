// Espejo de: backend/src/types.d.ts

export type EstadoOrden =
  | "pendiente"
  | "en_preparacion"
  | "listo_para_entregar"
  | "entregado"
  | "cancelado";

export interface ItemOrden {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  extrasIds?: string[];
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
