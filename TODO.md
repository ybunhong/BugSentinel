# AI Code Helper – Development TODO List

## Phase 1: Core Features (Easy)

### 1. Project Setup

- [x] Initialize Vite + React + TypeScript project
      **Acceptance Criteria:** Project runs locally without errors. TypeScript type checking is enabled.
- [x] Install dependencies for React, UI components, syntax highlighting, and state management
      **Acceptance Criteria:** Dependencies installed and app builds without errors.

### 2. Paste & Analyze Code

- [x] Create code input component
      **Acceptance Criteria:** Supports multi-line input, scroll, and tab indentation.
- [x] Create “Analyze” button component
      **Acceptance Criteria:** Button triggers AI analysis and is disabled while processing.
- [x] Integrate Claude AI API for on-demand analysis
      **Acceptance Criteria:** Code is sent to Claude AI when “Analyze” is clicked, and suggestions are displayed.

---

## Phase 2: Core Enhancements (Medium)

### 3. Bug Detection

- [x] Implement syntax and logic error detection using AI
      **Acceptance Criteria:** AI highlights errors in the code and provides plain-language explanations.

### 4. Refactoring Recommendations

- [x] Implement basic refactoring suggestions
      **Acceptance Criteria:** Users can see improved readability and efficiency.
- [x] Implement advanced refactoring suggestions
      **Acceptance Criteria:** Users can toggle between original and AI-refactored code.

### 5. Before & After View

- [x] Create side-by-side comparison view
      **Acceptance Criteria:** Original and improved code displayed with highlighted changes.
- [x] Create inline diff view
      **Acceptance Criteria:** Users can toggle between side-by-side and inline diff.

---

## Phase 3: Language Support & Library (Medium-Hard)

### 6. Multi-Language Support

- [x] Implement language selector dropdown
      **Acceptance Criteria:** Users can select the language of the code.
- [x] Implement auto-detection of language
      **Acceptance Criteria:** AI receives the correct language without manual selection.
- [x] Support multiple languages including JS, TS, HTML, CSS, Python, C++, Java
      **Acceptance Criteria:** Analysis works correctly for all supported languages.

### 7. Code Snippet Library / History

- [x] Implement snippet storage in localStorage
      **Acceptance Criteria:** Snippets persist across sessions and can be viewed, copied, or deleted.

---

## Phase 4: UI/UX & Optional Enhancements (Hard)

### 8. Minimal & Clean UI

- [x] Design single-page layout with input, analyze button, before/after view, and snippet library
      **Acceptance Criteria:** Layout is intuitive, responsive, and visually clean.
- [x] Implement collapsible snippet library
      **Acceptance Criteria:** Users can expand or collapse snippets for easy navigation.
- [x] Implement toolbar actions: Analyze, Clear, Save, Copy
      **Acceptance Criteria:** Toolbar buttons function correctly.

### 9. Optional Enhancements

- [x] Dark/Light mode toggle
      **Acceptance Criteria:** UI colors update correctly on mode change.
- [x] Export snippets to file
      **Acceptance Criteria:** Users can download snippets in .txt or .json format.
- [x] Advanced inline diff highlighting
      **Acceptance Criteria:** Changes are clearly highlighted with color or indicators.

---
