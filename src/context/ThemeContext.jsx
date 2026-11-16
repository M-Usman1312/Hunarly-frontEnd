import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "hunarly:theme";

function isTheme(value) {
  return value === "light" || value === "dark";
}

function getInitialTheme() {
  const documentTheme = document.documentElement.dataset.theme;
  if (isTheme(documentTheme)) return documentTheme;

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0B1220" : "#101D35");
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    function syncTheme(event) {
      if (event.key !== THEME_STORAGE_KEY) return;
      const nextTheme = isTheme(event.newValue) ? event.newValue : "light";
      setTheme(nextTheme);
      applyTheme(nextTheme);
      setStorageError("");
    }

    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      storageError,
      toggleTheme() {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        applyTheme(nextTheme);

        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
          setStorageError("");
        } catch {
          setStorageError(
            "The theme changed, but this browser could not save your preference.",
          );
        }
      },
    }),
    [storageError, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
}
