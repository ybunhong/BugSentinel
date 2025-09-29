/**
 * Renders the Terms of Service page.
 * This page outlines the terms and conditions for using the BugSentinel application.
 */
import React from 'react';
import '../styles/LegalPages.css';

const TermsOfService: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Terms of Service</h1>
      <p><em>Last updated: September 29, 2025</em></p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using BugSentinel (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h2>2. Description of Service</h2>
      <p>BugSentinel is a tool that provides static analysis, code refactoring suggestions, and error detection for various programming languages. The Service operates entirely on the client-side, and your code is not uploaded to any server.</p>

      <h2>3. User Conduct</h2>
      <p>You are solely responsible for the code you input into the Service. You agree not to use the Service for any unlawful purpose or to infringe on the rights of others.</p>

      <h2>4. Disclaimer of Warranty</h2>
      <p>The Service is provided "as is" and "as available" without any warranties of any kind, including the warranty of merchantability, fitness for a particular purpose, or non-infringement. BugSentinel does not guarantee that the suggestions provided are accurate, complete, or free of errors.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall BugSentinel be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of this Service or with the delay or inability to use this Service.</p>

      <h2>6. Intellectual Property</h2>
      <p>You retain full ownership of the code you enter into the Service. We claim no intellectual property rights over the material you provide. The BugSentinel application and its original content, features, and functionality are and will remain the exclusive property of its creators.</p>

      <h2>7. Changes to Terms</h2>
      <p>We reserve the right to modify these terms from time to time at our sole discretion. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at: support@bugsentinel.com</p>
    </div>
  );
};

export default TermsOfService;
