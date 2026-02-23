import mongoose from "mongoose";
import type { Orden } from "../../types.js";

const OrdenSchema = new mongoose.Schema<Orden>(
  {
    items: [
      {
        productoId: { type: String, required: true },
        cantidad: { type: Number, required: true, min: 1 },
        precioUnitario: { type: Number, required: true, min: 0 },
        extrasIds: [{ type: String }],
      },
    ],
    estado: {
      type: String,
      enum: ["pendiente", "en_preparacion", "listo_para_entregar", "entregado", "cancelado"],
      default: "pendiente",
    },
    subtotal: { type: Number, required: true, min: 0 },
    descuentoTotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    promocionesAplicadas: [
      {
        promocionId: { type: String, required: true },
        nombre: { type: String, required: true },
        tipo: {
          type: String,
          enum: ["monto_fijo", "porcentaje", "3x2", "2x1", "combo"],
          required: true,
        },
        montoDescontado: { type: Number, required: true, min: 0 },
        itemsAfectados: [{ type: String }],
      },
    ],
  },
  { timestamps: true },
);

const OrdenModel = mongoose.model<Orden>("Orden", OrdenSchema);

export default OrdenModel;
