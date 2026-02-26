import { useOrdenes } from "../../../hooks/useOrdenes";
import type { EstadoOrden, Orden } from "../../../types/orden.types";

const ESTADOS_ACTIVOS: EstadoOrden[] = ["pendiente", "en_preparacion", "listo_para_entregar"];

const ESTADO_CONFIG: Record<EstadoOrden, { label: string; color: string; next?: EstadoOrden; nextLabel?: string }> = {
  pendiente:            { label: "Pendiente",            color: "border-yellow-500/50 bg-yellow-500/5",  next: "en_preparacion",      nextLabel: "Iniciar preparación" },
  en_preparacion:       { label: "En preparación",       color: "border-blue-500/50 bg-blue-500/5",      next: "listo_para_entregar", nextLabel: "Marcar listo" },
  listo_para_entregar:  { label: "Listo para entregar",  color: "border-green-500/50 bg-green-500/5",    next: "entregado",           nextLabel: "Marcar entregado" },
  entregado:            { label: "Entregado",            color: "border-gray-700 bg-gray-800/30" },
  cancelado:            { label: "Cancelado",            color: "border-red-500/50 bg-red-500/5" },
};

function OrdenCard({ orden, onAvanzar }: { orden: Orden; onAvanzar: (id: string, estado: EstadoOrden) => void }) {
  const config = ESTADO_CONFIG[orden.estado];

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${config.color}`}>
      <div className="flex items-center justify-between">
        <p className="text-white font-mono font-bold">#{orden.id.slice(-6).toUpperCase()}</p>
        <span className="text-xs text-gray-400">
          {new Date(orden.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="space-y-1">
        {orden.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-300">x{item.cantidad} · {item.productoId.slice(-4)}</span>
            <span className="text-gray-400">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-2 flex justify-between">
        <span className="text-gray-400 text-sm">Total</span>
        <span className="text-white font-bold">${orden.total.toFixed(2)}</span>
      </div>

      {config.next && (
        <button
          onClick={() => onAvanzar(orden.id, config.next!)}
          className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          {config.nextLabel}
        </button>
      )}
    </div>
  );
}

export function OrdenesPage() {
  const { ordenes, isLoading, error, actualizarEstado, refetch } = useOrdenes();

  const ordenesActivas = ordenes.filter((o) => ESTADOS_ACTIVOS.includes(o.estado));

  if (isLoading) return <div className="text-gray-400">Cargando órdenes...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Órdenes activas</h2>
          <p className="text-gray-400 text-sm mt-1">{ordenesActivas.length} órdenes en curso</p>
        </div>
        <button
          onClick={refetch}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {ordenesActivas.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-white font-medium">No hay órdenes activas</p>
          <p className="text-gray-500 text-sm">Todas las órdenes están al día</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ESTADOS_ACTIVOS.map((estado) => {
            const cols = ordenesActivas.filter((o) => o.estado === estado);
            return (
              <div key={estado} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  {ESTADO_CONFIG[estado].label} ({cols.length})
                </h3>
                {cols.map((orden) => (
                  <OrdenCard key={orden.id} orden={orden} onAvanzar={actualizarEstado} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
