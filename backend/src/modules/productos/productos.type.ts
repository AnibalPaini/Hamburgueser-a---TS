export type ProductoType = {
  id: string;
  nombre: string;
  precio: number;
  categoria: "extras" | "bebida" | "postre" | "papas";
  descripcion?: string;
  imagenUrl: string;
  disponible?: boolean;
};

export type ProductoCreateType = Omit<ProductoType, "id">;

export type ProductoUpdateType = Partial<ProductoCreateType>;

