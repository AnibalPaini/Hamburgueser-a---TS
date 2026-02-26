import { useOrdenes } from "../../../hooks/useOrdenes";
import { useProductos } from "../../../hooks/useProductos";
import { useUsuarios } from "../../../hooks/useUsuarios";

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4`}>
      <div className={`text-3xl p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { ordenes } = useOrdenes();
  const { productos } = useProductos();
  const { usuarios } = useUsuarios();

  const pendientes = ordenes.filter((o) => o.estado === "pendiente").length;
  const enPreparacion = ordenes.filter((o) => o.estado === "en_preparacion").length;
  const ventasHoy = ordenes
    .filter((o) => {
      const hoy = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === hoy;
    })
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Resumen del día</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Órdenes pendientes" value={pendientes} icon="⏳" color="bg-yellow-500/10 text-yellow-400" />
        <StatCard label="En preparación" value={enPreparacion} icon="👨‍🍳" color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Ventas hoy" value={`$${ventasHoy.toFixed(2)}`} icon="💰" color="bg-green-500/10 text-green-400" />
        <StatCard label="Productos activos" value={productos.filter((p) => p.activo).length} icon="🍔" color="bg-amber-500/10 text-amber-400" />
      </div>

      {/* Órdenes recientes */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Órdenes recientes</h3>
        {ordenes.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay órdenes todavía</p>
        ) : (
          <div className="space-y-2">
            {ordenes.slice(0, 5).map((orden) => (
              <div key={orden.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm text-white font-mono">#{orden.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{orden.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">${orden.total.toFixed(2)}</p>
                  <EstadoBadge estado={orden.estado} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total usuarios" value={usuarios.length} icon="👥" color="bg-purple-500/10 text-purple-400" />
        <StatCard label="Total órdenes" value={ordenes.length} icon="📋" color="bg-pink-500/10 text-pink-400" />
      </div>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pendiente: "bg-yellow-500/20 text-yellow-400",
    en_preparacion: "bg-blue-500/20 text-blue-400",
    listo_para_entregar: "bg-green-500/20 text-green-400",
    entregado: "bg-gray-500/20 text-gray-400",
    cancelado: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${map[estado] ?? "bg-gray-700 text-gray-300"}`}>
      {estado.replace("_", " ")}
    </span>
  );
}
