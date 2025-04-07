import axios from "axios";

export const GITHUB_TOKEN: string = import.meta.env.VITE_GITHUB_TOKEN as string; // Ensure this is set in your .env file

export const GITHUB_API_URL = "https://api.github.com";

export const githubSearchCodeApi = axios.create({
  baseURL: 'https://api.github.com/search/code',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

export const githubSearchRepoApi = axios.create({
  baseURL: 'https://api.github.com/search/repositories',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});
