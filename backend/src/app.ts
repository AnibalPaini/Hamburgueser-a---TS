import express from "express";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb.js";
import usuarioRouter from "./modules/usuario/usuario.router.js";
import ordenRouter from "./modules/orden/orden.router.js";
import productoRouter from "./modules/productos/producto.router.js"
import promocionesRouter from "./modules/promociones/promocion.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares
app.use(cors(
  config.env === "development"
    ? { origin: "http://localhost:5173", credentials: true }
    : { origin: config.frontendUrl, credentials: true }
));
app.use(cookieParser(config.cookieSecret));                            


//endpoints
app.use("/api/usuarios", usuarioRouter);
app.use("/api/ordenes", ordenRouter);
app.use("/api/productos", productoRouter);
app.use("/api/promociones", promocionesRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();