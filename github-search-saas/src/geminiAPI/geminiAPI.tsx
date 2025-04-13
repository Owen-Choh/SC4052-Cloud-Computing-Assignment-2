import { GEMINI_API_KEY } from "../api/apiconfigs";
import {
  GoogleGenAI,
  GenerateContentConfig,
  Type,
  FunctionCallingConfigMode,
} from "@google/genai";

const apiKey = GEMINI_API_KEY;
export const genAI = new GoogleGenAI({ apiKey: apiKey });

const defaultModel = "gemini-2.0-flash";

export const defaultGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function generateContent(prompt: string) {
  const result = await genAI.models.generateContent({
    model: defaultModel,
    config: defaultGenerationConfig,
    contents: prompt,
  });

  return result.text;
}

export async function generateContentWithConfig(
  prompt: string,
  config: GenerateContentConfig
) {
  const result = await genAI.models.generateContent({
    model: defaultModel,
    config: config,
    contents: prompt,
  });

  return result.text;
}

export async function generateWithSystemInstructionAndConfig(
  systemInstruction: string,
  prompt: string,
  config: GenerateContentConfig
) {
  const result = await genAI.models.generateContent({
    model: defaultModel,
    config: {
      ...config,
      systemInstruction: {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
    },
    contents: prompt,
  });

  return result.text;
}

export async function generateWithTools(
  systemInstruction: string,
  historyArr: string[],
  prompt: string,
  config: GenerateContentConfig
) {
  var mappedHistory;
  if (historyArr.length === 0) {
    mappedHistory = undefined;
  } else {
    mappedHistory = historyArr.map((p) => ({
      role: "user",
      parts: [{ text: p }],
    }));
  }
  console.log("mappedHistory", mappedHistory);
  const chat = genAI.chats.create({
    model: defaultModel,
    history: mappedHistory,
    config: {
      ...config,
      systemInstruction: {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      tools: [
        {
          functionDeclarations: [submitPullRequestFunctionDeclaration],
        },
      ],
    },
  });

  const result = await chat.sendMessage({
    message: prompt,
  });

  return result;
}

export async function generateWithSystemInstructionConfigAndTools(
  systemInstruction: string,
  prompt: string,
  config: GenerateContentConfig
) {
  let promptCopy = prompt;
  promptCopy = promptCopy.replace("```", "");

  const result = await genAI.models.generateContent({
    model: defaultModel,
    config: {
      ...config,
      systemInstruction: {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      tools: [
        {
          functionDeclarations: [submitPullRequestFunctionDeclaration],
        },
      ],
    },
    contents: promptCopy,
  });

  return result;
}

export const submitPullRequestFunctionDeclaration = {
  name: "submit_pull_request",
  description: "Submit a pull request to the repository.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      filePath: {
        type: Type.STRING,
        description: 'path of the file with file name, e.g. "README.md"',
      },
      commitMessage: {
        type: Type.STRING,
        description: "commit message of the change",
      },
      branchName: {
        type: Type.STRING,
        description: "branch name created for the pull request",
      },
      pullRequestTitle: {
        type: Type.STRING,
        description: "The title of the pull request.",
      },
      pullRequestBody: {
        type: Type.STRING,
        description: "The body of the pull request.",
      },
      fileContent: {
        type: Type.STRING,
        description: "The content of the file.",
      },
    },
    required: [
      "filePath",
      "commitMessage",
      "branchName",
      "pullRequestTitle",
      "pullRequestBody",
      "fileContent",
    ],
  },
};

export interface PullRequestArgs {
  filePath: string;
  commitMessage: string;
  branchName: string;
  pullRequestTitle: string;
  pullRequestBody: string;
  fileContent: string;
}
// function to parse the function call from the gemini api response.
// it kept returning a python print statement with the function call inside.
export const parsePythonFunctionOutput = (
  genWithToolsResponse: string
): PullRequestArgs => {
  if (
    genWithToolsResponse.startsWith("```\nprint(default_api") &&
    genWithToolsResponse.endsWith("```")
  ) {
    try {
      const functionCallString = genWithToolsResponse;

      // Regex to extract function name and arguments
      const functionCallRegex = /submit_pull_request\((.)+\)/;
      const functionCallLongRegex =
        /submit_pull_request\((.|[\n|\r])+\)(?=\)\n```$)/;
      const match1 = functionCallString.match(functionCallRegex);
      const match2 = functionCallString.match(functionCallLongRegex);
      // match is whichever is longer
      console.log("match1: ", match1);
      console.log("match2: ", match2);
      var match;
      if (match1 && match2) {
        let first = match1[0].length > match1[1].length ? match1[0] : match1[1];
        let second =
          match2[0].length > match2[1].length ? match2[0] : match2[1];
        match = first.length > second.length ? match1 : match2;
      } else {
        match = match1 || match2;
      }

      console.log("functionCallString: ", match);
      if (match && match[1]) {
        const argsString =
          match[0].length > match[1].length ? match[0] : match[1];

        // Regex to extract key-value pairs
        const keyValueRegex = /(\w+)=('([^']+)')/g;
        let keyValueMatch;
        const extractedArgs: { [key: string]: string } = {};

        while ((keyValueMatch = keyValueRegex.exec(argsString)) !== null) {
          console.log("keyValueMatch: ", keyValueMatch);
          const key = keyValueMatch[1];
          const value = keyValueMatch[3] || keyValueMatch[4]; // handles both single and double quotes
          extractedArgs[key] = value;
        }

        console.log("Extracted args", extractedArgs);
        const {
          filePath,
          commitMessage,
          branchName,
          pullRequestTitle,
          pullRequestBody,
          fileContent,
        } = extractedArgs;

        if (
          filePath &&
          commitMessage &&
          branchName &&
          pullRequestTitle &&
          pullRequestBody &&
          fileContent
        ) {
          const fixedFileContent = fileContent.replace(/\\n/g, "\n");
          console.log("return pull request extracted args:", extractedArgs);
          return {
            filePath,
            commitMessage,
            branchName,
            pullRequestTitle,
            pullRequestBody,
            fileContent: fixedFileContent,
          };
        } else {
          console.log("Incomplete arguments extracted from the text response.");
        }
      } else {
        console.log(
          "Could not parse the function call from the text response."
        );
      }
    } catch (error) {
      console.error("Error parsing function call from text:", error);
      console.log("Error parsing function call from the text response.");
    }
  }

  return {
    filePath: "",
    commitMessage: "",
    branchName: "",
    pullRequestTitle: "",
    pullRequestBody: "",
    fileContent: "",
  };
};
