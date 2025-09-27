import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import * as babelParser from "@babel/parser";
import fetch from "node-fetch";
import { ESLint } from "eslint";

dotenv.config();
const app = express();
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.post("/api/analyze", async (req, res) => {
  const { code, language: lang } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  let aiSuggestions = [
    {
      title: "Use let/const instead of var",
      description:
        "Replace 'var' declarations with 'let' or 'const' for better block scoping.",
    },
    {
      title: "Remove unused variables",
      description:
        "Remove variables that are declared but never used to clean up the code.",
    },
    {
      title: "Add semicolons",
      description:
        "Add semicolons at the end of statements for better code consistency.",
    },
    {
      title: "Use strict equality",
      description: "Use '===' instead of '==' for strict equality comparisons.",
    },
    {
      title: "Extract repeated logic",
      description:
        "Consider extracting repeated logic into reusable functions.",
    },
    {
      title: "Improve variable names",
      description:
        "Use more descriptive variable names to improve code readability.",
    },
    {
      title: "Add error handling",
      description:
        "Add try-catch blocks or proper error handling for robustness.",
    },
    {
      title: "Optimize performance",
      description:
        "Consider performance optimizations for better execution speed.",
    },
    {
      title: "Add comments",
      description: "Add meaningful comments to explain complex logic.",
    },
    {
      title: "Use modern syntax",
      description:
        "Use modern JavaScript/TypeScript features like arrow functions and destructuring.",
    },
    {
      title: "Fix console.log typos",
      description:
        "Correct any typos in console.log statements (e.g., 'consol.log' → 'console.log').",
    },
    {
      title: "Handle async operations",
      description:
        "Properly handle promises and async operations with await or .then().",
    },
  ];

  // Add language-specific suggestions
  if (lang === "javascript" || lang === "typescript") {
    aiSuggestions.push(
      {
        title: "Add TypeScript types",
        description: "Add explicit type annotations for better type safety.",
      },
      {
        title: "Use template literals",
        description:
          "Use template literals (backticks) instead of string concatenation.",
      }
    );
  }

  let refactoredCode =
    code
      .replace(/\bvar\b/g, "let")
      .replace(/\t/g, "  ")
      .trimEnd() + "\n";
  const explanations = [
    "Replaced var with let for block scoping.",
    "Normalized indentation and ensured trailing newline.",
  ];

  if (anthropicKey) {
    try {
      console.log(
        "Using Claude model:",
        process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest"
      );
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const system = `You are an expert code assistant. Respond ONLY with raw JSON and NOTHING else.`;
      const schema = {
        suggestions: [{ title: "string", description: "string" }],
        errors: [{ line: 0, message: "string" }],
        refactoredCode: "string",
        explanations: ["string"],
      };
      const prompt = `Return STRICT JSON matching EXACTLY this shape (no markdown, no commentary): ${JSON.stringify(
        schema
      )}\nAnalyze the following ${lang} code, fill ALL fields, and include a complete refactoredCode string.\n\nCODE:\n${code}`;
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: prompt }],
      });
      const text = response.content
        .filter((b) => b?.type === "text")
        .map((b) => b.text || "")
        .join("\n");
      console.log("Claude raw (first 400):", (text || "").slice(0, 400));
      if (text) {
        const stripped = text
          .trim()
          .replace(/^```[\w]*\n?/, "")
          .replace(/```$/, "");
        try {
          const parsed = JSON.parse(stripped);
          console.log("Claude JSON parsed");
          if (
            parsed?.suggestions &&
            Array.isArray(parsed.suggestions) &&
            parsed.suggestions.length >= 5
          ) {
            aiSuggestions = parsed.suggestions.map((s) => ({
              title: String(s.title || "Suggestion"),
              description: String(s.description || ""),
            }));
          }
          if (
            parsed?.refactoredCode &&
            typeof parsed.refactoredCode === "string"
          ) {
            refactoredCode = parsed.refactoredCode;
          }
          if (parsed?.explanations && Array.isArray(parsed.explanations)) {
            const safe = parsed.explanations.filter(
              (e) => typeof e === "string"
            );
            if (safe.length > 0) {
              explanations.splice(0, explanations.length, ...safe);
            }
          }
          if (parsed?.errors && Array.isArray(parsed.errors)) {
            for (const er of parsed.errors) {
              const line = Number(er?.line) || 1;
              const message = String(er?.message || "Issue detected");
              errors.push({ line, message });
            }
          }
        } catch (_) {
          // ignore parse errors; keep mock-derived content
        }
      }
    } catch (e) {
      console.error("Claude call failed:", e?.message || e);
      // Silent fallback to mock
    }
  }
  // OpenRouter fallback if Anthropic not available or returns auth/billing error
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!anthropicKey && openrouterKey) {
    try {
      const schema = {
        suggestions: [{ title: "string", description: "string" }],
        errors: [{ line: 0, message: "string" }],
        refactoredCode: "string",
        explanations: ["string"],
      };
      const prompt = `Return STRICT JSON ONLY (no markdown). Shape: ${JSON.stringify(
        schema
      )}\nAnalyze ${lang} code, include refactoredCode.\n\nCODE:\n${code}`;
      const resp = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AI Code Helper",
          },
          body: JSON.stringify({
            model:
              process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 4096,
          }),
        }
      );
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content;
      console.log("OpenRouter raw (first 400):", (text || "").slice(0, 400));
      if (text) {
        const stripped = text
          .trim()
          .replace(/^```[\w]*\n?/, "")
          .replace(/```$/, "");
        try {
          const parsed = JSON.parse(stripped);
          // Only use AI suggestions if they provide at least 5 suggestions, otherwise keep our comprehensive mock
          if (
            parsed?.suggestions &&
            Array.isArray(parsed.suggestions) &&
            parsed.suggestions.length >= 5
          ) {
            aiSuggestions = parsed.suggestions.map((s) => ({
              title: String(s.title || "Suggestion"),
              description: String(s.description || ""),
            }));
            console.log(
              `Using AI suggestions: ${parsed.suggestions.length} suggestions`
            );
          } else {
            console.log(
              `Keeping mock suggestions: AI only provided ${
                parsed?.suggestions?.length || 0
              } suggestions`
            );
          }
          if (
            parsed?.refactoredCode &&
            typeof parsed.refactoredCode === "string"
          ) {
            refactoredCode = parsed.refactoredCode;
          }
          if (parsed?.explanations && Array.isArray(parsed.explanations)) {
            const safe = parsed.explanations.filter(
              (e) => typeof e === "string"
            );
            if (safe.length > 0) {
              explanations.splice(0, explanations.length, ...safe);
            }
          }
          if (parsed?.errors && Array.isArray(parsed.errors)) {
            for (const er of parsed.errors) {
              const line = Number(er?.line) || 1;
              const message = String(er?.message || "Issue detected");
              errors.push({ line, message });
            }
          }
        } catch (_) {
          // ignore parse errors; keep mock-derived content
        }
      }
    } catch (e) {
      console.error("OpenRouter call failed:", e?.message || e);
    }
  }

  // Enhanced linting with basic rules and syntax checking
  const lines = code.split(/\r?\n/);
  const errors = [];

  if (lang === "javascript" || lang === "typescript") {
    // Basic syntax check first
    try {
      babelParser.parse(code, {
        sourceType: "module",
        allowReturnOutsideFunction: true,
        plugins: lang === "typescript" ? ["typescript", "jsx"] : ["jsx"],
      });
    } catch (parseError) {
      const msg = parseError?.message || "Syntax error";
      const loc = parseError?.loc;
      errors.push({
        line: loc?.line || 1,
        column: loc?.column || 1,
        endLine: loc?.line || 1,
        endColumn: loc?.column || 1,
        message: msg,
        severity: "error",
        ruleId: "syntax-error",
      });
    }

    // Basic linting rules
    const codeLines = code.split(/\r?\n/);

    // Check for var usage
    codeLines.forEach((line, index) => {
      if (line.includes("var ")) {
        errors.push({
          line: index + 1,
          column: line.indexOf("var ") + 1,
          endLine: index + 1,
          endColumn: line.indexOf("var ") + 4,
          message: "Unexpected var, use let or const instead",
          severity: "error",
          ruleId: "no-var",
        });
      }
    });

    // Check for unused variables (basic check)
    const variableDeclarations = [];
    const variableUsages = [];

    codeLines.forEach((line, index) => {
      // Find variable declarations
      const letMatch = line.match(/\blet\s+(\w+)/g);
      const constMatch = line.match(/\bconst\s+(\w+)/g);
      const varMatch = line.match(/\bvar\s+(\w+)/g);

      if (letMatch) {
        letMatch.forEach((match) => {
          const varName = match.replace(/\blet\s+/, "");
          variableDeclarations.push({
            name: varName,
            line: index + 1,
            type: "let",
          });
        });
      }
      if (constMatch) {
        constMatch.forEach((match) => {
          const varName = match.replace(/\bconst\s+/, "");
          variableDeclarations.push({
            name: varName,
            line: index + 1,
            type: "const",
          });
        });
      }
      if (varMatch) {
        varMatch.forEach((match) => {
          const varName = match.replace(/\bvar\s+/, "");
          variableDeclarations.push({
            name: varName,
            line: index + 1,
            type: "var",
          });
        });
      }

      // Find variable usages
      variableDeclarations.forEach((decl) => {
        const regex = new RegExp(`\\b${decl.name}\\b`, "g");
        const matches = line.match(regex);
        if (matches && index + 1 !== decl.line) {
          variableUsages.push(decl.name);
        }
      });
    });

    // Check for unused variables
    variableDeclarations.forEach((decl) => {
      if (!variableUsages.includes(decl.name)) {
        errors.push({
          line: decl.line,
          column: 1,
          endLine: decl.line,
          endColumn: 1,
          message: `'${decl.name}' is assigned a value but never used`,
          severity: "warning",
          ruleId: "no-unused-vars",
        });
      }
    });
  }

  return res.json({
    suggestions: aiSuggestions,
    errors,
    refactoredCode,
    explanations,
    language: lang,
  });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
