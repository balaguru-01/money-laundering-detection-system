import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "ocean" : "ocean"
  );
  const location = useLocation();

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "sunset") {
      root.setAttribute("data-theme", "sunset");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setTheme((t) => (t === "sunset" ? "ocean" : "sunset"));

  return (
    <header className="header">
      <div className="header-container">
        <h1>
          <Link to="/" className="header-title">
            Proactive Money Laundering
          </Link>
        </h1>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === "sunset"}
          aria-label={theme === "sunset" ? "Switch to ocean theme" : "Switch to sunset theme"}
          title={theme === "sunset" ? "Switch to ocean theme" : "Switch to sunset theme"}
        >
          {theme === "sunset" ? "🌙" : "☀️"}
        </button>

        {/* Mobile menu toggle */}
        <button
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className={`header-nav${open ? " active" : ""}`}
          role="navigation"
        >
          <Link to="/">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/alerts">Alerts</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
