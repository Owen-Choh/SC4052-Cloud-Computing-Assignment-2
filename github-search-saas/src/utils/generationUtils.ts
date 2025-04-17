import { FileObjWithExplaination, generateContentWithConfig, generateWithPullRequestDeclaration, generateWithSystemInstructionAndConfig, generateWithTools, parseFileObjectFunctionDeclaration, PullRequestArgs } from "../geminiAPI/geminiAPI";
import { fetchFileContents, submitPullRequest } from "./apiUtils";
import { checkCache } from "./cacheUtils";
import { stripCodeFences } from "./utils";

export const generateREADME = async (
  setLoading: Function,
  setLoadingMessage: Function,
  setError: Function,
  validateInitialState: Function,
  cache: Map<string, string>,
  results: any[],
  username: string,
  repository: string,
  token: string,
  geminiApiKey: string,
  modelTemperature: number,
  autoPullRequestReadme: boolean,
  setOutput: Function,
  setRepoFileContentMap: Function
) => {
  setLoading(true);
  setLoadingMessage("Validating initial state...");
  setError(null);

  if (!validateInitialState()) {
    setLoading(false);
    setLoadingMessage("");
    return;
  }

  setLoadingMessage("Checking cache...");
  let { repoFileContents, finalPrompt, generatedContent } = checkCache(cache);

  if (repoFileContents === "") {
    setLoadingMessage("Fetching file contents, please remain patient...");
    const { fileContents, fileContentMap, errmsg } = await fetchFileContents(results, geminiApiKey);
    if (errmsg) {
      setError("Error fetching file content for: " + errmsg);
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    repoFileContents = fileContents;
    setRepoFileContentMap(fileContentMap);
    cache.set("repoFileContents", repoFileContents);
  }

  if (finalPrompt === "") {
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

      const genWithToolsResponse = await generateWithPullRequestDeclaration(
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
      var errmsg = "";

      setLoadingMessage("Submitting pull request...");
      // this is the built in function call from the api, usually dont work if context is too large
      if (genWithToolsResponse.functionCalls) {
        console.log("function calls: ", genWithToolsResponse.functionCalls);
        const tool_call = genWithToolsResponse.functionCalls[0];
        if (tool_call.name === "submit_pull_request" && tool_call.args) {
          ({ result: pullRequestResult, errmsg } = await submitPullRequest(
            username,
            repository,
            token,
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
          ));
        }
      } else {
        if (genWithToolsResponse.text && genWithToolsResponse.text != "") {
          // try to parse the response as a json object (specified in the system instruction) and call the function
          try {
            const parsedResponse: PullRequestArgs = JSON.parse(
              genWithToolsResponse.text
            );
            parsedResponse.fileContent = stripCodeFences(
              parsedResponse.fileContent);
            console.log("parsed response: ", parsedResponse);
            ({ result: pullRequestResult, errmsg } = await submitPullRequest(
              username,
              repository,
              token,
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
            ));
            generatedContent =
              pullRequestResult + "\n" + genWithToolsResponse.text;
          } catch (error) {
            try {
              // try again after cleaning since the ai keeps wrapping in these tags
              const cleanJson = genWithToolsResponse.text
                .replace(/```json|```$/g, "")
                .trim();
              const parsedResponse: PullRequestArgs = JSON.parse(cleanJson);
              parsedResponse.fileContent = stripCodeFences(
                parsedResponse.fileContent);
              console.log("parsed response after cleaning: ", parsedResponse);
              ({ result: pullRequestResult, errmsg } = await submitPullRequest(
                username,
                repository,
                token,
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
              ));
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
      setError(errmsg);
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

export const generateDocumentation = async (
  setLoading: Function,
  setLoadingMessage: Function,
  setError: Function,
  validateInitialState: Function,
  cache: Map<string, string>,
  results: any[],
  repository: string,
  token: string,
  geminiApiKey: string,
  modelTemperature: number,
  setOutput: Function
) => {
  setLoading(true);
  setLoadingMessage("Validating initial state...");
  setError(null);

  if (!validateInitialState()) {
    setLoading(false);
    setLoadingMessage("");
    return;
  }

  setLoadingMessage("Checking cache...");
  let { repoFileContents, finalPrompt, generatedContent } = checkCache(cache);

  if (repoFileContents === "") {
    setLoadingMessage("Fetching file contents, please remain patient...");
    const { fileContents, errmsg } = await fetchFileContents(results, token);
    if (errmsg) {
      setError("Error fetching file content for: " + errmsg);
      setLoading(false);
      setLoadingMessage("");
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

  if (!finalPrompt) {
    setError("No content to generate documentation for.");
    setLoading(false);
    setLoadingMessage("");
    return;
  }

  if (generatedContent == "") {
    setLoadingMessage("Generating documentation...");
    generatedContent =
      (await generateContentWithConfig(
        geminiApiKey,
        finalPrompt,
        { temperature: modelTemperature }
      )) || "Error generating content";
    cache.set("generatedContent", generatedContent);
  }

  setOutput(generatedContent);
  setLoading(false);
  setLoadingMessage("");
};

export const generateCommentsAndSendPullRequest = async (
  setLoading: Function,
  setLoadingMessage: Function,
  setError: Function,
  validateInitialState: Function,
  cache: Map<string, string>,
  results: any[],
  username: string,
  repository: string,
  token: string,
  geminiApiKey: string,
  modelTemperature: number,
  autoPullRequestComments: boolean,
  repoFileContentMap: Map<string, string>,
  setRepoFileContentMap: Function,
  selectedItems: any[],
  setOutput: Function,
) => {
  setLoading(true);
  setLoadingMessage("Validating initial state...");
  setError(null);

  if (!validateInitialState()) {
    setLoading(false);
    setLoadingMessage("");
    return;
  }

  if (!selectedItems || selectedItems.length === 0) {
    setError("No files selected. Please select some files first.");
    setLoading(false);
    setLoadingMessage("");
    return;
  }

  setLoadingMessage("Checking cache...");
  let { repoFileContents, finalPrompt } = checkCache(cache);

  if (repoFileContents === "") {
    setLoadingMessage("Fetching file contents, please remain patient...");
    const { fileContents, fileContentMap, errmsg } = await fetchFileContents(results, token);
    if (errmsg) {
      setError("Error fetching file content: " + errmsg);
      setLoading(false);
      setLoadingMessage("");
      return;
    }
    repoFileContentMap = new Map<string, string>(
      [...repoFileContentMap, ...fileContentMap]
    );
    setRepoFileContentMap(repoFileContentMap);
    cache.set("repoFileContents", fileContents);
  }

  if (finalPrompt === "") {
    setLoadingMessage("Preparing final prompt...");
    finalPrompt = `These are the contents of the files in the repository\n\n${repoFileContents}`;
    cache.set("finalPrompt", finalPrompt);
  }

  setLoadingMessage("Processing selected files...");
  const outputs: { filePath: string; fileContent: string; explain: string }[] = [];
  var failedOutputs: string[] = [];

  for (const file of selectedItems) {
    setLoadingMessage(`Processing ${file.path}...`);
    try {
      const systemInstruction = `You are an API agent. Your response will be consumed directly by code and parsed as a JSON object. Just return a raw JSON object. Help me make sure that the code ${file.path} is well documented.\n\n${repoFileContentMap.get(file.path)}`;

      const generatedResponse = await generateWithTools(
        geminiApiKey,
        systemInstruction,
        [],
        finalPrompt,
        { temperature: modelTemperature },
        parseFileObjectFunctionDeclaration,
      );
      const generatedContent = generatedResponse.text || "Error generating content";
      console.log("generatedResponse: ", generatedContent);

      if (generatedContent !== "none" && generatedContent !== "" &&
        generatedContent !== "Error generating content") {
        const cleanedContent = stripCodeFences(generatedContent);
        var parsedContent: FileObjWithExplaination;
        try {
          parsedContent
            = JSON.parse(cleanedContent);
          parsedContent.fileContent = stripCodeFences(parsedContent.fileContent);
        } catch (error) {
          try {
            console.error(error);
            console.log(
              "Error parsing generated content, trying again after removing extra new lines..."
            );
            const removedExtraNewlines = cleanedContent.replace(/\n/g, "");
            parsedContent = JSON.parse(removedExtraNewlines);
            parsedContent.fileContent = stripCodeFences(parsedContent.fileContent);
          } catch (error) {
            console.error("Error parsing generated content:", error);
            failedOutputs.push(file.path + "\n\n" + cleanedContent);
            continue; // Skip this file if parsing fails
          }
        }

        if (parsedContent.fileContent && parsedContent.fileContent !== "none" && !parsedContent.explain.startsWith("No changes needed.")) {
          outputs.push({
            filePath: file.path,
            fileContent: parsedContent.fileContent,
            explain: parsedContent.explain,
          });
        } else {
          console.log(
            `No changes needed after removing code fences for ${file.path}`
          );
          console.log("parsedContent: ", parsedContent);
        }
      } else {
        console.log(`No generated content for ${file.path}`);
        failedOutputs.push("No generated content for:" + file.path + "\n\n" + generatedContent);
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
      failedOutputs.push(`Error processing file ${file.path}:`, error as string);
    }
  }

  if (outputs.length > 0) {
    if (autoPullRequestComments) {
      console.log("Auto pull request enabled.");
      setLoadingMessage("Submitting pull request...");

      const explanations = outputs.map((output) => {
        return output.filePath + "\n" + output.explain;
      });
      explanations.join("\n\n");
      const pullRequestBody = `These are the generated comments from github search saas. The following files were updated:\n\n${explanations}`;

      const pullRequestResult = await submitPullRequest(
        username,
        repository,
        token,
        outputs,
        "Generated comments",
        "generated-comments",
        "Generated comments",
        pullRequestBody
      );

      const outputArray: string = JSON.stringify(outputs, null, 2);

      var finalOutput: string = `Pull request result: ${pullRequestResult.result}\n\nGenerated comments:\n${outputArray}`;
      if (failedOutputs.length > 0) {
        finalOutput += `\n\nFailed outputs:\n${failedOutputs.join("\n\n")}`;
        setError(`There are ${failedOutputs.length} files that are skipped by the ai. The content will still be listed in the output.` + pullRequestResult.errmsg);
      } else {
        setError(pullRequestResult.errmsg);
      }

      setOutput(finalOutput);
      cache.set("generatedContent", finalOutput);
    } else {
      const outputArray: string = JSON.stringify(outputs, null, 2);
      cache.set("generatedContent", outputArray);
      setOutput(outputArray);
    }
  } else {
    setOutput("No output generated.");
  }

  setLoading(false);
  setLoadingMessage("");
};
