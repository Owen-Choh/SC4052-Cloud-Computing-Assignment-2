import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi } from "../api/apiconfigs";

const CodeEdit: React.FC = () => {
  const {
    username,
    setUsername,
    repository,
    setRepository,
    token,
    setToken,
    selectedItems: selectedItem,
    setSelectedItems: setSelectedItem,
  } = useGithubContext();

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg flex-grow">
      <div className="flex gap-4 items-center w-full">
        <h2 className="text-2xl">Extra function</h2>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg">Selected Details:</h3>
          <p>Repository: {repository || "None selected"}</p>
          <p>Items: {(selectedItem || []).join(", ") || "None selected"}</p>
        </div>
      </div>
    </div>
  );
};

export default CodeEdit;
