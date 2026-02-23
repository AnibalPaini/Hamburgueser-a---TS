import type { Request, Response } from "express";
import type { ItemOrden, EstadoOrden, Orden } from "../../types.js";
import OrdenService from "./orden.services.js";

const ordenService = new OrdenService();

type OrdenCreateBody = {
  items: Pick<ItemOrden, "productoId" | "cantidad" | "extrasIds">[];
};

export const getOrdenes = async (req: Request, res: Response) => {
  try {
    const ordenes: Orden[] = await ordenService.getOrdenes();
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las ordenes" });
  }
};

export const getOrdenById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(400).json({ error: "El campo id es requerido" });
    const orden = await ordenService.getOrdenById(id);
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden" });
  }
};

export const createOrden = async (
  req: Request<{}, OrdenCreateBody>,
  res: Response,
) => {
  try {
    const { items } = req.body;
    if (!items?.length) {
      return res
        .status(400)
        .json({ error: "La orden debe tener al menos un item" });
    }
    const nuevaOrden = await ordenService.createOrden({ items });
    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la orden" });
  }
};

export const patchEstadoOrden = async (
  req: Request<{ id: string }, {}, { estado: EstadoOrden }>,
  res: Response,
) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ error: "El campo estado es requerido" });
    }
    const ordenActualizada = await ordenService.updateEstado(
      req.params.id,
      estado,
    );
    if (!ordenActualizada)
      return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json(ordenActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};
