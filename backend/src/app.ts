import express from "express";
import hamburguesaRouter from "./modules/hamburguesa/hamburguesa.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/hamburguesas", hamburguesaRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});