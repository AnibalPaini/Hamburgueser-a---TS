import "./App.css";
import { AuthProvider } from "./context/auth/auth.provider";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HamburguesasContenedor from "./components/Menu/hamburuesas/HamburguesasContenedor";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <AuthProvider>
      <Header />
      <Hero></Hero>
      <div
        className="bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("/Firefly.png")' }}
      >
        <HamburguesasContenedor />
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
