import { useOrdenes } from "../../../hooks/useOrdenes";
import type { EstadoOrden, Orden } from "../../../types/orden.types";

const ESTADOS_ACTIVOS: EstadoOrden[] = [
  "pendiente",
  "en_preparacion",
  "listo_para_entregar",
];

const ESTADO_CONFIG: Record<
  EstadoOrden,
  { label: string; color: string; next?: EstadoOrden; nextLabel?: string }
> = {
  pendiente: {
    label: "Pendiente",
    color: "border-yellow-400 bg-yellow-50",
    next: "en_preparacion",
    nextLabel: "Iniciar preparación",
  },
  en_preparacion: {
    label: "En preparación",
    color: "border-blue-400 bg-blue-50",
    next: "listo_para_entregar",
    nextLabel: "Marcar listo",
  },
  listo_para_entregar: {
    label: "Listo para entregar",
    color: "border-green-400 bg-green-50",
    next: "entregado",
    nextLabel: "Marcar entregado",
  },
  entregado: { label: "Entregado", color: "border-primary/20 bg-claro" },
  cancelado: { label: "Cancelado", color: "border-primary/30 bg-red-50" },
};

function OrdenCard({
  orden,
  onAvanzar,
}: {
  orden: Orden;
  onAvanzar: (id: string, estado: EstadoOrden) => void;
}) {
  const config = ESTADO_CONFIG[orden.estado];

  return (
    <div
      className={`border-l-4 rounded-xl p-4 space-y-3 bg-claro shadow-sm ${config.color}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-secondary font-black font-mono">
          #{orden.id.slice(-6).toUpperCase()}
        </p>
        <span className="text-xs text-secondary/50 font-semibold">
          {new Date(orden.createdAt).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="space-y-1">
        {orden.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-secondary/70">
              x{item.cantidad} · {item.productoId.slice(-4)}
            </span>
            <span className="text-secondary/50">
              ${(item.precioUnitario * item.cantidad).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-primary/15 pt-2 flex justify-between">
        <span className="text-secondary/50 text-sm font-semibold">Total</span>
        <span className="text-secondary font-black">
          ${orden.total.toFixed(2)}
        </span>
      </div>

      {config.next && (
        <button
          onClick={() => onAvanzar(orden.id, config.next!)}
          className="w-full bg-primary hover:bg-secondary text-claro font-black py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          {config.nextLabel}
        </button>
      )}
    </div>
  );
}

export function OrdenesPage() {
  const { ordenes, isLoading, error, actualizarEstado, refetch } = useOrdenes();

  const ordenesActivas = ordenes.filter((o) =>
    ESTADOS_ACTIVOS.includes(o.estado),
  );

  if (isLoading)
    return (
      <div className="text-secondary/60 font-semibold p-4">
        Cargando órdenes...
      </div>
    );
  if (error)
    return <div className="text-primary font-semibold p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Órdenes activas
          </h2>
          <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
            {ordenesActivas.length} órdenes en curso
          </p>
        </div>
        <button
          onClick={refetch}
          className="bg-primary/10 hover:bg-primary text-primary hover:text-claro border border-primary/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
        >
          🔄 Actualizar
        </button>
      </div>

      {ordenesActivas.length === 0 ? (
        <div className="bg-claro border border-primary/15 rounded-xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-secondary font-black">No hay órdenes activas</p>
          <p className="text-secondary/50 text-sm font-semibold mt-1">
            Todas las órdenes están al día
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ESTADOS_ACTIVOS.map((estado) => {
            const cols = ordenesActivas.filter((o) => o.estado === estado);
            return (
              <div key={estado} className="space-y-3">
                <h3 className="text-xs font-black text-secondary/60 uppercase tracking-[0.18em]">
                  {ESTADO_CONFIG[estado].label} ({cols.length})
                </h3>
                {cols.map((orden) => (
                  <OrdenCard
                    key={orden.id}
                    orden={orden}
                    onAvanzar={actualizarEstado}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
