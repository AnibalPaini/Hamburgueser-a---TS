import { useState, useEffect, useCallback } from "react";
import { ordenService } from "../services/orden.service";
import type { Orden, EstadoOrden } from "../types/orden.types";

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ordenService.getAll();
      setOrdenes(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar órdenes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  const actualizarEstado = async (id: string, estado: EstadoOrden) => {
    const res = await ordenService.actualizarEstado(id, { estado });
    setOrdenes((prev) => prev.map((o) => (o.id === id ? res.data : o)));
  };

  return { ordenes, isLoading, error, actualizarEstado, refetch: fetchOrdenes };
}
