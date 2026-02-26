import { useState } from "react";
import { usePromociones } from "../../../hooks/usePromociones";
import type { Promocion, CrearPromocionDTO, TipoPromocion, AlcancePromocion } from "../../../types/promocion.types";

const emptyForm: CrearPromocionDTO = {
  nombre: "",
  descripcion: "",
  tipo: "porcentaje",
  valor: 0,
  alcance: "todos",
  activa: true,
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
};

export function PromocionesPage() {
  const { promociones, isLoading, error, crear, actualizar, eliminar } = usePromociones();
  const [modal, setModal] = useState<"crear" | "editar" | null>(null);
  const [editando, setEditando] = useState<Promocion | null>(null);
  const [form, setForm] = useState<CrearPromocionDTO>(emptyForm);

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
    });
    setModal("editar");
  };

  const handleSubmit = async () => {
    if (modal === "crear") await crear(form);
    else if (modal === "editar" && editando) await actualizar(editando.id, form);
    setModal(null);
  };

  if (isLoading) return <div className="text-gray-400">Cargando promociones...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Promociones</h2>
          <p className="text-gray-400 text-sm mt-1">{promociones.length} promociones</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Nueva promoción
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promociones.map((promo) => (
          <div key={promo.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-semibold">{promo.nombre}</p>
                {promo.descripcion && <p className="text-gray-500 text-xs mt-0.5">{promo.descripcion}</p>}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${promo.activa ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                {promo.activa ? "Activa" : "Inactiva"}
              </span>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">{promo.tipo}</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">{promo.alcance}</span>
              {promo.tipo !== "2x1" && promo.tipo !== "3x2" && (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded font-semibold">
                  {promo.tipo === "porcentaje" ? `${promo.valor}%` : `$${promo.valor}`}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {new Date(promo.fechaInicio).toLocaleDateString("es-AR")} → {new Date(promo.fechaFin).toLocaleDateString("es-AR")}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => abrirEditar(promo)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => eliminar(promo.id)}
                className="flex-1 bg-red-900/30 hover:bg-red-900/60 text-red-400 py-1.5 rounded text-xs transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-lg">
              {modal === "crear" ? "Nueva promoción" : "Editar promoción"}
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
              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoPromocion })}
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
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  placeholder={form.tipo === "porcentaje" ? "Valor (%)" : "Valor ($)"}
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                />
              )}

              <select
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                value={form.alcance}
                onChange={(e) => setForm({ ...form, alcance: e.target.value as AlcancePromocion })}
              >
                <option value="todos">Todos los productos</option>
                <option value="categoria">Por categoría</option>
                <option value="productos">Productos específicos</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fecha inicio</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                    value={form.fechaInicio as string}
                    onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fecha fin</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                    value={form.fechaFin as string}
                    onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                />
                Activa
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
