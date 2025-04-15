import React, { useState } from "react";
import { githubSearchCodeApi, octokit } from "../api/apiconfigs";
import { useGithubContext } from "../context/useGithubContext";
import { generateContent } from "../geminiAPI/geminiAPI";
import Markdown from "react-markdown";

const CodeSearch = () => {
  const {
    username,
    repository,
    selectedItems,
    setSelectedItems,
    query,
    setQuery,
    fileTypes,
    setFileTypes,
    results,
    setResults,
    descriptions,
    setDescriptions,
  } = useGithubContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDescriptions, setLoadingDescriptions] = useState({});
  
  function parseData(data) {
    // If the data is an array, return that
      if (Array.isArray(data)) {
        return data
      }
  
    // Some endpoints respond with 204 No Content instead of empty array
    //   when there is no data. In that case, return an empty array.
    if (!data) {
      return []
    }
  
    // Otherwise, the array of items that we want is in an object
    // Delete keys that don't include the array of items
    delete data.incomplete_results;
    delete data.repository_selection;
    delete data.total_count;
    // Pull out the array of items
    const namespaceKey = Object.keys(data)[0];
    data = data[namespaceKey];
  
    return data;
  }


  const handleSearch = async () => {
    setResults([]);
    setSelectedItems([]);
    // better to keep the descriptions when a new search is made since api calls are expensive
    // and can use the descriptions from the previous search if sha is same
    // setDescriptions({}); 
    setLoading(true);
    setError(null);

    try {
      var languageFilter = "";
      fileTypes.split(",").forEach((type) => {
        if (type.trim() !== "") {
          languageFilter += `+language:${type}`;
        }
      });
      var userFilter = "";
      
      var nameWithRepo = "";
      if (repository && username) {
        nameWithRepo = `+repo:${username}/${repository}`;
      } else if (username) {
        userFilter = `+user:${username}`;
      }

      const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
      let pagesRemaining = true;
      let data = [];
      const queryString = `${query}${languageFilter}${userFilter}${nameWithRepo}`;
      let response = await octokit.request("GET /search/code", {
        q: queryString,
        per_page: 100,
      });
      pagesRemaining = response.data.total_count > 100

      let parsedData = parseData(response.data)
      data = [...data, ...parsedData];
      
      let linkHeader = response.headers.link;
      while (pagesRemaining) {
        let url = linkHeader.match(nextPattern)[0] || null;
        
        if(!url) {
          console.log("No next url detected in the link header. Stopping pagination.");
          break;
        }

        const response = await octokit.request(`GET ${url}`, {
          per_page: 100,
        });
        linkHeader = response.headers.link;
    
        const parsedData = parseData(response.data)
        data = [...data, ...parsedData];
    
        pagesRemaining = (linkHeader && linkHeader.includes(`rel=\"next\"`)) || false;
      }

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
      const getCodeResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: item.repository.owner.login,
          repo: item.repository.name,
          path: item.path,
        }
      );
      console.log(atob(getCodeResponse.data.content));
      if (getCodeResponse.data.content === "") {
        console.log("code api response is empty");
        return;
      }

      var desc = query ? query : "all code in the repository";
      const description = await generateContent(
        `User searched for ${query} and wants a description of the code from the file ${
          item.name
        } - ${item.repository.full_name}
        Summarise what this code is doing in two to three sentences. ${atob(
          getCodeResponse.data.content
        )}`
      );
      setDescriptions((prev) => ({ ...prev, [item.sha]: description }));
    } catch (error) {
      console.error("Error fetching file content:", error);
    } finally {
      setLoadingDescriptions((prev) => ({ ...prev, [item.sha]: false }));
    }
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow overflow-x-hidden overflow-y-auto">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl">GitHub Code Search</h2>
      </div>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter code snippet..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <input
          type="text"
          value={fileTypes}
          onChange={(e) => setFileTypes(e.target.value)}
          placeholder="Filter by comma seperated file types..."
        />
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2>Results:{" "}{results.length}</h2>
          <ul className="border-gray-500 border-2 rounded-lg p-2">
            {results.map((item) => (
              <li
                key={item.sha}
                className="flex flex-col gap-2 p-2 border-gray-200 border-2 rounded-lg"
              >
                <div className="flex gap-4 items-center">
                  <input
                    type="radio"
                    id={`select-${item.sha}`}
                    className="mr-2"
                    checked={selectedItems.sha === item.sha}
                    onChange={() => {
                      setSelectedItems(item);
                    }}
                  />
                  <label htmlFor={`select-${item.sha}`} className="flex-grow">
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!text-white hover:!underline"
                    >
                      {item.name} - {item.repository.full_name}
                    </a>
                  </label>
                  <button
                    onClick={() => describeCode(item)}
                    disabled={loadingDescriptions[item.sha]}
                    className="relative"
                  >
                    {loadingDescriptions[item.sha] ? "Loading..." : "Describe"}
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
        </div>
      )}
    </div>
  );
};

export default CodeSearch;
