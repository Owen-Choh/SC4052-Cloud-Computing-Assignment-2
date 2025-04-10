import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi } from "../api/apiconfigs";

const CodeEdit: React.FC = () => {
  const { username, repository, token, selectedItems, results } =
    useGithubContext();

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">Extra function</h2>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg">Selected Details:</h3>
          <p>Username: {username || "None selected"}</p>
          <p>Repository: {repository || "None selected"}</p>
          <p>
            Items:{" "}
            {selectedItems && selectedItems.length > 0
              ? results
                  .filter((item) => selectedItems.includes(item.sha))
                  .map((item) => `${item.name} (${item.repository.full_name})`)
                  .join(", ")
              : "None selected"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeEdit;
