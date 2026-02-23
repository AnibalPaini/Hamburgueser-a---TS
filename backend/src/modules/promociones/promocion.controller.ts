import type { Request, Response } from "express";
import { PromocionService } from "./promocion.service.js";
import type {
  Promocion,
  TipoPromocion,
  AlcancePromocion,
} from "../../types.js";

const promocionService = new PromocionService();
type PromocionCreateBody = Omit<Promocion, "id">;

export const getAllPromociones = async (req: Request, res: Response) => {
  try {
    const promociones = await promocionService.getAll();
    res.status(200).json(promociones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las promociones" });
  }
};

export const getPromocionById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const promocion = await promocionService.getById(id);
    if (!promocion) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }
    res.status(200).json(promocion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la promoción" });
  }
};

export const createPromocion = async (
  req: Request<{}, {}, PromocionCreateBody>,
  res: Response,
) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      valor,
      alcance,
      categoriasAplicables,
      productosAplicables,
      activa,
      fechaInicio,
      fechaFin,
    } = req.body;
    if (
      !nombre ||
      !tipo ||
      valor === undefined ||
      !alcance ||
      !fechaInicio ||
      !fechaFin ||
      activa === undefined
    ) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios: nombre, tipo, valor, alcance, fechaInicio, fechaFin, activa",
      });
    }
    if (
      tipo === "combo" &&
      (!productosAplicables || productosAplicables.length < 2)
    ) {
      return res.status(400).json({
        error:
          "Para promociones tipo combo, se requieren al menos 2 productos aplicables",
      });
    }

    const nuevaPromocion = await promocionService.create({
      nombre,
      ...(descripcion !== undefined && { descripcion }),
      tipo,
      valor,
      alcance,
      ...(categoriasAplicables !== undefined && { categoriasAplicables }),
      ...(productosAplicables !== undefined && { productosAplicables }),
      activa,
      fechaInicio,
      fechaFin,
    });
    res.status(201).json(nuevaPromocion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la promoción" });
  }
};

export const updatePromocion = async (
  req: Request<{ id: string }, {}, Partial<PromocionCreateBody>>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const updatedPromocion = await promocionService.update(id, req.body);
    if (!updatedPromocion) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }
    res.json(updatedPromocion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la promoción" });
  }
};

export const deletePromocion = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const promocionEliminada = await promocionService.delete(id);
    if (!promocionEliminada) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }
    res.json({ message: "Promoción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la promoción" });
  }
};
