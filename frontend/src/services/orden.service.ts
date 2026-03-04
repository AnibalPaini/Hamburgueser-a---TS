import { apiClient } from "./api.client";
import type { Orden, ActualizarEstadoOrdenDTO } from "../types/orden.types";
import type { ExtraItem } from "../context/carrito/orden.type";
import type { Cliente, TipoEntrega } from "../types/cliente.type";

export interface CrearOrdenItemDTO {
  productoId: string;
  cantidad: number;
  extras?: ExtraItem[];
}

export interface CrearOrdenDTO {
  items: CrearOrdenItemDTO[];
  cliente: Cliente;
  tipoEntrega: TipoEntrega;
}

export const ordenService = {
  getAll: () => apiClient.get<Orden[]>("/api/ordenes"),

  getById: (id: string) => apiClient.get<Orden>(`/api/ordenes/${id}`),

  crear: (body: CrearOrdenDTO) => apiClient.post<Orden>("/api/ordenes", body),

  actualizarEstado: (id: string, data: ActualizarEstadoOrdenDTO) =>
    apiClient.patch<Orden>(`/api/ordenes/${id}/estado`, data),
};
