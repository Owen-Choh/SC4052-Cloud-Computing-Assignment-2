import { githubGetCodeApi, GITHUB_TOKEN } from "../api/apiconfigs";

export const fetchFileContents = async (results: any[], token: string): Promise<{
  fileContents: string;
  fileContentMap: Map<string, string>;
  errmsg: string;
}> => {
  let fileContents = "";
  let fileContentMap = new Map<string, string>();
  let errmsg = "";

  for (const item of results) {
    try {
      const response = await githubGetCodeApi.get(
        `/${item.repository.full_name}/contents/${item.path}`,
        {
          headers: {
            Authorization: `Bearer ${token || GITHUB_TOKEN}`,
          },
        }
      );
      const fileContent = atob(response.data.content);
      fileContents += item.path + "\n" + fileContent + "\n\n";
      fileContentMap.set(item.path, fileContent);
    } catch (error) {
      console.error(`Error fetching file content for ${item.path}: ${error}`);
      errmsg += item.path + "; ";
    }
  }

  return { fileContents, fileContentMap, errmsg };
};

// submits pull request, will throw an error if api call fails
export const submitPullRequest = async (
  username: string,
  repository: string,
  token: string,
  files: { filePath: string; fileContent: string }[],
  commitMessage: string,
  branchName: string,
  pullRequestTitle: string,
  pullRequestBody: string
): Promise<{ result: string, errmsg: string }> => {
  var errmessage = "";
  console.log("Checking pull request parameters...");
  if (!files || files.length === 0) {
    return { result: "pull request aborted", errmsg: "error: no content to submit for pull request" };
  }
  if (files.some((file) => !file.filePath || !file.fileContent)) {
    return { result: "pull request aborted", errmsg: "error: file paths or file contents are empty" };
  }
  if (commitMessage === "") {
    console.log("Default commit message used as no commit message provided.");
    commitMessage = "Default commit message from github search saas";
    errmessage += "error: default commit message used as no commit message provided\n";
  }
  branchName = branchName.replace(/[^a-zA-Z0-9-_]/g, "-");
  console.log("branch name sanitized: ", branchName);
  if (!branchName || branchName === "") {
    console.log(
      "Default branch name used as no branch name after sanitizing."
    );
    branchName = "default-branch-name";
    errmessage += "error: default branch name used as no branch name after sanitizing\n";
  }
  if (!pullRequestTitle || pullRequestTitle === "") {
    console.log(
      "Default pull request title used as no pull request title provided."
    );
    errmessage +=
      "error: default pull request title used as no pull request title provided\n";
    pullRequestTitle = "Generated output from github search saas";
  }
  if (!pullRequestBody || pullRequestBody === "") {
    console.log(
      "Default pull request body used as no pull request body provided."
    );
    errmessage +=
      "error: default pull request body used as no pull request body provided\n"
      ;
    pullRequestBody = "This is the generated output from github search saas";
  }

  try {
    const defaultBranchResponse = await githubGetCodeApi.get(
      `/${username}/${repository}`,
      {
        headers: {
          Authorization: `Bearer ${token || GITHUB_TOKEN}`,
        },
      }
    );
    const defaultBranch = defaultBranchResponse.data.default_branch;

    const commitAndTreeResponse = await githubGetCodeApi.get(
      `/${username}/${repository}/branches/${defaultBranch}`,
      {
        headers: {
          Authorization: `Bearer ${token || GITHUB_TOKEN}`,
        },
      }
    );
    const oldCommit = commitAndTreeResponse.data.commit.sha;
    const oldTree = commitAndTreeResponse.data.commit.commit.tree.sha;

    let newTree = oldTree;
    let newCommit = oldCommit;

    for (const { filePath, fileContent } of files) {
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
            Authorization: `Bearer ${token || GITHUB_TOKEN}`,
          },
        }
      );
      newTree = newTreeResponse.data.sha;
    }

    const newCommitResponse = await githubGetCodeApi.post(
      `/${username}/${repository}/git/commits`,
      {
        message: commitMessage,
        tree: newTree,
        parents: [newCommit],
      },
      {
        headers: {
          Authorization: `Bearer ${token || GITHUB_TOKEN}`,
        },
      }
    );
    newCommit = newCommitResponse.data.sha;

    const newBranchName = branchName + Date.now();
    await githubGetCodeApi.post(
      `/${username}/${repository}/git/refs`,
      {
        ref: `refs/heads/${newBranchName}`,
        sha: newCommit,
      },
      {
        headers: {
          Authorization: `Bearer ${token || GITHUB_TOKEN}`,
        },
      }
    );

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
          Authorization: `Bearer ${token || GITHUB_TOKEN}`,
        },
      }
    );
    console.log("Pull request response: ", pullRequestResponse.data);

    return { result: "Pull request submitted successfully!", errmsg: errmessage };
  } catch (error) {
    console.error("Error submitting pull request: ", error);
    errmessage += "error: error when submitting pull request:" + error;
    return { result: "Pull request submission failed", errmsg: errmessage };
  }
};
