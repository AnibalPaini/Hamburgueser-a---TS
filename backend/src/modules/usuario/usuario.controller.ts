import type { Request, Response } from "express";
import UsuarioService from "./usuario.service.js";
import type {
  UsuarioCreateType,
  UsuarioUpdateType,
  UsuarioLoginType,
  UsuarioRegisterType,
  UsuarioJWTType,
} from "./usuario.type.js";
import { generateToken } from "../../utils/jwt.js";
import { cookieExtractor } from "../../utils/cookies.js";

const usuarioService = new UsuarioService();

/* LOGIN - REGISTER */

export const login = async (
  req: Request<{}, {}, UsuarioLoginType>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuarioService.login(email, password);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = generateToken({
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 días
      httpOnly: true,
      signed: true,
      sameSite: "strict",
    });

    res.json({ message: "Login exitoso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const register = async (
  req: Request<{}, {}, UsuarioRegisterType>,
  res: Response,
) => {
  try {
    const { nombre, telefono, email, password } = req.body;
    const usuario = await usuarioService.register(
      email,
      password,
      nombre,
      telefono,
    );
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({ message: "Registro exitoso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

/* Controllers de admin */

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUsuarioById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getById(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const postUsuario = async (
  req: Request<{}, {}, UsuarioCreateType>,
  res: Response,
) => {
  try {
    const { nombre, email, telefono, password, rol, activo } = req.body;
    if (!nombre || !email || !telefono || !password || !rol) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const nuevoUsuario = await usuarioService.create({
      nombre,
      email,
      telefono,
      password,
      rol,
      activo,
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const putUsuario = async (
  req: Request<{ id: string }, {}, UsuarioUpdateType>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const usuarioActualizado = await usuarioService.put(id, datos);
    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado", data: datos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUsuario = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await usuarioService.delete(id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
