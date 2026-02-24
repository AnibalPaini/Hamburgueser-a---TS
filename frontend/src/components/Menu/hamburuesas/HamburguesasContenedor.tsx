import HamburguesaCard from "./HamburguesasCard";

type Hamburguesa = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
};

//Remplazar con fetch a la API cuando esté lista
const hamburguesas: Hamburguesa[] = [
  {
    id: 1,
    nombre: "La Clásica",
    descripcion: "Carne 200g, queso cheddar, lechuga, tomate y nuestra salsa especial.",
    precio: 4500,
    imagen: "/hamburguesas/clasica.jpg",
  },
  {
    id: 2,
    nombre: "La Diabla",
    descripcion: "Doble carne, jalapeños, cheddar derretido, cebolla crocante y salsa picante.",
    precio: 5800,
    imagen: "/hamburguesas/diabla.jpg",
  },
  {
    id: 3,
    nombre: "La Franky",
    descripcion: "Carne 250g, bacon, huevo frito, cheddar, pickles y mostaza artesanal.",
    precio: 6200,
    imagen: "/hamburguesas/franky.jpg",
  },
  {
    id: 4,
    nombre: "La Veggie",
    descripcion: "Medallón de lentejas, queso vegano, rúcula, tomate seco y alioli.",
    precio: 4800,
    imagen: "/hamburguesas/veggie.jpg",
  },
];

const HamburguesasContenedor = () => {
  return (
    <section className="px-10 py-16 bg-claro/90" id="menu">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block mb-3 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-white bg-primary rounded-full shadow-sm">
            Menú
          </span>
          <h2 className="text-4xl font-black text-primary tracking-tight">
            Nuestras Hamburguesas
          </h2>
          <div className="mt-3 w-16 h-1 bg-secondary rounded-full" />
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hamburguesas.map((h) => (
            <HamburguesaCard key={h.id} {...h} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-2.5 text-sm font-black uppercase tracking-[0.15em] text-white bg-primary rounded-md hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
            Ver más
          </button>
        </div>

      </div>
    </section>
  );
};

export default HamburguesasContenedor;