import { apiClient } from "./api.client";
import type { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO } from "../types/usuario.types";

export const usuarioService = {
  getAll: () =>
    apiClient.get<Usuario[]>("/api/usuarios"),

  getById: (id: string) =>
    apiClient.get<Usuario>(`/api/usuarios/${id}`),

  create: (data: CrearUsuarioDTO) =>
    apiClient.post<Usuario>("/api/usuarios", data),

  update: (id: string, data: ActualizarUsuarioDTO) =>
    apiClient.put<Usuario>(`/api/usuarios/${id}`, data),

  remove: (id: string) =>
    apiClient.delete(`/api/usuarios/${id}`),
};
