const Hero = () => {
  return (
    <section
      className="relative h-[calc(100vh-85px)] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url("/image_1771515149848_dedqxf.png")' }}
    >
      {/* Overlay: opaco arriba para el texto, transparente abajo para la ilustración */}
      <div className="absolute inset-0 bg-gradient-to-b from-claro/95 via-claro/60 to-transparent" />

      {/* Contenido en el tercio superior */}
      <div className="relative z-10 flex flex-col items-center text-center pt-24 px-6">
        {/* Eyebrow tag */}
        <span className="inline-block mb-4 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-white bg-primary rounded-full shadow-md">
          Las mejores de la ciudad
        </span>

        {/* Título */}
        <h1 className="text-5xl md:text-6xl font-black text-primary leading-none tracking-tight mb-3 drop-shadow-sm">
          ¡Bienvenido a{" "}
          <span className="border-b-4 border-secondary pb-0.5">
            Franky Burguer
          </span>
          !
        </h1>

        {/* Subtítulo */}
        <p className="text-lg font-semibold text-secondary mb-8 max-w-md tracking-wide drop-shadow-sm">
          Hechas con ingredientes frescos y mucho amor, directo al fuego.
        </p>

        {/* CTA */}
        <a
          href="#menu"
          className="inline-flex items-center gap-2 px-9 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-white bg-primary rounded-md shadow-lg hover:bg-secondary hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-200"
        >
          <span>🍔</span>
          <span>Ver Menú</span>
          <span>↓</span>
        </a>

        {/* Scroll hint */}
        <div className="mt-10 flex flex-col items-center gap-1 opacity-40 text-secondary">
          <span className="text-[0.9rem] font-bold uppercase tracking-[0.15em]">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
