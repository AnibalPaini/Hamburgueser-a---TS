// Espejo de: backend/src/modules/usuario/usuario.type.ts

export type RolUsuario = "admin" | "cliente";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
  activo: boolean;
}

export type CrearUsuarioDTO = Omit<Usuario, "id"> & { password: string };
export type ActualizarUsuarioDTO = Partial<Omit<CrearUsuarioDTO, "password">>;
