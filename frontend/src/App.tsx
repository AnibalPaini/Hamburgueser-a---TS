import "./App.css";
import { AuthProvider } from "./context/auth/auth.provider";
function App() {
  return (
    <AuthProvider>
      <p className="">APP</p>
    </AuthProvider>
  );
}

export default App;
