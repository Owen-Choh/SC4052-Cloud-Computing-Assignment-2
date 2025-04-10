import React, { useState } from "react";
import { githubSearchCodeApi } from "../api/apiconfigs";
import { useGithubContext } from "../context/useGithubContext";

const CodeSearch = () => {
  const context = useGithubContext;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false);

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

  const toggleMinimized = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div className="p-4 w-screen border-gray-500 border-2 rounded-lg relative">
      <button
        onClick={() => toggleMinimized()}
        className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded"
      >
        {minimized? "Minimize" : "Expand"}
      </button>
      <h1>GitHub Code Search</h1>
      {minimized && <>
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

      <h2>Results:</h2>
      <ul>
        {results.map((item) => (
          <li key={item.sha}>
            <a href={item.html_url} target="_blank" rel="noopener noreferrer">
              {item.name} - {item.repository.full_name}
            </a>
          </li>
        ))}
      </ul>
      </>
}
    </div>
  );
};

export default CodeSearch;
