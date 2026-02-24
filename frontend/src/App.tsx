import "./App.css";
import { AuthProvider } from "./context/auth/auth.provider";
import Header from "./components/Header/Header";
function App() {
  return (
    <AuthProvider>
      <Header />
      <p className="">APP</p>
    </AuthProvider>
  );
}

export default App;
