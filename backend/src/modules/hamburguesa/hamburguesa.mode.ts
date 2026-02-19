import mongoose, { Schema } from "mongoose";
import type { HamburguesaType } from "./hamburguesa.type.js";

const hamburguesaSchema = new mongoose.Schema<HamburguesaType>({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
  },
  imagenUrl: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  adicionales: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
  },
});

const HamburguesaModel = mongoose.model<HamburguesaType>(
  "Hamburguesa",
  hamburguesaSchema,
);

export default HamburguesaModel;
