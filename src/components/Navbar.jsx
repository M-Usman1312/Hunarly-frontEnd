import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearDemoSession, getDemoSession } from "../utils/demoAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Find Workers", to: "/find-workers" },
  { label: "Become a Worker", to: "/become-a-worker" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionError, setSessionError] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme, storageError } = useTheme();

  useEffect(() => {
    function refreshSession() {
      try {
        setSession(getDemoSession());
        setSessionError("");
      } catch (error) {
        setSession(null);
        setSessionError(
          error instanceof Error
            ? error.message
            : "Demo login session could not be read.",
        );
      }
    }

    refreshSession();
    window.addEventListener("storage", refreshSession);
    window.addEventListener("hunarly:session-updated", refreshSession);
    return () => {
      window.removeEventListener("storage", refreshSession);
      window.removeEventListener("hunarly:session-updated", refreshSession);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    try {
      clearDemoSession();
      setSession(null);
      setSessionError("");
      closeMenu();
      navigate("/", { replace: true, state: { loggedOut: true } });
    } catch (error) {
      setSessionError(
        error instanceof Error ? error.message : "Could not log out of the demo session.",
      );
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Hunarly home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            h
          </span>
          <span>hunarly</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          id="primary-navigation"
          className={`navigation${menuOpen ? " navigation-open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="navigation-links">
            {links.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `navigation-link${isActive ? " navigation-link-active" : ""}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="navigation-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light" ? "Switch to dark mode" : "Switch to light mode"
              }
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>
            {session ? (
              <>
                <span className="session-greeting" title={`${session.role} demo account`}>
                  Hi, {session.name.split(" ")[0]}
                </span>
                <button className="logout-button" type="button" onClick={handleLogout}>
                  <LogOut size={15} aria-hidden="true" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="login-link" to="/login" onClick={closeMenu}>
                  Log in
                </Link>
                <Link
                  className="button button-primary header-cta"
                  to="/signup"
                  onClick={closeMenu}
                >
                  Get started <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
          {sessionError && (
            <p className="session-error" role="alert">
              {sessionError}
            </p>
          )}
          {storageError && (
            <p className="theme-storage-error" role="status">
              {storageError}
            </p>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
