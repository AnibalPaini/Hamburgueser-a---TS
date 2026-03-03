import mongoose, { Schema } from "mongoose";
import type { Promocion } from "../../types.js";

const PromocionSchema = new Schema<Promocion>(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },

    tipo: {
      type: String,
      enum: ["porcentaje", "monto_fijo", "2x1", "3x2", "combo"],
      required: true,
    },

    // 2x1 no usa valor → validación cruzada con tipo se hace en pre("validate")
    valor: {
      type: Number,
      default: 0,
      min: [0, "El valor no puede ser negativo"],
    },

    alcance: {
      type: String,
      enum: ["todos", "categoria", "productos"],
      required: true,
    },

    // Solo relevante si alcance === "categoria"
    categoriasAplicables: {
      type: [String],
      enum: ["hamburguesa", "papas", "bebida", "extra", "postre"],
      default: undefined, // no guardar [] vacío si no aplica
    },

    // Solo relevante si alcance === "productos"
    // Referencia real a Producto en lugar de strings sueltos
    productosAplicables: {
      type: [{ type: Schema.Types.ObjectId, ref: "Producto" }],
      default: undefined,
    },

    activa: { type: Boolean, default: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    imagenUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

// ─── Índices ──────────────────────────────────────────────────────────────────

// Las consultas más frecuentes serán "dame las promos activas y vigentes"
PromocionSchema.index({ activa: 1, fechaInicio: 1, fechaFin: 1 });

const PromocionModel = mongoose.model<Promocion>("Promocion", PromocionSchema);

export default PromocionModel;
