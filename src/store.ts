import { create } from "zustand";

export type Suggestion = {
  title: string;
  description: string;
  line?: number | null;
  column?: number | null;
};

type AnalyzeState = {
  isAnalyzing: boolean;
  suggestions: Suggestion[];
  errors?: {
    line: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    severity?: "error" | "warning" | "info";
    ruleId?: string;
  }[];
  refactoredCode?: string;
  explanations?: string[];
  detectedLanguage?: string;
  loadedCode: string | null;
  analyzeCode: (code: string, language: string) => Promise<void>;
  clear: () => void;
  setLoadedCode: (code: string | null) => void;
};

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  isAnalyzing: false,
  suggestions: [],
  loadedCode: null,
  analyzeCode: async (code: string, language: string) => {
    set({ isAnalyzing: true });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error("Failed to analyze");
      const data = (await res.json()) as {
        suggestions: Suggestion[];
        errors?: {
          line: number;
          column?: number;
          endLine?: number;
          endColumn?: number;
          message: string;
          severity?: "error" | "warning" | "info";
          ruleId?: string;
        }[];
        refactoredCode?: string;
        explanations?: string[];
        language?: string;
      };
      set({
        suggestions: data.suggestions,
        errors: data.errors ?? [],
        refactoredCode: data.refactoredCode,
        explanations: data.explanations ?? [],
        detectedLanguage: data.language,
      });
    } catch (err) {
      set({
        suggestions: [
          {
            title: "Analysis failed",
            description: "Unable to get suggestions.",
          },
        ],
        errors: [],
        refactoredCode: undefined,
        explanations: [],
      });
    } finally {
      set({ isAnalyzing: false });
    }
  },
  clear: () =>
    set({
      suggestions: [],
      errors: [],
      refactoredCode: undefined,
      explanations: [],
      detectedLanguage: undefined,
      loadedCode: null,
    }),
  setLoadedCode: (code: string | null) => set({ loadedCode: code }),
}));
