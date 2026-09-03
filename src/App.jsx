import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import InstallModal from "./components/InstallModal.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import PricingPage from "./pages/PricingPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [installWorld, setInstallWorld] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && installWorld) setInstallWorld(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [installWorld]);

  const openInstall = (world) => setInstallWorld(world);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-bg text-fg">
        <Header />
        <Routes>
          <Route path="/" element={<Home onInstall={openInstall} />} />
          <Route path="/catalog" element={<Catalog onInstall={openInstall} />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
        <Footer />
        {installWorld && <InstallModal world={installWorld} onClose={() => setInstallWorld(null)} />}
      </div>
    </BrowserRouter>
  );
}
