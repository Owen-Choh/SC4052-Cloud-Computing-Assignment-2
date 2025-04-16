export const checkCache = (cache: Map<string, string>) => {
  return {
    repoFileContents: cache.get("repoFileContents") || "",
    finalPrompt: cache.get("finalPrompt") || "",
    generatedContent: cache.get("generatedContent") || "",
  };
};

export const clearGenContent = (cache: Map<string, string>, setOutput: Function) => {
  cache.delete("generatedContent");
  cache.delete("finalPrompt");
  setOutput("");
  console.log("Cache size: ", cache.size);
};

export const clearRepoContent = (
  cache: Map<string, string>,
  setRepoFileContentArray: Function,
  setOutput: Function
) => {
  cache.delete("repoFileContents");
  setRepoFileContentArray([]);
  setOutput("");
  console.log("Cache: ", cache);
};
