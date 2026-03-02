const Footer = () => {
  return (
    <footer className="bg-secondary text-claro">

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-md">
              <img src="/logo.png" alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="leading-none">
              <span className="block text-xl font-black tracking-tight text-claro">Franky</span>
              <span className="block text-xs font-black tracking-[0.2em] uppercase text-claro/70">Burguer</span>
            </div>
          </div>
          <p className="text-sm text-claro/70 leading-relaxed">
            Las mejores hamburguesas de la ciudad, hechas con ingredientes frescos y mucho amor.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-claro/50 mb-1">Menú</h4>
          {["Hamburguesas", "Promos", "Combos", "Info"].map((item) => (
            <a
              key={item}
              href=""
              className="text-sm text-claro/80 hover:text-claro hover:translate-x-1 transition-all duration-200 w-fit"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Contacto */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-claro/50 mb-1">Contacto</h4>
          <p className="text-sm text-claro/80">📍 Av. San Martin, 123</p>
          <p className="text-sm text-claro/80">📞 +54 2954 - 123456</p>
          <p className="text-sm text-claro/80">🕐 Lun–Vie: 12:00 – 23:00</p>
          <p className="text-sm text-claro/80">🕐 Sáb–Dom: 12:00 – 00:00</p>
        </div>

      </div>

      {/* Barra inferior */}
      <div className="border-t border-claro/10 px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-claro/40">
          © {new Date().getFullYear()} Franky Burguer. Todos los derechos reservados.
        </p>
        <p className="text-xs text-claro/40">
          Hecho con 🍔 y mucho amor
        </p>
      </div>

    </footer>
  );
};

export default Footer;