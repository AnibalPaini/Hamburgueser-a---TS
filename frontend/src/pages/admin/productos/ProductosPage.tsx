import { useState } from "react";
import { useProductos } from "../../../hooks/useProductos";
import type { Producto, CrearProductoDTO, CategoriaProducto } from "../../../types/product.type";

const CATEGORIAS: CategoriaProducto[] = ["hamburguesa", "papas", "bebida", "extra", "postre"];

const emptyForm: CrearProductoDTO = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "hamburguesa",
  activo: true,
  imagenUrl: "",
};

export function ProductosPage() {
  const { productos, isLoading, error, crear, actualizar, eliminar } = useProductos();
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<CrearProductoDTO>(emptyForm);
  const [filtro, setFiltro] = useState<CategoriaProducto | "todas">("todas");

  const productosFiltrados = filtro === "todas"
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

  if (isLoading) return <div className="text-gray-400">Cargando productos...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Productos</h2>
          <p className="text-gray-400 text-sm mt-1">{productos.length} productos en total</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
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
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              filtro === cat
                ? "bg-amber-500 text-gray-900 font-semibold"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">Producto</th>
              <th className="text-left p-4">Categoría</th>
              <th className="text-left p-4">Precio</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {producto.imagenUrl && (
                      <img src={producto.imagenUrl} alt={producto.nombre} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-white font-medium">{producto.nombre}</p>
                      {producto.descripcion && (
                        <p className="text-gray-500 text-xs truncate max-w-xs">{producto.descripcion}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs capitalize">
                    {producto.categoria}
                  </span>
                </td>
                <td className="p-4 text-white">${producto.precio.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${producto.activo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {producto.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirEditar(producto)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(producto.id)}
                      className="text-xs bg-red-900/40 hover:bg-red-900/70 text-red-400 px-3 py-1.5 rounded transition-colors"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-bold text-lg">
              {modal === "crear" ? "Nuevo producto" : "Editar producto"}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                placeholder="Descripción (opcional)"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
              />
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaProducto })}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
              <input
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                placeholder="URL de imagen (opcional)"
                value={form.imagenUrl}
                onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Activo
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors"
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
