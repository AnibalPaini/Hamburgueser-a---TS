import type { ObjectId } from "mongoose";

export type UsuarioType = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "admin" | "cliente";
  activo: boolean;
};

export type UsuarioRegisterType = {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
};

export type UsuarioCreateType = Omit<UsuarioType, "id">;

export type UsuarioUpdateType = Partial<UsuarioCreateType>;

export type UsuarioLoginType = Pick<UsuarioType, "email" | "password">;

export type UsuarioJWTType = Omit<
  UsuarioType,
  "password" | "activo" | "telefono"
>;
