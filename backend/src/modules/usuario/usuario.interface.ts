export interface UsuarioInterface {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "admin" | "cliente";
  activo: boolean;
}
