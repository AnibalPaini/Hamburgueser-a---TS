import { useState } from "react";
import { useOrdenes } from "../../../hooks/useOrdenes";
import { useProductos } from "../../../hooks/useProductos";
import { usePromociones } from "../../../hooks/usePromociones";
import type { EstadoOrden, Orden, ItemOrden } from "../../../types/orden.types";
import type { Producto } from "../../../types/product.type";
import type { Promocion } from "../../../types/promocion.types";

const BADGE: Record<EstadoOrden, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  en_preparacion: "bg-blue-100 text-blue-700",
  listo_para_entregar: "bg-green-100 text-green-700",
  entregado: "bg-gray-100 text-gray-500",
  cancelado: "bg-red-100 text-primary",
};

function resolverNombreItem(
  item: ItemOrden,
  productos: Producto[],
  promociones: Promocion[],
): string {
  if (item.esCombo && item.comboId) {
    const combo = promociones.find((p) => p.id === item.comboId);
    return combo ? `🍔 ${combo.nombre}` : "Combo";
  }
  const prod = productos.find((p) => p._id === item.productoId);
  return prod?.nombre ?? item.productoId.slice(-6).toUpperCase();
}

function resolverNombreExtra(extraId: string, productos: Producto[]): string {
  const prod = productos.find((p) => p._id === extraId);
  return prod?.nombre ?? extraId.slice(-6).toUpperCase();
}

function DetallePedido({
  orden,
  productos,
  promociones,
}: {
  orden: Orden;
  productos: Producto[];
  promociones: Promocion[];
}) {
  return (
    <tr className="bg-primary/5">
      <td colSpan={8} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Cliente */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">
              Cliente
            </p>
            <p className="font-bold text-secondary">
              {orden.cliente?.nombre ?? "-"}
            </p>
            <p className="text-secondary/60">{orden.cliente?.email ?? "-"}</p>
            <p className="text-secondary/60">
              {orden.cliente?.telefono ?? "-"}
            </p>
            <div className="mt-2">
              {orden.tipoEntrega === "envio" ? (
                <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  🛵 Envío a domicilio
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  🏪 Retiro en local
                </span>
              )}
            </div>
            {orden.tipoEntrega === "envio" && orden.cliente?.domicilio && (
              <p className="text-secondary/70 text-xs mt-1">
                {orden.cliente.domicilio.direccion}{" "}
                {orden.cliente.domicilio.altura}
                {orden.cliente.domicilio.piso
                  ? `, Piso ${orden.cliente.domicilio.piso}`
                  : ""}
                {orden.cliente.domicilio.departamento
                  ? ` Dpto. ${orden.cliente.domicilio.departamento}`
                  : ""}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">
              Items
            </p>
            {orden.items.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg px-3 py-2 space-y-1 border border-primary/10"
              >
                <div className="flex justify-between">
                  <span className="font-black text-secondary text-xs">
                    ×{item.cantidad}{" "}
                    {resolverNombreItem(item, productos, promociones)}
                  </span>
                  <span className="text-secondary/60 text-xs font-semibold">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
                {item.extras && item.extras.length > 0 && (
                  <ul className="space-y-0.5 pl-1">
                    {item.extras.map((e) => (
                      <li
                        key={e.extraId}
                        className="text-[11px] text-secondary/50 font-semibold"
                      >
                        + {e.cantidad}×{" "}
                        {resolverNombreExtra(e.extraId, productos)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Totales y descuentos */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">
              Resumen
            </p>
            <div className="bg-white rounded-lg px-3 py-3 border border-primary/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-secondary/60">
                <span>Subtotal</span>
                <span>${orden.subtotal.toFixed(2)}</span>
              </div>
              {orden.promocionesAplicadas.map((p) => (
                <div
                  key={p.promocionId}
                  className="flex justify-between text-green-600 font-semibold"
                >
                  <span className="truncate max-w-30">{p.nombre}</span>
                  <span>−${p.montoDescontado.toFixed(2)}</span>
                </div>
              ))}
              {orden.descuentoTotal > 0 && (
                <div className="flex justify-between text-green-600 font-bold border-t border-primary/10 pt-1">
                  <span>Descuento total</span>
                  <span>−${orden.descuentoTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary font-black text-sm border-t border-primary/10 pt-1">
                <span>Total</span>
                <span>${orden.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function PedidosPage() {
  const { ordenes, isLoading, error, actualizarEstado } = useOrdenes();
  const { productos } = useProductos();
  const { promociones } = usePromociones();
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [soloHoy, setSoloHoy] = useState(false);

  const hoy = new Date().toDateString();
  const ordenadas = [...ordenes]
    .filter((o) => !soloHoy || new Date(o.createdAt).toDateString() === hoy)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Pedidos
          </h2>
          <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
            {ordenadas.length} pedido{ordenadas.length !== 1 ? "s" : ""}
            {soloHoy ? " hoy" : " en total"} · Clic en una fila para ver detalle
          </p>
        </div>
        <button
          onClick={() => setSoloHoy((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all duration-200 ${
            soloHoy
              ? "bg-primary text-claro shadow-md"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          📅 {soloHoy ? "Mostrando hoy" : "Ver solo hoy"}
        </button>
      </div>

      <div className="bg-claro border border-primary/15 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-claro">
            <tr>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                ID
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Cliente
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Items
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Entrega
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Total
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Estado
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Fecha
              </th>
              <th className="text-left p-4 font-black uppercase tracking-widest text-xs">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((orden) => {
              const abierta = expandidoId === orden.id;
              return (
                <>
                  <tr
                    key={orden.id}
                    onClick={() => setExpandidoId(abierta ? null : orden.id)}
                    className={`border-t border-primary/10 cursor-pointer transition-colors ${
                      abierta ? "bg-primary/10" : "hover:bg-primary/5"
                    }`}
                  >
                    <td className="p-4 font-mono font-black text-secondary">
                      #{orden.id.slice(-6).toUpperCase()}
                      <span className="ml-1 text-secondary/30 text-xs">
                        {abierta ? "▲" : "▼"}
                      </span>
                    </td>
                    <td className="p-4 text-secondary/80 font-semibold">
                      {orden.cliente?.nombre ?? "-"}
                    </td>
                    <td className="p-4 text-secondary/70">
                      {orden.items.length} items
                    </td>
                    <td className="p-4">
                      {orden.tipoEntrega === "envio" ? (
                        <span className="text-blue-600 font-black text-xs">
                          🛵 Envío
                        </span>
                      ) : (
                        <span className="text-green-600 font-black text-xs">
                          🏪 Retiro
                        </span>
                      )}
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
                      {new Date(orden.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      {orden.estado === "pendiente" && (
                        <button
                          onClick={() =>
                            actualizarEstado(orden.id, "cancelado")
                          }
                          className="text-xs bg-primary/10 hover:bg-primary text-primary hover:text-claro px-2 py-1 rounded-lg font-semibold transition-all duration-200"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                  {abierta && (
                    <DetallePedido
                      key={`${orden.id}-detalle`}
                      orden={orden}
                      productos={productos}
                      promociones={promociones}
                    />
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
