import type { Promocion } from "../../../types/promocion.types";

export interface CombosCardProps extends Promocion {
  onAgregarAlCarrito?: () => void;
}

const formatDescuento = (tipo: Promocion["tipo"], valor: number): string => {
  switch (tipo) {
    case "porcentaje":
      return `${valor}% OFF`;
    case "monto_fijo":
      return `$${valor} OFF`;
    case "2x1":
      return "2x1";
    case "3x2":
      return "3x2";
    case "combo":
      return `$${valor}`;
    default:
      return `$${valor}`;
  }
};

const CombosCard = ({
  nombre,
  descripcion,
  tipo,
  valor,
  fechaFin,
  imagenUrl,
  onAgregarAlCarrito,
}: CombosCardProps) => {
  const fechaFormateada = new Date(fechaFin).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group flex flex-col bg-claro rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/10">
      {/* Banner superior con degradado */}
      <div className="relative h-32 bg-linear-to-br from-primary to-secondary flex items-center justify-center">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl">🍔</span>
        )}
        {/* Badge descuento */}
        <span className="absolute top-3 right-3 bg-white text-primary text-sm font-black px-3 py-1 rounded-full shadow-md">
          {formatDescuento(tipo, valor)}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-xl font-black text-primary tracking-tight">
          {nombre}
        </h3>
        {descripcion && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            {descripcion}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-auto">
          Válido hasta:{" "}
          <span className="font-semibold text-gray-500">{fechaFormateada}</span>
        </p>
        <button
          onClick={onAgregarAlCarrito}
          disabled={!onAgregarAlCarrito}
          className="mt-2 w-full py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar al pedido
        </button>
      </div>
    </div>
  );
};

export default CombosCard;
