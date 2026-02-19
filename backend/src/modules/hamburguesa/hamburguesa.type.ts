export type HamburguesaType = {
    id: number;
    nombre: string;
    precio: number;
    descripcion?: string;
    disponible: boolean;
    imagenUrl?: string;
    adicionales?: string[];
}