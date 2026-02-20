import type { Request, Response } from "express";
import ProductoService from "./producto.service.js";
import type { ProductoCreateType, ProductoUpdateType } from "./productos.type.js";

const productoService = new ProductoService();

export const getProductos = async (req: Request, res: Response) => {
    try {
        const productos = await productoService.getAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}