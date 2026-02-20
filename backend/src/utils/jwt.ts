import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { UsuarioJWTType } from "../modules/usuario/usuario.type.js";

export const generateToken = (payload: UsuarioJWTType) => {
  if (config.jwtSecret === undefined) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "72h" });
};

export const verifyToken = (token: string) => {
  try {
    if (config.jwtSecret === undefined) {
      throw new Error("JWT secret is not defined");
    }
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};
