# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides comprehensive documentation for the SC4052-Cloud-Computing-Assignment-2 repository. It's split into two sections: How-to Guides and Reference Guides. The how-to guides are designed to help you accomplish specific tasks, while the reference guides provide detailed information about the components and their functionalities.

## How-to Guides

### 1. Setting up the Project

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install Dependencies:**
    This project uses `pnpm` as the package manager. If you don't have it installed, you can install it using `npm`:

    ```bash
    npm install -g pnpm
    ```

    Then, install the project dependencies:

    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `github-search-saas` directory. You'll need to define the following environment variables:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    *   Replace `<your_github_token>` with a personal access token from GitHub that has code search access.
    *   Replace `<your_gemini_api_key>` with your Gemini API key.

4.  **Run the Application:**

    ```bash
    pnpm dev
    ```

    This will start the development server. The application should be accessible in your browser at `http://localhost:<port>`, where `<port>` is the port number shown in your terminal.

### 2. Performing a Code Search

1.  **Navigate to the CodeSearch Tab:**
    Click on the "CodeSearch" tab in the sidebar of the application.

2.  **Enter Search Query:**
    In the text input field labeled "Enter code snippet...", type the code snippet or keyword you want to search for.

3.  **Filter by File Types (Optional):**
    In the text input field labeled "Filter by comma separated file types...", enter a comma-separated list of file extensions (e.g., `js,py,java`) to narrow your search to specific file types.

4.  **Click "Search":**
    Click the "Search" button. The application will display a list of code snippets matching your query and file type filters.

5.  **Describe Code (Optional):**
    Click the "Describe" button next to a search result to generate a summary of what the code does. This uses the Gemini API, so ensure your API key is set up correctly.

### 3. Using the General Information Tab

1.  **GitHub Token:** Enter your GitHub personal access token in the "GitHub Token" field.
2.  **GitHub Username:** Enter the GitHub username whose repositories you want to search through in the "GitHub Username" field.
3.  **Repository Name:**
    *   If you want to search through a specific repository, first enter the GitHub username.
    *   Then, click the "Get Repos" button.
    *   A dropdown menu will appear with a list of the user's repositories. Select the desired repository from the dropdown.

## Reference Guide

### 1. `README.md`

*   **Purpose:**  Provides a basic introduction to the project, instructions on setting up and expanding the ESLint configuration, and links to relevant resources.

### 2. `package.json`

*   **Purpose:**  Defines the project's metadata, dependencies, and scripts.
*   **Key Dependencies:**
    *   `react`:  A JavaScript library for building user interfaces.
    *   `react-dom`:  Provides DOM-specific methods that are useful for managing the app in a web browser.
    *   `vite`:  A build tool that provides a fast and streamlined development experience.
    *   `@vitejs/plugin-react-swc`:  A Vite plugin that uses SWC for fast refresh.
    *   `tailwindcss`: A utility-first CSS framework.
    *   `axios`: A promise-based HTTP client for making API requests.
    *   `octokit`: A GitHub API client for interacting with the GitHub API.
    *   `react-markdown`: A component to render Markdown.
    *    `@google/generative-ai`: Google Gemini API SDK
*   **Key DevDependencies:**
    *   `@types/react`, `@types/react-dom`:  TypeScript definitions for React.
    *   `typescript`:  A superset of JavaScript that adds static typing.
    *   `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`:  Tools for linting and code analysis.
    *   `typescript-eslint`:  Tools to enable ESLint to understand TypeScript code.

### 3. `vite.config.ts`

*   **Purpose:**  Configures the Vite build tool.
*   **`plugins`:**  An array of Vite plugins used in the project. Includes `@vitejs/plugin-react-swc` for React support and `tailwindcss` for Tailwind CSS.

### 4. `eslint.config.js`

*   **Purpose:**  Configures ESLint, a JavaScript linter.
*   **`extends`:**  Specifies a set of pre-defined ESLint rules and configurations.
    *   `@eslint/js.configs.recommended`: Provides a set of recommended JavaScript linting rules.
    *   `tseslint.configs.recommended`: Provides a set of recommended TypeScript linting rules.
*   **`plugins`:**  Defines the ESLint plugins used in the project.
    *   `react-hooks`:  Enforces the rules of React Hooks.
    *   `react-refresh`:  Ensures that only React components are exported for Fast Refresh.
*   **`rules`:**  Customizes the ESLint rules.

### 5. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

*   **Purpose:**  Configure the TypeScript compiler.
*   **`tsconfig.json`:** The base configuration file that references the app and node configs.
*   **`tsconfig.app.json`:**  Configuration specific to the React application.  Includes settings for target ECMAScript version, module system, JSX transformation, and strict type checking.
*   **`tsconfig.node.json`:** Configuration specific to node environment.

### 6. `src/main.tsx`

*   **Purpose:**  The entry point of the React application.
*   **Functionality:**  Renders the `App` component into the HTML element with the ID `root`.

### 7. `index.html`

*   **Purpose:**  The main HTML file for the application.
*   **Functionality:**  Contains the `<div id="root"></div>` element where the React application will be mounted.  Also includes the `<script type="module" src="/src/main.tsx"></script>` to load the application code.

### 8. `src/App.tsx`

*   **Purpose:**  The main component of the application.
*   **Functionality:**
    *   Manages the state for the active tab using `useState`.
    *   Renders different components based on the active tab: `GeneralInfo`, `CodeSearch`, and `CodeEdit`.
    *   Wraps the components with `GithubProvider` to provide access to the Github context.

### 9. `src/App.css`, `src/index.css`

*   **Purpose:**  CSS files for styling the application.
*   **`src/App.css`:** Primarily used for importing tailwind and setting up the root container.
*   **`src/index.css`:** Includes global styles and Tailwind CSS imports.

### 10. `src/vite-env.d.ts`

*   **Purpose:**  A declaration file that provides type definitions for Vite's environment variables.

### 11. `src/api/apiconfigs.tsx`

*   **Purpose:**  Contains API configurations for interacting with the GitHub API and Google Gemini API.
*   **`GITHUB_TOKEN`:** The GitHub personal access token, retrieved from environment variables.
*   **`GEMINI_API_KEY`:** The Google Gemini API key, retrieved from environment variables.
*   **`octokit`:** An instance of the `Octokit` class, configured with the GitHub token. Used to make authenticated requests to the GitHub API.
*   **`GITHUB_API_URL`:** Base URL for Github API.
*   **`githubSearchCodeApi`:** axios instance for the Github Code Search API.
*   **`githubSearchRepoApi`:** axios instance for the Github Repository Search API.
*   **`githubGetCodeApi`:** axios instance for getting Github Code.

### 12. `src/components/CodeSearch.tsx`

*   **Purpose:**  A component that provides a user interface for searching code on GitHub.
*   **Functionality:**
    *   Uses the `useGithubContext` hook to access the username, repository, query, fileTypes, results, and descriptions states.
    *   Provides input fields for entering a search query and filtering by file types.
    *   Uses the `octokit` to make requests to the GitHub API's code search endpoint.
    *   Displays the search results in a list.
    *   Provides a "Describe" button for each result, which uses the Gemini API to generate a summary of the code snippet.
*   **Key Functions:**
    *   `handleSearch`: Performs a code search using the GitHub API based on the current query and file type filters.
    *   `describeCode`: Generates a description of the code using the Gemini API.
*   **Notable Libraries:**
    *   `react-markdown`: Used to render the Gemini API's generated descriptions as Markdown.

### 13. `src/components/GeneralInfo.tsx`

*   **Purpose:**  A component for setting the GitHub username and repository.
*   **Functionality:**
    *   Uses the `useGithubContext` hook to access and update the username and repository states.
    *   Provides input fields for entering the GitHub username and repository name.
    *   Fetches the list of repositories when the username is entered and displays them in a dropdown.
*   **Key Functions:**
    *   `fetchRepos`: Fetches the user's repositories from the GitHub API and updates the `repos` state.

### 14. `src/context/useGithubContext.tsx`

*   **Purpose:**  Provides a React context for managing the application's state.
*   **Functionality:**
    *   Creates a `GithubContext` using `createContext`.
    *   Defines a `GithubProvider` component that wraps the application and provides the context.
    *   Uses `useState` to manage the username, repository, token, selectedItems, repos, query, fileTypes, results, and descriptions states.
    *   Provides setter functions for updating the states.
*   **Key States:**
    *   `username`:  The GitHub username.
    *   `repository`:  The repository name.
    *   `token`:  The GitHub token.
    *   `selectedItems`: The selected code snippets.
    *   `repos`:  The list of repositories.
    *    `query`: Search term.
    *    `fileTypes`: file types for the search.
    *    `results`: Results from code search.
    *   `descriptions`: Gemini code descriptions.
*   **Key Functions:**
    *   `useGithubContext`:  A hook that provides access to the Github context.

### 15. `src/geminiAPI/geminiAPI.tsx`

*   **Purpose:**  Handles interactions with the Google Gemini API.
*   **Functionality:**
    *   Initializes the Gemini API client with the API key from environment variables.
    *   Provides a function `generateContent` that takes a prompt and returns the generated text from the Gemini API.

## Troubleshooting

*   **API Key Issues:**
    *   Ensure that the `.env` file contains the correct API keys.
    *   Verify that the API keys have the necessary permissions and are active.
*   **GitHub API Rate Limits:**
    *   The GitHub API has rate limits. If you exceed the rate limit, you may need to wait before making more requests. Authenticated requests have higher rate limits.
*   **Dependency Issues:**
    *   If you encounter issues with dependencies, try deleting the `node_modules` folder and running `pnpm install` again. Also delete the `pnpm-lock.yaml`.

This documentation provides a comprehensive overview of the SC4052-Cloud-Computing-Assignment-2 repository. If you have further questions or need additional assistance, please refer to the project's issue tracker or contact the project maintainers.
