import { Router } from "express";
import {
  register,
  login,
  logout,
  getUsuarios,
  getUsuarioById,
  postUsuario,
  deleteUsuario,
  putUsuario,
} from "./usuario.controller.js";
import {
  authMiddleware,
  authorizationMiddleware,
} from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/", authMiddleware, authorizationMiddleware("admin"), getUsuarios);
router.get("/:id", authMiddleware, authorizationMiddleware("admin"), getUsuarioById);
router.post("/", authMiddleware, authorizationMiddleware("admin"), postUsuario);
router.put("/:id", authMiddleware, authorizationMiddleware("admin"), putUsuario);
router.delete("/:id", authMiddleware, authorizationMiddleware("admin"), deleteUsuario);

router.post("/logout", logout);
router.get("/auth/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
router.post("/login", login);
router.post("/register", register);

export default router;
