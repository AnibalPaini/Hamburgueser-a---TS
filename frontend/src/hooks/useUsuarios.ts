import { useState, useEffect, useCallback } from "react";
import { usuarioService } from "../services/usuario.service";
import type { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO } from "../types/usuario.types";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await usuarioService.getAll();
      setUsuarios(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const crear = async (data: CrearUsuarioDTO) => {
    const res = await usuarioService.create(data);
    setUsuarios((prev) => [...prev, res.data]);
  };

  const actualizar = async (id: string, data: ActualizarUsuarioDTO) => {
    const res = await usuarioService.update(id, data);
    setUsuarios((prev) => prev.map((u) => (u.id === id ? res.data : u)));
  };

  const eliminar = async (id: string) => {
    await usuarioService.remove(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return { usuarios, isLoading, error, crear, actualizar, eliminar, refetch: fetchUsuarios };
}
