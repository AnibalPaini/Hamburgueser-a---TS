import { useUsuarios } from "../../../hooks/useUsuarios";

export function UsuariosPage() {
  const { usuarios, isLoading, error, eliminar } = useUsuarios();

  if (isLoading)
    return (
      <div className="text-secondary/60 font-semibold p-4">
        Cargando usuarios...
      </div>
    );
  if (error)
    return <div className="text-primary font-semibold p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-secondary tracking-tight">
          Usuarios
        </h2>
        <p className="text-secondary/50 text-sm font-semibold mt-1 uppercase tracking-[0.12em]">
          {usuarios.length} usuarios registrados
        </p>
      </div>

      <div className="bg-claro border border-primary/15 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-claro">
            <tr>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Nombre
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Email
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Teléfono
              </th>
              <th className="text-left p-4 font-black uppercase tracking-[0.1em] text-xs">
                Rol
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
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-t border-primary/10 hover:bg-primary/5 transition-colors"
              >
                <td className="p-4 text-secondary font-semibold">
                  {usuario.nombre}
                </td>
                <td className="p-4 text-secondary/70">{usuario.email}</td>
                <td className="p-4 text-secondary/70">{usuario.telefono}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      usuario.rol === "admin"
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary/10 text-secondary/70"
                    }`}
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      usuario.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-primary"
                    }`}
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  {usuario.rol !== "admin" && (
                    <button
                      onClick={() => eliminar(usuario.id)}
                      className="text-xs bg-primary/10 hover:bg-primary text-primary hover:text-claro px-3 py-1.5 rounded-lg font-semibold transition-all duration-200"
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
