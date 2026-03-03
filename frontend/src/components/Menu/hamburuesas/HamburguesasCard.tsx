import type { Producto } from "../../../types/product.type";
import type { PromoInfo } from "./HamburguesasContenedor";
import { useNavigate } from "react-router-dom";

interface HamburguesaCardProps extends Producto {
  promo?: PromoInfo;
}

function calcularPrecioFinal(precio: number, promo: PromoInfo): number {
  if (promo.tipo === "porcentaje") {
    return Math.round(precio * (1 - promo.valor / 100) * 100) / 100;
  }
  if (promo.tipo === "monto_fijo") {
    return Math.max(0, precio - promo.valor);
  }
  return precio;
}

const HamburguesaCard = ({
  _id,
  nombre,
  descripcion,
  precio,
  imagenUrl,
  promo,
}: HamburguesaCardProps) => {
  const navigate = useNavigate();
  const tieneDescuentoPrecio =
    promo && (promo.tipo === "porcentaje" || promo.tipo === "monto_fijo");
  const precioFinal = tieneDescuentoPrecio
    ? calcularPrecioFinal(precio, promo!)
    : precio;

  return (
    <div className="group flex flex-col bg-claro rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/10"
      onClick={() => navigate(`/menu/hamburguesas/${_id}`)}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden h-52 bg-primary/5">
        <img
          src={imagenUrl || "/placeholder.jpg"}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge precio */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-0.5">
          {tieneDescuentoPrecio && (
            <span className="bg-white/80 text-gray-400 text-xs font-semibold px-2 py-0.5 rounded-full line-through shadow-sm">
              ${precio}
            </span>
          )}
          <span className="bg-primary text-white text-sm font-black px-3 py-1 rounded-full shadow-md">
            ${precioFinal}
          </span>
        </div>
        {/* Badge promoción */}
        {promo && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            🏷️ {promo.label}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-xl font-black text-primary tracking-tight">
          {nombre}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {descripcion}
        </p>
        <button className="mt-2 w-full py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
          Agregar al pedido
        </button>
      </div>
    </div>
  );
};

export default HamburguesaCard;
