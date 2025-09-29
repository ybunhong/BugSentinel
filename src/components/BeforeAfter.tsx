/**
 * Renders a diff view comparing the original code ("Before") and the refactored code ("After").
 * It allows switching between side-by-side and inline views.
 */
import React from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

interface BeforeAfterProps {
  code: string;
  refactoredCode?: string;
  view: "side-by-side" | "inline";
  setView: (v: "side-by-side" | "inline") => void;
  theme: string;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ code, refactoredCode, view, setView, theme }) => {
  if (!refactoredCode) return null;
  return (
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <button
          className="copy-btn"
          style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4, background: '#f2f2f2', color: '#222', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => {
            if (refactoredCode) navigator.clipboard.writeText(refactoredCode);
          }}
          title="Copy refactored code"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
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
  );
};

export default BeforeAfter;
