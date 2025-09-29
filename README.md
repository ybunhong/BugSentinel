# Bug Sentintel

Bug Sentintel is a local-first AI-powered code analysis and snippet management tool. It helps you analyze, refactor, and manage your code securely—without sending your code to any server unless you configure your own API keys.

## Features

- **AI Suggestions:** Get actionable AI-powered suggestions for code improvements.
- **Refactor Preview:** Instantly preview refactored code and explanations.
- **Lint & Error Detection:** Inline detection of syntax errors, usage of `var`, and unused variables.
- **Before & After Diff:** Visual diff of your original and refactored code with a one-click copy for the refactored version.
- **Snippet Library:** Save, load, export, and manage code snippets locally in your browser.
- **Modern UI:** Clean, responsive, dark/light theme with fantasy-inspired design.
- **Local-First:** All your data stays in your browser's `localStorage` by default.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Zustand, Monaco Editor
- **Backend:** Node.js, Express, Babel Parser, ESLint, optional Anthropic/OpenRouter API

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
git clone https://github.com/ybunhong/BugSentinel.git
cd BugSentinel
npm install
```

### Running the App
- **Frontend:**
  ```bash
  npm run dev
  ```
  Visit [http://localhost:5173](http://localhost:5173)

- **Backend (optional, for AI analysis):**
  ```bash
  npm run server
  ```
  The API will run at [http://localhost:5174](http://localhost:5174)

## Usage
- Paste or write code in the editor.
- Click **Analyze** to get AI suggestions and refactored code.
- Use **Save** to store snippets locally.
- View **Before & After** diff and copy the refactored code with one click.
- Browse, load, or export snippets from the Snippet Library.

## Privacy
See [`PrivacyPolicy.tsx`](src/pages/PrivacyPolicy.tsx):
- All data is stored locally in your browser by default.
- No code or analysis is sent to external servers unless you provide your own API keys.

## License
MIT

---

For feedback or questions, contact: ybunhong12@gmail.com
