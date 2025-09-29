/**
 * Renders the AI Suggestions section, displaying a grid of suggestion cards.
 * Each card contains a title and an optional description for improving the code.
 */
import React from "react";

interface AiSuggestionProps {
  suggestions: Array<{ title: string; description?: string }>;
}

const AiSuggestion: React.FC<AiSuggestionProps> = ({ suggestions }) => {
  return (
    <section className="results">
      <h2>AI Suggestions</h2>
      {suggestions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="empty-text">
            No AI suggestions available. Paste code and click Analyze.
          </p>
        </div>
      ) : (
        <div className="suggestions-grid">
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-card">
              <div className="suggestion-header">
                <div className="suggestion-title-container">
                  <h3 className="suggestion-title">{s.title}</h3>
                </div>
              </div>
              {s.description && (
                <p className="suggestion-description">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AiSuggestion;
