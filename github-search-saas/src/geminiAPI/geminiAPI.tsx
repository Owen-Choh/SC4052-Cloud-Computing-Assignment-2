import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../api/apiconfigs";

const apiKey = GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export async function generateContent(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(prompt);

  return result.response.text();
}

export async function generateContentWithConfig(prompt: string, config: GenerationConfig) {
  if (config == null) {
    throw new Error("Config is null. Please provide a valid config to api.");
  }

  const chatSession = model.startChat({
    generationConfig: config,
  });

  const result = await chatSession.sendMessage(prompt);
  
  return result.response.text();
}

export async function generateWithSystemInstructionAndConfig(systemInstruction: string, prompt: string, config: GenerationConfig) {
  if (config == null) {
    throw new Error("Config is null. Please provide a valid config to api.");
  }

  const chatSession = model.startChat({
    generationConfig: config,
    systemInstruction: {
      role: "user",
      parts: [
        {text: systemInstruction},
      ],
    },
  });

  const result = await chatSession.sendMessage(prompt);
  
  return result.response.text();
}
