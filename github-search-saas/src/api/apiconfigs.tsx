import axios from "axios";

export const GITHUB_TOKEN: string = import.meta.env.VITE_GITHUB_TOKEN as string; // Ensure this is set in your .env file

export const GITHUB_API_URL = "https://api.github.com";

export const githubSearchApi = axios.create({
  baseURL: 'https://api.github.com/search/code',
});

githubSearchApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return config;
});