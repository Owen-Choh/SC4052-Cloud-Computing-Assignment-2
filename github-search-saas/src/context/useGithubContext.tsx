import React, { createContext, useState, ReactNode, useContext } from "react";

interface GithubContextType {
  username: string;
  setUsername: (username: string) => void;
  repository: string;
  setRepository: (repository: string) => void;
  token: string;
  setToken: (token: string) => void;
  selectedItems: [];
  setSelectedItems: (item: []) => void;
}

export const GithubContext = createContext<GithubContextType | undefined>(
  undefined
);

export const useGithubContext = () => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error(
      "useGithubContext must be used within Github Context Provider"
    );
  }
  return context;
};

export const GithubProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [token, setToken] = useState("");
  const [selectedItem, setSelectedItem] = useState<[]>([]);

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
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
