import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send("Hamburguesa route");
});

router.post("/", (req, res) => {
  const { name, price } = req.body;
  res.json({ name, price });
});

export default router;