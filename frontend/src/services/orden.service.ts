import { apiClient } from "./api.client";
import type { Orden, ActualizarEstadoOrdenDTO } from "../types/orden.types";

export const ordenService = {
  getAll: () =>
    apiClient.get<Orden[]>("/api/ordenes"),

  getById: (id: string) =>
    apiClient.get<Orden>(`/api/ordenes/${id}`),

  actualizarEstado: (id: string, data: ActualizarEstadoOrdenDTO) =>
    apiClient.patch<Orden>(`/api/ordenes/${id}/estado`, data),
};
