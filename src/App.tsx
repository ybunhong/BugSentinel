import React, { useMemo, useState } from "react";
import { useAnalyzeStore } from "./store";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import Editor, { useMonaco } from "@monaco-editor/react";
import MonacoMarkers from "./MonacoMarkers";

// Modern Language Selector Component
const LanguageSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: "auto", label: "Auto detect", icon: "🔍" },
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "typescript", label: "TypeScript", icon: "🔷" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "html", label: "HTML", icon: "🌐" },
    { value: "css", label: "CSS", icon: "🎨" },
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
        <span className="language-icon">{selectedLanguage.icon}</span>
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
              <span className="language-icon">{lang.icon}</span>
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

export const App: React.FC = () => {
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
  const [language, setLanguage] = useState<string>("auto");
  const [view, setView] = useState<"side-by-side" | "inline">("side-by-side");
  const [snippetsVersion, setSnippetsVersion] = useState<number>(0);
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "dark"
  );
  const [toast, setToast] = useState<string>("");
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(
    new Set()
  );

  const disabled = useMemo(
    () => isAnalyzing || code.trim().length === 0,
    [isAnalyzing, code]
  );

  // Apply suggestion function
  const applySuggestion = (suggestion: {
    title: string;
    description: string;
  }) => {
    let newCode = code;

    // Apply different fixes based on suggestion type
    if (suggestion.title.toLowerCase().includes("var")) {
      // Replace var with let
      newCode = code.replace(/\bvar\s+/g, "let ");
    } else if (
      suggestion.title.toLowerCase().includes("unused variable") ||
      suggestion.title.toLowerCase().includes("remove unused")
    ) {
      // Remove lines with unused variables (simplified)
      const lines = code.split("\n");
      const filteredLines = lines.filter((line) => {
        const hasUnused =
          line.includes("let unused") ||
          line.includes("var unused") ||
          line.includes("const unused");
        return !hasUnused;
      });
      newCode = filteredLines.join("\n");
    } else if (
      suggestion.title.toLowerCase().includes("console.log") ||
      suggestion.title.toLowerCase().includes("consol.log")
    ) {
      // Fix console.log typos
      newCode = code.replace(/\bconsol\.log/g, "console.log");
    } else if (
      suggestion.title.toLowerCase().includes("===") ||
      suggestion.title.toLowerCase().includes("assignment")
    ) {
      // Fix assignment vs comparison
      newCode = code.replace(/([^=!<>])=([^=])/g, "$1===$2");
    }

    setCode(newCode);
    setToast("✅ Suggestion applied!");
    setTimeout(() => setToast(""), 3000);

    // Add the suggestion to dismissed list so it disappears from UI
    setDismissedSuggestions((prev) => new Set([...prev, suggestion.title]));

    // NO automatic re-analysis - user can click Analyze manually if they want
  };

  // Dismiss suggestion function
  const dismissSuggestion = (suggestion: {
    title: string;
    description: string;
  }) => {
    setDismissedSuggestions((prev) => new Set([...prev, suggestion.title]));
    setToast("❌ Suggestion dismissed");
    setTimeout(() => setToast(""), 2000);
  };

  // Filter out dismissed suggestions
  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedSuggestions.has(s.title)
  );

  return (
    <div className="container">
      <header className="header">
        <h1>AI Code Helper</h1>
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
      <main className="main">
        <div className="toolbar">
          <LanguageSelector value={language} onChange={setLanguage} />
          <button
            className="analyze"
            disabled={disabled}
            onClick={() => {
              setDismissedSuggestions(new Set()); // Clear dismissed suggestions on new analysis
              analyzeCode(code, language);
            }}
          >
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </button>
          <button
            className="analyze"
            onClick={() => {
              setCode("");
              setDismissedSuggestions(new Set());
              clear();
            }}
          >
            Clear
          </button>
          <button
            className="analyze"
            onClick={() => {
              try {
                const now = new Date().toISOString();
                const existing = JSON.parse(
                  localStorage.getItem("snippets") || "[]"
                );
                const snippet = {
                  id: crypto.randomUUID(),
                  code,
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
              {language === "auto" && detectedLanguage
                ? `Detected: ${detectedLanguage}`
                : null}
            </span>
          </div>
        </div>
        {monaco && errors && errors.length > 0 && (
          <MonacoMarkers monaco={monaco} errors={errors} />
        )}
        <div style={{ height: 320 }}>
          <Editor
            height="100%"
            value={code}
            language={language === "auto" ? undefined : language}
            theme={theme === "dark" ? "vs-dark" : "light"}
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
            onMount={(editor, monacoInstance) => {
              // Ensure a consistent model we can mark
              const uri = monacoInstance?.Uri?.parse(
                "inmemory://model/primary"
              );
              const model =
                monacoInstance?.editor.getModel(uri) ||
                monacoInstance?.editor.createModel(
                  editor.getValue(),
                  language === "auto" ? undefined : language,
                  uri
                );
              if (model) editor.setModel(model);
            }}
          />
        </div>
        <section className="results">
          <h2>AI Suggestions</h2>
          {visibleSuggestions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <p className="empty-text">
                {suggestions.length > 0 && dismissedSuggestions.size > 0
                  ? "All suggestions have been dismissed."
                  : "No AI suggestions available. Paste code and click Analyze."}
              </p>
            </div>
          ) : (
            <div className="suggestions-grid">
              {visibleSuggestions.map((s, i) => (
                <div key={i} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="suggestion-title-container">
                      <h3 className="suggestion-title">{s.title}</h3>
                      {s.line && (
                        <span className="suggestion-location">
                          Line {s.line}
                          {s.column ? `:${s.column}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="suggestion-description">{s.description}</p>
                  <div className="suggestion-actions">
                    <button
                      className="suggestion-btn primary"
                      onClick={() => applySuggestion(s)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Apply
                    </button>
                    <button
                      className="suggestion-btn secondary"
                      onClick={() => dismissSuggestion(s)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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

        {refactoredCode && (
          <section className="results">
            <h2>Before & After</h2>
            <div className="view-controls-container">
              <div className="view-controls">
                <label>
                  <input
                    type="radio"
                    name="diffview"
                    checked={view === "side-by-side"}
                    onChange={() => setView("side-by-side")}
                  />
                  Side-by-side
                </label>
                <label>
                  <input
                    type="radio"
                    name="diffview"
                    checked={view === "inline"}
                    onChange={() => setView("inline")}
                  />
                  Inline
                </label>
              </div>
              <div className="copy-buttons">
                <button
                  className="copy-btn"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(refactoredCode);
                      setToast("📋 Copied to clipboard!");
                      setTimeout(() => setToast(""), 2000);
                    } catch {}
                  }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  Copy Fixed Code
                </button>
              </div>
            </div>
            <ReactDiffViewer
              oldValue={code}
              newValue={refactoredCode}
              splitView={view === "side-by-side"}
              compareMethod={DiffMethod.WORDS}
              styles={{
                variables: {
                  dark: {
                    diffViewerBackground:
                      theme === "dark" ? "#0b1020" : "#ffffff",
                    diffViewerColor: theme === "dark" ? "#e8eef8" : "#0b1020",
                    diffViewerTitleColor:
                      theme === "dark" ? "#9fb0d0" : "#5b6b8b",
                    diffViewerTitleBackground:
                      theme === "dark" ? "#121830" : "#f6f8ff",
                    codeFoldGutterBackground:
                      theme === "dark" ? "#121830" : "#f6f8ff",
                    codeFoldBackground:
                      theme === "dark" ? "#121830" : "#f6f8ff",
                    addedBackground: theme === "dark" ? "#0d4f0d" : "#e6ffed",
                    removedBackground: theme === "dark" ? "#4f0d0d" : "#ffeaea",
                    wordAddedBackground:
                      theme === "dark" ? "#0d4f0d" : "#e6ffed",
                    wordRemovedBackground:
                      theme === "dark" ? "#4f0d0d" : "#ffeaea",
                  },
                },
              }}
            />
          </section>
        )}
      </main>
      <aside className="results" style={{ marginTop: 12 }}>
        <details>
          <summary>Snippet Library</summary>
          <SnippetLibrary
            version={snippetsVersion}
            onLoad={(s) => {
              setCode(s.code);
              setDismissedSuggestions(new Set()); // Clear dismissed suggestions when loading
            }}
          />
        </details>
      </aside>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

type Snippet = {
  id: string;
  code: string;
  language: string;
  refactoredCode?: string;
  suggestions?: { title: string; description: string }[];
  errors?: { line: number; message: string }[];
  explanations?: string[];
  timestamp: string;
};

const SnippetLibrary: React.FC<{
  version: number;
  onLoad: (s: Snippet) => void;
}> = ({ version, onLoad }) => {
  const [items, setItems] = useState<Snippet[]>([]);
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("snippets") || "[]");
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, [version]);
  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem("snippets", JSON.stringify(next));
  };
  const exportTxt = (s: Snippet) => {
    const content = `// Language: ${s.language}\n// Timestamp: ${s.timestamp}\n\n${s.code}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snippet-${s.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div style={{ marginTop: 8 }}>
      {items.length === 0 ? (
        <p className="muted">No snippets saved yet.</p>
      ) : (
        <div className="snippet-list">
          {items.map((s) => (
            <div key={s.id} className="snippet-item">
              <div className="snippet-header">
                <div className="snippet-info">
                  <span className="snippet-timestamp">
                    {new Date(s.timestamp).toLocaleString()}
                  </span>
                  <span className="snippet-language">{s.language}</span>
                </div>
                <div className="snippet-actions">
                  <button
                    className="snippet-btn load"
                    onClick={() => onLoad(s)}
                  >
                    Load
                  </button>
                  <button
                    className="snippet-btn export"
                    onClick={() => exportTxt(s)}
                  >
                    Export .txt
                  </button>
                  <button
                    className="snippet-btn delete"
                    onClick={() => remove(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="snippet-code">
                <pre>
                  <code>
                    {s.code.length > 200
                      ? s.code.substring(0, 200) + "..."
                      : s.code}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
