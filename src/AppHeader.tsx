import React from "react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="header">
      <h1>AI Code Helper</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/snippets">Snippets</Link>
      </nav>
      <button
        className="analyze"
        onClick={() => {
          const next = theme === "dark" ? "light" : "dark";
          setTheme(next);
          localStorage.setItem("theme", next);
          document.documentElement.setAttribute("data-theme", next);
        }}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default AppHeader;
