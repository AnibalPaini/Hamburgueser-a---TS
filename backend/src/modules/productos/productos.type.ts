export type ProductoType = {
    nombre: string;
    precio: number;
    categoria: "extra" | "bebida" | "postre";
    descripcion?: string;
    imagenUrl: string;
    disponible?: boolean;
};