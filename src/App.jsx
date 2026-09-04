import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import InstallModal from "./components/InstallModal.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Welcome from "./pages/Welcome.jsx";
import Overview from "./pages/Overview.jsx";
import Claim from "./pages/Claim.jsx";
import Start from "./pages/Start.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminClaims from "./pages/AdminClaims.jsx";
import WorldFeed from "./pages/WorldFeed.jsx";

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
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/start" element={<Start />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/worlds/:slug" element={<WorldFeed />} />
        </Routes>
        <Footer />
        {installWorld && <InstallModal world={installWorld} onClose={() => setInstallWorld(null)} />}
      </div>
    </BrowserRouter>
  );
}
