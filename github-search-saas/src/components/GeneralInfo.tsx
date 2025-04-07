import React from "react";
import { useGithubContext } from "../context/useGithubContext";

const GeneralInfo: React.FC = () => {
  const context = useGithubContext();

  if (!context) {
    return <div>Error: Github Context Provider not found</div>;
  }

  const { username, setUsername, repository, setRepository, token, setToken } =
    context;

  return (
    <div className="p-2">
      <h2 className="text-4xl">General Information</h2>
      <div className="flex gap-4">
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
          <input
            type="text"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default GeneralInfo;
