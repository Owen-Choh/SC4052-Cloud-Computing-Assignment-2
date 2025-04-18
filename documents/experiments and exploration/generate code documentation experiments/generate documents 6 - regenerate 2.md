# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Assignment-2 repository. It is divided into two sections: How-to Guides and Reference Guides.

## How-to Guides

This section provides step-by-step instructions on how to perform common tasks within the application.

### 1. Setting up the Development Environment

1.  **Install Node.js:** Ensure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Install pnpm:** This project uses pnpm as the package manager. If you do not have pnpm, install it using `npm install -g pnpm`.
3.  **Clone the Repository:** Clone the repository to your local machine using `git clone <repository_url>`.
4.  **Install Dependencies:** Navigate to the project directory in your terminal and run `pnpm install` to install all the necessary dependencies.
5.  **Configure Environment Variables:** Create a `.env` file in the root directory of the `github-search-saas` folder and add your GitHub token and Gemini API Key. For example:

    ```
    VITE_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    *Note:* It's critical to set your Github token and Gemini API key, otherwise the application will error

6.  **Start the Development Server:** Run `pnpm dev` to start the development server. The application should be accessible at `http://localhost:5173/` (or another port, as indicated in the console).

### 2. Performing a Code Search

1.  Navigate to the CodeSearch tab.
2.  Enter your search query in the "Enter code snippet..." input field.
3.  Optionally, filter by file types by entering a comma-separated list of file extensions (e.g., "js,py,tsx") in the "Filter by comma seperated file types..." input field.
4.  Click the "Search" button.
5.  The search results will be displayed as a list of files.

### 3. Generating Documentation for Code

1.  Perform a code search as described in the previous section.
2.  Select the files you want to include in the documentation by checking the checkboxes next to each file.
3.  Navigate to the "CodeEdit" tab.
4.  Ensure that the "Username" and "Repository" fields are filled in on the "GeneralInfo" tab.
5.  Click the "Generate Documentation" button.
6.  The generated documentation will appear in the text area on the code edit tab.

### 4. Selecting a Repository

1.  Navigate to the "GeneralInfo" tab.
2.  Enter the GitHub username in the "GitHub Username" input field.
3.  Click the "Get Repos" button.
4.  Select a repository from the "Repository Name" dropdown.

*Note:* The username must be set for the repositories to populate into the Repository Name dropdown. You must press "Get Repos" for the API to get the repo names.

## Reference Guide

This section provides detailed information about the components, context, API configurations, and other important aspects of the application.

### 1. Directory Structure

```
SC4052-Cloud-Computing-Assignment-2/
├── README.md                   # General information about the project
├── github-search-saas/         # React app directory
│   ├── src/                    # Source code directory
│   │   ├── App.tsx             # Main application component
│   │   ├── main.tsx            # Entry point for React application
│   │   ├── vite-env.d.ts       # TypeScript environment declarations
│   │   ├── App.css             # Styles for the App component
│   │   ├── index.css           # Global styles
│   │   ├── api/                # API configuration files
│   │   │   ├── apiconfigs.tsx  # Configuration for GitHub API
│   │   ├── components/         # React components
│   │   │   ├── CodeEdit.tsx    # Component for generating documentation
│   │   │   ├── CodeSearch.tsx  # Component for searching code
│   │   │   ├── GeneralInfo.tsx # Component for general information input
│   │   ├── context/            # Context provider
│   │   │   ├── useGithubContext.tsx # Manages GitHub-related state
│   │   ├── geminiAPI/          # Gemini API integration
│   │   │   ├── geminiAPI.tsx   # Functions for interacting with the Gemini API
│   │   ├── index.css           # Global styles
│   ├── vite.config.ts          # Vite configuration file
│   ├── eslint.config.js        # ESLint configuration file
│   ├── tsconfig.json           # TypeScript configuration file
│   ├── tsconfig.app.json       # TypeScript configuration for app
│   ├── tsconfig.node.json      # TypeScript configuration for node
│   ├── index.html              # Main HTML file
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Dependency lock file
├── pnpm-lock.yaml              # Dependency lock file
```

### 2. Key Components

*   **`App.tsx`**: The main application component that sets up the layout and handles tab navigation. It uses the `GithubProvider` to make GitHub-related state available to all components.
    *   It maintains a `tab` state, determining which component to render.
    *   The `GithubProvider` wraps the main content, providing context.
*   **`CodeEdit.tsx`**: This component is responsible for generating documentation using the Gemini API. It retrieves selected code files and their contents, then sends a prompt to Gemini to generate documentation. The component also makes use of caching using the `cache` state to reduce redundant API calls.
    *   It uses `useGithubContext` to access the username, repository, selected items, and search results.
    *   It displays selected file details and provides a button to trigger documentation generation.
    *   It renders the generated documentation in a read-only text area.
*   **`CodeSearch.tsx`**: This component provides the code search functionality. It allows users to enter a query, filter by file types, and search for code in GitHub repositories.
    *   It manages the search query, file types, and search results using the `useGithubContext` hook.
    *   It uses the GitHub API to perform the code search.
    *   It renders the search results as a list of files with checkboxes for selection.
    *   Each result has a "Describe" button that sends the code content to the Gemini API for description.
*   **`GeneralInfo.tsx`**: This component allows users to input their GitHub username, token, and select a repository.
    *   It uses the `useGithubContext` hook to manage the username, token, and repository state.
    *   It fetches a list of repositories for the given username using the GitHub API.
    *   It renders input fields for the username and token, and a dropdown for selecting the repository.

### 3. Context (`useGithubContext.tsx`)

The `useGithubContext` hook provides a centralized way to manage GitHub-related state across the application.

*   **`GithubContext`**: The context object that holds the state and setter functions.
*   **`GithubProvider`**: A component that wraps the application and provides the context to its children.
*   **State Variables**:

    *   `username`: string - The GitHub username.
    *   `repository`: string - The selected repository name.
    *   `token`: string - The GitHub token.
    *   `selectedItems`: [] - An array of selected item shas.
    *    `repos`: string[] - An array of repository names
    *   `query`: string - The code search query.
    *   `fileTypes`: string - A comma-separated list of file types.
    *   `results`: any[] - An array of search results from the GitHub API.
    *   `descriptions`: Record<string, string> - A map of SHA values to code descriptions.
*   **Setter Functions**:

    *   `setUsername`: (username: string) =\> void - Sets the GitHub username.
    *   `setRepository`: (repository: string) =\> void - Sets the selected repository name.
    *   `setToken`: (token: string) =\> void - Sets the GitHub token.
    *   `setSelectedItems`: (items: []) =\> void - Sets the selected items.
    *   `setRepos`: (repos: string[]) =\> void - Sets the repositories.
    *   `setQuery`: (query: string) =\> void - Sets the code search query.
    *   `setFileTypes`: (fileTypes: string) =\> void - Sets the file types.
    *   `setResults`: (results: any[]) =\> void - Sets the search results.
    *   `setDescriptions`: (descriptions: Record<string, string>) =\> void - Sets the code descriptions.

*Note:* `setToken` function, although implemented, does not automatically update the octokit instance with the new token. This is a TODO in the code.

### 4. API Configurations (`apiconfigs.tsx`)

This file configures the GitHub API client using `axios` and `octokit`.

*   **`GITHUB_TOKEN`**: A string containing the GitHub token, retrieved from the environment variables.
*   **`GEMINI_API_KEY`**: A string containing the Gemini API key, retrieved from the environment variables.
*   **`octokit`**: An instance of the Octokit client, authenticated with the GitHub token.
*   **`GITHUB_API_URL`**: A constant defining the base URL for the GitHub API.
*   **`githubSearchCodeApi`**: An axios instance configured to search code.
*   **`githubSearchRepoApi`**: An axios instance configured to search repositories.
*   **`githubGetCodeApi`**: An axios instance configured to retrieve code content.
*Note:* Ensure that `VITE_GITHUB_TOKEN` and `VITE_GEMINI_API_KEY` are properly configured in the `.env` file

### 5. Gemini API Integration (`geminiAPI/geminiAPI.tsx`)

This file contains functions for interacting with the Gemini API.

*   **`generateContent(prompt: string)`**: This asynchronous function sends a prompt to the Gemini API and returns the generated content.
    *   It initializes the Gemini API client with the API key.
    *   It configures the model with specific settings, such as temperature, topP, and maxOutputTokens.
    *   It sends the prompt to the Gemini API and returns the generated text.

### 6. Key Libraries

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A build tool that provides a fast development experience.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **Octokit:** A well maintained and comprehensive library to help make calls to Github's REST API, which uses Axios under the hood.
*   **react-markdown:** A react component that renders markdown.
*   **@google/generative-ai:** Google's new Gemini API.

### 7. ESLint Configuration (`eslint.config.js`)

This file configures ESLint, a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

*   It extends the recommended ESLint configurations and TypeScript ESLint configurations.
*   It specifies the files to be linted (`**/*.{ts,tsx}`).
*   It configures the language options, including the ECMAScript version and global variables.
*   It includes plugins for React Hooks and React Refresh.
*   It defines rules for React Hooks and React Refresh.

### 8. Vite Configuration (`vite.config.ts`)

This file configures Vite, a build tool that provides a fast development experience.

*   It uses the `@vitejs/plugin-react-swc` plugin for React support.
*   It uses the `@tailwindcss/vite` plugin for Tailwind CSS integration.

### 9. TypeScript Configurations (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)

These files configure the TypeScript compiler.

*   `tsconfig.json`: The main TypeScript configuration file that references the app and node configurations.
*   `tsconfig.app.json`: Configuration for the React application, including compiler options and file inclusions.
*   `tsconfig.node.json`: Configuration for Node.js-specific code, including compiler options and file inclusions.

