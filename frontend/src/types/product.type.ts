export type CategoriaProducto =
  | "hamburguesa"
  | "papas"
  | "bebida"
  | "extra"
  | "combo"
  | "postre";

export interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: CategoriaProducto;
  activo: boolean;
  imagenUrl?: string;
  extrasExcluidos?: string[]; // solo para hamburguesas: ids de extras BLOQUEADOS; vacío = todos disponibles
}

// DTOs para las operaciones
export type CrearProductoDTO = Omit<Producto, "_id">;
export type ActualizarProductoDTO = Partial<CrearProductoDTO>;
