import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import BackToTop from "./components/BackToTop.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import FindWorkers from "./pages/FindWorkers.jsx";
import WorkerProfile from "./pages/WorkerProfile.jsx";
import BecomeWorker from "./pages/BecomeWorker.jsx";
import { LoginPage, SignupPage, WorkerDashboard } from "./pages/AuthPages.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";

function PagePlaceholder({ title }) {
  return (
    <section className="welcome-panel">
      <span className="eyebrow">Hunarly</span>
      <h1>{title}</h1>
      <p>This page will be built in a later project phase.</p>
    </section>
  );
}

function AuthRouteNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const notice =
    location.pathname === "/" && location.state?.loginSuccess
      ? `Welcome back, ${location.state.userName}. You’re logged in to your demo account.`
      : location.pathname === "/" && location.state?.loggedOut
        ? "You’ve logged out of your Hunarly demo account."
        : "";

  if (!notice) return null;

  function dismiss() {
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    });
  }

  return (
    <div className="auth-route-notice" role="status">
      <CheckCircle2 size={17} aria-hidden="true" />
      <span>{notice}</span>
      <button type="button" onClick={dismiss} aria-label="Dismiss notification">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <AuthRouteNotice />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/become-a-worker" element={<BecomeWorker />} />
          <Route path="/workers/:workerId" element={<WorkerProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<PagePlaceholder title="Page not found" />} />
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}

export default App;
