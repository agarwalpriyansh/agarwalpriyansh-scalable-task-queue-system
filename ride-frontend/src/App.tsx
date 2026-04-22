import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Fleet from "@/pages/Fleet";
import About from "@/pages/About";
import Contacts from "@/pages/Contacts";
import Careers from "@/pages/Careers";
import BecomeDriver from "@/pages/BecomeDriver";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/become-driver" element={<BecomeDriver />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
