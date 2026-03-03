import { Router } from "express";
import {
  deleteProducto,
  getProductos,
  getProductoById,
  postProducto,
  putProducto,
} from "./producto.controller.js";

const router: Router = Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);

router.post("/", postProducto);
router.put("/:id", putProducto);
router.delete("/:id", deleteProducto);

export default router;
