# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Assignment-2 repository, outlining its purpose, functionality, code structure, and setup instructions.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Project Overview](#project-overview)
3.  [Architecture](#architecture)
4.  [Code Structure](#code-structure)
    *   [github-search-saas/src/App.tsx](#github-search-saassrcapptsx)
    *   [github-search-saas/vite.config.ts](#github-search-saasvite.config.ts)
    *   [github-search-saas/eslint.config.js](#github-search-saaseslint.config.js)
    *   [github-search-saas/src/main.tsx](#github-search-saassrcmain.tsx)
    *   [github-search-saas/index.html](#github-search-saasindex.html)
    *   [github-search-saas/src/App.css](#github-search-saassrcapp.css)
    *   [github-search-saas/src/vite-env.d.ts](#github-search-saassrcvite-env.d.ts)
    *   [github-search-saas/src/index.css](#github-search-saassrcindex.css)
    *   [github-search-saas/src/api/apiconfigs.tsx](#github-search-saassrcapiapiconfigs.tsx)
    *   [github-search-saas/src/components/CodeSearch.tsx](#github-search-saassrccomponentscodesearch.tsx)
    *   [github-search-saas/src/components/GeneralInfo.tsx](#github-search-saassrccomponentsgeneralinfo.tsx)
    *   [github-search-saas/src/context/useGithubContext.tsx](#github-search-saassrccontextusegithubcontext.tsx)
    *   [github-search-saas/tsconfig.json](#github-search-saastsconfig.json)
    *   [github-search-saas/tsconfig.app.json](#github-search-saastsconfig.app.json)
    *   [github-search-saas/tsconfig.node.json](#github-search-saastsconfig.node.json)
    *   [github-search-saas/src/geminiAPI/geminiAPI.tsx](#github-search-saassrcgeminiapigeminiapi.tsx)
5.  [Setup Instructions](#setup-instructions)
6.  [Usage](#usage)
7.  [Environment Variables](#environment-variables)
8.  [Dependencies](#dependencies)
9.  [ESLint Configuration](#eslint-configuration)
10. [Future Enhancements](#future-enhancements)
11. [Troubleshooting](#troubleshooting)
12. [License](#license)

## 1. Introduction

The SC4052-Cloud-Computing-Assignment-2 repository contains the code for a GitHub code search application built as a SaaS. This application leverages the GitHub API and a Gemini API to provide a user-friendly interface for searching code within specified repositories and generating descriptions for the code snippets.  The application is built using React, TypeScript, Vite, and Tailwind CSS.

## 2. Project Overview

The primary goal of this project is to create a functional and scalable code search application that can be deployed as a service. It provides the following core features:

*   **GitHub Repository Selection:** Allows users to specify a GitHub username and select a repository from the list of available repositories for that user.
*   **Code Search:** Enables users to search for specific code snippets within the selected repository.
*   **File Type Filtering:** Allows users to filter the code search results by file type (e.g., `.js`, `.py`, `.ts`).
*   **Code Description Generation:** Uses the Gemini API to generate a concise description of the code snippet found, aiding in understanding its purpose.

## 3. Architecture

The application follows a component-based architecture, utilizing React for the user interface and TypeScript for type safety.  The main components are:

*   **App:** The root component that orchestrates the entire application.
*   **GeneralInfo:**  A component that handles user input for the GitHub username and repository selection.
*   **CodeSearch:** A component responsible for handling the code search functionality, filtering, and description generation.
*   **GithubProvider:** A context provider that manages the global state of the application (username, repository, token).
*   **GeminiAPI:** handles API calls to the google gemini API

## 4. Code Structure

The repository is organized as follows:

```
SC4052-Cloud-Computing-Assignment-2/
├── README.md                   # Project overview and setup instructions
├── github-search-saas/         # Main application directory
│   ├── index.html                # HTML entry point
│   ├── package.json              # Project dependencies and scripts
│   ├── pnpm-lock.yaml
│   ├── src/                      # Source code directory
│   │   ├── App.css               # Global CSS styles
│   │   ├── App.tsx               # Main application component
│   │   ├── api/                  # API configuration
│   │   │   ├── apiconfigs.tsx     # Defines API endpoints and configurations
│   │   ├── components/           # Reusable React components
│   │   │   ├── CodeSearch.tsx     # Code search component
│   │   │   ├── GeneralInfo.tsx    # General information component (username, repository)
│   │   ├── context/              # React context for global state
│   │   │   ├── useGithubContext.tsx # GitHub context provider
│   │   ├── geminiAPI/            # Gemini API integration
│   │   │   ├── geminiAPI.tsx      # functions to interact with gemini API
│   │   ├── index.css             # Global CSS styles
│   │   ├── main.tsx              # Entry point for React application
│   │   ├── vite-env.d.ts         # TypeScript environment declarations
│   ├── tsconfig.app.json         # TypeScript configuration for application code
│   ├── tsconfig.json             # Root TypeScript configuration
│   ├── tsconfig.node.json        # TypeScript configuration for Node.js
│   ├── vite.config.ts            # Vite build configuration
│   └── eslint.config.js          # ESLint configuration
```

Below is a detailed description of key files:

### github-search-saas/src/App.tsx

```typescript
import CodeSearch from './components/CodeSearch';
import GeneralInfo from './components/GeneralInfo';
import { GithubProvider } from './context/useGithubContext';

function App() {
  return (
    <div className="App flex flex-col gap-2 w-screen h-screen p-4">
      <GithubProvider>
        <GeneralInfo />
        <CodeSearch />
      </GithubProvider>
    </div>
  );
}

export default App;
```

*   **Purpose:** This is the root component of the application.
*   **Functionality:** It wraps the `GeneralInfo` and `CodeSearch` components within the `GithubProvider`, making the GitHub context available to all child components.  It also provides a basic layout using CSS classes.

### github-search-saas/vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

*   **Purpose:** Configuration file for the Vite build tool.
*   **Functionality:** It defines the plugins used by Vite, including `@vitejs/plugin-react-swc` for React support and `tailwindcss` for Tailwind CSS integration.

### github-search-saas/eslint.config.js

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

*   **Purpose:** Configuration file for ESLint, a JavaScript linting tool.
*   **Functionality:** This file configures ESLint with recommended rules for JavaScript and TypeScript, React Hooks, and React Refresh. It also specifies global variables and file patterns to lint.

### github-search-saas/src/main.tsx

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

*   **Purpose:** Entry point for the React application.
*   **Functionality:** It renders the `App` component inside a `StrictMode` block, which helps identify potential problems in the React code.

### github-search-saas/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

*   **Purpose:** HTML entry point for the application.
*   **Functionality:** It defines the basic HTML structure, including the `root` element where the React application will be mounted.

### github-search-saas/src/App.css

```css
@import "tailwindcss";

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
```

*   **Purpose:** Global CSS styles for the application.
*   **Functionality:**  Currently, this file primarily imports Tailwind CSS and provides some basic styling for the root element.

### github-search-saas/src/vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

*   **Purpose:** TypeScript declaration file for Vite environment variables.
*   **Functionality:** It provides type definitions for environment variables used in the Vite application.

### github-search-saas/src/index.css

```css
@import "tailwindcss";

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}

input {
  border-radius: 0.5em;
  border: 1px solid #ffffff;
  padding: 0.5em;
}

select {
  border-radius: 0.5em;
  border: 1px solid #ffffff;
  padding: 0.5em;
}
```

*   **Purpose:** Global CSS styles for the application.
*   **Functionality:** It imports Tailwind CSS and defines some basic styling for elements like body, h1, button, input, and select.

### github-search-saas/src/api/apiconfigs.tsx

```typescript
import axios from "axios";
import { Octokit } from "octokit";

export const GITHUB_TOKEN: string = import.meta.env.VITE_GITHUB_TOKEN as string; // Ensure this is set in your .env file
export const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY as string; // Ensure this is set in your .env file

export const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

export const GITHUB_API_URL = "https://api.github.com";

export const githubSearchCodeApi = axios.create({
  baseURL: 'https://api.github.com/search/code',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

export const githubSearchRepoApi = axios.create({
  baseURL: 'https://api.github.com/search/repositories',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});
```

*   **Purpose:** Defines API endpoints and configurations for interacting with the GitHub API and octokit.
*   **Functionality:**
    *   Imports the necessary libraries.
    *   Retrieves the GitHub token and gemini api key from environment variables.
    *   Creates an `Octokit` instance, authenticated using the GitHub token.  Octokit handles GitHub API requests.
    *   Defines an axios instance using the github token for searching code.
    *   Defines an axios instance using the github token for searching repos.

### github-search-saas/src/components/CodeSearch.tsx

```typescript
import React, { useState } from "react";
import { githubSearchCodeApi, octokit } from "../api/apiconfigs";
import { useGithubContext } from "../context/useGithubContext";
import { genCodeDescription } from "../geminiAPI/geminiAPI";
import Markdown from "react-markdown";

const CodeSearch = () => {
  const { username, repository, token } = useGithubContext();

  const [query, setQuery] = useState("");
  const [fileTypes, setFileTypes] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(true);
  const [descriptions, setDescriptions] = useState({});
  const [loadingDescriptions, setLoadingDescriptions] = useState({});

  const toggleMinimized = () => {
    setMinimized((prev) => !prev);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      var languageFilter = "";
      fileTypes.split(",").forEach((type) => {
        if (type.trim() !== "") {
          languageFilter += `+language:${type}`;
        }
      });
      const response = await octokit.request("GET /search/code", {
        q: `${query}${languageFilter}+user:Owen-Choh`,
      });

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
      const otheer = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: item.repository.owner.login,
          repo: item.repository.name,
          path: item.path,
        }
      );
      console.log(atob(otheer.data.content));
      if (otheer.data.content === "") {
        console.log("code api response is empty");
        return;
      }
      const description = await genCodeDescription(
        `User searched for ${query} and wants a description of the code from the file ${
          item.name
        } - ${item.repository.full_name}
        Summarise what this code is doing in two to three sentences. ${atob(
          otheer.data.content
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
    <div className="p-4 border-gray-500 border-2 rounded-lg relative">
      <button
        onClick={() => toggleMinimized()}
        className="absolute top-2 right-2 bg-gray-200 rounded"
      >
        {minimized ? "Minimize" : "Expand"}
      </button>
      <h2 className="text-2xl">GitHub Code Search</h2>
      {minimized && (
        <>
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
            className="min-w-1/2"
            placeholder="Enter comma seperated file types to filter..."
          />

          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {results.length > 0 && (
            <>
              <h2>Results:</h2>
              <ul className="border-gray-500 border-2 rounded-lg">
                {results.map((item) => (
                  <li
                    key={item.sha}
                    className="flex flex-col gap-2 m-2 p-2 border-gray-200 border-2 rounded-lg"
                  >
                    <div className="flex gap-4 items-center">
                      <a
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name} - {item.repository.full_name}
                      </a>
                      <button
                        onClick={() => describeCode(item)}
                        disabled={loadingDescriptions[item.sha]}
                        className="relative"
                      >
                        {loadingDescriptions[item.sha]
                          ? "Loading..."
                          : "Describe"}
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CodeSearch;
```

*   **Purpose:** Handles the code search functionality.
*   **Functionality:**
    *   Retrieves the username, repository, and token from the GitHub context.
    *   Uses React's `useState` hook to manage the query, file types, search results, loading state, errors, minimized state, generated descriptions, and loading state for descriptions.
    *   `handleSearch` function sends a request to the GitHub API to search for code.
    *   `describeCode` function sends a request to the Gemini API to generate a description for a code snippet and decodes it from base64.
    *   Renders a search form with input fields for the code snippet and file types, a search button, and a display area for the results. Results are displayed as a list, each including a link to the code on GitHub and a button to generate a description.
    *   react-markdown displays the code description.
    *   Ability to toggle the "minimized" or expanded state of the component.

### github-search-saas/src/components/GeneralInfo.tsx

```typescript
import React, { useState, useEffect } from "react";
import { useGithubContext } from "../context/useGithubContext";
import { githubSearchRepoApi } from "../api/apiconfigs";

const GeneralInfo: React.FC = () => {
  const context = useGithubContext();

  if (!context) {
    return <div>Error: Github Context Provider not found</div>;
  }

  const { username, setUsername, repository, setRepository, token, setToken } =
    context;

  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  const fetchRepos = async () => {
    if (username) {
      setLoading(true);
      setError(null);

      try {
        const response = await githubSearchRepoApi.get(
          githubSearchRepoApi.defaults.baseURL + `?q=user:${username}`
        );

        if (!response) {
          throw new Error("Failed to fetch repositories");
        } else {
          const repoNames = response.data.items.map((item: any) => item.name);
          setRepos(repoNames);
        }
      } catch (error) {
        setError("An error occurred while fetching repositories.");
      } finally {
        setLoading(false);
      }
    } else {
      setRepos([]);
    }
  };

  const toggleMinimized = () => {
    setMinimized((prev) => !prev);
  };

  return (
    <div className="p-4 border-gray-500 border-2 rounded-lg relative">
      <button
        onClick={() => toggleMinimized()}
        className="absolute top-2 right-2 bg-gray-200 rounded"
      >
        {minimized ? "Minimize" : "Expand"}
      </button>
      <h2 className="text-2xl">General Information</h2>
      {minimized && (
        <div className="flex gap-4 items-center">
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
            {loading ? (
              <span>Loading...</span>
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <select
                value={repository}
                onChange={(e) => {
                  const selectedRepo = e.target.value;
                  setRepository(selectedRepo); // Update context provider
                }}
              >
                <option value="" className="text-black">
                  Select a repository
                </option>
                {repos.map((repo) => (
                  <option key={repo} value={repo} className="text-black">
                    {repo}
                  </option>
                ))}
              </select>
            )}
          </label>
          <button
            onClick={fetchRepos}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Fetching..." : "Get Repos"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;
```

*   **Purpose:** Handles user input for the GitHub username, token, and repository selection.
*   **Functionality:**
    *   Retrieves the username, repository, token, and setter functions from the GitHub context.
    *   Uses React's `useState` hook to manage the list of repositories, loading state, and errors.
    *   `fetchRepos` function retrieves the list of repositories for the specified username from the GitHub API.
    *   Renders input fields for the username and token, a select dropdown for the repository, and a button to fetch the repositories.
    *   Updates the GitHub context with the entered username, token, and selected repository.
    *   Ability to toggle the "minimized" or expanded state of the component.

### github-search-saas/src/context/useGithubContext.tsx

```typescript
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface GithubContextType {
  username: string;
  setUsername: (username: string) => void;
  repository: string;
  setRepository: (repository: string) => void;
  token: string;
  setToken: (token: string) => void;
}

export const GithubContext = createContext<GithubContextType | undefined>(undefined);

export const useGithubContext = () => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error("useGithubContext must be used within Github Context Provider");
  }
  return context;
};

export const GithubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [repository, setRepository] = useState('');
  const [token, setToken] = useState('');

  return (
    <GithubContext.Provider value={{ username, setUsername, repository, setRepository, token, setToken }}>
      {children}
    </GithubContext.Provider>
  );
};
```

*   **Purpose:** Provides a React context for managing the global state of the application (username, repository, token).
*   **Functionality:**
    *   Creates a `GithubContext` using `React.createContext`.
    *   Defines a custom hook `useGithubContext` to access the context.
    *   Creates a `GithubProvider` component that manages the state (username, repository, token) using React's `useState` hook and makes it available to all child components.

### github-search-saas/tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

*   **Purpose:** Root TypeScript configuration file.
*   **Functionality:** It references the `tsconfig.app.json` and `tsconfig.node.json` files, which contain the specific TypeScript configurations for the application code and Node.js code, respectively.

### github-search-saas/tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

*   **Purpose:** TypeScript configuration for the application code.
*   **Functionality:**
    *   Sets the compilation target to ES2020.
    *   Specifies the libraries to include (ES2020, DOM, DOM.Iterable).
    *   Configures module resolution for a bundler environment.
    *   Enables strict type checking and linting rules.
    *   Specifies the `src` directory as the source code location.

### github-search-saas/tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

*   **Purpose:** TypeScript configuration for Node.js code.
*   **Functionality:**
    *   Sets the compilation target to ES2022.
    *   Specifies the libraries to include (ES2023).
    *   Configures module resolution for a bundler environment.
    *   Enables strict type checking and linting rules.
    *   Specifies the `vite.config.ts` file as the source code location.

### github-search-saas/src/geminiAPI/geminiAPI.tsx

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../api/apiconfigs";

const apiKey = GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export async function genCodeDescription(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(prompt);

  return result.response.text();
}
```

*   **Purpose:** Provides functionality to interact with the Gemini API for generating code descriptions.
*   **Functionality:**
    *   Initializes a `GoogleGenerativeAI` instance with the API key retrieved from the environment variables.
    *   Sets default generation configuration, including temperature, topP, topK, maxOutputTokens, and response type.
    *   Defines an asynchronous function `genCodeDescription` that takes a prompt as input and sends it to the Gemini API. It returns the generated description as text.

## 5. Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2/github-search-saas
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the project root directory and add the following environment variables:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    Replace `<your_github_token>` with your GitHub personal access token and `<your_gemini_api_key>` with your Gemini API key.

4.  **Run the application:**

    ```bash
    pnpm dev
    ```

    This will start the development server and open the application in your browser.

## 6. Usage

1.  Open the application in your browser.
2.  Enter your GitHub personal access token in the "GitHub Token" field.
3.  Enter your GitHub username in the "GitHub Username" field.
4.  Click the "Get Repos" button to fetch the list of repositories for the specified user.
5.  Select a repository from the "Repository Name" dropdown.
6.  Enter a code snippet to search for in the "Enter code snippet..." field.
7.  Enter comma-separated file types to filter by in the "Enter comma seperated file types to filter..." field.
8.  Click the "Search" button to initiate the code search.
9.  The search results will be displayed as a list, with each item including a link to the code on GitHub and a button to generate a description.
10. Click the "Describe" button to generate a description for a code snippet. The description will be displayed below the link.

## 7. Environment Variables

The application requires the following environment variables to be set:

*   `VITE_GITHUB_TOKEN`: Your GitHub personal access token.  This is used to authenticate requests to the GitHub API.
*   `VITE_GEMINI_API_KEY`: Your Gemini API key.  This is used to authenticate requests to the Gemini API.

## 8. Dependencies

The project uses the following dependencies:

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A fast and lightweight build tool.
