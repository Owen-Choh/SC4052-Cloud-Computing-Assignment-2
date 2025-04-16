import React, { useState } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { fetchFileContents, submitPullRequest } from "../utils/apiUtils";
import { stripCodeFences, downloadOutput } from "../utils/utils";
import {
  checkCache,
  clearGenContent,
  clearRepoContent,
} from "../utils/cacheUtils";
import {
  generateREADME,
  generateDocumentation,
  generateCommentsAndSendPullRequest,
} from "../utils/generationUtils";
import { generateWithSystemInstructionAndConfig } from "../geminiAPI/geminiAPI";
import { Slider } from "@mui/material";

const CodeEdit: React.FC = () => {
  const {
    username,
    repository,
    token,
    selectedItems,
    setSelectedItems,
    results,
    resultsFromRepo,
    cache,
    setCache,
    repoFileContentMap,
    setRepoFileContentMap,
    geminiApiKey,
  } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>(
    cache.get("generatedContent") || ""
  );
  const [modelTemperature, setModelTemperature] = useState<number>(0);
  const [autoPullRequestReadme, setAutoPullRequestReadme] =
    useState<boolean>(true);
  const [autoPullRequestComments, setAutoPullRequestComments] =
    useState<boolean>(true);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [minimizedCache, setMinimizedCache] = useState<boolean>(false);

  const toggleMinimizedCache = () => {
    setMinimizedCache(!minimizedCache);
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

  const checkComments = async (selectedFilePath: string) => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache(cache);

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents, please remain patient...");
      let { fileContents, fileContentMap, errmsg } = await fetchFileContents(
        results,
        token
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentMap);
      repoFileContents = fileContents;
      await setRepoFileContentMap(
        (prev) => new Map([...prev, ...fileContentMap])
      );
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentMap after reset: ", repoFileContentMap);
    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (generatedContent == "") {
      setLoadingMessage("Validating comments...");
      const systemInstruction = `Help me check the comments written for the code ${selectedFilePath} and make sure they are accurate. Give me the full updated file only if comments in the file needs changes. Otherwise just let me know that the comments are accurate.`;

      generatedContent =
        (await generateWithSystemInstructionAndConfig(
          geminiApiKey,
          systemInstruction,
          finalPrompt,
          {
            temperature: modelTemperature,
          }
        )) || "Error generating content";

      console.log("generatedContent: ", generatedContent);
      cache.set("generatedContent", generatedContent);
      setOutput(generatedContent);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const wellDocumented = async (selectedFilePath: string) => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache(cache);

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents, please remain patient...");
      let { fileContents, fileContentMap, errmsg } = await fetchFileContents(
        results,
        token
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentMap);
      repoFileContents = fileContents;
      await setRepoFileContentMap(
        (prev) => new Map([...prev, ...fileContentMap])
      );
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentMap after reset: ", repoFileContentMap);
    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (generatedContent == "") {
      setLoadingMessage("Validating documentation...");
      const systemInstruction = `Help me make sure that the code ${selectedFilePath} is well documented. Give me the full updated file only if comments in the file needs changes.`;

      generatedContent =
        (await generateWithSystemInstructionAndConfig(
          geminiApiKey,
          systemInstruction,
          finalPrompt,
          {
            temperature: modelTemperature,
          }
        )) || "Error generating content";

      console.log("generatedContent: ", generatedContent);
      cache.set("generatedContent", generatedContent);
      setOutput(generatedContent);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  const sendCustomPrompt = async () => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    if (customPrompt == "") {
      setError("Please enter a custom prompt.");
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache(cache);
    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents, please remain patient...");
      let { fileContents, fileContentMap, errmsg } = await fetchFileContents(
        results,
        token
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentMap);
      repoFileContents = fileContents;
      await setRepoFileContentMap(
        (prev) => new Map([...prev, ...fileContentMap])
      );
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentMap after reset: ", repoFileContentMap);
    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (generatedContent == "") {
      setLoadingMessage("Generating a response...");

      generatedContent =
        (await generateWithSystemInstructionAndConfig(
          geminiApiKey,
          customPrompt,
          finalPrompt,
          {
            temperature: modelTemperature,
          }
        )) || "Error generating content";

      console.log("generatedContent: ", generatedContent);
      cache.set("generatedContent", generatedContent);
      setOutput(generatedContent);
    }

    setLoading(false);
    setLoadingMessage("");
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-2xl">Extra functions</h2>
        {resultsFromRepo != repository && (
          <p className="text-xl font-bold text-red-500">
            Files loaded from search may not be up to date, please refresh the
            search in order to use this feature
          </p>
        )}
        <div className="flex gap-4 w-full">
          <p className="text-lg text-nowrap">
            Model Temperature (how much creativity/variation in the output):
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
        <div className="flex gap-4 w-full">
          <div>
            <p className="text-lg">Username: {username || "None selected"}</p>
            <div>
              <div className="flex flex-col gap-4 mb-2">
                <p className="text-lg">
                  Repository: {repository || "None selected"}
                </p>

                <button
                  onClick={() =>
                    generateDocumentation(
                      setLoading,
                      setLoadingMessage,
                      setError,
                      validateInitialState,
                      cache,
                      results,
                      repository,
                      token,
                      geminiApiKey,
                      modelTemperature,
                      setOutput
                    )
                  }
                  className="w-fit !bg-blue-900"
                >
                  Generate Documentation
                </button>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() =>
                      generateREADME(
                        setLoading,
                        setLoadingMessage,
                        setError,
                        validateInitialState,
                        cache,
                        results,
                        username,
                        repository,
                        token,
                        geminiApiKey,
                        modelTemperature,
                        autoPullRequestReadme,
                        setOutput,
                        setRepoFileContentMap
                      )
                    }
                    className="w-fit !bg-gray-600"
                  >
                    Generate README
                  </button>
                  <p>Auto Submit Pull Request?</p>
                  <input
                    type="checkbox"
                    checked={autoPullRequestReadme}
                    onChange={(e) => setAutoPullRequestReadme(e.target.checked)}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() =>
                      generateCommentsAndSendPullRequest(
                        setLoading,
                        setLoadingMessage,
                        setError,
                        validateInitialState,
                        cache,
                        results,
                        username,
                        repository,
                        token,
                        geminiApiKey,
                        modelTemperature,
                        autoPullRequestComments,
                        repoFileContentMap,
                        setRepoFileContentMap,
                        selectedItems,
                        setOutput
                      )
                    }
                    className="w-fit !bg-green-900"
                  >
                    Generate and Check Comments for all selected files
                  </button>
                  <p>Auto Submit Pull Request?</p>
                  <input
                    type="checkbox"
                    checked={autoPullRequestComments}
                    onChange={(e) =>
                      setAutoPullRequestComments(e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-col gap-2 w-1/3">
            <h3 className="text-lg gap-4 flex items-center">
              Processing Cache (makes generation faster){" "}
              <button
                onClick={toggleMinimizedCache}
                className="!p-1 !bg-blue-900"
              >
                {minimizedCache ? "Show" : "Hide"}
              </button>
            </h3>
            <div
              className={`flex flex-col gap-2 ${
                minimizedCache ? "hidden" : ""
              }`}
            >
              {cache.has("repoFileContents") ? (
                <div className="flex items-center gap-4">
                  <p className="text-green-500 max-w-1/2">
                    Repository File Contents Cached {repoFileContentMap.size}{" "}
                    from {resultsFromRepo}
                  </p>
                  <button
                    onClick={() =>
                      clearRepoContent(cache, setRepoFileContentMap, setOutput)
                    }
                  >
                    Clear File Content cache
                  </button>
                </div>
              ) : (
                <p className="text-red-500 font-bold">
                  Repository File Contents not Cached
                </p>
              )}
              {!loading &&
              (cache.has("generatedContent") || cache.has("finalPrompt")) ? (
                <div className="flex  items-center gap-4">
                  <p className="text-green-500">
                    AI Output Cached
                    <br />
                    Clear this to regenerate output
                  </p>
                  <button onClick={() => clearGenContent(cache, setOutput)}>
                    Clear AI output cache
                  </button>
                </div>
              ) : (
                <p className="text-red-500 font-bold">AI Output not Cached</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-lg">
          Selected Items:
          {selectedItems && selectedItems.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {selectedItems.map((item) => (
                <li key={item.sha} className="flex gap-2">
                  <p>{item.path}</p>
                  <button
                    onClick={() => checkComments(item.path)}
                    className="!text-base !bg-green-700"
                  >
                    Validate Comments
                  </button>
                  <button
                    onClick={() => wellDocumented(item.path)}
                    className="!text-base !bg-green-900"
                  >
                    "Well Documented" Code
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev.filter((prevItem) => prevItem !== item)
                      );
                    }}
                    className="!text-base !bg-red-900"
                  >
                    Deselect
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            " None selected"
          )}
        </div>
        {loading && (
          <p className="text-green-500">{loadingMessage || "Loading..."}</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        <div className="w-full">
          <div className="flex gap-4 items-center mb-2">
            <p>Output</p>
            <button
              onClick={() =>
                downloadOutput(output, "text/markdown", "output.md")
              }
              disabled={!output}
              className="!p-2"
            >
              Download Output
            </button>
            <button
              onClick={() =>
                downloadOutput(
                  cache.get("repoFileContents") || "",
                  "text/plain",
                  "Repository_File_Contents.txt"
                )
              }
              disabled={!cache.has("repoFileContents")}
              className="!p-2"
            >
              Download Cached File Contents
            </button>
            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={() => {
                  var filepath = "README.md";
                  if (selectedFilePath != "") {
                    filepath = selectedFilePath.replace(
                      /[^a-zA-Z0-9-_/.]/g,
                      "-"
                    );
                  }
                  submitPullRequest(
                    username,
                    repository,
                    token,
                    [{ filePath: filepath, fileContent: output }],
                    `Generated ${filepath} from github search saas`,
                    "generated-output",
                    "Generated output",
                    `This is the generated ${filepath} from github search saas`
                  );
                }}
                className="!bg-green-800 !p-2"
              >
                Submit Pull Request with the output below
              </button>
              <input
                type="text"
                placeholder="Filepath of pull request (Default: README.md)"
                className="w-full"
                value={selectedFilePath}
                onChange={(e) => setSelectedFilePath(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-center flex-grow">
              <button onClick={sendCustomPrompt} className="!bg-blue-900 !p-2">
                Send custom prompt with entire search result as context
              </button>
              <input
                type="text"
                placeholder="Custom prompt (e.g. Give me some descriptions to consider for this repository)"
                className="w-full"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </div>
          <textarea
            className="w-full h-64 border-gray-500 border-2 rounded-lg p-2"
            placeholder="Generated documentation will appear here..."
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CodeEdit;
