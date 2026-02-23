import type { Producto } from "../../types.js";
import ProductoModel from "./productos.model.js";

type ProductoCreateBody = Omit<Producto, "id">;
type ProductoUpdateBody = Partial<ProductoCreateBody>;

export default class ProductoService {

  async getAll() {
    return ProductoModel.find();
  }

  async getById(id: string) {
    return ProductoModel.findById(id);
  }

  async create(data: ProductoCreateBody) {
    return ProductoModel.create(data);
  }

  async update(id: string, data: ProductoUpdateBody) {
    return ProductoModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
  }

  async delete(id: string) {
    return ProductoModel.findByIdAndDelete(id);
  }
}