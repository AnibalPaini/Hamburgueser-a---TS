import { Router } from "express";
import { getHamburguesas, postHamburguesa, putHamburguesa, deleteHamburguesa } from "./hamburguesa.controller.js";

const router: Router = Router();

router.get("/", getHamburguesas);

router.post("/", postHamburguesa);

router.put("/:id", putHamburguesa);

router.delete("/:id", deleteHamburguesa);


export default router;