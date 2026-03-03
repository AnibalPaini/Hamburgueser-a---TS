import mongoose from "mongoose";
import type { Producto } from "../../types.js";

const productoSchema = new mongoose.Schema<Producto>({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: {
    type: String,
    enum: ["hamburguesa", "papas", "bebida", "extra", "postre"],
    required: true,
  },
  descripcion: { type: String },
  imagenUrl: { type: String },
  activo: { type: Boolean, default: true },
  extrasExcluidos: { type: [String], default: undefined }, // ids de extras bloqueados; vacío = todos disponibles
});

const ProductoModel = mongoose.model<Producto>("Producto", productoSchema);

export default ProductoModel;
