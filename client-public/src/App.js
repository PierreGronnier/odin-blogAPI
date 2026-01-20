import { BrowserRouter } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <AppRouter />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
