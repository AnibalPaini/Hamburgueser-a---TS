import type { ProductoCreateType, ProductoUpdateType, ProductoType } from "./productos.type.js";
import ProductoModel from "./productos.model.js";

export default class ProductoService {
  async getAll(): Promise<ProductoType[]> {
    return ProductoModel.find();
  }
  async getById(id: string) {
    return ProductoModel.findById(id);
  }
  async create(data: ProductoCreateType) {
    return ProductoModel.create(data);
  }
  async update(id: string, data: ProductoUpdateType) {
    return ProductoModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
  }
  async delete(id: string) {
    return ProductoModel.findByIdAndDelete(id);
  }
}
