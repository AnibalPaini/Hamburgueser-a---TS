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
  extrasDisponibles?: string[]; // solo para hamburguesas, ids de productos con categoria "extra"
}

// DTOs para las operaciones
export type CrearProductoDTO = Omit<Producto, "id">;
export type ActualizarProductoDTO = Partial<CrearProductoDTO>;