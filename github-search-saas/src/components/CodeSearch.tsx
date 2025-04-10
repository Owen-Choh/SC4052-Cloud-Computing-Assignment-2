import React, { useState } from "react";
import { githubSearchCodeApi, octokit } from "../api/apiconfigs";
import { useGithubContext } from "../context/useGithubContext";
import { genCodeDescription } from "../geminiAPI/geminiAPI";
import Markdown from "react-markdown";

const CodeSearch = () => {
  const context = useGithubContext;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(true);
  const [descriptions, setDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});

  const toggleMinimized = () => {
    setMinimized((prev) => !prev);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await githubSearchCodeApi.get(
        githubSearchCodeApi.defaults.baseURL +
          `?q=${query}+language:ts+OR+language:tsx+user:Owen-Choh`
      );
      setResults(response.data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const describeCode = async (item) => {
    setLoadingDescriptions((prev) => ({ ...prev, [item.sha]: true }));
    try {
      const otheer = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: item.repository.owner.login,
          repo: item.repository.name,
          path: item.path,
        }
      );
      console.log(atob(otheer.data.content));
      if (otheer.data.content === "") {
        console.log("code api response is empty");
        return;
      }
      const description = await genCodeDescription(
        "Summarise what this code is doing. " + atob(otheer.data.content)
      );
      setDescriptions((prev) => ({ ...prev, [item.sha]: description }));
    } catch (error) {
      console.error("Error fetching file content:", error);
    } finally {
      setLoadingDescriptions((prev) => ({ ...prev, [item.sha]: false }));
    }
  };

  return (
    <div className="p-4 w-screen border-gray-500 border-2 rounded-lg relative">
      <button
        onClick={() => toggleMinimized()}
        className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded"
      >
        {minimized ? "Minimize" : "Expand"}
      </button>
      <h2 className="text-2xl">GitHub Code Search</h2>
      {minimized && (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter code snippet..."
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>

          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {results.length > 0 && (
            <>
              <h2>Results:</h2>
              <ul className="border-gray-500 border-2 rounded-lg">
                {results.map((item) => (
                  <li key={item.sha} className="flex flex-col gap-2 m-2 p-2 border-gray-200 border-2 rounded-lg">
                    <div className="flex gap-4 items-center">
                      <a
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name} - {item.repository.full_name}
                      </a>
                      <button
                        onClick={() => describeCode(item)}
                        disabled={loadingDescriptions[item.sha]}
                        className="relative"
                      >
                        {loadingDescriptions[item.sha]
                          ? "Loading..."
                          : "Describe"}
                      </button>
                    </div>
                    {descriptions[item.sha] && (
                      <div className="p-2">
                        <Markdown>{descriptions[item.sha]}</Markdown>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CodeSearch;
