# AI Code Helper – Software Specification

## 1. Overview

**Project Name:** AI Code Helper
**Description:** A web application that helps users improve their code by detecting bugs, suggesting improvements, refactoring code, and explaining changes in plain language. Users paste code, analyze it with Claude AI, and compare before/after versions.

**Target User:** Individual developers
**AI Backend:** Claude AI (on-demand analysis)
**Frontend:** React + Vite + TypeScript
**Storage:** LocalStorage for snippet history

---

## 2. Features & User Stories

### Paste & Analyze Code

- **User Story:** Users can paste code and click “Analyze” to receive AI suggestions.
- **Acceptance Criteria:**

  - Multi-line code input is supported.
  - “Analyze” triggers AI analysis.
  - Suggestions are returned and displayed clearly.

### Bug Detection

- **User Story:** Users want the app to identify syntax or logic errors.
- **Acceptance Criteria:**

  - AI highlights errors in the code.
  - Provides corrected code and plain-language explanations.

### Refactoring Recommendations

- **User Story:** Users want cleaner and more efficient code.
- **Acceptance Criteria:**

  - Offers basic and advanced refactoring.
  - Users can toggle between original and refactored code.

### Before & After View

- **User Story:** Users want to compare original and AI-improved code.
- **Acceptance Criteria:**

  - Side-by-side or inline diff view.
  - Changes are highlighted and collapsible.

### Multi-Language Support

- **User Story:** Users want to analyze code in multiple programming languages.
- **Acceptance Criteria:**

  - Supports web development languages and more (JavaScript, TypeScript, HTML, CSS, Python, C++, Java, etc.).
  - Language can be auto-detected or selected manually.

### Code Snippet Library / History

- **User Story:** Users want to save analyzed snippets for future reference.
- **Acceptance Criteria:**

  - Snippets can be stored locally or in the cloud (Supabase).
  - Users can view, copy, or delete snippets.
  - Each snippet stores original code, AI suggestions, language, and timestamp.

### Minimal & Clean UI

- **User Story:** Users want a simple and intuitive interface.
- **Acceptance Criteria:**

  - Single-page layout including code input, analyze button, before/after view, and snippet library.
  - Minimal colors, clear typography, and responsive design.

---

## 3. Technical Specifications

### Frontend

- Built with React + Vite using TypeScript.
- Component-based architecture for input, analysis, comparison, and snippet management.

### AI Integration

- Uses Claude AI for code analysis.
- Analysis is triggered only when the user clicks “Analyze”.
- AI responses include bug detection, code refactoring suggestions, and plain-language explanations.

### Storage Options

- **LocalStorage:** For quick, personal snippet saving.
- **Supabase (optional):** For multi-device access, authentication, and cloud storage.

### UI/UX Guidelines

- Side-by-side or inline diff with clear highlighting of changes.
- Collapsible snippet library for easy navigation.
- Toolbar for actions: Analyze, Clear, Save, Copy.
- Fully responsive for desktop and tablet devices.

### Optional Enhancements

- Real-time code analysis while typing.
- Dark/Light mode toggle.
- Export snippets to file.
- Advanced inline diff highlighting.

---
