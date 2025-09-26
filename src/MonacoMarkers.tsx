import React from "react";

type Props = {
  monaco: any;
  errors: { line: number; message: string }[];
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
      startLineNumber: e.line,
      startColumn: 1,
      endLineNumber: e.line,
      endColumn: 120,
      message: e.message,
      severity: monaco.MarkerSeverity.Warning,
    }));
    monaco.editor.setModelMarkers(model, "analysis", markers);
    return () => {
      monaco.editor.setModelMarkers(model, "analysis", []);
    };
  }, [monaco, JSON.stringify(errors)]);
  return null;
};

export default MonacoMarkers;
