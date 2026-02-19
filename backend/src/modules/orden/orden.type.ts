export type OrdenType = {
    id:number,
    usuarioId: number;
    hamburguesas: {hamburguesaId: number, cantidad: number}[];
    total: number;
    estado: "pendiente" | "en preparación" | "listo para entrega" | "entregado" | "cancelado" | "enviado";
}