import mongoose from "mongoose";
import type { Orden } from "../../types.js";

const OrdenSchema = new mongoose.Schema<Orden>(
  {
    cliente: {
      nombre: { type: String, required: true },
      email: { type: String, required: true },
      telefono: { type: String, required: true },
      domicilio: {
        type: new mongoose.Schema(
          {
            direccion: { type: String, required: true },
            altura: { type: String, required: true },
            piso: { type: String },
            departamento: { type: String },
          },
          { _id: false },
        ),
        required: false,
      },
    },
    tipoEntrega: {
      type: String,
      enum: ["retiro", "envio"],
      required: true,
    },
    items: [
      {
        productoId: { type: String, required: true },
        cantidad: { type: Number, required: true, min: 1 },
        precioUnitario: { type: Number, required: true, min: 0 },
        extras: [
          {
            extraId: { type: String, required: true },
            cantidad: { type: Number, required: true, min: 1 },
          },
        ],
        esCombo: { type: Boolean, default: false },
        comboId: { type: String },
      },
    ],
    estado: {
      type: String,
      enum: [
        "pendiente",
        "en_preparacion",
        "listo_para_entregar",
        "entregado",
        "cancelado",
      ],
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
