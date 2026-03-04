import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HamburguesasContenedor from "./components/Menu/hamburuesas/HamburguesasContenedor";
import Footer from "./components/Footer/Footer";
import { Carrito } from "./components/Carrito/Carrito";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <Carrito isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Hero />
      <div
        className="bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("/Firefly.png")' }}
      >
        <HamburguesasContenedor />
      </div>
      <Footer />
    </>
  );
}

export default App;
