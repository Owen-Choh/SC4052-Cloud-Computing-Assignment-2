import React, { useState } from 'react';
import { githubSearchApi } from './api/apiconfigs';
import { useGithubContext } from './context/useGithubContext';

const CodeSearch = () => {
  const context = useGithubContext;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await githubSearchApi.get(
        `https://api.github.com/search/code?q=${query}+language:ts+OR+language:tsx+user:Owen-Choh`, // Adjust language as needed
      );

      setResults(response.data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>GitHub Code Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter code snippet..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

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
    </div>
  );
};

export default CodeSearch;