import React, { createContext, useState, ReactNode, useContext } from "react";

interface GithubContextType {
  username: string;
  setUsername: (username: string) => void;
  repository: string;
  setRepository: (repository: string) => void;
  token: string;
  setToken: (token: string) => void;
  selectedItems: any;
  setSelectedItems: (item: any) => void;
  repos: string[];
  setRepos: (repos: string[]) => void;
  query: string;
  setQuery: (query: string) => void;
  fileTypes: string;
  setFileTypes: (fileTypes: string) => void;
  results: any[];
  setResults: (results: any[]) => void;
  descriptions: Record<string, string>;
  setDescriptions: (descriptions: Record<string, string>) => void;
  cache: Map<string, string>;
  setCache: (cache: Map<string, string>) => void;
  repoFileContentArray: string[];
  setRepoFileContentArray: (array: string[]) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

// Create a context for GitHub-related state
export const GithubContext = createContext<GithubContextType | undefined>(
  undefined
);

// Custom hook to use the GitHub context
export const useGithubContext = () => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error(
      "useGithubContext must be used within Github Context Provider"
    );
  }
  return context;
};

// GitHub context provider component
export const GithubProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State variables for various GitHub-related data
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [token, setTokenState] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [repos, setRepos] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [fileTypes, setFileTypes] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [cache, setCache] = useState<Map<string, string>>(new Map());
  const [repoFileContentArray, setRepoFileContentArray] = useState<string[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");

  // Function to update the token state
  const setToken = (token: string) => {
    setTokenState(token);
    // TODO: update the octokit instance with the new token
  };

  return (
    <GithubContext.Provider
      value={{
        username,
        setUsername,
        repository,
        setRepository,
        token,
        setToken,
        selectedItems: selectedItem,
        setSelectedItems: setSelectedItem,
        repos,
        setRepos,
        query,
        setQuery,
        fileTypes,
        setFileTypes,
        results,
        setResults,
        descriptions,
        setDescriptions,
        cache,
        setCache,
        repoFileContentArray,
        setRepoFileContentArray,
        geminiApiKey,
        setGeminiApiKey,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};