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
    selectedItems,
    results,
    cache,
    setCache,
    repoFileContentArray,
    setRepoFileContentArray,
  } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>(
    cache.get("generatedContent") || ""
  );
  const [modelTemperature, setModelTemperature] = useState<number>(0);
  const [autoPullRequest, setAutoPullRequest] = useState<boolean>(false);

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
          `/${item.repository.full_name}/contents/${item.path}`
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
    setError(null);
    if (!validateInitialState()) {
      setLoading(false);
      return;
    }
    var { repoFileContents, finalPrompt, generatedContent } = checkCache();

    if (repoFileContents == "") {
      let { fileContents, fileContentArray, errmsg } = await fetchFileContents(
        results
      );
      if (errmsg) {
        setError("Error fetching file content for: " + errmsg);
      }
      console.log("promptArray reset: ", fileContentArray);
      repoFileContents = fileContents;
      await setRepoFileContentArray(fileContentArray);
      cache.set("repoFileContents", repoFileContents);
    }

    console.log("repoFileContentArray after reset: ", repoFileContentArray);
    if (finalPrompt == "") {
      finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
      cache.set("finalPrompt", finalPrompt);
    }

    if (!finalPrompt) {
      setError("No content to generate README for.");
      setLoading(false);
      return;
    }

    if (generatedContent == "") {
      if (autoPullRequest) {
        console.log("Auto pull request enabled.");
        const systemInstruction = `You are an API agent. Your response will be consumed directly by code and parsed as a JSON object. Do not format your JSON output in markdown fence blocks. Do not include any explanations. Do not use code fences like \`\`\`json. Just return a raw JSON object.\nSubmit a pull request for a suggested README file for my code repository ${repository}. You do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;

        console.log(
          "repoFileContentArray before gen ai: ",
          repoFileContentArray
        );
        const genWithToolsResponse =
          await generateWithSystemInstructionConfigAndTools(
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          );

        console.log("genWithToolsResponse: ", genWithToolsResponse);
        console.log("genWithToolsResponse text: ", genWithToolsResponse.text);
        var pullRequestResult = "Error submitting pull request";
        // this is the built in function call from the api, usually dont work if context is too large
        if (genWithToolsResponse.functionCalls) {
          console.log("function calls: ", genWithToolsResponse.functionCalls);
          const tool_call = genWithToolsResponse.functionCalls[0];
          if (tool_call.name === "submit_pull_request" && tool_call.args) {
            pullRequestResult = await submitPullRequest(
              tool_call.args.filePath,
              tool_call.args.commitMessage,
              tool_call.args.branchName,
              tool_call.args.pullRequestTitle,
              tool_call.args.pullRequestBody,
              tool_call.args.fileContent
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
                parsedResponse.filePath,
                parsedResponse.commitMessage,
                parsedResponse.branchName,
                parsedResponse.pullRequestTitle,
                parsedResponse.pullRequestBody,
                parsedResponse.fileContent
              );
            } catch (error) {
              try {
                // try again after cleaning since the ai keeps wrapping in these tags
                const cleanJson = genWithToolsResponse.text
                  .replace(/```json|```$/g, "")
                  .trim();
                const parsedResponse: PullRequestArgs = JSON.parse(cleanJson);
                console.log("parsed response after cleaning: ", parsedResponse);
                pullRequestResult = await submitPullRequest(
                  parsedResponse.filePath,
                  parsedResponse.commitMessage,
                  parsedResponse.branchName,
                  parsedResponse.pullRequestTitle,
                  parsedResponse.pullRequestBody,
                  parsedResponse.fileContent
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
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          )) || "";
      }

      cache.set("generatedContent", generatedContent);
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
      generatedContent =
        (await generateContentWithConfig(finalPrompt, {
          temperature: modelTemperature,
        })) || "Error generating content";
      cache.set("generatedContent", generatedContent);
    } else {
      generatedContent = cache.get("generatedContent") || "";
    }

    setOutput(generatedContent);
    setLoading(false);
  };

  const submitPullRequest = async (
    filePath: string,
    commitMessage: string,
    branchName: string,
    pullRequestTitle: string,
    pullRequestBody: string,
    fileContent: string
  ): Promise<string> => {
    console.log("Submitting pull request...");
    if (fileContent == "") {
      if (output == "") {
        setError("No content to submit for pull request.");
        return "No content to submit for pull request.";
      }
      fileContent = output;
    }
    if (!filePath || filePath == "") {
      console.log("Default file path used as no file path provided.");
      setError(
        "Default file path used as no file path provided for pull request."
      );
      filePath = "README.md";
    }
    if (!commitMessage || commitMessage == "") {
      console.log("Default commit message used as no commit message provided.");
      setError("Default commit message used as no commit message provided.");
      commitMessage = "Generated README from github search saas";
    }
    if (!branchName || branchName == "") {
      console.log("Default branch name used as no branch name provided.");
      setError("Default branch name used as no branch name provided.");
      branchName = "generated-readme";
    } else {
      branchName = branchName.replace(/[^a-zA-Z0-9-_]/g, "-");
      console.log("branch name sanitized: ", branchName);
    }
    if (!pullRequestTitle || pullRequestTitle == "") {
      console.log(
        "Default pull request title used as no pull request title provided."
      );
      setError(
        "Default pull request title used as no pull request title provided."
      );
      pullRequestTitle = "Generated README";
    }
    if (!pullRequestBody || pullRequestBody == "") {
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
        `/${username}/${repository}`
      );
      const defaultBranch = defaultBranchResponse.data.default_branch;
      console.log("default branch of repo: ", defaultBranch);

      // get latest commit and tree
      const commitAndTreeResponse = await githubGetCodeApi.get(
        `/${username}/${repository}/branches/${defaultBranch}`
      );
      const oldCommit = commitAndTreeResponse.data.commit.sha;
      const oldTree = commitAndTreeResponse.data.commit.commit.tree.sha;
      console.log("previous commit and tree: ", oldCommit, oldTree);

      // create new tree with new file
      const newTreeResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/git/trees`,
        {
          base_tree: oldTree,
          tree: [
            {
              path: filePath,
              mode: "100644",
              type: "blob",
              content: fileContent,
            },
          ],
        }
      );
      const newTree = newTreeResponse.data.sha;

      // create new commit object
      const newCommitResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/git/commits`,
        {
          message: commitMessage,
          tree: newTree,
          parents: [oldCommit],
        }
      );
      const newCommit = newCommitResponse.data.sha;
      console.log("new commit: ", newCommit);

      // create new reference (branch) for the commit;
      const newBranchName = branchName + Date.now();
      const newReferenceResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/git/refs`,
        {
          ref: `refs/heads/${newBranchName}`,
          sha: newCommit,
        }
      );
      console.log("new reference: ", newReferenceResponse);

      //  '{"title":"Amazing new feature","body":"Please pull these awesome changes in!","head":"octocat:new-feature","base":"master"}'
      // create pull request
      const pullRequestResponse = await githubGetCodeApi.post(
        `/${username}/${repository}/pulls`,
        {
          title: pullRequestTitle,
          body: pullRequestBody,
          head: newBranchName,
          base: defaultBranch,
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
              <p className="text-green-500">
                Repository File Contents Cached {repoFileContentArray.length}
              </p>
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
          <div className="flex gap-4 items-center mb-2">
            <p>Auto Submit Pull Request?</p>
            <input
              type="checkbox"
              checked={autoPullRequest}
              onChange={(e) => setAutoPullRequest(e.target.checked)}
            />
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
              Download File Contents
            </button>
            <button
              onClick={() =>
                submitPullRequest(
                  "README.md",
                  "Generated README from github search saas",
                  "generated-readme",
                  "Generated README",
                  "This is a generated README from github search saas",
                  output
                )
              }
              className="!bg-green-800 !p-2"
            >
              Submit Pull Request with the output below
            </button>
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
