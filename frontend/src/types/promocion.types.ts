// Espejo de: backend/src/types.d.ts
import type { CategoriaProducto } from "./product.type";

export type TipoPromocion =
  | "porcentaje"
  | "monto_fijo"
  | "2x1"
  | "3x2"
  | "combo";

export type AlcancePromocion = "todos" | "categoria" | "productos";

export interface Promocion {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoPromocion;
  valor: number;
  alcance: AlcancePromocion;
  categoriasAplicables?: CategoriaProducto[];
  productosAplicables?: string[];
  activa: boolean;
  fechaInicio: string;
  fechaFin: string;
  imagenUrl?: string;
}

export type CrearPromocionDTO = Omit<Promocion, "id">;
export type ActualizarPromocionDTO = Partial<CrearPromocionDTO>;
export interface PromocionAplicada {
  promocionId: string;
  nombre: string;
  tipo: TipoPromocion;
  montoDescontado: number;
  itemsAfectados: string[]; // ids de los ItemOrden afectados
}