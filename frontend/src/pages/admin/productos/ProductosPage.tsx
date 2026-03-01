import { useState } from "react";
import { useProductos } from "../../../hooks/useProductos";
import type {
  Producto,
  CrearProductoDTO,
  CategoriaProducto,
} from "../../../types/product.type";

const CATEGORIAS: CategoriaProducto[] = [
  "hamburguesa",
  "papas",
  "bebida",
  "extra",
  "postre",
];

const emptyForm: CrearProductoDTO = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "hamburguesa",
  activo: true,
  imagenUrl: "",
};

export function ProductosPage() {
  const { productos, isLoading, error, crear, actualizar, eliminar } =
    useProductos();
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<CrearProductoDTO>(emptyForm);
  const [filtro, setFiltro] = useState<CategoriaProducto | "todas">("todas");

  const productosFiltrados =
    filtro === "todas"
      ? productos
      : productos.filter((p) => p.categoria === filtro);

  const abrirCrear = () => {
    setForm(emptyForm);
    setEditando(null);
    setModal("crear");
  };

  const abrirEditar = (producto: Producto) => {
    setEditando(producto);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      categoria: producto.categoria,
      activo: producto.activo,
      imagenUrl: producto.imagenUrl ?? "",
    });
    setModal("editar");
  };

  const handleSubmit = async () => {
    if (modal === "crear") {
      await crear(form);
    } else if (modal === "editar" && editando) {
      await actualizar(editando.id, form);
    }
    setModal(null);
  };

  if (isLoading)
    return (
      <div className="text-secondary/60 font-semibold p-4">
        Cargando productos...
      </div>
    );
  if (error)
    return <div className="text-primary font-semibold p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Productos
          </h2>
          <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
            {productos.length} productos en total
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-primary hover:bg-secondary text-claro font-black px-5 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 uppercase tracking-[0.12em]"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Filtro por categoría */}
      <div className="flex gap-2 flex-wrap">
        {["todas", ...CATEGORIAS].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat as typeof filtro)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-[0.1em] transition-all duration-200 ${
              filtro === cat
                ? "bg-primary text-claro shadow-sm"
                : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-claro border border-primary/15 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-claro">
            <tr>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Producto
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Categoría
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Precio
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Estado
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                className="border-t border-primary/10 hover:bg-primary/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {producto.imagenUrl && (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="w-10 h-10 rounded-lg object-cover border border-primary/15"
                      />
                    )}
                    <div>
                      <p className="text-secondary font-semibold">
                        {producto.nombre}
                      </p>
                      {producto.descripcion && (
                        <p className="text-secondary/50 text-xs truncate max-w-xs">
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-semibold capitalize">
                    {producto.categoria}
                  </span>
                </td>
                <td className="p-4 text-secondary font-bold">
                  ${producto.precio.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${producto.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-primary"}`}
                  >
                    {producto.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirEditar(producto)}
                      className="text-xs bg-secondary/10 hover:bg-secondary text-secondary hover:text-claro px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(producto.id)}
                      className="text-xs bg-primary/10 hover:bg-primary text-primary hover:text-claro px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-secondary/60 flex items-center justify-center z-50">
          <div className="bg-claro border-t-4 border-primary rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-secondary font-black text-lg uppercase tracking-[0.1em]">
              {modal === "crear" ? "Nuevo producto" : "Editar producto"}
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
              <input
                type="number"
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: Number(e.target.value) })
                }
              />
              <select
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.categoria}
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoria: e.target.value as CategoriaProducto,
                  })
                }
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
              <input
                className="w-full bg-white border border-primary/20 text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="URL de imagen (opcional)"
                value={form.imagenUrl}
                onChange={(e) =>
                  setForm({ ...form, imagenUrl: e.target.value })
                }
              />
              <label className="flex items-center gap-2 text-sm text-secondary font-semibold">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) =>
                    setForm({ ...form, activo: e.target.checked })
                  }
                  className="accent-primary"
                />
                Activo
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
