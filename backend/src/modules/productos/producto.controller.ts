import type { Request, Response } from "express";
import ProductoService from "./producto.service.js";
import type { Producto } from "../../types.js";

type ProductoCreateBody = Omit<Producto, "id">;
type ProductoUpdateBody = Partial<ProductoCreateBody>;

const productoService = new ProductoService();

export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await productoService.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const getProductoById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const producto = await productoService.getById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const postProducto = async (
  req: Request<{}, {}, ProductoCreateBody & { extrasDisponibles?: string[] }>,
  res: Response,
) => {
  try {
    const {
      nombre,
      precio,
      categoria,
      descripcion,
      activo,
      imagenUrl,
      extrasDisponibles,
    } = req.body;

    if (!nombre || !precio || !categoria) {
      return res
        .status(400)
        .json({
          error: "Faltan campos obligatorios: nombre, precio, categoria",
        });
    }

/*     if (
      categoria === "hamburguesa" &&
      (!extrasDisponibles || extrasDisponibles.length === 0)
    ) {
      return res
        .status(400)
        .json({
          error: "Una hamburguesa debe tener al menos un extra disponible",
        });
    } */

    const nuevoProducto = await productoService.create({
      nombre,
      precio,
      categoria,
      activo: activo ?? true,
      ...(descripcion !== undefined && { descripcion }),
      ...(imagenUrl !== undefined && { imagenUrl }),
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

export const putProducto = async (
  req: Request<{ id: string }, {}, ProductoUpdateBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const productoActualizado = await productoService.update(id, datos);
    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", data: productoActualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

export const deleteProducto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const productoEliminado = await productoService.delete(id);
    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
