import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubGetCodeApi } from "../api/apiconfigs";
import {
  defaultGenerationConfig,
  generateContentWithConfig,
  generateWithSystemInstructionAndConfig,
  generateWithSystemInstructionConfigAndTools,
  generateWithTools,
  PullRequestArgs,
} from "../geminiAPI/geminiAPI";
import { Slider } from "@mui/material";

const CodeEdit: React.FC = () => {
  const {
    username,
    repository,
    token,
    selectedItems,
    results,
    resultsFromRepo,
    cache,
    setCache,
    repoFileContentArray,
    setRepoFileContentArray,
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
  const [minimizedCache, setMinimizedCache] = useState<boolean>(false);
  const toggleMinimizedCache = () => {
    setMinimizedCache(!minimizedCache);
  };
  const clearGenContent = () => {
    cache.delete("generatedContent");
    cache.delete("finalPrompt");
    setOutput("");
    console.log("Cache size: ", cache.size);
  };
  const clearRepoContent = () => {
    cache.delete("repoFileContents");
    setRepoFileContentArray([]);
    setOutput("");
    console.log("Cache: ", cache);
  };

  const downloadOutput = (
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

  const stripCodeFences = (content: string): string => {
    return content
      .replace(/^```[\w]*\s*/i, "") // Remove opening fence and optional language tag
      .replace(/```$/, "") // Remove closing fence
      .trim();
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
  ): Promise<{
    fileContents: string;
    fileContentArray: string[];
    errmsg: string;
  }> => {
    var fileContents = "";
    var fileContentArray: string[] = [];
    var errmsg = "";
    for (const item of results) {
      try {
        const response = await githubGetCodeApi.get(
          `/${item.repository.full_name}/contents/${item.path}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fileContent = atob(response.data.content);
        fileContents += item.path + "\n" + fileContent + "\n\n";
        fileContentArray.push(item.path + "\n" + fileContent);
      } catch (error) {
        console.error(`Error fetching file content for ${item.path}: ${error}`);
        errmsg += item.path + "; ";
      }
    }

    console.log("fileContentArray fetched: ", fileContentArray);
    return { fileContents, fileContentArray, errmsg };
  };

  const generateREADME = async () => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents...");
      let { fileContents, fileContentArray, errmsg } = await fetchFileContents(
        results
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentArray);
      repoFileContents = fileContents;
      await setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentArray after reset: ", repoFileContentArray);
    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (!finalPrompt) {
      setError("No content to generate README for.");
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    if (generatedContent == "") {
      setLoadingMessage("Generating README...");
      if (autoPullRequestReadme) {
        console.log("Auto pull request enabled.");
        const systemInstruction = `You are an API agent. Your response will be consumed directly by code and parsed as a JSON object. Do not format your JSON output in markdown fence blocks. Do not include any explanations. Do not use code fences like \`\`\`json. Just return a raw JSON object.\nSubmit a pull request for a suggested README file for my code repository ${repository}. You do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;

        console.log(
          "repoFileContentArray before gen ai: ",
          repoFileContentArray
        );
        const genWithToolsResponse =
          await generateWithSystemInstructionConfigAndTools(
            geminiApiKey,
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          );

        console.log("genWithToolsResponse: ", genWithToolsResponse);
        console.log("genWithToolsResponse text: ", genWithToolsResponse.text);
        var pullRequestResult = "Error submitting pull request";

        setLoadingMessage("Submitting pull request...");
        // this is the built in function call from the api, usually dont work if context is too large
        if (genWithToolsResponse.functionCalls) {
          console.log("function calls: ", genWithToolsResponse.functionCalls);
          const tool_call = genWithToolsResponse.functionCalls[0];
          if (tool_call.name === "submit_pull_request" && tool_call.args) {
            pullRequestResult = await submitPullRequest(
              [
                {
                  filePath: tool_call.args.filePath as string,
                  fileContent: tool_call.args.fileContent as string,
                },
              ],
              tool_call.args.commitMessage as string,
              tool_call.args.branchName as string,
              tool_call.args.pullRequestTitle as string,
              tool_call.args.pullRequestBody as string
            );
          }
        } else {
          if (genWithToolsResponse.text && genWithToolsResponse.text != "") {
            // try to parse the response as a json object (specified in the system instruction) and call the function
            try {
              const parsedResponse: PullRequestArgs = JSON.parse(
                genWithToolsResponse.text
              );
              console.log("parsed response: ", parsedResponse);
              pullRequestResult = await submitPullRequest(
                [
                  {
                    filePath: parsedResponse.filePath,
                    fileContent: parsedResponse.fileContent,
                  },
                ],
                parsedResponse.commitMessage,
                parsedResponse.branchName,
                parsedResponse.pullRequestTitle,
                parsedResponse.pullRequestBody
              );
              generatedContent =
                pullRequestResult + "\n" + genWithToolsResponse.text;
            } catch (error) {
              try {
                // try again after cleaning since the ai keeps wrapping in these tags
                const cleanJson = genWithToolsResponse.text
                  .replace(/```json|```$/g, "")
                  .trim();
                const parsedResponse: PullRequestArgs = JSON.parse(cleanJson);
                console.log("parsed response after cleaning: ", parsedResponse);
                pullRequestResult = await submitPullRequest(
                  [
                    {
                      filePath: parsedResponse.filePath,
                      fileContent: parsedResponse.fileContent,
                    },
                  ],
                  parsedResponse.commitMessage,
                  parsedResponse.branchName,
                  parsedResponse.pullRequestTitle,
                  parsedResponse.pullRequestBody
                );
                console.log(pullRequestResult);
                generatedContent =
                  pullRequestResult + "\n" + genWithToolsResponse.text;
              } catch (error) {
                console.error("Error parsing response: ", error);
              }
            }
          } else {
            generatedContent = genWithToolsResponse.text || "";
          }
        }
      } else {
        // if auto pull request is not enabled, just generate the readme and put it on the UI
        const systemInstruction = `Generate a README for the code repository ${repository}, only return the contents of the README.\nFormat the README using standard Markdown syntax for text styling. Avoid using code blocks unless displaying code.\nYou do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;

        generatedContent =
          (await generateWithSystemInstructionAndConfig(
            geminiApiKey,
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          )) || "";
      }
    }

    cache.set("generatedContent", generatedContent);
    setOutput(generatedContent);
    setLoading(false);
    setLoadingMessage("");
  };

  const generateDocumentation = async () => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents...");
      const { fileContents, errmsg } = await fetchFileContents(results);
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      repoFileContents = fileContents;
      cache.set("repoFileContents", repoFileContents);
    }

    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `Generate documentation for the repository ${repository} with the following code. For conciseness, you do not need to include the code directly in the documentation, you may chose to include the file path if required. Write the documentation in a way that is easy to understand for a beginner. The documentation should use markdown styling, do not wrap your entire output in markdown tags. The documentation should be split into two sections: how-to guides and reference guides. Try to be detailed for the reference guide. Also include notes for anything the reader should look out for\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    console.log(finalPrompt);
    if (!finalPrompt) {
      setError("No content to generate documentation for.");
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    var generatedContent = "";
    if (!cache.has("generatedContent")) {
      setLoadingMessage("Generating documentation...");
      generatedContent =
        (await generateContentWithConfig(geminiApiKey, finalPrompt, {
          temperature: modelTemperature,
        })) || "Error generating content";
      cache.set("generatedContent", generatedContent);
    } else {
      generatedContent = cache.get("generatedContent") || "";
    }

    setOutput(generatedContent);
    setLoading(false);
    setLoadingMessage("");
  };

  const generateCommentsAndSendPullRequest = async (selectedFiles: any[]) => {
    setLoading(true);
    setLoadingMessage("Validating initial state...");
    setError(null);

    if (!validateInitialState()) {
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    setLoadingMessage("Checking cache...");
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents...");
      let { fileContents, fileContentArray, errmsg } = await fetchFileContents(
        results
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentArray);
      repoFileContents = fileContents;
      await setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentArray after reset: ", repoFileContentArray);
    if (finalPrompt == "") {
      setLoadingMessage("Preparing final prompt...");
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (generatedContent != "") {
      setLoading(false);
      setLoadingMessage("");
    }

    setLoadingMessage("Validating input files...");
    if (
      !selectedFiles ||
      !Array.isArray(selectedFiles) ||
      selectedFiles.length == 0
    ) {
      setError("No files selected. Please select some files first.");
      setLoading(false);
      setLoadingMessage("");
      return;
    }

    setLoadingMessage("Processing selected files...");
    const outputs: { filePath: string; fileContent: string }[] = []; // Array to store outputs for each file

    for (const file of selectedFiles) {
      setLoadingMessage(`Processing ${file.path}...`);
      try {
        const systemInstruction = `Help me make sure that the code ${file.path} is well documented. Give me the full updated file only if comments in the file need changes. Return "none" if no changes are needed. Your output will be parsed by code and will not be seen by users. Do not wrap your output in markdown tags.`;

        const generatedContent =
          (await generateWithSystemInstructionAndConfig(
            geminiApiKey,
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          )) || "Error generating content";

        if (
          generatedContent !== "none" &&
          generatedContent !== "" &&
          generatedContent !== "Error generating content"
        ) {
          const cleanedContent = stripCodeFences(generatedContent);
          if (cleanedContent !== "") {
            outputs.push({
              filePath: file.path,
              fileContent: cleanedContent,
            });
          } else {
            console.log(
              `No changes needed after removing code fences for ${file.path}`
            );
          }
        } else {
          console.log(`No generated content for ${file.path}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.path}:`, error);
        outputs.push({
          filePath: file.path,
          fileContent: "Error generating content",
        });
      }
    }

    if (outputs.length > 0) {
      if (autoPullRequestComments) {
        const pullRequestResult = submitPullRequest(
          outputs,
          "Generated comments",
          "generated-comments",
          "Generated comments",
          "These are the generated comments from github search saas"
        );

        const outputArray: string = JSON.stringify(outputs, null, 2);
        const finalOutput: string = `Pull request result: ${pullRequestResult}\n\nGenerated comments:\n${outputArray}`;
        cache.set("generatedContent", finalOutput);
        setOutput(finalOutput);
      } else {
        const outputArray: string = JSON.stringify(outputs, null, 2);
        cache.set("generatedContent", outputArray);
        setOutput(outputArray);
      }
    } else {
      setOutput("No output generated.");
    }

    console.log("Generated outputs:", outputs);
    setLoading(false);
    setLoadingMessage("");
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
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents...");
      let { fileContents, fileContentArray, errmsg } = await fetchFileContents(
        results
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentArray);
      repoFileContents = fileContents;
      await setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentArray after reset: ", repoFileContentArray);
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
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      setLoadingMessage("Fetching file contents...");
      let { fileContents, fileContentArray, errmsg } = await fetchFileContents(
        results
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
        return;
      }
      console.log("promptArray reset: ", fileContentArray);
      repoFileContents = fileContents;
      await setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentArray after reset: ", repoFileContentArray);
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

  const submitPullRequest = async (
    files: { filePath: string; fileContent: string }[],
    commitMessage: string,
    branchName: string,
    pullRequestTitle: string,
    pullRequestBody: string
  ): Promise<string> => {
    console.log("Submitting pull request...");
    if (!files || files.length === 0) {
      if (output === "") {
        setError("No content to submit for pull request.");
        return "No content to submit for pull request.";
      }
      files = [{ filePath: "README.md", fileContent: output }];
    }
    if (files.some((file) => !file.filePath || !file.fileContent)) {
      console.log("File paths or file contents are empty.");
      setError("File paths or file contents are empty.");
      return "File paths or file contents are empty.";
    }
    if (commitMessage === "") {
      console.log("Default commit message used as no commit message provided.");
      setError("Default commit message used as no commit message provided.");
      commitMessage = "Generated README from github search saas";
    }
    branchName = branchName.replace(/[^a-zA-Z0-9-_]/g, "-");
    console.log("branch name sanitized: ", branchName);
    if (!branchName || branchName === "") {
      console.log(
        "Default branch name used as no branch name after sanitizing."
      );
      setError("Default branch name used as no branch name after sanitizing.");
      branchName = "generated-readme";
    }
    if (!pullRequestTitle || pullRequestTitle === "") {
      console.log(
        "Default pull request title used as no pull request title provided."
      );
      setError(
        "Default pull request title used as no pull request title provided."
      );
      pullRequestTitle = "Generated README";
    }
    if (!pullRequestBody || pullRequestBody === "") {
      console.log(
        "Default pull request body used as no pull request body provided."
      );
      setError(
        "Default pull request body used as no pull request body provided."
      );
      pullRequestBody = "This is a generated README from github search saas";
    }

    try {
      // get default branch
      const defaultBranchResponse = await githubGetCodeApi.get(
        `/${username}/${repository}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const defaultBranch = defaultBranchResponse.data.default_branch;
      console.log("default branch of repo: ", defaultBranch);

      // get latest commit and tree
      const commitAndTreeResponse = await githubGetCodeApi.get(
        `/${username}/${repository}/branches/${defaultBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const oldCommit = commitAndTreeResponse.data.commit.sha;
      const oldTree = commitAndTreeResponse.data.commit.commit.tree.sha;
      console.log("previous commit and tree: ", oldCommit, oldTree);

      let newTree = oldTree;
      let newCommit = oldCommit;

      // loop through files to create commits
      for (const { filePath, fileContent } of files) {
        // Create new tree with new file
        const newTreeResponse = await githubGetCodeApi.post(
          `/${username}/${repository}/git/trees`,
          {
            base_tree: newTree,
            tree: [
              {
                path: filePath,
                mode: "100644",
                type: "blob",
                content: fileContent,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        newTree = newTreeResponse.data.sha;
      }
      // Create new commit object
      const newCommitResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/git/commits`,
        {
          message: commitMessage,
          tree: newTree,
          parents: [newCommit],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      newCommit = newCommitResponse.data.sha;
      console.log("new commit: ", newCommit);

      // Create new reference (branch) for the commit
      const newBranchName = branchName + Date.now();
      const newReferenceResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/git/refs`,
        {
          ref: `refs/heads/${newBranchName}`,
          sha: newCommit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("new reference: ", newReferenceResponse);

      // create pull request
      const pullRequestResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/pulls`,
        {
          title: pullRequestTitle,
          body: pullRequestBody,
          head: newBranchName,
          base: defaultBranch,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("pull request response: ", pullRequestResponse);
      return "Pull request submitted successfully!";
    } catch (error) {
      console.error("Error submitting pull request: ", error);
      return "Error submitting pull request: " + error;
    }
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
                  onClick={generateDocumentation}
                  className="w-fit !bg-blue-900"
                >
                  Generate Documentation
                </button>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={generateREADME}
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
                      generateCommentsAndSendPullRequest(selectedItems)
                    }
                    className="w-fit !bg-green-900"
                  >
                    Generate Comments for all selected files
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
                    Repository File Contents Cached{" "}
                    {repoFileContentArray.length} from {resultsFromRepo}
                  </p>
                  <button onClick={clearRepoContent}>
                    Clear File Content cache
                  </button>
                </div>
              ) : (
                <p className="text-red-500 font-bold">
                  Repository File Contents not Cached
                </p>
              )}
              {cache.has("generatedContent") ? (
                <div className="flex  items-center gap-4">
                  <p className="text-green-500">
                    AI Output Cached
                    <br />
                    Clear this to regenerate output
                  </p>
                  <button onClick={clearGenContent}>
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
            <button
              onClick={() => {
                var filepath = "README.md";
                if (selectedFilePath != "") {
                  filepath = selectedFilePath.replace(/[^a-zA-Z0-9-_/.]/g, "-");
                }
                submitPullRequest(
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
              className="w-1/4"
              value={selectedFilePath}
              onChange={(e) => setSelectedFilePath(e.target.value)}
            />
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
