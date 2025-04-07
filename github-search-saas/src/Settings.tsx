import React from 'react';
import { useGithubContext } from './context/useGithubContext';

const Settings: React.FC = () => {
  const context = useGithubContext();
  
  if (!context) {
    return <div>Error: Github Context Provider not found</div>;
  }

  const { username, setUsername, repository, setRepository, token, setToken } = context;

  return (
    <div className="">
      <h2>Settings</h2>
      <label>
        GitHub Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Repository Name:
        <input
          type="text"
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
        />
      </label>
      <label>
        GitHub Token:
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
    </div>
  );
};

export default Settings;