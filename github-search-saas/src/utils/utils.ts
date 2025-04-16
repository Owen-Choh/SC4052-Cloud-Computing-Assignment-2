export const stripCodeFences = (content: string): string => {
  return content
    .replace(/^```[\w]*\s*/i, "") // Remove opening fence and optional language tag
    .replace(/```$/, "") // Remove closing fence
    .trim();
};

export const downloadOutput = (
  content: string,
  filetype: string,
  filename: string
) => {
  const blob = new Blob([content], { type: filetype });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
