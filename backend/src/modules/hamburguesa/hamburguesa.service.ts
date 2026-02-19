import { after } from "node:test";
import HamburguesaModel from "./hamburguesa.model.js";
import type { HamburguesaBody } from "./hamburguesa.type.js";

export default class HamburguesaService {
  async getAll() {
    return HamburguesaModel.find();
  }

  async getById(id: string) {
    return HamburguesaModel.findById(id);
  }

  async create(data: HamburguesaBody) {
    const nuevaHamburguesa = new HamburguesaModel(data);
    return nuevaHamburguesa.save();
  }

  async update(id: string, data: Partial<HamburguesaBody>) {
    return HamburguesaModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
  }

  async delete(id: string) {
    return HamburguesaModel.findByIdAndDelete(id);
  }
}
