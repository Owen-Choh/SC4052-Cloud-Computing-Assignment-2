# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Assignment-2 repository. It is designed for both beginners and advanced users, offering detailed instructions and reference information to help you understand and utilize the application effectively.

## How-To Guides

This section provides step-by-step instructions for common tasks you might perform with this application.

### 1. Setting up the Project

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install dependencies:**

    This project uses `pnpm` as its package manager. If you don't have it installed, install it globally:

    ```bash
    npm install -g pnpm
    ```

    Then, install the project dependencies:

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the `github-search-saas/` directory with the following variables:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    Replace `<your_github_token>` with a personal access token from GitHub and `<your_gemini_api_key>` with your Gemini API key.

    **Important:** Keep your tokens secure and do not commit the `.env` file to your repository.

4.  **Start the development server:**

    ```bash
    pnpm dev
    ```

    This command will start the application, and you can view it in your browser at `http://localhost:<port>`, where `<port>` is usually `5173`.

### 2. Using the Application

1.  **General Information Tab:**
    *   Enter your GitHub token and username in the provided input fields.
    *   Click the "Get Repos" button to fetch the repositories associated with the entered username.
    *   Select a repository from the dropdown menu. This selection is required for code search and documentation generation.

2.  **Code Search Tab:**
    *   Enter a search query in the "Enter code snippet..." input field.
    *   Optionally, filter by file types by entering comma-separated extensions in the "Filter by comma seperated file types..." input field.
    *   Click the "Search" button to initiate the code search.
    *   Select relevant code snippets using the checkboxes next to each result.
    *   Click the "Describe" button to get a description from the Gemini API.

3.  **Code Edit Tab:**
    *   Ensure that a repository is selected in the "General Information" tab and results are found with items selected from the "Code Search" tab.
    *   Click the "Generate Documentation" button to generate documentation for the selected code snippets. The generated documentation will appear in the output textarea.

## Reference Guide

This section provides detailed information about the key components and files in the repository.

### 1. Core Files

*   **`README.md`**: Provides a brief overview of the project and initial setup instructions.
    *   *Note:* Always refer to this file first for a quick understanding of the project.

*   **`github-search-saas/src/App.tsx`**: The main application component that renders the layout and handles tab navigation.
    *   It maintains the state for the active tab (`GeneralInfo`, `CodeSearch`, or `CodeEdit`) and renders the corresponding component.
    *   It uses `GithubProvider` to wrap the content and provide context to all child components.

*   **`github-search-saas/vite.config.ts`**: Configuration file for Vite, the build tool.
    *   It specifies the plugins used, including `react` (for React support) and `tailwindcss` (for Tailwind CSS integration).

*   **`github-search-saas/eslint.config.js`**: Configuration file for ESLint, a JavaScript linter.
    *   It extends recommended configurations and sets up rules for React Hooks and React Refresh.
    *   *Note:*  Pay attention to the `parserOptions` section if you expand the ESLint configuration for production applications.

*   **`github-search-saas/src/main.tsx`**: Entry point for the React application.
    *   It renders the `App` component inside a `StrictMode` block.

*   **`github-search-saas/index.html`**: The main HTML file that hosts the React application.
    *   It includes the root element with the id "root" where the React app is mounted.

### 2. API Configurations

*   **`github-search-saas/src/api/apiconfigs.tsx`**: Contains configuration settings and instances for interacting with the GitHub API.

    *   **`GITHUB_TOKEN: string`**: Your GitHub personal access token, obtained from environment variables. Ensure this is set in your `.env` file.
    *   **`GEMINI_API_KEY: string`**: Your Gemini API key, obtained from environment variables. Ensure this is set in your `.env` file.
    *   **`octokit`**: An instance of the Octokit library, authenticated with your GitHub token.  This is the main way we access the github API.
    *   **`GITHUB_API_URL`**:  A string containing the base URL for the GitHub API.
    *   **`githubSearchCodeApi`**: An Axios instance configured to make requests to the GitHub code search API. It includes the base URL and authorization header.
    *   **`githubSearchRepoApi`**: An Axios instance configured to make requests to the GitHub repository search API. It includes the base URL and authorization header.
    *   **`githubGetCodeApi`**: An Axios instance configured to get the code of a certain file. It includes the base URL and authorization header.
    *   *Note:*  Properly setting the `GITHUB_TOKEN` is crucial for the application to authenticate with the GitHub API.

### 3. Components

*   **`github-search-saas/src/components/GeneralInfo.tsx`**: Component for gathering general information from the user.

    *   Allows the user to input their GitHub username and token.
    *   Fetches a list of repositories for the given username.
    *   Provides a dropdown menu for selecting a repository.
    *   *Note:*  The state of the username and selected repository is managed using the `useGithubContext` hook.

*   **`github-search-saas/src/components/CodeSearch.tsx`**: Component for searching code on GitHub.

    *   Takes a search query and file types as input.
    *   Uses the `octokit` to perform a code search.
    *   Displays the search results and allows the user to select specific items.
        *The description can be viewed by clicking the "Describe" button.
    *   *Note:*  The component uses the `useGithubContext` hook to access and update the search query, file types, search results, descriptions and selected items.

*   **`github-search-saas/src/components/CodeEdit.tsx`**: Component for generating documentation for selected code.

    *   Retrieves selected code snippets from the `useGithubContext`.
    *   Sends the code to the Gemini API to generate documentation.
    *   Displays the generated documentation in a textarea.
    *   *Note:*  This component uses the `generateContent` function to interact with the Gemini API.

### 4. Context

*   **`github-search-saas/src/context/useGithubContext.tsx`**: Provides a context for managing the application's state.

    *   **`GithubContext`**: A React context object.
    *   **`useGithubContext`**: A custom hook for accessing the context.
    *   **`GithubProvider`**: A component that provides the context to its children.
    *   It includes state variables for:
        *   `username`: The GitHub username.
        *   `repository`: The selected repository name.
        *   `token`: The GitHub token.
        *   `selectedItems`: An array of selected code snippets.
        *   `repos`: An array of repository names.
        *   `query`: The code search query.
        *   `fileTypes`: The file type filters.
        *   `results`: The search results.
        *   `descriptions`: The descriptions of code snippets.
    *   It also includes setter functions for updating these state variables.
    *   *Note:* All relevant information should be accessed using this context so that the application functions

### 5. Gemini API

*   **`github-search-saas/src/geminiAPI/geminiAPI.tsx`**: Contains the logic for interacting with the Gemini API.

    *   **`generateContent(prompt: string)`**: A function that sends a prompt to the Gemini API and returns the generated content.
    *   *Note:* Ensure that the `GEMINI_API_KEY` is correctly set in the `.env` file for this to work.

### 6. Styling

*   **`github-search-saas/src/App.css`**: Global styles for the application.  Largely unused but can be expanded.
*   **`github-search-saas/src/index.css`**: Global styles for the application, including Tailwind CSS imports.
    *   *Note:*  Tailwind CSS classes are used extensively for styling the components.

### 7. Other files

*   **`github-search-saas/tsconfig.json`**,  **`github-search-saas/tsconfig.app.json`**,  **`github-search-saas/tsconfig.node.json`**: TypeScript configuration files.  `tsconfig.json` references the other two, which configure the typescript compilation.
*   **`github-search-saas/pnpm-lock.yaml`**: Records the dependency tree.
*   **`github-search-saas/package.json`**: Records the project dependencies.

This documentation should give you a good starting point to understand and work with the SC4052-Cloud-Computing-Assignment-2 repository. Good luck!
