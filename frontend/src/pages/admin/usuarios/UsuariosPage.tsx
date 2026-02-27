import { useUsuarios } from "../../../hooks/useUsuarios";

export function UsuariosPage() {
  const { usuarios, isLoading, error, eliminar } = useUsuarios();

  if (isLoading) return <div className="text-gray-400">Cargando usuarios...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Usuarios</h2>
        <p className="text-gray-400 text-sm mt-1">{usuarios.length} usuarios registrados</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Teléfono</th>
              <th className="text-left p-4">Rol</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-4 text-white font-medium">{usuario.nombre}</td>
                <td className="p-4 text-gray-300">{usuario.email}</td>
                <td className="p-4 text-gray-300">{usuario.telefono}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    usuario.rol === "admin"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    usuario.activo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  {usuario.rol !== "admin" && (
                    <button
                      onClick={() => eliminar(usuario.id)}
                      className="text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-3 py-1.5 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
