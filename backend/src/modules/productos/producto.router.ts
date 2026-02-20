import { Router } from "express";

const router: Router = Router();

router.get("/");
router.get("/:cid");
router.post("/");
router.put("/");
router.delete("/");

export default router;
