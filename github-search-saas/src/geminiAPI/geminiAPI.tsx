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
