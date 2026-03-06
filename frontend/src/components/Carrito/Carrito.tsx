import { useState, useEffect } from "react";
import { useCarrito } from "../../context/carrito/cart.hook";
import { useProductos } from "../../hooks/useProductos";
import { usePromociones } from "../../hooks/usePromociones";
import { ordenService } from "../../services/orden.service";
import { calcularResumenCarrito } from "../../context/carrito/calcularPromos";
import type { TipoEntrega } from "../../types/cliente.type";

const tipoLabel: Record<string, string> = {
  porcentaje: "% desc.",
  monto_fijo: "$ desc.",
  "2x1": "2×1",
  "3x2": "3×2",
  combo: "Combo",
};

// ─── Input helper (fuera del componente para evitar re-montaje en cada render) ─
interface InputProps {
  label: string;
  field: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const CarritoInput = ({
  label,
  field,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required = false,
}: InputProps) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={`carrito-${field}`}
      className="text-xs font-bold text-gray-500 uppercase tracking-wider"
    >
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      id={`carrito-${field}`}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border rounded-lg px-3 py-2 text-sm text-secondary bg-white placeholder-gray-400 outline-none focus:border-primary transition ${
        error ? "border-red-400" : "border-primary/20 focus:border-primary"
      }`}
    />
    {error && <span className="text-red-400 text-[11px]">{error}</span>}
  </div>
);

type Paso = "carrito" | "datos";

interface FormState {
  tipoEntrega: TipoEntrega;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  altura: string;
  piso: string;
  departamento: string;
}

const formInicial: FormState = {
  tipoEntrega: "retiro",
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  altura: "",
  piso: "",
  departamento: "",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Carrito = ({ isOpen, onClose }: Props) => {
  const { carrito, dispatch, totalItems } = useCarrito();
  const { productos } = useProductos();
  const { promociones } = usePromociones();
  const [paso, setPaso] = useState<Paso>("carrito");
  const [form, setForm] = useState<FormState>(formInicial);
  const [errores, setErrores] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [confirmando, setConfirmando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState<string | null>(null);
  const [errorOrden, setErrorOrden] = useState<string | null>(null);

  const resumen = calcularResumenCarrito(carrito.items, promociones, productos);

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setPaso("carrito");
      setForm(formInicial);
      setErrores({});
      setErrorOrden(null);
    }
  }, [isOpen]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: undefined }));
  };

  const validar = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (form.tipoEntrega === "envio") {
      if (!form.direccion.trim()) e.direccion = "Requerido";
      if (!form.altura.trim()) e.altura = "Requerido";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirmar = async () => {
    if (!validar()) return;
    setConfirmando(true);
    setErrorOrden(null);
    try {
      const res = await ordenService.crear({
        items: carrito.items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          ...(item.extras?.length && { extras: item.extras }),
          ...(item.esCombo && {
            esCombo: true,
            comboId: item.comboId,
          }),
        })),
        tipoEntrega: form.tipoEntrega,
        cliente: {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          ...(form.tipoEntrega === "envio" && {
            domicilio: {
              direccion: form.direccion,
              altura: form.altura,
              ...(form.piso && { piso: form.piso }),
              ...(form.departamento && { departamento: form.departamento }),
            },
          }),
        },
      });
      setOrdenConfirmada(res.data.id);
      dispatch({ type: "CLEAR_CART" });
      setPaso("carrito");
    } catch {
      setErrorOrden("No se pudo confirmar el pedido. Intentá de nuevo.");
    } finally {
      setConfirmando(false);
    }
  };

  // ─── Input helper ───────────────────────────────────────────────────────────
  // (componente definido fuera del árbol — ver CarritoInput arriba)

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-oscuro z-50 flex flex-col shadow-2xl transition-transform duration-300 bg-claro ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/20 shrink-0">
          <div className="flex items-center gap-3">
            {paso === "datos" && (
              <button
                onClick={() => setPaso("carrito")}
                className="text-gray-400 hover:text-primary transition text-sm font-bold"
              >
                ←
              </button>
            )}
            <h2 className="text-xl font-black text-primary uppercase tracking-wider">
              {paso === "carrito" ? (
                <>
                  🛒 Tu pedido
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-bold bg-primary text-white rounded-full px-2 py-0.5">
                      {totalItems}
                    </span>
                  )}
                </>
              ) : (
                "Tus datos"
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* ── PASO 1: CARRITO ── */}
        {paso === "carrito" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {/* Orden confirmada */}
              {ordenConfirmada && (
                <div className="bg-green-900/40 border border-green-500 rounded-xl p-4 text-green-300 text-sm font-semibold">
                  ✅ ¡Pedido confirmado! ID:{" "}
                  <span className="font-mono">{ordenConfirmada}</span>
                  <button
                    className="block mt-2 text-xs underline text-green-400 hover:text-green-200"
                    onClick={() => setOrdenConfirmada(null)}
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {/* Carrito vacío */}
              {carrito.items.length === 0 && !ordenConfirmada && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
                  <span className="text-5xl">🍔</span>
                  <p className="font-semibold text-sm">Tu carrito está vacío</p>
                </div>
              )}

              {/* Items */}
              {carrito.items.map((item) => {
                const esCombo = item.esCombo === true;
                const producto = !esCombo
                  ? productos.find((p) => p._id === item.productoId)
                  : undefined;
                const esHamburguesa = producto?.categoria === "hamburguesa";
                const imagenMostrar = esCombo
                  ? item.imagenCombo
                  : producto?.imagenUrl;
                const nombreMostrar = esCombo
                  ? (item.nombreCombo ?? "Combo")
                  : (producto?.nombre ?? item.productoId);
                return (
                  <div
                    key={
                      esCombo
                        ? `combo-${item.comboId}`
                        : `${item.productoId}-${JSON.stringify(item.extras)}`
                    }
                    className="bg-claro/5 border border-primary/10 rounded-xl p-4 flex gap-3"
                  >
                    {imagenMostrar ? (
                      <img
                        src={imagenMostrar}
                        alt={nombreMostrar}
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                    ) : esCombo ? (
                      <span className="w-16 h-16 flex items-center justify-center text-3xl shrink-0">
                        🍔
                      </span>
                    ) : null}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-secondary text-sm leading-tight">
                            {nombreMostrar}
                          </span>
                          {esCombo && (
                            <span className="text-[10px] font-black bg-primary/15 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                              Combo
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: {
                                productoId: item.productoId,
                                extras: item.extras,
                                comboId: item.comboId,
                              },
                            })
                          }
                          className="text-gray-500 hover:text-red-400 transition text-lg leading-none shrink-0"
                        >
                          ×
                        </button>
                      </div>
                      {esHamburguesa &&
                        item.extras &&
                        item.extras.length > 0 && (
                          <ul className="flex flex-col gap-0.5 mt-0.5">
                            {item.extras.map((e) => {
                              const extraProd = productos.find(
                                (p) => p._id === e.extraId,
                              );
                              return (
                                <li
                                  key={e.extraId}
                                  className="text-xs text-secondary font-semibold"
                                >
                                  + {e.cantidad}×{" "}
                                  {extraProd?.nombre ?? e.extraId}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      <span className="text-xs text-gray-400 mt-0.5">
                        ${item.precioUnitario.toFixed(2)} c/u
                      </span>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              dispatch({
                                type: "DECREMENT_ITEM",
                                payload: {
                                  productoId: item.productoId,
                                  extras: item.extras,
                                  comboId: item.comboId,
                                },
                              })
                            }
                            className="w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-base font-black"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-black text-primary tabular-nums text-sm">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() =>
                              dispatch({
                                type: "INCREMENT_ITEM",
                                payload: {
                                  productoId: item.productoId,
                                  extras: item.extras,
                                  comboId: item.comboId,
                                },
                              })
                            }
                            className="w-7 h-7 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-base font-black"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-black text-secondary text-sm">
                          ${(item.precioUnitario * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer paso 1 */}
            {carrito.items.length > 0 && (
              <div className="border-t border-primary/20 px-5 py-4 flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-primary">
                    ${resumen.subtotal.toFixed(2)}
                  </span>
                </div>
                {resumen.promocionesAplicadas.map((p) => (
                  <div
                    key={p.promocionId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-1.5 text-green-400 font-semibold">
                      <span className="text-[10px] font-black bg-green-400/20 text-green-400 px-1.5 py-0.5 rounded-full uppercase">
                        {tipoLabel[p.tipo] ?? p.tipo}
                      </span>
                      {p.nombre}
                    </span>
                    <span className="font-black text-green-400">
                      −${p.montoDescontado.toFixed(2)}
                    </span>
                  </div>
                ))}
                {resumen.descuentoTotal > 0 && (
                  <div className="border-t border-primary/10 pt-2 mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Descuento total
                    </span>
                    <span className="font-black text-green-400 text-sm">
                      −${resumen.descuentoTotal.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1 mb-1">
                  <span className="font-black text-claro text-base uppercase tracking-wide">
                    Total
                  </span>
                  <span className="font-black text-secondary text-xl">
                    ${resumen.total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setPaso("datos")}
                  className="w-full py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white bg-primary rounded-xl hover:bg-secondary active:scale-95 transition-all duration-200 shadow-md"
                >
                  Continuar con mis datos →
                </button>
                <button
                  onClick={() => dispatch({ type: "CLEAR_CART" })}
                  className="text-xs text-gray-500 hover:text-red-400 transition text-center"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </>
        )}

        {/* ── PASO 2: DATOS DEL CLIENTE ── */}
        {paso === "datos" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {/* Tipo de entrega */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tipo de entrega <span className="text-red-400">*</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(["retiro", "envio"] as TipoEntrega[]).map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setField("tipoEntrega", tipo)}
                      className={`py-3 rounded-xl border-2 text-sm font-black uppercase tracking-wider transition-all ${
                        form.tipoEntrega === tipo
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-primary/20 text-gray-500 hover:border-primary/50"
                      }`}
                    >
                      {tipo === "retiro"
                        ? "🏪 Retiro en local"
                        : "🛵 Envío a domicilio"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Datos personales */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-primary/10 pb-1">
                  Datos personales
                </span>
                <CarritoInput
                  label="Nombre"
                  field="nombre"
                  value={form.nombre}
                  onChange={(v) => setField("nombre", v)}
                  error={errores.nombre}
                  placeholder="Juan Pérez"
                  required
                />
                <CarritoInput
                  label="Email"
                  field="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  error={errores.email}
                  placeholder="juan@ejemplo.com"
                  required
                />
                <CarritoInput
                  label="Teléfono"
                  field="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={(v) => setField("telefono", v)}
                  error={errores.telefono}
                  placeholder="11-1234-5678"
                  required
                />
              </div>

              {/* Domicilio — solo si envío */}
              {form.tipoEntrega === "envio" && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-primary/10 pb-1">
                    Dirección de envío
                  </span>
                  <CarritoInput
                    label="Calle"
                    field="direccion"
                    value={form.direccion}
                    onChange={(v) => setField("direccion", v)}
                    error={errores.direccion}
                    placeholder="Av. Siempre Viva"
                    required
                  />
                  <CarritoInput
                    label="Altura / Número"
                    field="altura"
                    value={form.altura}
                    onChange={(v) => setField("altura", v)}
                    error={errores.altura}
                    placeholder="742"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <CarritoInput
                      label="Piso"
                      field="piso"
                      value={form.piso}
                      onChange={(v) => setField("piso", v)}
                      placeholder="3"
                    />
                    <CarritoInput
                      label="Depto."
                      field="departamento"
                      value={form.departamento}
                      onChange={(v) => setField("departamento", v)}
                      placeholder="B"
                    />
                  </div>
                </div>
              )}

              {/* Resumen compacto */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-400 font-semibold">
                  Total a pagar
                </span>
                <span className="font-black text-secondary text-xl">
                  ${resumen.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer paso 2 */}
            <div className="border-t border-primary/20 px-5 py-4 flex flex-col gap-2 shrink-0">
              {errorOrden && (
                <p className="text-red-400 text-xs font-semibold mb-1">
                  {errorOrden}
                </p>
              )}
              <button
                onClick={handleConfirmar}
                disabled={confirmando}
                className="w-full py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white bg-primary rounded-xl hover:bg-secondary active:scale-95 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {confirmando
                  ? "Confirmando..."
                  : `Confirmar pedido — $${resumen.total.toFixed(2)}`}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
