import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi } from "../api/apiconfigs";

const CodeEdit: React.FC = () => {
  const context = useGithubContext();

  if (!context) {
    return <div>Error: Github Context Provider not found</div>;
  }

  const { 
    username, 
    setUsername, 
    repository, 
    setRepository, 
    token, 
    setToken, 
    selectedItem, 
    setSelectedItem 
  } = context;

  const [minimized, setMinimized] = useState(false);

  const toggleMinimized = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg w-full">
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">Extra function</h2>
        <button
          onClick={() => toggleMinimized()}
          className="ml-auto bg-gray-200 rounded"
        >
          {minimized ? "Minimize" : "Expand"}
        </button>
      </div>
      {minimized && (
        <div className="flex flex-col gap-4 items-start">
          <div className="flex gap-4 items-center">
            <label className="flex gap-2">
              Selected Item:
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Selected Details:</h3>
            <p>Repository: {repository || "None selected"}</p>
            <p>Items: {(selectedItem || []).join(", ") || "None selected"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEdit;
