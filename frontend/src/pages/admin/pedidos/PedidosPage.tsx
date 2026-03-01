import { useOrdenes } from "../../../hooks/useOrdenes";
import type { EstadoOrden } from "../../../types/orden.types";

const BADGE: Record<EstadoOrden, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_preparacion: "bg-blue-100 text-blue-700",
  listo_para_entregar: "bg-green-100 text-green-700",
  entregado: "bg-gray-100 text-gray-500",
  cancelado: "bg-red-100 text-primary",
};

export function PedidosPage() {
  const { ordenes, isLoading, error, actualizarEstado } = useOrdenes();

  if (isLoading)
    return (
      <div className="text-secondary/60 font-semibold p-4">
        Cargando pedidos...
      </div>
    );
  if (error)
    return <div className="text-primary font-semibold p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-secondary tracking-tight">
          Pedidos
        </h2>
        <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
          Historial completo de órdenes
        </p>
      </div>

      <div className="bg-claro border border-primary/15 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-claro">
            <tr>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                ID
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Items
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Subtotal
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Descuento
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Total
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Estado
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Fecha
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr
                key={orden.id}
                className="border-t border-primary/10 hover:bg-primary/5 transition-colors"
              >
                <td className="p-4 font-mono font-black text-secondary">
                  #{orden.id.slice(-6).toUpperCase()}
                </td>
                <td className="p-4 text-secondary/70">
                  {orden.items.length} items
                </td>
                <td className="p-4 text-secondary/70">
                  ${orden.subtotal.toFixed(2)}
                </td>
                <td className="p-4 text-green-600 font-semibold">
                  {orden.descuentoTotal > 0
                    ? `-$${orden.descuentoTotal.toFixed(2)}`
                    : "-"}
                </td>
                <td className="p-4 text-secondary font-black">
                  ${orden.total.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${BADGE[orden.estado]}`}
                  >
                    {orden.estado.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-4 text-secondary/50 font-semibold">
                  {new Date(orden.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-4">
                  {orden.estado === "pendiente" && (
                    <button
                      onClick={() => actualizarEstado(orden.id, "cancelado")}
                      className="text-xs bg-primary/10 hover:bg-primary text-primary hover:text-claro px-2 py-1 rounded-lg font-semibold transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
