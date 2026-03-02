import { useEffect, useState } from "react";
import HamburguesaCard from "./HamburguesasCard";
import CombosCard from "../combos/CombosCard";
import { productoService } from "../../../services/api.products";
import { promocionService } from "../../../services/promocion.service";
import type { Producto } from "../../../types/product.type";
import type { Promocion } from "../../../types/promocion.types";

type Filtro = "todos" | "hamburguesa" | "papas" | "bebida" | "postre" | "combos";

const FILTROS: { label: string; value: Filtro }[] = [
  { label: "Todos", value: "todos" },
  { label: "Hamburguesas", value: "hamburguesa" },
  { label: "Papas", value: "papas" },
  { label: "Bebidas", value: "bebida" },
  { label: "Combos", value: "combos" },
  { label: "Postres", value: "postre" },
];

export interface PromoInfo {
  label: string;
  tipo: Promocion["tipo"];
  valor: number;
}

function getPromocionActiva(
  producto: Producto,
  promociones: Promocion[],
): PromoInfo | undefined {
  const promo = promociones.find(
    (p) =>
      p.activa &&
      p.tipo !== "combo" &&
      (p.alcance === "todos" ||
        (p.alcance === "categoria" &&
          p.categoriasAplicables?.includes(producto.categoria)) ||
        (p.alcance === "productos" &&
          p.productosAplicables?.includes(producto._id))),
  );
  if (!promo) return undefined;

  let label: string;
  switch (promo.tipo) {
    case "2x1": label = "2x1"; break;
    case "3x2": label = "3x2"; break;
    case "porcentaje": label = `-${promo.valor}%`; break;
    case "monto_fijo": label = `-$${promo.valor}`; break;
    default: label = "Promo";
  }

  return { label, tipo: promo.tipo, valor: promo.valor ?? 0 };
}

const HamburguesasContenedor = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<Filtro>("todos");

  useEffect(() => {
    productoService
      .getAll()
      .then((res) =>
        setProductos(
          res.data.filter((p) => p.categoria !== "extra" && p.activo),
        ),
      )
      .catch((err) => console.error("Error al cargar productos:", err));

    promocionService
      .getAll()
      .then((res) => setPromociones(res.data.filter((p) => p.activa)))
      .catch((err) => console.error("Error al cargar promociones:", err));
  }, []);

  const combosActivos = promociones.filter(
    (p) => p.tipo === "combo" && p.activa,
  );

  const productosFiltrados =
    filtroActivo === "todos" || filtroActivo === "combos"
      ? filtroActivo === "todos" ? productos : []
      : productos.filter((p) => p.categoria === filtroActivo);

  return (
    <section className="px-10 py-16 bg-claro/90" id="menu">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="inline-block mb-3 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-white bg-primary rounded-full shadow-sm">
            Menú
          </span>
          <h2 className="text-4xl font-black text-primary tracking-tight">
            Nuestros Productos
          </h2>
          <div className="mt-3 w-16 h-1 bg-secondary rounded-full" />
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTROS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFiltroActivo(value)}
              className={`px-5 py-2 text-xs font-black uppercase tracking-[0.15em] rounded-full transition-all duration-200 border-2 ${
                filtroActivo === value
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-transparent text-primary border-primary/40 hover:border-primary hover:bg-primary/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid de cards */}
        {filtroActivo === "combos" ? (
          combosActivos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {combosActivos.map((combo) => (
                <CombosCard key={combo.id} {...combo} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16 text-sm font-medium">
              No hay combos disponibles.
            </p>
          )
        ) : productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((p) => (
              <HamburguesaCard
                key={p._id}
                {...p}
                promo={getPromocionActiva(p, promociones)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-16 text-sm font-medium">
            No hay productos en esta categoría.
          </p>
        )}
      </div>
    </section>
  );
};

export default HamburguesasContenedor;
