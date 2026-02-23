import { Router } from "express";
import {
  createOrden,
  getOrdenById,
  getOrdenes,
  patchEstadoOrden,
} from "./orden.controller.js";
import {
  authMiddleware,
  authorizationMiddleware,
} from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/", authMiddleware, authorizationMiddleware("admin"), getOrdenes);
router.get(
  "/:id",
  authMiddleware,
  authorizationMiddleware("admin"),
  getOrdenById,
);
router.post("/", createOrden);
router.patch(
  "/:id/estado",
  authMiddleware,
  authorizationMiddleware("admin"),
  patchEstadoOrden,
);

export default router;
