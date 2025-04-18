import React, { useState } from "react";
import { useGithubContext } from "../context/useGithubContext";
import {
  GEMINI_API_KEY,
  GITHUB_TOKEN,
  githubSearchRepoApi,
  setOctokit,
} from "../api/apiconfigs";

const GeneralInfo: React.FC = () => {
  const {
    username,
    setUsername,
    repository,
    setRepository,
    token,
    setToken,
    repos,
    setRepos,
    geminiApiKey,
    setGeminiApiKey,
  } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get the repositories for the every repository that the token has access to
  const fetchRepos = async () => {
    if (username) {
      setLoading(true);
      setError(null);

      try {
        const response = await githubSearchRepoApi.get(
          githubSearchRepoApi.defaults.baseURL + `?q=user:${username}`,
          {
            headers: {
              Authorization: `Bearer ${token || GITHUB_TOKEN}`,
            },
          }
        );

        if (!response) {
          throw new Error("Failed to fetch repositories");
        } else {
          const repoNames = response.data.items.map((item: any) => item.name);
          setRepos(repoNames);
        }
      } catch (error) {
        setError(
          "An error occurred while fetching repositories. Are you sure the username and token is valid?"
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a GitHub username.");
    }
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">General Information</h2>
        <a
          className="text-2xl"
          href="https://github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2"
          target="_blank"
        >
          (App source code can be found here)
        </a>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2 border-2 border-gray-700 rounded-lg p-4">
          <label className="flex gap-2 text-lg items-center">
            Gemini API Key:
            <input
              type="text"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            {GEMINI_API_KEY && (
              <span className="text-red-500">
                {" "}
                (Gemini API Key detected in env, please ensure that this is
                local development only)
              </span>
            )}
          </label>
          <p>
            This is used to generate code descriptions and summaries. You can
            get a free API key from Google Gemini.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-2 border-gray-700 rounded-lg p-4">
          <label className="flex gap-2 text-lg items-center">
            GitHub Token:
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setOctokit(e.target.value);
              }}
            />
            {GITHUB_TOKEN && (
              <span className="text-red-500">
                {" "}
                (Github token detected in env, please ensure that this is local
                development only)
              </span>
            )}
          </label>
          <p>
            This is used to list the repos that you own, search and retrieve
            code in the repository. Optionally, also submit pull requests if you
            use one of the features provided. To use all features provided by
            the app,{" "}
            <span className="font-bold">
              Read and Write access to code and pull requests
            </span>{" "}
            for the repository are minimally required.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-2 border-gray-700 rounded-lg p-4">
          <label className="flex gap-2 text-lg items-center">
            GitHub Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <p>
            Enter your GitHub username to fetch repositories and interact with
            the GitHub API.
          </p>
        </div>
        <div className="flex flex-col gap-2 border-2 border-gray-700 rounded-lg p-4">
          <label className="flex gap-2 text-lg items-center">
            Repository Name:
            <button
              onClick={fetchRepos}
              disabled={loading}
              className="bg-blue-500 text-white !p-1 rounded"
            >
              {loading ? "Fetching..." : "List Repos"}
            </button>
          </label>
          <p>
            Select a repository from the list of repositories fetched using your
            GitHub username and token. This will be the workspace for the app.
          </p>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <select
              value={repository}
              onChange={(e) => {
                const selectedRepo = e.target.value;
                setRepository(selectedRepo); // Update context provider
              }}
            >
              <option value="" className="text-black">
                Select a repository
              </option>
              {repos.map((repo) => (
                <option key={repo} value={repo} className="text-black">
                  {repo}
                </option>
              ))}
            </select>
          )}
          {error && <span className="text-lg text-red-500">{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
