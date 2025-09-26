import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import * as babelParser from "@babel/parser";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(express.json({ limit: "1mb" }));

// Basic rate limiting: 30 requests per minute per IP, burst safe
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

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
  // If ANTHROPIC_API_KEY is set, call Claude; otherwise use mock
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  let aiSuggestions = [
    {
      title: "General Improvement",
      description: "Consider extracting repeated logic into a function.",
    },
    {
      title: "Readability",
      description: "Add descriptive variable names and avoid deep nesting.",
    },
    { title: "Language", description: `Processed with language: ${lang}.` },
  ];
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
        temperature: 0,
        system,
        messages: [{ role: "user", content: prompt }],
      });
      // Debug: log entire content array to understand shape
      try {
        console.log(
          "Claude content blocks:",
          JSON.stringify(response?.content, null, 2)
        );
      } catch {}
      const blocks = Array.isArray(response?.content) ? response.content : [];
      const text = blocks
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
          if (parsed?.suggestions && Array.isArray(parsed.suggestions)) {
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
            // Recommended headers for OpenRouter attribution
            "HTTP-Referer":
              process.env.OPENROUTER_SITE || "http://localhost:5173",
            "X-Title": process.env.OPENROUTER_APP_NAME || "AI Code Helper",
          },
          body: JSON.stringify({
            model:
              process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
            messages: [
              { role: "system", content: "Respond ONLY with raw JSON." },
              { role: "user", content: prompt },
            ],
            temperature: 0,
          }),
        }
      );
      const data = await resp.json();
      // Handle both string and array content formats from OpenRouter
      const message = data?.choices?.[0]?.message;
      let content = "";
      if (typeof message?.content === "string") {
        content = message.content;
      } else if (Array.isArray(message?.content)) {
        content = message.content.map((p) => p?.text || "").join("\n");
      }
      console.log("OpenRouter raw (first 400):", String(content).slice(0, 400));
      if (typeof content === "string" && content) {
        const stripped = content
          .trim()
          .replace(/^```[\w]*\n?/, "")
          .replace(/```$/, "");
        try {
          const parsed = JSON.parse(stripped);
          if (parsed?.suggestions && Array.isArray(parsed.suggestions)) {
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
            if (safe.length > 0)
              explanations.splice(0, explanations.length, ...safe);
          }
          if (parsed?.errors && Array.isArray(parsed.errors)) {
            for (const er of parsed.errors) {
              const line = Number(er?.line) || 1;
              const message = String(er?.message || "Issue detected");
              errors.push({ line, message });
            }
          }
        } catch (_) {}
      }
    } catch (e) {
      console.error("OpenRouter call failed:", e?.message || e);
    }
  }

  // Derive very naive mock "bugs" and a refactor baseline
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

  // Basic syntax check for JS/TS
  if (lang === "javascript" || lang === "typescript") {
    try {
      babelParser.parse(code, {
        sourceType: "module",
        allowReturnOutsideFunction: true,
        plugins: lang === "typescript" ? ["typescript", "jsx"] : ["jsx"],
      });
    } catch (e) {
      const msg = e?.message || "Syntax error";
      const loc = e?.loc;
      errors.push({
        line: loc?.line || 1,
        message: msg,
      });
    }
  }

  return res.json({
    suggestions: aiSuggestions,
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
