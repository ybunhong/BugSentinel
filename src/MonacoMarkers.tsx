import React from "react";

type Props = {
  monaco: any;
  errors: {
    line: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    severity?: "error" | "warning" | "info";
    ruleId?: string;
  }[];
};

const MODEL_URI = "inmemory://model/primary";

export const MonacoMarkers: React.FC<Props> = ({ monaco, errors }) => {
  React.useEffect(() => {
    const model =
      monaco.editor
        .getModels()
        .find((m: any) => m.uri?.toString() === MODEL_URI) ||
      monaco.editor.getModels()[0];
    if (!model) return;

    const markers = (errors || []).map((e) => ({
      startLineNumber: e.line || 1,
      startColumn: e.column || 1,
      endLineNumber: e.endLine || e.line || 1,
      endColumn: e.endColumn || e.column || 1,
      message: `${e.message}${e.ruleId ? ` (${e.ruleId})` : ""}`,
      severity:
        e.severity === "error"
          ? monaco.MarkerSeverity.Error
          : e.severity === "warning"
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Info,
    }));

    monaco.editor.setModelMarkers(model, "analysis", markers);
    return () => {
      monaco.editor.setModelMarkers(model, "analysis", []);
    };
  }, [monaco, JSON.stringify(errors)]);
  return null;
};

export default MonacoMarkers;
