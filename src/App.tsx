            import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAnalyzeStore } from "./store";
import Editor, { useMonaco } from "@monaco-editor/react";
import MonacoMarkers from "./MonacoMarkers";
import { SnippetLibrary, Snippet } from "./SnippetLibrary";
import AiSuggestion from "./AiSuggestion";
import BeforeAfter from "./BeforeAfter";
import AppHeader from "./AppHeader";

// Modern Language Selector Component
const LanguageSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ];

  const selectedLanguage =
    languages.find((lang) => lang.value === value) || languages[0];

  return (
    <div className="language-selector">
      <button
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="language-label">{selectedLanguage.label}</span>
        <svg
          className={`language-arrow ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.value}
              className={`language-option ${
                value === lang.value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(lang.value);
                setIsOpen(false);
              }}
            >
              <span className="language-label">{lang.label}</span>
              {value === lang.value && (
                <svg
                  className="check-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CodeEditorPage: React.FC = () => {
  const editorRef = React.useRef<any>(null);
  const { loadedCode, setLoadedCode } = useAnalyzeStore();
  const monaco = useMonaco();
  const {
    analyzeCode,
    isAnalyzing,
    suggestions,
    errors,
    refactoredCode,
    explanations,
    detectedLanguage,
    clear,
  } = useAnalyzeStore();
  const [code, setCode] = useState<string>("");

  React.useEffect(() => {
    if (loadedCode) {
      setCode(loadedCode);
      setLoadedCode(null); // Clear the loaded code after setting it
    }
  }, [loadedCode, setLoadedCode]);
  const [language, setLanguage] = useState<string>("javascript");
  const [view, setView] = useState<"side-by-side" | "inline">("side-by-side");
  const [snippetsVersion, setSnippetsVersion] = useState<number>(0);
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "dark"
  );
  const [toast, setToast] = useState<string>("");

  const disabled = useMemo(
    () => isAnalyzing || code.trim().length === 0,
    [isAnalyzing, code]
  );

  
  
  const visibleSuggestions = suggestions;

  return (
    <div className="container">
      <main className="main">
        <div className="toolbar">
          <LanguageSelector value={language} onChange={setLanguage} />
          <button
            className="analyze"
            disabled={disabled}
            onClick={() => {
                            analyzeCode(code, language);
            }}
          >
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </button>
          {code.trim().length > 0 && (
            <button
              className="analyze"
              onClick={() => {
                setCode("");
                clear();
              }}
            >
              Clear
            </button>
          )}
          <button
            className="analyze"
            disabled={disabled}
            onClick={() => {
              if (!editorRef.current) return;
              try {
                const currentCode = editorRef.current.getValue();
                const now = new Date().toISOString();
                const existing = JSON.parse(
                  localStorage.getItem("snippets") || "[]"
                );
                const snippet = {
                  id: crypto.randomUUID(),
                  code: currentCode,
                  language,
                  refactoredCode,
                  suggestions,
                  errors,
                  explanations,
                  timestamp: now,
                };
                existing.unshift(snippet);
                localStorage.setItem("snippets", JSON.stringify(existing));
                setSnippetsVersion((v) => v + 1);
                setToast("Saved");
                setTimeout(() => setToast(""), 1200);
              } catch {}
            }}
          >
            Save
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span className="muted" style={{ alignSelf: "center" }}>
              {null}
            </span>
          </div>
        </div>
        {monaco && errors && errors.length > 0 && (
          <MonacoMarkers monaco={monaco} errors={errors} />
        )}
        <div className="snippet-monaco-clean" style={{ height: 320 }}>
          <Editor
            height="100%"
            value={code}
            language={language}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              lineNumbers: "on",
            }}
            onChange={(v) => setCode(v ?? "")}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>
        <AiSuggestion suggestions={visibleSuggestions} />

        {errors && errors.length > 0 && (
          <section className="results">
            <h2>Detected Issues</h2>
            <ul className="issues-list">
              {errors.map((e, i) => (
                <li
                  key={i}
                  className={`issue-item issue-${e.severity || "info"}`}
                >
                  <span className="issue-location">
                    Line {e.line}
                    {e.column ? `:${e.column}` : ""}
                    {e.endLine && e.endLine !== e.line ? `-${e.endLine}` : ""}
                  </span>
                  <span className="issue-message">{e.message}</span>
                  {e.ruleId && <span className="issue-rule">({e.ruleId})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <BeforeAfter code={code} refactoredCode={refactoredCode} view={view} setView={setView} theme={theme} />
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "dark"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className="container">
        <AppHeader theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<CodeEditorPage />} />
          <Route path="/snippets" element={<SnippetLibraryPage theme={theme} />} />
        </Routes>
      </div>
    </Router>
  );
}

const SnippetLibraryPage: React.FC<{ theme: string }> = ({ theme }) => {
  const [snippetsVersion, setSnippetsVersion] = useState(0);
  const navigate = useNavigate();
  const setLoadedCode = useAnalyzeStore((state) => state.setLoadedCode);

  const handleLoadSnippet = (snippet: Snippet) => {
    setLoadedCode(snippet.code);
    navigate('/');
  };

  return (
    <main className="main" style={{ padding: "0 24px" }} >
      <h1>Snippet Library</h1>
      <SnippetLibrary version={snippetsVersion} onLoad={handleLoadSnippet} theme={theme} />
    </main>
  );
};
