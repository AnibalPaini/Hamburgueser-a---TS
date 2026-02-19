import mongoose from "mongoose";
import type { ProductoType } from "./productos.type.js";

const hamburguesaSchema = new mongoose.Schema<ProductoType>({
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    categoria: {
        type: String,
        enum: ["extra", "bebida", "postre"],
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
})

const ProductoModel = mongoose.model<ProductoType>("Producto", hamburguesaSchema);

export default ProductoModel;