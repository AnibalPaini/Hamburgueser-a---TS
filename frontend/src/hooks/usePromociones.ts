import { useState, useEffect, useCallback } from "react";
import { promocionService } from "../services/promocion.service";
import type { Promocion, CrearPromocionDTO, ActualizarPromocionDTO } from "../types/promocion.types";

export function usePromociones() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromociones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await promocionService.getAll();
      setPromociones(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar promociones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromociones();
  }, [fetchPromociones]);

  const crear = async (data: CrearPromocionDTO) => {
    const res = await promocionService.create(data);
    setPromociones((prev) => [...prev, res.data]);
  };

  const actualizar = async (id: string, data: ActualizarPromocionDTO) => {
    const res = await promocionService.update(id, data);
    setPromociones((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const eliminar = async (id: string) => {
    await promocionService.remove(id);
    setPromociones((prev) => prev.filter((p) => p.id !== id));
  };

  return { promociones, isLoading, error, crear, actualizar, eliminar, refetch: fetchPromociones };
}
