import { Router } from "express";
import {
  deleteProducto,
  getProductos,
  postProducto,
  putProducto,
} from "./producto.controller.js";

const router: Router = Router();

router.get("/", getProductos);
router.get("/:cid", getProductos);

router.post("/", postProducto);
router.put("/:id", putProducto);
router.delete("/:id", deleteProducto);

export default router;
