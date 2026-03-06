import { useState } from "react";
import { useOrdenes } from "../../../hooks/useOrdenes";
import { useProductos } from "../../../hooks/useProductos";
import { usePromociones } from "../../../hooks/usePromociones";
import type { EstadoOrden, Orden, ItemOrden } from "../../../types/orden.types";
import type { Producto } from "../../../types/product.type";
import type { Promocion } from "../../../types/promocion.types";

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

function OrdenCard({
  orden,
  productos,
  promociones,
  onAvanzar,
}: {
  orden: Orden;
  productos: Producto[];
  promociones: Promocion[];
  onAvanzar: (id: string, estado: EstadoOrden) => void;
}) {
  const config = ESTADO_CONFIG[orden.estado];
  const [expandida, setExpandida] = useState(false);

  return (
    <div className={`border-l-4 rounded-xl bg-claro shadow-sm ${config.color}`}>
      {/* Cabecera siempre visible */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-secondary font-black font-mono text-sm">
            #{orden.id.slice(-6).toUpperCase()}
          </p>
          <span className="text-xs text-secondary/50 font-semibold">
            {new Date(orden.createdAt).toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Resumen rápido */}
        <div className="flex items-center gap-2 text-xs font-semibold text-secondary/70">
          <span>{orden.cliente?.nombre ?? "-"}</span>
          <span className="text-secondary/30">·</span>
          {orden.tipoEntrega === "envio" ? (
            <span className="text-blue-600 font-black">🛵 Envío</span>
          ) : (
            <span className="text-green-600 font-black">🏪 Retiro</span>
          )}
        </div>

        {/* Items resumidos */}
        <div className="space-y-0.5">
          {orden.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-secondary/80 font-semibold">
                ×{item.cantidad}{" "}
                {resolverNombreItem(item, productos, promociones)}
              </span>
              <span className="text-secondary/50 font-semibold">
                ${(item.precioUnitario * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-primary/15 pt-2 flex justify-between items-center">
          <button
            onClick={() => setExpandida((v) => !v)}
            className="text-xs text-primary font-black uppercase tracking-wide hover:underline"
          >
            {expandida ? "▲ Menos info" : "▼ Ver detalle"}
          </button>
          <span className="text-secondary font-black text-sm">
            ${orden.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Panel expandible */}
      {expandida && (
        <div className="border-t border-primary/10 px-4 pb-4 pt-3 space-y-3 bg-white/60 rounded-b-xl">
          {/* Cliente */}
          <div>
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">
              Cliente
            </p>
            <p className="text-sm text-secondary font-bold">
              {orden.cliente?.nombre ?? "-"}
            </p>
            <p className="text-xs text-secondary/60">
              {orden.cliente?.email ?? "-"}
            </p>
            <p className="text-xs text-secondary/60">
              {orden.cliente?.telefono ?? "-"}
            </p>
          </div>

          {/* Dirección si es envío */}
          {orden.tipoEntrega === "envio" && orden.cliente?.domicilio && (
            <div>
              <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">
                Dirección de envío
              </p>
              <p className="text-sm text-secondary font-semibold">
                {orden.cliente.domicilio.direccion}{" "}
                {orden.cliente.domicilio.altura}
                {orden.cliente.domicilio.piso
                  ? `, Piso ${orden.cliente.domicilio.piso}`
                  : ""}
                {orden.cliente.domicilio.departamento
                  ? ` Dpto. ${orden.cliente.domicilio.departamento}`
                  : ""}
              </p>
            </div>
          )}

          {/* Items con extras */}
          <div>
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">
              Detalle de items
            </p>
            <div className="space-y-2">
              {orden.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-primary/5 rounded-lg px-3 py-2 space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-secondary font-black">
                      ×{item.cantidad}{" "}
                      {resolverNombreItem(item, productos, promociones)}
                    </span>
                    <span className="text-sm text-secondary font-bold">
                      ${(item.precioUnitario * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                  {item.extras && item.extras.length > 0 && (
                    <ul className="space-y-0.5 pl-1">
                      {item.extras.map((e) => (
                        <li
                          key={e.extraId}
                          className="text-xs text-secondary/60 font-semibold"
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
          </div>

          {/* Descuentos */}
          {orden.promocionesAplicadas.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">
                Descuentos
              </p>
              {orden.promocionesAplicadas.map((p) => (
                <div
                  key={p.promocionId}
                  className="flex justify-between text-xs"
                >
                  <span className="text-green-600 font-semibold">
                    {p.nombre}
                  </span>
                  <span className="text-green-600 font-black">
                    −${p.montoDescontado.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Totales */}
          <div className="border-t border-primary/10 pt-2 space-y-1 text-xs">
            <div className="flex justify-between text-secondary/60">
              <span>Subtotal</span>
              <span>${orden.subtotal.toFixed(2)}</span>
            </div>
            {orden.descuentoTotal > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Descuento total</span>
                <span>−${orden.descuentoTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-secondary font-black text-sm pt-0.5">
              <span>Total</span>
              <span>${orden.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botón avanzar estado */}
      {config.next && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onAvanzar(orden.id, config.next!)}
            className="w-full bg-primary hover:bg-secondary text-claro font-black py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
            {config.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export function OrdenesPage() {
  const { ordenes, isLoading, error, actualizarEstado, refetch } = useOrdenes();
  const { productos } = useProductos();
  const { promociones } = usePromociones();

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
                    productos={productos}
                    promociones={promociones}
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
