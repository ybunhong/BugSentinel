import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/AppHeader.css";

export interface NavLink {
  to: string;
  label: string;
}

interface AppHeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
  navLinks?: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/editor", label: "Editor" },
  { to: "/snippets", label: "Snippets" },
];

/**
 * Renders the main application header.
 * Includes the site title, navigation links, and a theme toggle button.
 */
const AppHeader: React.FC<AppHeaderProps> = ({ theme, setTheme, navLinks = DEFAULT_LINKS }) => {
  const location = useLocation();
  const [toggling, setToggling] = React.useState(false);

  const handleToggle = () => {
    setToggling(true);
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    setTimeout(() => setToggling(false), 600);
  };

  return (
    <header className={`sentinel-header${theme === "dark" ? " dark" : " light"}${toggling ? " toggling" : ""}`}>
      <div className="sentinel-header-left">
        <span className="sentinel-title">BugSentinel</span>
      </div>
      <nav className="sentinel-header-nav">
        {navLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sentinel-nav-tile${location.pathname === item.to ? " active" : ""}`}
            tabIndex={0}
          >
            {item.label}
            <span className="sentinel-nav-underline" />
          </Link>
        ))}
      </nav>
      <div className="sentinel-header-right">
        <button
          className={`sentinel-theme-toggle${theme === "dark" ? " active" : ""}`}
          aria-label="Toggle dark/light mode"
          onClick={handleToggle}
        >
          <span className="sentinel-toggle-slider" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
