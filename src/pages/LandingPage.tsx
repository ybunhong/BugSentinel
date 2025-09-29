/**
 * Renders the main landing page for the BugSentinel application.
 * It provides an overview of the features and navigation to other parts of the site.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <section className="hero-section">
        <h1 className="hero-title">BugSentinel</h1>
        <p className="hero-subtitle">Debug smarter, not harder.</p>
        <blockquote className="hero-quote">"Turn errors into learning opportunities."</blockquote>
        <Link to="/editor" className="cta-button">Start Analyzing</Link>
      </section>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Detect Bugs Quickly</h3>
            <p>Find issues before they grow with our powerful static analysis engine.</p>
          </div>
          <div className="feature-card">
            <h3>Refactor Smarter</h3>
            <p>Get cleaner, optimized code suggestions to improve your codebase.</p>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2 className="section-title">Docs & Tutorials</h2>
        <ul className="docs-list">
          <li><Link to="/getting-started">Getting Started Guide</Link></li>
          <li><Link to="/snippets">Snippet Library</Link></li>
        </ul>
      </section>

      <section className="guidelines-section">
        <h2 className="section-title">Rules & Guidelines</h2>
        <ul className="guidelines-list">
          <li>Follow coding best practices to get the most accurate suggestions.</li>
          <li>Use saved snippets responsibly and respect intellectual property.</li>
          <li>For more information, check out our <Link to="/faq">FAQ</Link>.</li>
        </ul>
      </section>

      <section className="footer-section">
        <p>Contact: ybunhong12@gmail.com</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/ybunhongg_/" target="_blank">Instagram</a> | <a href="https://github.com/ybunhong" target="_blank">GitHub</a> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
