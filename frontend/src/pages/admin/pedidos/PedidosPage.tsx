import { useOrdenes } from "../../../hooks/useOrdenes";
import type { EstadoOrden } from "../../../types/orden.types";

const BADGE: Record<EstadoOrden, string> = {
  pendiente:           "bg-yellow-500/20 text-yellow-400",
  en_preparacion:      "bg-blue-500/20 text-blue-400",
  listo_para_entregar: "bg-green-500/20 text-green-400",
  entregado:           "bg-gray-500/20 text-gray-400",
  cancelado:           "bg-red-500/20 text-red-400",
};

export function PedidosPage() {
  const { ordenes, isLoading, error, actualizarEstado } = useOrdenes();

  if (isLoading) return <div className="text-gray-400">Cargando pedidos...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Pedidos</h2>
        <p className="text-gray-400 text-sm mt-1">Historial completo de órdenes</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Items</th>
              <th className="text-left p-4">Subtotal</th>
              <th className="text-left p-4">Descuento</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Fecha</th>
              <th className="text-left p-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-4 font-mono text-gray-300">#{orden.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 text-gray-300">{orden.items.length} items</td>
                <td className="p-4 text-gray-300">${orden.subtotal.toFixed(2)}</td>
                <td className="p-4 text-green-400">
                  {orden.descuentoTotal > 0 ? `-$${orden.descuentoTotal.toFixed(2)}` : "-"}
                </td>
                <td className="p-4 text-white font-semibold">${orden.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${BADGE[orden.estado]}`}>
                    {orden.estado.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-4 text-gray-400">
                  {new Date(orden.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-4">
                  {orden.estado === "pendiente" && (
                    <button
                      onClick={() => actualizarEstado(orden.id, "cancelado")}
                      className="text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-2 py-1 rounded transition-colors"
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
