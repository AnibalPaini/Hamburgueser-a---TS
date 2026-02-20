import { comparePassword, hashPassword } from "./../../utils/bcrypt.js";
import UsuarioModel from "./usuario.model.js";
import type {
  UsuarioType,
  UsuarioCreateType,
  UsuarioUpdateType,
} from "./usuario.type.js";


export default class UsuarioService {
  async getAll() {
    return await UsuarioModel.find();
  }

  async getById(id: string) {
    return await UsuarioModel.findById(id);
  }

  async create(usuario: UsuarioCreateType) {
    const newUsuario = new UsuarioModel(usuario);
    return await newUsuario.save();
  }

  async put(id: string, usuario: UsuarioUpdateType) {
    return await UsuarioModel.findByIdAndUpdate(id, usuario, {
      returnDocument: "after",
    });
  }

  async delete(id: string) {
    return await UsuarioModel.findByIdAndDelete(id);
  }

  async login(email: string, password: string) {
    const usuario = await UsuarioModel.findOne({ email });
    if (!usuario) {
      return null;
    }
    const isPasswordValid = comparePassword(password, usuario.password);
    if (!isPasswordValid) {
      return null;
    }
    return usuario;
  }

  async register(
    email: string,
    password: string,
    nombre: string,
    telefono: string,
  ) {
    const existingUser = await UsuarioModel.findOne({ email });
    if (existingUser) {
      return null; // Usuario ya existe
    }
    const hashedPassword = await hashPassword(password);
    const newUsuario = new UsuarioModel({
      email,
      password: hashedPassword,
      nombre,
      telefono,
      rol: "cliente",
      activo: true,
    });
    return await newUsuario.save();
  }
}
