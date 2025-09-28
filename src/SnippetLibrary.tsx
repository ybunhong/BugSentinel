import React, { useState } from "react";

export type Snippet = {
  id: string;
  code: string;
  language: string;
  refactoredCode?: string;
  suggestions?: { title: string; description: string }[];
  errors?: { line: number; message: string }[];
  explanations?: string[];
  timestamp: string;
};

export const SnippetLibrary: React.FC<{
  version: number;
  onLoad: (s: Snippet) => void;
}> = ({ version, onLoad }) => {
  const [items, setItems] = useState<Snippet[]>([]);
  const [expandedSnippets, setExpandedSnippets] = useState(new Set<string>());
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

  const toggleExpanded = (id: string) => {
    setExpandedSnippets(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
                    {expandedSnippets.has(s.id)
                      ? s.code
                      : s.code.substring(0, 200) + (s.code.length > 200 ? '...' : '')}
                  </code>
                </pre>
                {s.code.length > 200 && (
                  <button className="snippet-btn" onClick={() => toggleExpanded(s.id)}>
                    {expandedSnippets.has(s.id) ? 'Show less' : 'Show all'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
