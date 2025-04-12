import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubGetCodeApi } from "../api/apiconfigs";
import { generateContent } from "../geminiAPI/geminiAPI";
import { Slider } from "@mui/material";

const CodeEdit: React.FC = () => {
  const { username, repository, selectedItems, results } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [cache, setCache] = useState<Map<string, string>>(new Map());
  const [modelTemperature, setModelTemperature] = useState<number>(0);

  useEffect(() => {
    setCache(new Map());
  }, [repository]);

  const clearGenContent = () => {
    cache.delete("generatedContent");
    cache.delete("finalPrompt");
    setOutput("");
    console.log("Cache: ", cache);
    console.log("Cache size: ", cache.size);
  };
  const clearRepoContent = () => {
    cache.delete("repoFileContents");
    setOutput("");
    console.log("Cache: ", cache);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateDocumentation = async () => {
    setLoading(true);
    setError(null);
    if (!repository) {
      setError("No repository selected. Please select a repo first.");
      setLoading(false);
      return;
    }
    if (results && results.length == 0) {
      setError("No results found. Please attempt a search first.");
      setLoading(false);
      return;
    }

    try {
      var repoFileContents = "";
      var finalPrompt = "";
      if (cache.has("finalPrompt")) {
        finalPrompt = cache.get("finalPrompt") || "";
      } else if (cache.has("repoFileContents")) {
        if (cache.has("finalPrompt")) {
          finalPrompt = cache.get("finalPrompt") || "";
        } else {
          repoFileContents = cache.get("repoFileContents") || "";
        }
      } else {
        for (const item of results) {
          const response = await githubGetCodeApi.get(
            `/${item.repository.full_name}/contents/${item.path}`
          );
          const fileContent = atob(response.data.content);
          repoFileContents += item.path + "\n" + fileContent + "\n\n";
        }
        cache.set("repoFileContents", repoFileContents);
      }
      if (finalPrompt == "" || cache.has("finalPrompt")) {
        finalPrompt = `Generate documentation for the repository ${repository} with the following code. For conciseness, you do not need to include the code directly in the documentation, you may chose to include the file path if required. Write the documentation in a way that is easy to understand for a beginner. The documentation should use markdown styling, do not wrap your entire output in markdown tags. The documentation should be split into two sections: how-to guides and reference guides. Try to be detailed for the reference guide. Also include notes for anything the reader should look out for\n\n${repoFileContents}`;
        cache.set("finalPrompt", finalPrompt);
      }

      console.log(finalPrompt);
      if (!finalPrompt) {
        setError("No content to generate documentation for.");
        setLoading(false);
        return;
      }

      var generatedContent = "";
      if (!cache.has("generatedContent")) {
        generatedContent = await generateContent(finalPrompt);
        cache.set("generatedContent", generatedContent);
      } else {
        generatedContent = cache.get("generatedContent") || "";
      }

      setOutput(generatedContent);
    } catch (err) {
      setError("Error generating documentation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-2xl">Extra functions</h2>
        <div className="flex gap-4 w-1/2">
          <p className="text-lg text-nowrap">Model Temperature:</p>
          <Slider
            aria-label="Temperature"
            size="small"
            defaultValue={0}
            min={0}
            max={1}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, value) => {
              setModelTemperature(value.valueOf() as number);
            }}
          />
        </div>
        <h3 className="text-lg">Selected Details:</h3>
        <p>Username: {username || "None selected"}</p>
        <p>
          Repository: {repository || "None selected"}
          <div className="flex gap-4">
            <button onClick={generateDocumentation}>
              Generate Documentation
            </button>
            <button onClick={clearGenContent}>Clear generated content</button>
            <button onClick={clearRepoContent}>Clear repo content</button>
          </div>
        </p>
        <p>
          Items:{" "}
          {selectedItems && selectedItems.length > 0
            ? results
                .filter((item) => selectedItems.includes(item.sha))
                .map((item) => `${item.name} (${item.repository.full_name})`)
                .join(", ")
            : "None selected"}
        </p>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="w-full">
          <div className="flex gap-4 items-center mb-2">
            <p>Output</p>
            <button
              onClick={downloadOutput}
              disabled={!output}
              className="!p-2"
            >
              Download
            </button>
          </div>
          <textarea
            className="w-full h-64 border-gray-500 border-2 rounded-lg p-2"
            placeholder="Generated documentation will appear here..."
            readOnly
            value={output}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CodeEdit;
