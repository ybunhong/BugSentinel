import React, { useMemo, useState } from "react";
import { useAnalyzeStore } from "./store";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import Editor, { useMonaco } from "@monaco-editor/react";
import MonacoMarkers from "./MonacoMarkers";

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

  const disabled = useMemo(
    () => isAnalyzing || code.trim().length === 0,
    [isAnalyzing, code]
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
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="auto">Auto detect</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <button
            className="analyze"
            disabled={disabled}
            onClick={() => analyzeCode(code, language)}
          >
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </button>
          <button
            className="analyze"
            onClick={() => {
              setCode("");
              clear();
            }}
          >
            Clear
          </button>
          <button
            className="analyze"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
              } catch {}
            }}
          >
            Copy
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
          <h2>Suggestions</h2>
          {suggestions.length === 0 ? (
            <p className="muted">
              No suggestions yet. Paste code and click Analyze.
            </p>
          ) : (
            <ul>
              {suggestions.map((s, i) => (
                <li key={i}>
                  <strong>{s.title}</strong>
                  <p>{s.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {errors && errors.length > 0 && (
          <section className="results">
            <h2>Detected Issues</h2>
            <ul>
              {errors.map((e, i) => (
                <li key={i}>
                  <strong>Line {e.line}:</strong> {e.message}
                </li>
              ))}
            </ul>
          </section>
        )}

        {refactoredCode && (
          <section className="results">
            <h2>Before & After</h2>
            <ReactDiffViewer
              oldValue={code}
              newValue={refactoredCode}
              splitView={view === "side-by-side"}
              compareMethod={DiffMethod.WORDS}
              styles={{
                variables: { dark: { diffViewerBackground: "#0b1020" } },
              }}
            />
            {explanations && explanations.length > 0 && (
              <ul style={{ marginTop: 8 }}>
                {explanations.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            )}
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
        <ul>
          {items.map((s) => (
            <li
              key={s.id}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <span style={{ flex: 1 }}>
                {new Date(s.timestamp).toLocaleString()} — {s.language}
              </span>
              <button className="analyze" onClick={() => onLoad(s)}>
                Load
              </button>
              <button className="analyze" onClick={() => exportTxt(s)}>
                Export .txt
              </button>
              <button className="analyze" onClick={() => remove(s.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
