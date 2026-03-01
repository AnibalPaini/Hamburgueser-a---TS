import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HamburguesasContenedor from "./components/Menu/hamburuesas/HamburguesasContenedor";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <>
      <Header />
      <Hero></Hero>
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
