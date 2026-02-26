import { apiClient } from "./api.client";
import type { Promocion, CrearPromocionDTO, ActualizarPromocionDTO } from "../types/promocion.types";

export const promocionService = {
  getAll: () =>
    apiClient.get<Promocion[]>("/api/promociones"),

  getById: (id: string) =>
    apiClient.get<Promocion>(`/api/promociones/${id}`),

  create: (data: CrearPromocionDTO) =>
    apiClient.post<Promocion>("/api/promociones", data),

  update: (id: string, data: ActualizarPromocionDTO) =>
    apiClient.put<Promocion>(`/api/promociones/${id}`, data),

  remove: (id: string) =>
    apiClient.delete(`/api/promociones/${id}`),
};
