import { UsuarioJWTType } from "./modules/usuario/usuario.types";

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioJWTType;
    }
  }
}