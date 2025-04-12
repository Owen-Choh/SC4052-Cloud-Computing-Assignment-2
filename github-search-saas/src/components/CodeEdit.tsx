import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubGetCodeApi } from "../api/apiconfigs";
import {
  generateContentWithConfig,
  generateWithSystemInstructionAndConfig,
} from "../geminiAPI/geminiAPI";
import { Slider } from "@mui/material";

const CodeEdit: React.FC = () => {
  const { username, repository, selectedItems, results } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [cache, setCache] = useState<Map<string, string>>(new Map());
  const [modelTemperature, setModelTemperature] = useState<number>(0);

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

  const validateInitialState = (): boolean => {
    if (!repository) {
      setError("No repository selected. Please select a repo first.");
      return false;
    }
    if (results && results.length == 0) {
      setError(
        "No results found. Please attempt a search to see what is in your repo first."
      );
      return false;
    }
    return true;
  };

  const checkCache = (): {
    repoFileContents: string;
    finalPrompt: string;
    generatedContent: string;
  } => {
    return {
      repoFileContents: cache.get("repoFileContents") || "",
      finalPrompt: cache.get("finalPrompt") || "",
      generatedContent: cache.get("generatedContent") || "",
    };
  };

  const fetchFileContents = async (
    items: any[]
  ): Promise<{ fileContents: string; errmsg: string }> => {
    var fileContents = "";
    var errmsg = "";
    for (const item of results) {
      try {
        const response = await githubGetCodeApi.get(
          `/${item.repository.full_name}/contents/${item.path}`
        );
        const fileContent = atob(response.data.content);
        fileContents += item.path + "\n" + fileContent + "\n\n";
      } catch (error) {
        console.error(`Error fetching file content for ${item.path}: ${error}`);
        errmsg += item.path + "; ";
      }
    }

    return { fileContents, errmsg };
  };

  const generateREADME = async () => {
    setLoading(true);
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      return;
    }
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      const { fileContents, errmsg } = await fetchFileContents(results);
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
      }
      repoFileContents = fileContents;
      cache.set("repoFileContents", repoFileContents);
    }

    if (finalPrompt == "") {
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    console.log(finalPrompt);
    if (!finalPrompt) {
      setError("No content to generate README for.");
      setLoading(false);
      return;
    }

    const systemInstruction = `Generate a README for the code repository ${repository}, only return the contents of the README.\nFormat the README using standard Markdown syntax for text styling. Avoid using code blocks unless displaying code.\nYou do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;
    var generatedContent = "";
    if (!cache.has("generatedContent")) {
      generatedContent = await generateWithSystemInstructionAndConfig(
        systemInstruction,
        finalPrompt,
        {
          temperature: modelTemperature,
        }
      );
      cache.set("generatedContent", generatedContent);
    } else {
      generatedContent = cache.get("generatedContent") || "";
    }

    setOutput(generatedContent);
    setLoading(false);
  };

  const generateDocumentation = async () => {
    setLoading(true);
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      return;
    }

    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      const { fileContents, errmsg } = await fetchFileContents(results);
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
      }
      repoFileContents = fileContents;
      cache.set("repoFileContents", repoFileContents);
    }

    if (finalPrompt == "") {
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
      generatedContent = await generateContentWithConfig(finalPrompt, {
        temperature: modelTemperature,
      });
      cache.set("generatedContent", generatedContent);
    } else {
      generatedContent = cache.get("generatedContent") || "";
    }

    setOutput(generatedContent);
    setLoading(false);
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-2xl">Extra functions</h2>
        <div className="flex gap-4 w-full">
          <p className="text-lg text-nowrap">
            Model Temperature (how much variation in the output):
          </p>
          <div className="w-1/3">
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
          <p>{modelTemperature}</p>
        </div>
        <h3 className="text-lg">Selected Details:</h3>
        <p>Username: {username || "None selected"}</p>
        <div>
          <div className="flex gap-4 items-center mb-2">
            <p>Repository: {repository || "None selected"}</p>
            <p>Processing Cache (makes the buttons below faster):</p>
            {cache.has("repoFileContents") ? (
              <p className="text-green-500">Repository File Contents Cached</p>
            ) : (
              <p className="text-red-500 font-bold">
                Repository File Contents not Cached
              </p>
            )}
            {cache.has("generatedContent") ? (
              <p className="text-green-500">AI Output Cached</p>
            ) : (
              <p className="text-red-500 font-bold">AI Output not Cached</p>
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={generateDocumentation}>
              Generate Documentation
            </button>
            <button onClick={generateREADME}>Generate README</button>
            <button onClick={clearRepoContent}>Clear File Content cache</button>
            <button onClick={clearGenContent}>Clear AI output cache</button>
          </div>
        </div>
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
