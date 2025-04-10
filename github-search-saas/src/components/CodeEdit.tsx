import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubGetCodeApi } from "../api/apiconfigs";
import { generateContent } from "../geminiAPI/geminiAPI";

const CodeEdit: React.FC = () => {
  const { username, repository, selectedItems, results } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [cache, setCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setCache(new Map());
  },[repository]);

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

          finalPrompt = `Generate documentation for the repository ${repository} with the following code:\n\n${repoFileContents}`;
          cache.set("finalPrompt", finalPrompt);
        }
      } else {
        var repoFileContents = "";
        for (const item of results) {
          const response = await githubGetCodeApi.get(
            `/${item.repository.full_name}/contents/${item.path}`
          );
          const fileContent = atob(response.data.content);
          repoFileContents += item.path + "\n" + fileContent + "\n\n";
        }
        cache.set("repoFileContents", repoFileContents);

        finalPrompt = `Generate documentation for the repository ${repository} with the following code:\n\n${repoFileContents}`;
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
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">Extra function</h2>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <h3 className="text-lg">Selected Details:</h3>
        <p>Username: {username || "None selected"}</p>
        <p>
          Repository: {repository || "None selected"}
          <button onClick={generateDocumentation}>
            Generate Documentation
          </button>
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
          <p>Output</p>
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
