import { create } from "zustand";

export type Suggestion = {
  title: string;
  description: string;
};

type AnalyzeState = {
  isAnalyzing: boolean;
  suggestions: Suggestion[];
  errors?: { line: number; message: string }[];
  refactoredCode?: string;
  explanations?: string[];
  detectedLanguage?: string;
  analyzeCode: (code: string, language: string) => Promise<void>;
  clear: () => void;
};

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  isAnalyzing: false,
  suggestions: [],
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
        errors?: { line: number; message: string }[];
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
    }),
}));
