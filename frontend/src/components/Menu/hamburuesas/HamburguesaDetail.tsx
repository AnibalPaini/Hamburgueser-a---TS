import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productoService } from "../../../services/api.products";
import type { Producto } from "../../../types/product.type";
import { useCarrito } from "../../../context/carrito/cart.hook";

const HamburguesaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [extras, setExtras] = useState<Producto[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await productoService.getById(id);
        console.log(res);

        const prod = res.data;
        setProducto(prod);

        // Si es hamburguesa, cargamos TODOS los extras y excluimos los bloqueados
        if (prod.categoria === "hamburguesa") {
          const todosRes = await productoService.getAll();
          const excluidos = prod.extrasExcluidos ?? [];
          const extrasDisponibles = todosRes.data.filter(
            (p) =>
              p.categoria === "extra" && p.activo && !excluidos.includes(p._id),
          );
          setExtras(extrasDisponibles);
        }
      } catch {
        setError("No se pudo cargar el producto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const cambiarCantidad = (extraId: string, delta: number) => {
    setSelectedExtras((prev) => {
      const actual = prev[extraId] ?? 0;
      const nueva = actual + delta;
      if (nueva <= 0) {
        return Object.fromEntries(
          Object.entries(prev).filter(([k]) => k !== extraId),
        );
      }
      return { ...prev, [extraId]: nueva };
    });
  };

  const { dispatch } = useCarrito();

  const precioExtras = extras.reduce((acc, e) => {
    const qty = selectedExtras[e._id] ?? 0;
    return acc + e.precio * qty;
  }, 0);

  const total = (producto?.precio ?? 0) + precioExtras;

  const handleAgregarAlCarrito = () => {
    if (!producto) return;
    const extrasItem = Object.entries(selectedExtras)
      .filter(([, qty]) => qty > 0)
      .map(([extraId, cantidad]) => ({ extraId, cantidad }));
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productoId: producto._id,
        cantidad: 1,
        precioUnitario: total,
        ...(extrasItem.length > 0 && { extras: extrasItem }),
      },
    });
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-oscuro">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-oscuro gap-4">
        <p className="text-red-400 text-lg font-semibold">
          {error ?? "Producto no encontrado."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-primary text-white rounded-md font-bold hover:bg-secondary transition"
        >
          Volver
        </button>
      </div>
    );
  }

  const esHamburguesa = producto.categoria === "hamburguesa";
  const esCombo = producto.categoria === "combo";

  return (
    <div className="min-h-screen bg-oscuro text-claro">
      {/* Botón volver */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition"
        >
          ← Volver
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Imagen + info principal */}
        <div className="flex flex-col md:flex-row gap-8 bg-claro/5 rounded-2xl overflow-hidden border border-primary/10 shadow-lg">
          {/* Imagen */}
          <div className="md:w-1/2 h-64 md:h-auto bg-primary/10 shrink-0">
            <img
              src={producto.imagenUrl || "/placeholder.jpg"}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between p-6 gap-4 flex-1">
            <div className="flex flex-col gap-2">
              {/* Badge categoría */}
              <span className="self-start text-xs font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-1 rounded-full">
                {esCombo
                  ? "🍔 Combo"
                  : esHamburguesa
                    ? "🍔 Hamburguesa"
                    : producto.categoria}
              </span>

              <h1 className="text-3xl font-black text-primary">
                {producto.nombre}
              </h1>

              {producto.descripcion && (
                <p className="text-sm text-gray-400 leading-relaxed">
                  {producto.descripcion}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-secondary">
                ${total.toFixed(2)}
              </span>
              {precioExtras > 0 && (
                <span className="text-sm text-gray-500 mb-1">
                  (base ${producto.precio} + extras ${precioExtras.toFixed(2)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sección extras — solo hamburguesas */}
        {esHamburguesa && extras.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black text-primary uppercase tracking-wider">
              Agregá extras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extras.map((extra) => {
                const cantidad = selectedExtras[extra._id] ?? 0;
                return (
                  <div
                    key={extra._id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      cantidad > 0
                        ? "border-primary bg-primary/20 text-claro"
                        : "border-primary/20 bg-claro/5 text-gray-400"
                    }`}
                  >
                    {/* Info extra */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold text-sm">{extra.nombre}</span>
                      {extra.descripcion && (
                        <span className="text-xs mt-0.5 opacity-70 truncate">
                          {extra.descripcion}
                        </span>
                      )}
                      <span className="text-xs font-black text-secondary mt-1">
                        +${extra.precio} c/u
                      </span>
                    </div>

                    {/* Contador +/- */}
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button
                        onClick={() => cambiarCantidad(extra._id, -1)}
                        disabled={cantidad === 0}
                        className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center text-lg font-black text-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-black text-base tabular-nums">
                        {cantidad}
                      </span>
                      <button
                        onClick={() => cambiarCantidad(extra._id, 1)}
                        className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-lg font-black text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón agregar al pedido */}
        <button
          onClick={handleAgregarAlCarrito}
          className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] text-white bg-primary rounded-xl hover:bg-secondary active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Agregar al pedido — ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default HamburguesaDetail;
