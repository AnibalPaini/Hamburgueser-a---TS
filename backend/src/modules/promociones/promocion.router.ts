import {Router} from 'express';
import { deletePromocion, getAllPromociones, createPromocion, updatePromocion, getPromocionById } from './promocion.controller.js';

const router: Router = Router();

router.get("/", getAllPromociones)
router.get("/:id", getPromocionById)
router.post("/", createPromocion)
router.put("/:id", updatePromocion)
router.delete("/:id", deletePromocion)

export default router;