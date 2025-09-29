/**
 * Renders the Frequently Asked Questions (FAQ) page.
 * This page provides answers to common questions about BugSentinel.
 */
import React from 'react';
import '../styles/FaqPage.css';

const FaqPage: React.FC = () => {
  return (
    <div className="faq-container">
      <h1 className="page-title">Frequently Asked Questions</h1>

      <div className="faq-item">
        <h2>What is BugSentinel?</h2>
        <p>BugSentinel is a powerful, local-first code analysis tool designed to help developers write better code. It detects bugs, suggests refactorings, and provides explanations to help you learn and improve.</p>
      </div>

      <div className="faq-item">
        <h2>Is my code secure?</h2>
        <p>Yes. BugSentinel operates entirely on your local machine. Your code is never sent to a server, ensuring your data remains private and secure. All snippets are stored in your browser's local storage.</p>
      </div>

      <div className="faq-item">
        <h2>What languages are supported?</h2>
        <p>BugSentinel currently supports JavaScript, TypeScript, Python, Java, C++, HTML, and CSS. We are always working to expand our language support.</p>
      </div>

      <div className="faq-item">
        <h2>How does the analysis work?</h2>
        <p>BugSentinel uses a combination of static analysis engines and AI-powered models to scan your code for common errors, style violations, and structural issues. It then provides detailed feedback and refactoring suggestions.</p>
      </div>

      <div className="faq-item">
        <h2>Can I use this for commercial projects?</h2>
        <p>Yes, you are free to use BugSentinel for both personal and commercial projects. However, please review our Terms of Service for full details on usage and limitations.</p>
      </div>

      <div className="faq-item">
        <h2>How do I save my code?</h2>
        <p>After analyzing your code, you can click the "Save" button in the toolbar. This will store the code, along with its analysis and suggestions, in your personal Snippet Library for future access.</p>
      </div>
    </div>
  );
};

export default FaqPage;
