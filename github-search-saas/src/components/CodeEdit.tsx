import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubGetCodeApi } from "../api/apiconfigs";
import {
  generateContentWithConfig,
  generateWithSystemInstructionAndConfig,
  generateWithSystemInstructionConfigAndTools,
} from "../geminiAPI/geminiAPI";
import { Slider } from "@mui/material";

const CodeEdit: React.FC = () => {
  const { username, repository, selectedItems, results, cache, setCache } =
    useGithubContext();

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

    if (generatedContent == "") {
      if (autoPullRequest) {
        console.log("Auto pull request enabled.");
        const systemInstruction = `Submit a pull request for a suggested README file for this code repository ${repository}.\nFormat the README using standard Markdown syntax for text styling. Avoid using code blocks unless displaying code.\nYou do not need to include the code directly in the README, you may chose to include the file path if required.\nWrite the README in a way that is easy to understand for a beginner.\nInclude a short description of what the repository contains, an overview of the code, architecture (if applicable) and how to set up and use it.\nAlso include brief notes that the reader should look out for when using the repository such as not commiting their env file.`;
        
        const genWithToolsResponse =
          await generateWithSystemInstructionConfigAndTools(
            systemInstruction,
            finalPrompt,
            {
              temperature: modelTemperature,
            }
          );
        console.log("genWithToolsResponse: ", genWithToolsResponse);
        if (genWithToolsResponse.functionCalls) {
          console.log("function calls: ", genWithToolsResponse.functionCalls);
          const tool_call = genWithToolsResponse.functionCalls[0];
          if (tool_call.name === "submit_pull_request" && tool_call.args) {
            const result = submitPullRequest(
              tool_call.args.filePath,
              tool_call.args.commitMessage,
              tool_call.args.branchName,
              tool_call.args.pullRequestTitle,
              tool_call.args.pullRequestBody,
              tool_call.args.fileContent
            );
          }
        }
        generatedContent = genWithToolsResponse.text || "";
      } else {
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

  const submitPullRequest = async (
    filePath: string,
    commitMessage: string,
    branchName: string,
    pullRequestTitle: string,
    pullRequestBody: string,
    fileContent: string
  ) => {
    console.log("Submitting pull request...");
    if (fileContent == "") {
      if (output == "") {
        setError("No content to submit for pull request.");
        return;
      }
      fileContent = output;
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
              onClick={downloadOutput}
              disabled={!output}
              className="!p-2"
            >
              Download
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
              Submit Pull Request
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
