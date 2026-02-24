type Hamburguesa = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
};

const HamburguesaCard = ({ nombre, descripcion, precio, imagen }: Hamburguesa) => {
  return (
    <div className="group flex flex-col bg-claro rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/10">
      
      {/* Imagen */}
      <div className="relative overflow-hidden h-52 bg-primary/5">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge precio */}
        <span className="absolute top-3 right-3 bg-primary text-white text-sm font-black px-3 py-1 rounded-full shadow-md">
          ${precio}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-xl font-black text-primary tracking-tight">
          {nombre}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {descripcion}
        </p>
        <button className="mt-2 w-full py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
          Agregar al pedido
        </button>
      </div>

    </div>
  );
};

export default HamburguesaCard;