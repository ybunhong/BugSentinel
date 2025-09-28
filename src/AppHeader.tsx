import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AppHeader.css";

interface AppHeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ theme, setTheme }) => {
  const location = useLocation();
  return (
    <header className={`app-header-modern${theme === "dark" ? " dark" : ""}`}>
      <h1 className="app-header-title">BugSentinel</h1>
      <nav className="app-header-nav">
        {[
          { to: "/", label: "Home" },
          { to: "/snippets", label: "Snippets" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`app-header-link${location.pathname === item.to ? " active" : ""}`}
          >
            {item.label}
            <span className="app-header-link-underline" />
          </Link>
        ))}
      </nav>
      <label
        className="theme-toggle-label"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="theme-toggle-icon">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => {
            const next = theme === "dark" ? "light" : "dark";
            setTheme(next);
            localStorage.setItem("theme", next);
            document.documentElement.setAttribute("data-theme", next);
          }}
          style={{ display: "none" }}
        />
        <span className="theme-toggle-switch">
          <span className="theme-toggle-knob" />
        </span>
      </label>
    </header>
  );
};

export default AppHeader;
