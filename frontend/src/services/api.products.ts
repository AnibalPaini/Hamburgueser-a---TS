import type {
  Producto,
  CrearProductoDTO,
  ActualizarProductoDTO,
} from "../types/product.type";
import { apiClient } from "./api.client";

export const productoService = {
    getAll: () =>
    apiClient.get<Producto[]>("/api/productos"),
    getById: (id: string) =>
    apiClient.get<Producto>(`/api/productos/${id}`),
    create: (data: CrearProductoDTO) =>
    apiClient.post<Producto>("/api/productos", data),
    update: (id: string, data: ActualizarProductoDTO) =>
    apiClient.put<Producto>(`/api/productos/${id}`, data),
    delete: (id: string) =>
    apiClient.delete(`/api/productos/${id}`),
}