import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.signedCookies.token
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Agregar la información del usuario al objeto de solicitud
    next(); // Continuar con la siguiente función middleware o ruta
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const authorizationMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};
