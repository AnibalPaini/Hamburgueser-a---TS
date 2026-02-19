import type { Request, Response } from "express";
import HamburguesaService from "./hamburguesa.service.js";
import type { HamburguesaBody } from "./hamburguesa.type.js";

const hamburguesaService = new HamburguesaService();

export const getHamburguesas = async (req: Request, res: Response) => {
  try {
    const hamburguesas = await hamburguesaService.getAll();
    res.json(hamburguesas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las hamburguesas" });
  }
};

export const postHamburguesa = async (
  req: Request<{}, HamburguesaBody>,
  res: Response,
) => {
  try {
    const { nombre, precio, disponible, descripcion, imagenUrl, adicionales } =
      req.body;
    const nuevaHamburguesa = await hamburguesaService.create({
      nombre,
      precio,
      descripcion,
      disponible,
      imagenUrl,
      adicionales,
    });
    res.status(201).json(nuevaHamburguesa);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la hamburguesa" });
  }
};

export const putHamburguesa = async (
  req: Request<{ id: string }, {}, HamburguesaBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const hamburguesaActualizada = await hamburguesaService.update(id, datos);
    if (!hamburguesaActualizada) {
      return res.status(404).json({ error: "Hamburguesa no encontrada" });
    }

    res.json({ message: "Hamburguesa actualizada", data: datos });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la hamburguesa" });
  }
};

export const deleteHamburguesa = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const hamburguesaEliminada = await hamburguesaService.delete(id);
    if (!hamburguesaEliminada) {
      return res.status(404).json({ error: "Hamburguesa no encontrada" });
    }
    res.json({ message: "Hamburguesa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la hamburguesa" });
  }
};