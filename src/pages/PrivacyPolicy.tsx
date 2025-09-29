/**
 * Renders the Privacy Policy page.
 * This page details the application's data handling practices.
 */
import React from 'react';
import '../styles/LegalPages.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: September 29, 2025</em></p>

      <p>This Privacy Policy describes how BugSentinel collects, uses, and handles your information when you use our application.</p>

      <h2>Information We Collect</h2>
      <p>BugSentinel is designed to be a local-first application. All data you provide is stored locally on your device in your browser's <code>localStorage</code>. We do not transmit your code or analysis results to any server.</p>
      <ul>
        <li><strong>Code Snippets:</strong> The code you enter, its analysis, suggestions, and refactored versions are stored locally so you can access them in your Snippet Library.</li>
        <li><strong>Usage Data:</strong> We store your theme preference (light/dark mode) locally.</li>
      </ul>

      <h2>How We Use Information</h2>
      <p>The information collected is used solely to provide and enhance the application's functionality on your local machine. Since we do not collect your data, we do not use it for any other purpose.</p>

      <h2>Data Storage and Security</h2>
      <p>Your data is stored in your browser's <code>localStorage</code>. This means the data resides on your computer and is not accessible by us or any third party. Security of this data depends on the security of your own device and browser.</p>

      <h2>Your Choices</h2>
      <p>You have full control over your data. You can clear your snippets at any time by using the "Delete" functionality within the application or by clearing your browser's <code>localStorage</code> for this site.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, you can contact us at: ybunhong12@gmail.com</p>
    </div>
  );
};

export default PrivacyPolicy;
