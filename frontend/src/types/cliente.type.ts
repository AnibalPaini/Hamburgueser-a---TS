export type TipoEntrega = "retiro" | "envio";

export type Domicilio = {
  direccion: string;
  altura: string;
  piso?: string;
  departamento?: string;
};

export type Cliente = {
  nombre: string;
  email: string;
  telefono: string;
  domicilio?: Domicilio;
};
