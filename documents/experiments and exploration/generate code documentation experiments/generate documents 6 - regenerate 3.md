# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Assignment-2 repository. It is designed for users of all skill levels, from beginners to experienced developers.

## How-To Guides

*   **Setting up the Project:**
    1.  **Clone the repository:** `git clone <repository_url>`
    2.  **Install dependencies:** `npm install`
    3.  **Configure environment variables:** Create a `.env` file in the `github-search-saas` directory and add your Github token and Gemini API Key:
        ```
        VITE_GITHUB_TOKEN=<your_github_token>
        VITE_GEMINI_API_KEY=<your_gemini_api_key>
        ```
        *Important*: Ensure that these values are kept secret and not committed to the repository.
    4.  **Run the development server:** `npm run dev`
    5.  **Access the application:** Open your browser and navigate to the address shown in the console (usually `http://localhost:5173/`).

*   **Using the Application:**
    1.  **General Information Tab:** Enter your GitHub username and token. Click "Get Repos" to populate the repository dropdown with your repositories. Select a repository from the dropdown.
    2.  **CodeSearch Tab:** Enter a code snippet to search for in the selected repository. You can also filter by file types (e.g., `.js, .py`). Click "Search" to view the results.
    3.  **CodeEdit Tab:** Review the search results. You can select specific files using the checkboxes, then click the "Generate Documentation" button, and the result will appear in the text box below.

*   **Generating Documentation:**
    1.  Navigate to the "CodeEdit" tab.
    2.  If you have not done so yet, fill in the Username and Repository in the "GeneralInfo" tab, and perform a search in the "CodeSearch" tab.
    3.  Ensure you've selected the files you want to include in the documentation.
    4.  Click the "Generate Documentation" button. The generated documentation will appear in the output textarea.
    5.  Click the "Download" button to download the generated documentation as a markdown file.
    6.  If you want to regenerate documentation, clear your cache for the generated content.

## Reference Guide

### **Project Structure**

The project is structured as follows:

```
SC4052-Cloud-Computing-Assignment-2/
├── github-search-saas/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiconfigs.tsx
│   │   ├── components/
│   │   │   ├── CodeEdit.tsx
│   │   │   ├── CodeSearch.tsx
│   │   │   └── GeneralInfo.tsx
│   │   ├── context/
│   │   │   └── useGithubContext.tsx
│   │   ├── geminiAPI/
│   │   │   └── geminiAPI.tsx
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   ├── .eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── tsconfig.node.json
└── README.md
```

*   `github-search-saas/`: Contains the source code for the React application.
*   `src/`: Contains the React components, styles, and logic.
*   `api/`: Contains the API configurations to connect to the Github and Gemini APIs.
*   `components/`: Contains the React components for the application.
*   `context/`: Contains the React context provider to manage the application state.
*   `geminiAPI/`: Contains the Google Gemini API to generate documentation.
*   `App.tsx`: The main application component.
*   `main.tsx`: Entry point for the React application.
*   `.eslint.config.js`: Configuration file for ESLint.
*   `index.html`: The main HTML file.
*   `package.json`: Contains the project's dependencies and scripts.
*   `README.md`: Provides a general overview of the project.
*   `tsconfig.json`: Contains the project's TypeScript configuration.

### **Key Components**

*   **`App.tsx`:**
    *   Responsible for the main application structure.
    *   Includes a sidebar for navigation between the "GeneralInfo", "CodeSearch", and "CodeEdit" tabs.
    *   Uses a `GithubProvider` to make application state available to all components.
    *   `setTab`: A `useState` hook to track the selected tab, and change the rendered component.

*   **`src/components/GeneralInfo.tsx`:**
    *   Allows users to enter their GitHub username and token.
    *   Fetches repositories based on the entered username and displays them in a select dropdown.
    *   Manages application state for username, repository and token.
    *   `fetchRepos`: Makes an API call to the Github repos API to get all repos from the user.

*   **`src/components/CodeSearch.tsx`:**
    *   Provides a search interface for GitHub code.
    *   Allows users to enter a search query and filter by file types.
    *   Displays search results with checkboxes to select specific files.
    *   Uses the Github `octokit` API to get results from the Github repos.
    *   `handleSearch`: Makes an API call to the Github search API to get the code search results.
    *   `describeCode`: Makes a call to the Gemini API to get a summary of the code.

*   **`src/components/CodeEdit.tsx`:**
    *   Displays the selected code files and allows users to generate documentation.
    *   Communicates with the Gemini API to generate documentation based on the selected code.
    *   Provides a download button to save the generated documentation.
    *   Uses local caching to improve response times from the Gemini API.
    *   `generateDocumentation`: Makes a call to the Gemini API to generate documentation.
    *   `downloadOutput`: Allows for downloading the contents of the `Output` text box.
    *   `clearGenContent`: Clears the `generatedContent` and `finalPrompt` cache variables.
    *   `clearRepoContent`: Clears the `repoFileContents` cache variables.

*   **`src/context/useGithubContext.tsx`:**
    *   Provides a context for managing application state, such as the GitHub username, repository, token, selected files, and search results.
    *   Makes these available to all components within the `GithubProvider`.
    *   `GithubContextType`: Typescript type for the context.
    *   `useGithubContext`: Hook to use the context within the application.
    *   `GithubProvider`: Context Provider for providing state across the application.

*   **`src/api/apiconfigs.tsx`:**
    *   Configures the Axios API client for making requests to the GitHub API.
    *   Sets the base URL and authorization headers.
    *   Exports a configured `octokit` instance and Axios instances for code and repository searches.
    *   `GITHUB_TOKEN`: Variable for storing the Github API Token.
    *   `GEMINI_API_KEY`: Variable for storing the Gemini API Key.
    *   `octokit`: Configured Octokit instance.
    *   `githubSearchCodeApi`: Configured Axios API instance for code search.
    *   `githubSearchRepoApi`: Configured Axios API instance for repository search.
    *   `githubGetCodeApi`: Configured Axios API instance for getting the code from the Github repos.

*   **`src/geminiAPI/geminiAPI.tsx`:**
    *   Configures the connection with the Google Gemini API.
    *   Provides a function to generate content based on a given prompt.
    *   `generateContent`: Function to generate content for a given prompt with the default config.
    *   `generateContentWithConfig`: Function to generate content for a given prompt with the custom config.

### **Environment Variables**

The application requires the following environment variables:

*   `VITE_GITHUB_TOKEN`: Your GitHub personal access token.  This token needs the `repo` scope to access private repositories.
*   `VITE_GEMINI_API_KEY`: Your Google Gemini API key.

These variables must be set in a `.env` file in the project directory.

### **Notes and Considerations**

*   **API Rate Limits:** The GitHub API has rate limits. Be mindful of these limits when making requests, especially during development.
*   **Error Handling:** The application includes basic error handling, but you may need to add more robust error handling for production use.
*   **Security:** Store your GitHub token securely and avoid committing it to the repository. Use environment variables to manage sensitive information.
*   **Gemini API Usage:**  The quality of the generated documentation depends on the prompt you provide to the Gemini API. Experiment with different prompts to achieve the best results.
*   **Caching:** The CodeEdit component implements basic caching. Consider implementing a more sophisticated caching strategy for production environments.
*   **Dependencies:** The project uses the following key dependencies:
    *   `react`: For building the user interface.
    *   `axios`: For making HTTP requests to the GitHub API.
    *   `octokit`: For interacting with the GitHub API.
    *   `@google/generative-ai`: For generating content through Google's generative AI models.
    *   `tailwindcss`: A utility-first CSS framework for rapidly designing custom designs.
    *   `@mui/material`: A comprehensive suite of UI components.
*   **Octokit vs Axios:** The project uses both Octokit and Axios. The Octokit library is a higher-level abstraction that provides convenient methods for interacting with the GitHub API, especially for operations like search. Axios is used for more general HTTP requests where Octokit's features are not necessary.

This documentation should provide a solid foundation for understanding and working with the SC4052-Cloud-Computing-Assignment-2 repository. Remember to consult the source code for more detailed information on specific components and functionalities.
