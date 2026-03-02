import CombosCard from "./CombosCard";
import { usePromociones } from "../../../hooks/usePromociones";

const CombosContenedor = () => {
  const { promociones, isLoading, error } = usePromociones();

  const combos = promociones.filter((p) => p.tipo === "combo" && p.activa);

  return (
    <section className="px-10 py-16 bg-claro/90" id="combos">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block mb-3 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-white bg-primary rounded-full shadow-sm">
            Combos
          </span>
          <h2 className="text-4xl font-black text-primary tracking-tight">
            Nuestros Combos
          </h2>
          <div className="mt-3 w-16 h-1 bg-secondary rounded-full" />
        </div>

        {/* Estados */}
        {isLoading && (
          <p className="text-center text-gray-500 font-semibold">
            Cargando combos...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}
        {!isLoading && !error && combos.length === 0 && (
          <p className="text-center text-gray-400 font-semibold">
            No hay combos disponibles por el momento.
          </p>
        )}

        {/* Grid de cards */}
        {!isLoading && combos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {combos.map((combo) => (
              <CombosCard key={combo.id} {...combo} />
            ))}
          </div>
        )}

        {!isLoading && combos.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-2.5 text-sm font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
              Ver más
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CombosContenedor;
