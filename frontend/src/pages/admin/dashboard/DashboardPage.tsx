import { useOrdenes } from "../../../hooks/useOrdenes";
import { useProductos } from "../../../hooks/useProductos";
import { useUsuarios } from "../../../hooks/useUsuarios";

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent: string;
}) {
  return (
    <div
      className={`bg-claro border-l-4 ${accent} rounded-xl p-5 flex items-center gap-4 shadow-sm`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-secondary/60 text-xs font-black uppercase tracking-[0.15em]">
          {label}
        </p>
        <p className="text-secondary text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { ordenes } = useOrdenes();
  const { productos } = useProductos();
  const { usuarios } = useUsuarios();

  const pendientes = ordenes.filter((o) => o.estado === "pendiente").length;
  const enPreparacion = ordenes.filter(
    (o) => o.estado === "en_preparacion",
  ).length;
  const ventasHoy = ordenes
    .filter((o) => {
      const hoy = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === hoy;
    })
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-secondary tracking-tight">
          Dashboard
        </h2>
        <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
          Resumen del día
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Órdenes pendientes"
          value={pendientes}
          icon="⏳"
          accent="border-yellow-500"
        />
        <StatCard
          label="En preparación"
          value={enPreparacion}
          icon="👨‍🍳"
          accent="border-blue-500"
        />
        <StatCard
          label="Ventas hoy"
          value={`$${ventasHoy.toFixed(2)}`}
          icon="💰"
          accent="border-primary"
        />
        <StatCard
          label="Productos activos"
          value={productos.filter((p) => p.activo).length}
          icon="🍔"
          accent="border-secondary"
        />
      </div>

      {/* Órdenes recientes */}
      <div className="bg-claro border border-primary/15 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-primary/10">
          <h3 className="text-secondary font-black uppercase tracking-[0.15em] text-sm">
            Órdenes recientes
          </h3>
        </div>
        {ordenes.length === 0 ? (
          <p className="text-secondary/40 text-sm p-5">
            No hay órdenes todavía
          </p>
        ) : (
          <div className="divide-y divide-primary/10">
            {ordenes.slice(0, 5).map((orden) => (
              <div
                key={orden.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-primary/5 transition-colors"
              >
                <div>
                  <p className="text-sm text-secondary font-black font-mono">
                    #{orden.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-secondary/50">
                    {orden.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary font-bold">
                    ${orden.total.toFixed(2)}
                  </p>
                  <EstadoBadge estado={orden.estado} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total usuarios"
          value={usuarios.length}
          icon="👥"
          accent="border-secondary"
        />
        <StatCard
          label="Total órdenes"
          value={ordenes.length}
          icon="📋"
          accent="border-primary"
        />
      </div>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    en_preparacion: "bg-blue-100 text-blue-700",
    listo_para_entregar: "bg-green-100 text-green-700",
    entregado: "bg-gray-100 text-gray-500",
    cancelado: "bg-red-100 text-primary",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${map[estado] ?? "bg-gray-100 text-gray-500"}`}
    >
      {estado.replace("_", " ")}
    </span>
  );
}
