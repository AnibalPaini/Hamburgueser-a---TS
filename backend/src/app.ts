import express from "express";
import hamburguesaRouter from "./modules/hamburguesa/hamburguesa.router.js";
import config from "./config/config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoints
app.use("/api/hamburguesas", hamburguesaRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});