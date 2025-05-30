import axios from "axios";
import { Octokit } from "octokit";

export const GITHUB_TOKEN: string = import.meta.env.VITE_GITHUB_TOKEN as string; // Ensure this is set in your .env file
export const GEMINI_API_KEY: string = import.meta.env
  .VITE_GEMINI_API_KEY as string; // Ensure this is set in your .env file

export var octokit = new Octokit({
  auth: GITHUB_TOKEN,
});
export const setOctokit = (token: string) => {
  if (token && token !== "") {
    octokit = new Octokit({
      auth: token,
    });
  } else if (GITHUB_TOKEN && GITHUB_TOKEN !== "") {
    octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });
  }

  throw new Error("Token is required to set Octokit instance.");
};

export const GITHUB_API_URL = "https://api.github.com";

export const githubSearchCodeApi = axios.create({
  baseURL: "https://api.github.com/search/code",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

export const githubSearchRepoApi = axios.create({
  baseURL: "https://api.github.com/search/repositories",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

export const githubGetCodeApi = axios.create({
  baseURL: "https://api.github.com/repos",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});
