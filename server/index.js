import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Mock analysis endpoint for Phase 1
app.post("/api/analyze", async (req, res) => {
  const { code, language } = req.body ?? {};
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing code" });
  }
  // Simple mock suggestions to satisfy acceptance criteria
  let lang = language && language !== "auto" ? language : "auto";
  if (lang === "auto") {
    // very naive auto-detection heuristics for Phase 3
    if (/\b#include\b|std::/.test(code)) lang = "cpp";
    else if (/\bpublic\s+class\b|System\.out\.println/.test(code))
      lang = "java";
    else if (/\bdef\s+\w+\(|print\(/.test(code)) lang = "python";
    else if (/<[a-zA-Z][\s\S]*?>[\s\S]*<\/[a-zA-Z]+>/.test(code)) lang = "html";
    else if (/\{[\s\S]*:\s*[#a-zA-Z0-9\-\.]+;[\s\S]*\}/.test(code))
      lang = "css";
    else if (/\binterface\b|:\s*\w+\s*=\s*\(.*\)\s*=>/.test(code))
      lang = "typescript";
    else lang = "javascript";
  }
  // Derive very naive mock "bugs" and a refactor
  const lines = code.split(/\r?\n/);
  const errors = [];
  if (code.includes("var ")) {
    errors.push({
      line: Math.max(1, lines.findIndex((l) => l.includes("var ")) + 1),
      message: "Avoid var; prefer let/const.",
    });
  }
  if (code.length > 0 && !/\n$/.test(code)) {
    errors.push({
      line: lines.length,
      message: "File does not end with a newline.",
    });
  }

  const refactoredCode =
    code
      .replace(/\bvar\b/g, "let")
      .replace(/\t/g, "  ")
      .trimEnd() + "\n";

  const explanations = [
    "Replaced var with let for block scoping.",
    "Normalized indentation and ensured trailing newline.",
  ];

  return res.json({
    suggestions: [
      {
        title: "General Improvement",
        description: "Consider extracting repeated logic into a function.",
      },
      {
        title: "Readability",
        description: "Add descriptive variable names and avoid deep nesting.",
      },
      { title: "Language", description: `Processed with language: ${lang}.` },
    ],
    errors,
    refactoredCode,
    explanations,
    language: lang,
  });
});

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
