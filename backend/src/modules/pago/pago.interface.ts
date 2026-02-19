export interface PagoInterface {
  id: number;
  ordenId: number;
  monto: number;
  metodo: "tarjeta" | "efectivo" | "mercadopago" | "transferencia";
  estado: "pendiente" | "aprobado" | "rechazado";
  createdAt: Date;
}
