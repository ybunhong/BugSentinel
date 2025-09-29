/**
 * Renders the "Getting Started" guide page.
 * This page provides a step-by-step tutorial on how to use the BugSentinel application.
 */
import React from 'react';
import '../styles/GettingStartedPage.css';

const GettingStartedPage: React.FC = () => {
  return (
    <div className="getting-started-container">
      <h1 className="page-title">Getting Started with BugSentinel</h1>
      <p className="page-intro">Welcome to BugSentinel! This guide will walk you through the key features and how to use them to improve your code.</p>

      <div className="guide-section">
        <h2>Step 1: Add Your Code</h2>
        <p>The first step is to get your code into the editor. You can either type directly into the editor or paste a block of code you're working on. The editor supports multiple languages and provides syntax highlighting to make your code readable.</p>
      </div>

      <div className="guide-section">
        <h2>Step 2: Select the Language</h2>
        <p>Use the language selector dropdown in the toolbar to choose the programming language of your code. This ensures that BugSentinel uses the correct rules for analysis. Supported languages include JavaScript, Python, Java, and more.</p>
      </div>

      <div className="guide-section">
        <h2>Step 3: Analyze Your Code</h2>
        <p>Once your code is ready, click the <strong>Analyze</strong> button. BugSentinel will perform a static analysis to identify potential issues. The results will appear in two sections:</p>
        <ul>
          <li><strong>Detected Issues:</strong> A list of specific errors, warnings, and style issues found in your code, including line numbers and rule IDs.</li>
          <li><strong>AI Suggestions:</strong> Broader recommendations for improving your code's structure, readability, and performance.</li>
        </ul>
      </div>

      <div className="guide-section">
        <h2>Step 4: Review the Refactored Code</h2>
        <p>After analysis, a <strong>Before & After</strong> view will appear, showing a diff of your original code and the refactored version suggested by BugSentinel. You can switch between a side-by-side and an inline view to compare the changes easily.</p>
      </div>

      <div className="guide-section">
        <h2>Step 5: Save to Your Snippet Library</h2>
        <p>If you want to save your code and its analysis for later, click the <strong>Save</strong> button. This will add the current code, refactored code, and all analysis results to your personal snippet library.</p>
      </div>

      <div className="guide-section">
        <h2>Step 6: Manage Your Snippets</h2>
        <p>Navigate to the <strong>Snippets</strong> page from the header to view your saved snippets. From here, you can:</p>
        <ul>
          <li><strong>Load</strong> a snippet back into the editor to continue working on it.</li>
          <li><strong>Export</strong> a snippet as a text file.</li>
          <li><strong>Delete</strong> snippets you no longer need.</li>
        </ul>
      </div>

      <div className="guide-section">
        <h2>Step 7: Switch Themes</h2>
        <p>You can toggle between light and dark modes using the theme switcher in the header. The application will remember your preference for your next visit.</p>
      </div>
    </div>
  );
};

export default GettingStartedPage;
