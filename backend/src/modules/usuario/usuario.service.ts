import { comparePassword } from './../../utils/bcrypt';
import UsuarioModel from "./usuario.model.js";
import type {
  UsuarioType,
  UsuarioCreateType,
  UsuarioUpdateType,
} from "./usuario.type.js";

import {comparePassword} from "../../utils/bcrypt.js";

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
}
