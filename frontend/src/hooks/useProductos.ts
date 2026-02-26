import { useState, useEffect, useCallback } from "react";
import { productoService } from "../services/api.products";
import type { Producto, CrearProductoDTO, ActualizarProductoDTO } from "../types/product.type";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productoService.getAll();
      setProductos(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const crear = async (data: CrearProductoDTO) => {
    const res = await productoService.create(data);
    setProductos((prev) => [...prev, res.data]);
  };

  const actualizar = async (id: string, data: ActualizarProductoDTO) => {
    const res = await productoService.update(id, data);
    setProductos((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const eliminar = async (id: string) => {
    await productoService.delete(id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return { productos, isLoading, error, crear, actualizar, eliminar, refetch: fetchProductos };
}
