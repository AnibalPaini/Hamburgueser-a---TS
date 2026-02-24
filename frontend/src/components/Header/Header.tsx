const Header = () => {
  return (
    <header className="flex w-full items-center justify-between px-8 py-4 bg-white shadow-md">
      <div className="flex items-center">
        <img src="/logo.png" alt="logo" className="w-16 mr-2" />
        <div className="flex-col m-0">
          <h1 className="text-2xl font-bold">Franky</h1>
          <p className="text-2xl font-bold">Burguer</p>
        </div>
        
      </div>

      <div className=" ">
        <nav className="flex space-x-4">
          <a href="" className="text-gray-700 hover:text-red-500 bg-red-950">Hamburguesas</a>
          <a href="" className="text-gray-700 hover:text-red-500">Promos</a>
          <a href="" className="text-gray-700 hover:text-red-500">Combos</a>
          <a href="" className="text-gray-700 hover:text-red-500">Info</a>
        </nav>
      </div>
      <button className="rounded-b-md rounded-t-md w-24 bg-red-500 text-white hover:bg-red-600">
        Ordenar
      </button>
    </header>
  );
};

export default Header;
