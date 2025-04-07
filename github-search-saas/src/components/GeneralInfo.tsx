import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi } from "../api/apiconfigs";

const GeneralInfo: React.FC = () => {
  const context = useGithubContext();

  if (!context) {
    return <div>Error: Github Context Provider not found</div>;
  }

  const { username, setUsername, repository, setRepository, token, setToken } =
    context;

  const [repos, setRepos] = useState<string[]>([]);
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
    } else {
      setRepos([]);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [username, token]);

  return (
    <div className="p-2">
      <h2 className="text-4xl">General Information</h2>
      <div className="flex gap-4 items-center">
        <label className="flex gap-2">
          GitHub Token:
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </label>
        <label className="flex gap-2">
          GitHub Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="flex gap-2">
          Repository Name:
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <select
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
            >
              <option value="" className="text-black">Select a repository</option>
              {repos.map((repo) => (
                <option key={repo} value={repo} className="text-black">
                  {repo}
                </option>
              ))}
            </select>
          )}
        </label>
        <button
          onClick={fetchRepos}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Fetching..." : "Get Repos"}
        </button>
      </div>
    </div>
  );
};

export default GeneralInfo;
