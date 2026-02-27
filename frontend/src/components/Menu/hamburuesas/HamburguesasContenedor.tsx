import HamburguesaCard from "./HamburguesasCard";
import {productoService} from "../../../services/api.products";
import { useEffect, useState } from "react";

import type { Hamburguesa } from "../../../types/hamburguesa.type";

const HamburguesasContenedor = () => {
  //Remplazar con fetch a la API cuando esté lista
  const fetchHamburguesas = async (): Promise<Hamburguesa[]> => {
    try {
      const res = await productoService.getAll();
      return res.data
        .filter((p) => p.categoria === "hamburguesa")
        .map((p) => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion || "",
          precio: p.precio,
          imagen: p.imagenUrl || "",
        }));
    } catch (error) {
      console.error("Error al cargar hamburguesas:", error);
      return [];
    }
  };

  const [hamburguesas, setHamburguesas] = useState<Hamburguesa[]>([]);
  useEffect(() => {
    fetchHamburguesas().then(setHamburguesas);
  }, []);

  return (
    <section className="px-10 py-16 bg-claro/90" id="menu">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block mb-3 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-white bg-primary rounded-full shadow-sm">
            Menú
          </span>
          <h2 className="text-4xl font-black text-primary tracking-tight">
            Nuestras Hamburguesas
          </h2>
          <div className="mt-3 w-16 h-1 bg-secondary rounded-full" />
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hamburguesas.map((h) => (
            <HamburguesaCard key={h.id} {...h} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-2.5 text-sm font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
            Ver más
          </button>
        </div>
      </div>
    </section>
  );
};

export default HamburguesasContenedor;
