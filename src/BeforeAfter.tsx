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
