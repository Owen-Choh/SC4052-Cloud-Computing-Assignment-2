import { GEMINI_API_KEY } from "../api/apiconfigs";
import { GoogleGenAI, GenerateContentConfig, Type, FunctionCallingConfigMode } from "@google/genai";

const apiKey = GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey });

const defaultModel = "gemini-2.0-flash";

const defaultGenerationConfig = {
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

export async function generateWithSystemInstructionConfigAndTools(
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
      tools: [
        {
          functionDeclarations: [submitPullRequestFunctionDeclaration],
        },
      ],
      toolConfig: {
        functionCallingConfig: {
          // Force it to call a function
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: ['submit_pull_request'],
        }
      },
    },
    contents: prompt,
  });

  return result;
}

const submitPullRequestFunctionDeclaration = {
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
