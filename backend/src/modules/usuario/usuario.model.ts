import mongoose from "mongoose";
import type { UsuarioType } from "./usuario.type.js";

const usuarioSchema = new mongoose.Schema<UsuarioType>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin", "cliente"], required: true },
  activo: { type: Boolean, default: true },
});

const UsuarioModel = mongoose.model<UsuarioType>("Usuario", usuarioSchema);
export default UsuarioModel;
