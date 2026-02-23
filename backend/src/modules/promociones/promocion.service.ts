import PromocionModel from "./promocion.model.js";
import type {
  Promocion,
} from "../../types.js";

export class PromocionService {
  async getAll(): Promise<Promocion[]> {
    return await PromocionModel.find();
  }
  async getById(id: string): Promise<Promocion | null> {
    return await PromocionModel.findById(id);
  }
  async create(data: Omit<Promocion, "id">): Promise<Promocion> {
    const promocion = new PromocionModel(data);
    return await promocion.save();
  }
  async update(
    id: string,
    data: Partial<Omit<Promocion, "id">>,
  ): Promise<Promocion | null> {
    return await PromocionModel.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string): Promise<Promocion | null> {
    return await PromocionModel.findByIdAndDelete(id);
  }
}
