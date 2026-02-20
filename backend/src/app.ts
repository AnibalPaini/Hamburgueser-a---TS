import express from "express";
import hamburguesaRouter from "./modules/hamburguesa/hamburguesa.router.js";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb.js";
import usuarioRouter from "./modules/usuario/usuario.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares
app.use(cors());
app.use(cookieParser(config.cookieSecret));                            


//endpoints
app.use("/api/hamburguesas", hamburguesaRouter);
app.use("/api/usuarios", usuarioRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();