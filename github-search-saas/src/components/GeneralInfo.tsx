import React, { useState } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi, setOctokit } from "../api/apiconfigs";

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

  const fetchRepos = async () => {
    if (username) {
      setLoading(true);
      setError(null);

      try {
        const response = await githubSearchRepoApi.get(
          githubSearchRepoApi.defaults.baseURL + `?q=user:${username}`
        );

        if (!response) {
          throw new Error("Failed to fetch repositories");
        } else {
          const repoNames = response.data.items.map((item: any) => item.name);
          setRepos(repoNames);
        }
      } catch (error) {
        setError("An error occurred while fetching repositories.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">General Information</h2>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <label className="flex gap-2 text-lg items-center">
          Gemini API Key:
          <input
            type="text"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
          />
        </label>
        <label className="flex gap-2 text-lg items-center">
          GitHub Token:
          <input
            type="password"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setOctokit(e.target.value); 
            }}
          />
        </label>
        <label className="flex gap-2 text-lg items-center">
          GitHub Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="flex gap-2 text-lg items-center">
          Repository Name:
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
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
          <button
            onClick={fetchRepos}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Fetching..." : "Get Repos"}
          </button>
        </label>
      </div>
    </div>
  );
};

export default GeneralInfo;
