# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides documentation for the SC4052-Cloud-Computing-Assignment-2 repository. It is designed for users with varying levels of experience, including beginners.

## Table of Contents
- [How-To Guides](#how-to-guides)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Running the Application](#running-the-application)
  - [Searching for Code on GitHub](#searching-for-code-on-github)
  - [Describing Code Snippets with Gemini](#describing-code-snippets-with-gemini)
  - [Configuring General Information](#configuring-general-information)
- [Reference Guides](#reference-guides)
  - [App.tsx](#apptsx)
  - [Vite Configuration (vite.config.ts)](#vite-configuration-viteconfigts)
  - [ESLint Configuration (eslint.config.js)](#eslint-configuration-eslintconfigjs)
  - [API Configurations (src/api/apiconfigs.tsx)](#api-configurations-srcapiapiconfigstsx)
  - [CodeSearch Component (src/components/CodeSearch.tsx)](#codesearch-component-srccomponentscodesearchtsx)
  - [GeneralInfo Component (src/components/GeneralInfo.tsx)](#generalinfo-component-srccomponentsgeneralinfotsx)
  - [GithubContext and GithubProvider (src/context/useGithubContext.tsx)](#githubcontext-and-githubprovider-srccontextusegithubcontexttsx)
  - [Gemini API Integration (src/geminiAPI/geminiAPI.tsx)](#gemini-api-integration-srcgeminiapigeminiapitsx)
  - [Tailwind CSS Configuration](#tailwind-css-configuration)

## How-To Guides

This section provides step-by-step instructions on how to perform common tasks with this application.

### Setting Up the Development Environment

Before you can run the application, you need to set up your development environment.

1.  **Install Node.js and npm/pnpm:**  This project uses Node.js as its runtime environment and pnpm for package management. Download and install Node.js from the [official Node.js website](https://nodejs.org/). npm is included with Node.js. However, this project uses pnpm, therefore pnpm must be installed globally.
    ```bash
    npm install -g pnpm
    ```
2.  **Clone the repository:** Clone the SC4052-Cloud-Computing-Assignment-2 repository from GitHub to your local machine.
    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```
3.  **Install dependencies:** Use pnpm to install the required dependencies listed in `package.json`.
    ```bash
    pnpm install
    ```
4.  **Create `.env` file:** Create a `.env` file in the project's root directory and define the following environment variables. This project uses Vite, therefore all env variables must start with `VITE_`.
    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```
    * Replace `<your_github_token>` with a personal access token from GitHub with code search permissions. You can create one at [GitHub Personal Access Tokens](https://github.com/settings/tokens).
    *   Replace `<your_gemini_api_key>` with an API key from Google Gemini.
        *   Please note: to use Gemini, you must go through the API setup process:
        *   Go to [makersuite.google.com](https://makersuite.google.com/) and sign in with your Google account.
        *   Create a new project if needed.
        *   Click on "Get API key" to generate an API key for your project.
5. **Github Token Requirements**
  * Create a personal access token with the `repo`, `read:user`, and `search:code` scopes.

### Running the Application

Once you have set up your development environment, you can run the application.

1.  **Start the development server:** Use pnpm to start the Vite development server.
    ```bash
    pnpm dev
    ```
2.  **Access the application:** Open your web browser and navigate to the address provided in the console (usually `http://localhost:5173/`).

### Searching for Code on GitHub

The application allows you to search for code snippets on GitHub.

1.  **Navigate to the "CodeSearch" tab:** Click on the "CodeSearch" tab in the sidebar.
2.  **Enter your search query:** Type your code snippet or keywords into the text input field.
3.  **Filter by file types (optional):** Enter comma-separated file extensions (e.g., `js,py,ts`) into the "Filter by file types" input field. Leave empty to search all file types.
4.  **Click the "Search" button:** This will initiate the code search on GitHub based on your criteria.
5.  **View the results:** The search results will be displayed as a list of code snippets with links to the corresponding files on GitHub.

### Describing Code Snippets with Gemini

You can use the application to generate descriptions of code snippets using the Google Gemini API.

1.  **Search for code (as described above).**
2.  **Locate the code snippet you want to describe in the search results.**
3.  **Click the "Describe" button next to the code snippet.** The application will send the code snippet to the Gemini API and generate a description.
4.  **View the generated description:** The description will be displayed below the corresponding code snippet.

### Configuring General Information

The "GeneralInfo" tab allows you to configure your GitHub username and API token, and select a repository.

1.  **Navigate to the "GeneralInfo" tab:** Click on the "GeneralInfo" tab in the sidebar.
2.  **Enter your GitHub token:** Type or paste your GitHub personal access token into the "GitHub Token" input field.
3.  **Enter your GitHub username:** Type your GitHub username into the "GitHub Username" input field.
4.  **Select a repository (optional):** Choose a repository from the "Repository Name" dropdown. This will limit code searches to the selected repository. If the correct repository is not displayed, click the "Get Repos" button.

## Reference Guides

This section provides detailed information about the main components and files in the repository.

### App.tsx

*File path: github-search-saas/src/App.tsx*

This is the main component of the application. It manages the tab navigation and renders the corresponding component based on the selected tab.

*   **State:** `tab` - stores the currently selected tab (`GeneralInfo`, `CodeSearch`, or `CodeEdit`).
*   **Functionality:**
    *   Renders a sidebar with tab navigation links.
    *   Renders the `GeneralInfo`, `CodeSearch`, or `CodeEdit` component based on the selected tab.
    *   Uses the `GithubProvider` to provide the application state to the components.

### Vite Configuration (vite.config.ts)

*File path: github-search-saas/vite.config.ts*

This file contains the configuration for the Vite build tool.

*   **Plugins:**
    *   `react()`:  A Vite plugin that provides React Fast Refresh support.
    *   `tailwindcss()`:  A Vite plugin that integrates Tailwind CSS into the project.

### ESLint Configuration (eslint.config.js)

*File path: github-search-saas/eslint.config.js*

This file contains the configuration for ESLint, a JavaScript linting tool.

*   **Extends:**
    *   `@eslint/js.configs.recommended`:  Extends the recommended ESLint rules for JavaScript.
    *   `...tseslint.configs.recommended`:  Extends the recommended ESLint rules for TypeScript.
*   **Plugins:**
    *   `'react-hooks'`:  Provides linting rules for React Hooks.
    *   `'react-refresh'`:  Provides linting rules for React Refresh.
*   **Rules:**
    *   `react-hooks.configs.recommended.rules`: Includes recommended react hooks linting rules.
    *   `'react-refresh/only-export-components'`: Warns when modules export something other than components.

### API Configurations (src/api/apiconfigs.tsx)

*File path: github-search-saas/src/api/apiconfigs.tsx*

This file defines the API configurations for interacting with the GitHub API.

*   **Constants:**
    *   `GITHUB_TOKEN`: Reads the GitHub token from environment variables.  **Important:** Ensure `VITE_GITHUB_TOKEN` is set in your `.env` file.
    *   `GITHUB_API_URL`: The base URL for the GitHub API.
*   **Axios instances:** Creates pre-configured Axios instances for specific GitHub API endpoints:
    *   `githubSearchCodeApi`: For searching code.
    *   `githubSearchRepoApi`: For searching repositories.
    *   `githubGetCodeApi`: For getting code.
    *   Each Axios instance includes a `Authorization` header with your GitHub token.

### CodeSearch Component (src/components/CodeSearch.tsx)

*File path: github-search-saas/src/components/CodeSearch.tsx*

This component provides the code search functionality.

*   **Context:** Uses the `useGithubContext` hook to access the application state (username, repository, search query, etc.).
*   **State:**
    *   `loading`: Indicates whether a search is in progress.
    *   `error`: Stores any error message that occurred during the search.
    *   `loadingDescriptions`: An object keeping track of which code descriptions are currently loading.
*   **Functionality:**
    *   Handles user input for the search query and file types.
    *   Calls the GitHub API to search for code based on the user's input.
    *   Displays the search results as a list of code snippets.
    *   Allows the user to select code snippets.
    *   Provides a button to generate a description of each code snippet using the Gemini API.
*   **`handleSearch` function:**
    *   Constructs a query string based on the user's input.
    *   Calls the GitHub API to search for code.
    *   Updates the `results` state with the search results.
    *   Handles any errors that occur during the search.
*   **`describeCode` function:**
    *   Fetches the content of the selected code file using `octokit`
    *   Calls the Gemini API to generate a description of the code snippet.
    *   Updates the `descriptions` state with the generated description.

### GeneralInfo Component (src/components/GeneralInfo.tsx)

*File path: github-search-saas/src/components/GeneralInfo.tsx*

This component allows the user to configure their GitHub username, API token, and select a repository.

*   **Context:** Uses the `useGithubContext` hook to access and update the application state (username, repository, token).
*   **State:**
    *   `loading`: Indicates whether the repository list is being fetched.
    *   `error`: Stores any error message that occurred while fetching repositories.
*   **Functionality:**
    *   Provides input fields for the user to enter their GitHub username and API token.
    *   Provides a dropdown list of repositories for the user to select.
    *   Fetches the user's repositories from the GitHub API when the "Get Repos" button is clicked.
*   **`fetchRepos` function:**
    *   Calls the GitHub API to retrieve the user's repositories.
    *   Updates the `repos` state with the list of repository names.
    *   Handles any errors that occur during the retrieval process.

### GithubContext and GithubProvider (src/context/useGithubContext.tsx)

*File path: src/context/useGithubContext.tsx*

This file defines the `GithubContext` and `GithubProvider` for managing the application's global state.

*   **GithubContext:** A React context that provides access to the following state variables:
    *   `username`: The user's GitHub username.
    *   `repository`: The selected repository name.
    *   `token`: The user's GitHub API token.
    *   `selectedItems`: The list of selected code snippet SHAs.
    *   `repos`: The list of the user's repository names.
    *    `query`: The text that user inputs in CodeSearch.
    *    `fileTypes`: The file types that user inputs in CodeSearch.
    *   `results`: The results from Github Search.
    *   `descriptions`: descriptions from Gemini.
*   **GithubProvider:** A React component that provides the `GithubContext` to its children.
    *   Manages the state variables and provides functions to update them.
    *   The `setToken` function allows updating the GitHub API token.
*   **useGithubContext:** A custom hook that provides easy access to the `GithubContext` values.

### Gemini API Integration (src/geminiAPI/geminiAPI.tsx)

*File path: src/geminiAPI/geminiAPI.tsx*

This file defines the integration with the Google Gemini API for generating code descriptions.

*   **Configuration:**
    *   Reads the Gemini API key from environment variables.  **Important:** Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file.
    *   Configures the Gemini API client with the API key and model settings.
*   **`generateContent` function:**
    *   Takes a prompt string as input.
    *   Sends the prompt to the Gemini API.
    *   Returns the generated text from the API response.
    *   **Important:** As per the documentation, the model is `gemini-2.0-flash`.

### Tailwind CSS Configuration

*Applies across multiple files: src/index.css, src/App.css, tailwind.config.js (if applicable)*

This project utilizes Tailwind CSS for styling. The `src/index.css` and `src/App.css` files are used to import tailwind.config.js (if applicable), which is the entry point for Tailwind's styles. Refer to the Tailwind CSS documentation for details on configuring and customizing the styles.
