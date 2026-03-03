export type CategoriaProducto =
  | "hamburguesa"
  | "papas"
  | "bebida"
  | "extra"
  | "postre";
export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: CategoriaProducto;
  activo: boolean;
  imagenUrl?: string;
  extrasExcluidos?: string[]; // solo para hamburguesas: ids de extras BLOQUEADOS; por defecto todos los extras están disponibles
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMOCIONES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * porcentaje  → descuenta un % del precio (valor = 20 significa 20%)
 * monto_fijo  → descuenta un monto fijo del total (valor = 5 significa -$5)
 * 2x1         → el item de menor precio sale gratis dentro de los aplicables
 *               valor = 0 (no se usa)
 * 3x2         → el item de menor precio sale gratis dentro de los aplicables
 *               valor = 0 (no se usa)
 * combo       → precio especial al llevar un conjunto de productos juntos
 *               valor = precio final del combo
 */
export type TipoPromocion =
  | "porcentaje"
  | "monto_fijo"
  | "2x1"
  | "3x2"
  | "combo";

/**
 * Alcance de la promoción:
 * - "todos"      → aplica a todos los productos del menú
 * - "categoria"  → aplica a una o más categorías completas
 * - "productos"  → aplica solo a los productos indicados en `productosAplicables`
 */
export type AlcancePromocion = "todos" | "categoria" | "productos";

export interface Promocion {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoPromocion;
  valor?: number; // si tipo es "porcentaje", es el % a descontar; si es "monto_fijo", es el monto a descontar; si es "combo", es el precio final del combo
  alcance: AlcancePromocion;
  /**
   * Solo si alcance === "categoria".
   * Ej: ["hamburguesa", "papas"]
   */
  categoriasAplicables?: CategoriaProducto[];
  /**
   * Solo si alcance === "productos".
   * El admin elige exactamente qué ids entran.
   * Para "combo", estos son los productos que deben estar TODOS en la orden.
   */
  productosAplicables?: string[];

  activa: boolean;
  imagenUrl?: string;
  fechaInicio: Date;
  fechaFin: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDEN
// ─────────────────────────────────────────────────────────────────────────────
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

/** Detalle de cómo y cuánto se aplicó cada promoción */
export interface PromocionAplicada {
  promocionId: string;
  nombre: string;
  tipo: TipoPromocion;
  montoDescontado: number;
  itemsAfectados: string[]; // ids de los ItemOrden afectados
}
