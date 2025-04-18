# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Assignment-2 repository. It is divided into two sections: How-To Guides and Reference Guides.

## How-To Guides

This section provides step-by-step instructions on how to perform common tasks within the application.

### Setting up the project

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    Create a `.env` file in the root directory of the `github-search-saas` folder. Add your GitHub token and Gemini API key to the `.env` file:
    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```
    **Note:** Ensure you have a valid GitHub token with the necessary permissions to search code and access repositories. Also, make sure your Gemini API key is valid and has been properly set up.
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the application in development mode, usually on `http://localhost:5173`.

### Searching for code

1.  Navigate to the `CodeSearch` tab in the application.
2.  Enter your search query in the input field.
3.  Optionally, filter by file types by entering comma-separated file extensions (e.g., `js,ts,py`) in the "Filter by file types" input field.
4.  Click the "Search" button.
5.  The search results will be displayed below.

### Generating documentation for code

1.  First, perform a code search as described above.
2.  In the `CodeSearch` tab, select the checkboxes next to the files you want to include in the documentation.
3.  Navigate to the `CodeEdit` tab.
4.  Ensure that the correct username and repository are selected in the `GeneralInfo` tab.
5.  Click the "Generate Documentation" button.
6.  The generated documentation will appear in the "Output" textarea.
7.  You can download the generated documentation as a markdown file by clicking the "Download" button.

### Clearing generated content or repo content

1.  Navigate to the `CodeEdit` tab.
2.  Click the "Clear generated content" button to clear the generated documentation from the output textarea and the cache.
3.  Click the "Clear repo content" button to clear the cached repository file contents.

## Reference Guide

This section provides detailed information about the different components, APIs, and context providers used in the application.

### Components

*   **`App.tsx`**: This is the main component that renders the entire application. It manages the tab state and renders the appropriate component based on the selected tab.
    *   **State:**
        *   `tab`: A string representing the currently selected tab (`GeneralInfo`, `CodeSearch`, or `CodeEdit`).
    *   **Functionality:**
        *   Renders a sidebar with tab navigation.
        *   Renders the selected component within the `GithubProvider`.
*   **`GeneralInfo.tsx`**: This component allows the user to enter their GitHub username, token, and select a repository.
    *   **State:**
        *   `loading`: A boolean indicating whether the repositories are being fetched.
        *   `error`: A string containing any error message that occurred during the repository fetching process.
    *   **Props from `useGithubContext`:**
        *   `username`: The GitHub username.
        *   `setUsername`: A function to set the GitHub username.
        *   `repository`: The selected repository name.
        *   `setRepository`: A function to set the selected repository name.
        *   `token`: The GitHub token.
        *   `setToken`: A function to set the GitHub token.
        *   `repos`: An array of repository names.
        *   `setRepos`: A function to set the array of repository names.
    *   **Functionality:**
        *   Fetches the user's repositories from GitHub using the `githubSearchRepoApi`.
        *   Allows the user to select a repository from a dropdown list.
*   **`CodeSearch.tsx`**: This component allows the user to search for code on GitHub.
    *   **State:**
        *   `loading`: A boolean indicating whether the search is in progress.
        *   `error`: A string containing any error message that occurred during the search process.
        *   `loadingDescriptions`: An object containing the loading state for each code description.
    *   **Props from `useGithubContext`:**
        *   `username`: The GitHub username.
        *   `repository`: The selected repository name.
        *   `selectedItems`: An array of selected item shas.
        *   `setSelectedItems`: A function to set the selected items.
        *   `query`: The search query.
        *   `setQuery`: A function to set the search query.
        *   `fileTypes`: A string containing comma-separated file types to filter by.
        *   `setFileTypes`: A function to set the file types.
        *   `results`: An array of search results.
        *   `setResults`: A function to set the search results.
        *   `descriptions`: An object containing the descriptions for each code item.
        *   `setDescriptions`: A function to set the descriptions.
    *   **Functionality:**
        *   Performs a code search on GitHub using the `githubSearchCodeApi`.
        *   Displays the search results in a list.
        *   Allows the user to select items from the search results.
        *   Fetches and displays descriptions for each code item using the `generateContent` function.
*   **`CodeEdit.tsx`**: This component allows the user to generate documentation for the selected code.
    *   **State:**
        *   `loading`: A boolean indicating whether the documentation generation is in progress.
        *   `error`: A string containing any error message that occurred during the documentation generation process.
        *   `output`: A string containing the generated documentation.
        *   `cache`: A Map used to cache the generated content and repo file contents.
        *   `modelTemperature`: A number representing the model temperature for the Gemini API.
    *   **Props from `useGithubContext`:**
        *   `username`: The GitHub username.
        *   `repository`: The selected repository name.
        *   `selectedItems`: An array of selected item shas.
        *   `results`: An array of search results.
    *   **Functionality:**
        *   Generates documentation for the selected code using the `generateContent` function.
        *   Displays the generated documentation in a textarea.
        *   Allows the user to download the generated documentation as a markdown file.

### APIs

*   **`src/api/apiconfigs.tsx`**: This file contains the API configurations for interacting with the GitHub API and stores the API keys.
    *   `GITHUB_TOKEN`: A string containing the GitHub token.
        *   **Note:** This token should be stored securely and should not be exposed in the client-side code. It is loaded from the `.env` file.
    *   `GEMINI_API_KEY`: A string containing the Gemini API key.
        *   **Note:** This key should be stored securely and should not be exposed in the client-side code. It is loaded from the `.env` file.
    *   `octokit`: An instance of the `Octokit` class, configured with the GitHub token.
    *   `GITHUB_API_URL`: A string containing the base URL for the GitHub API.
    *   `githubSearchCodeApi`: An instance of `axios` configured to search code.
    *   `githubSearchRepoApi`: An instance of `axios` configured to search repositories.
    *   `githubGetCodeApi`: An instance of `axios` configured to get code from a repository.
*   **`src/geminiAPI/geminiAPI.tsx`**: This file contains the API configurations for interacting with the Gemini API.
    *   `generateContent(prompt: string)`: A function that takes a prompt and returns the generated content from the Gemini API.
    *   `generateContentWithConfig(prompt: string, config: GenerationConfig)`: A function that takes a prompt and a configuration object and returns the generated content from the Gemini API.
        *   **Note:** The `GenerationConfig` object allows you to customize the behavior of the Gemini API, such as setting the temperature, topP, and maxOutputTokens.

### Context Providers

*   **`src/context/useGithubContext.tsx`**: This file defines the `GithubContext` context provider, which is used to share state between components.
    *   **`GithubContextType`**: An interface defining the shape of the context value.
        *   `username`: A string representing the GitHub username.
        *   `setUsername`: A function to set the GitHub username.
        *   `repository`: A string representing the selected repository name.
        *   `setRepository`: A function to set the selected repository name.
        *   `token`: A string representing the GitHub token.
        *   `setToken`: A function to set the GitHub token.
        *   `selectedItems`: An array of selected item shas.
        *   `setSelectedItems`: A function to set the selected items.
        *   `repos`: An array of repository names.
        *   `setRepos`: A function to set the array of repository names.
        *   `query`: A string representing the search query.
        *   `setQuery`: A function to set the search query.
        *   `fileTypes`: A string representing the file types to filter by.
        *   `setFileTypes`: A function to set the file types.
        *   `results`: An array of search results.
        *   `setResults`: A function to set the search results.
        *   `descriptions`: An object containing the descriptions for each code item.
        *   `setDescriptions`: A function to set the descriptions.
    *   **`GithubProvider`**: A React component that provides the `GithubContext` to its children.
        *   **Note:** All components that need to access the context value must be wrapped in the `GithubProvider`.
    *   **`useGithubContext`**: A custom hook that allows components to access the `GithubContext` value.
        *   **Note:** This hook must be called within a component that is wrapped in the `GithubProvider`.

### Notes

*   **API Keys:** Ensure that your GitHub token and Gemini API key are stored securely and are not exposed in the client-side code. Use environment variables to store these keys and load them into the application at runtime.
*   **Error Handling:** The application includes basic error handling, but you may want to add more robust error handling to handle different types of errors that can occur during API calls and documentation generation.
*   **Caching:** The application uses a cache to store the generated content and repo file contents. This can improve performance by reducing the number of API calls that are made. However, you should be aware of the potential for stale data and implement a cache invalidation strategy if necessary.
*   **Rate Limiting:** The GitHub API is rate-limited. Be mindful of the rate limits and implement a strategy to handle rate limit errors.
*   **Gemini API Cost:** Be aware of the cost associated with using the Gemini API. The cost depends on the number of requests that are made and the amount of text that is generated.
*   **Model Temperature:** The model temperature affects the randomness of the generated text. A higher temperature will result in more random text, while a lower temperature will result in more predictable text.
