import { useState } from "react";
import { usePromociones } from "../../../hooks/usePromociones";
import type {
  Promocion,
  CrearPromocionDTO,
  TipoPromocion,
  AlcancePromocion,
} from "../../../types/promocion.types";
import type { CategoriaProducto } from "../../../types/product.type";
import { useProductos } from "../../../hooks/useProductos";

const emptyForm: CrearPromocionDTO = {
  nombre: "",
  descripcion: "",
  tipo: "porcentaje",
  valor: 0,
  alcance: "todos",
  categoriasAplicables: [],
  productosAplicables: [],
  activa: true,
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
};

const categorias: CategoriaProducto[] = [
  "hamburguesa",
  "papas",
  "bebida",
  "postre",
  "extra",
];

export function PromocionesPage() {
  const { promociones, isLoading, error, crear, actualizar, eliminar } =
    usePromociones();
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [editando, setEditando] = useState<Promocion | null>(null);
  const [form, setForm] = useState<CrearPromocionDTO>(emptyForm);
  const { productos } = useProductos();

  const abrirCrear = () => {
    setForm(emptyForm);
    setEditando(null);
    setModal("crear");
  };

  const abrirEditar = (promo: Promocion) => {
    setEditando(promo);
    setForm({
      nombre: promo.nombre,
      descripcion: promo.descripcion ?? "",
      tipo: promo.tipo,
      valor: promo.valor,
      alcance: promo.alcance,
      activa: promo.activa,
      fechaInicio: promo.fechaInicio.split("T")[0],
      fechaFin: promo.fechaFin.split("T")[0],
      categoriasAplicables: promo.categoriasAplicables,
      productosAplicables: promo.productosAplicables,
    });
    setModal("editar");
  };

  const handleSubmit = async () => {
    if (modal === "crear") await crear(form);
    else if (modal === "editar" && editando)
      await actualizar(editando.id, form);
    setModal(null);
  };

  if (isLoading)
    return (
      <div className="text-secondary/60 font-semibold p-4">
        Cargando promociones...
      </div>
    );
  if (error)
    return <div className="text-primary font-semibold p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Promociones
          </h2>
          <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
            {promociones.length} promociones
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-primary hover:bg-secondary text-claro font-black px-5 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 uppercase tracking-[0.12em]"
        >
          + Nueva promoción
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promociones.map((promo) => (
          <div
            key={promo.id}
            className="bg-claro border border-primary/15 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-secondary font-black">{promo.nombre}</p>
                {promo.descripcion && (
                  <p className="text-secondary/50 text-xs mt-0.5">
                    {promo.descripcion}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${promo.activa ? "bg-green-100 text-green-700" : "bg-gray-100 text-secondary/50"}`}
              >
                {promo.activa ? "Activa" : "Inactiva"}
              </span>
            </div>

            <div className="flex gap-2 text-xs flex-wrap">
              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded font-semibold">
                {promo.tipo}
              </span>
              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded font-semibold">
                {promo.alcance}
              </span>
              {promo.tipo !== "2x1" && promo.tipo !== "3x2" && (
                <span className="bg-primary/15 text-primary px-2 py-1 rounded font-black">
                  {promo.tipo === "porcentaje"
                    ? `${promo.valor}%`
                    : `$${promo.valor}`}
                </span>
              )}
            </div>

            <p className="text-xs text-secondary/40 font-semibold">
              {new Date(promo.fechaInicio).toLocaleDateString("es-AR")} →{" "}
              {new Date(promo.fechaFin).toLocaleDateString("es-AR")}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => abrirEditar(promo)}
                className="flex-1 bg-secondary/10 hover:bg-secondary text-secondary hover:text-claro py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => eliminar(promo.id)}
                className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-claro py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-secondary/20 flex items-center justify-center z-50">
          <div className="bg-claro border-t-4 border-primary rounded-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-secondary font-black text-lg uppercase tracking-[0.1em]">
              {modal === "crear" ? "Nueva promoción" : "Editar promoción"}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <input
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Descripción (opcional)"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
              <select
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.tipo}
                onChange={(e) =>
                  setForm({ ...form, tipo: e.target.value as TipoPromocion })
                }
              >
                <option value="porcentaje">Porcentaje</option>
                <option value="monto_fijo">Monto fijo</option>
                <option value="2x1">2x1</option>
                <option value="3x2">3x2</option>
                <option value="combo">Combo</option>
              </select>

              {form.tipo !== "2x1" && form.tipo !== "3x2" && (
                <input
                  type="number"
                  className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder={
                    form.tipo === "porcentaje" ? "Valor (%)" : "Valor ($)"
                  }
                  value={form.valor}
                  onChange={(e) =>
                    setForm({ ...form, valor: Number(e.target.value) })
                  }
                />
              )}

              <select
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.alcance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alcance: e.target.value as AlcancePromocion,
                  })
                }
              >
                <option value="todos">Todos los productos</option>
                <option value="categoria">Por categoría</option>
                <option value="productos">Productos específicos</option>
              </select>

              {form.alcance === "categoria" && (
                <div className="space-y-2">
                  <label className="text-xs text-secondary/60 font-black uppercase tracking-[0.1em] block">
                    Categorías aplicables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setForm({
                            ...form,
                            categoriasAplicables:
                              form.categoriasAplicables.includes(cat)
                                ? form.categoriasAplicables.filter(
                                    (c) => c !== cat,
                                  )
                                : [...form.categoriasAplicables, cat],
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          form.categoriasAplicables.includes(cat)
                            ? "bg-primary text-claro"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.alcance === "productos" && (
                <div className="space-y-2">
                  <label className="text-xs text-secondary/60 font-black uppercase tracking-[0.1em] block">
                    Productos aplicables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {productos.map((producto) => (
                      <button
                        key={producto._id}
                        onClick={() =>
                          setForm({
                            ...form,
                            productosAplicables:
                              form.productosAplicables.includes(producto._id)
                                ? form.productosAplicables.filter(
                                    (id) => id !== producto._id,
                                  )
                                : [...form.productosAplicables, producto._id],
                          })
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          form.productosAplicables.includes(producto._id)
                            ? "bg-primary text-claro"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {producto.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-secondary/60 font-black uppercase tracking-[0.1em] mb-1 block">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={form.fechaInicio as string}
                    onChange={(e) =>
                      setForm({ ...form, fechaInicio: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-secondary/60 font-black uppercase tracking-[0.1em] mb-1 block">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={form.fechaFin as string}
                    onChange={(e) =>
                      setForm({ ...form, fechaFin: e.target.value })
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-secondary font-semibold">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={(e) =>
                    setForm({ ...form, activa: e.target.checked })
                  }
                  className="accent-primary"
                />
                Activa
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 bg-secondary/10 hover:bg-secondary/20 text-secondary py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-secondary text-claro font-black py-2 rounded-lg text-sm transition-all duration-200 active:scale-95 uppercase tracking-[0.1em]"
              >
                {modal === "crear" ? "Crear" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
