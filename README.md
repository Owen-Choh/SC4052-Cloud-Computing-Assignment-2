# SC4052-Cloud-Computing-Assignment-2

This repository contains a React-based SaaS application developed as part of NTU SC4052 Cloud Computing for searching and editing code on GitHub, enhanced with AI-powered documentation and comment generation. As a demonstration, this README was generated using the application, with light editing and customization to suit this project.

➡️ [Try the app here](https://sc4052-cloud-computing-assignment-2.glitch.me/)

## Description

This project provides a user-friendly interface to:

- Search code within GitHub repositories using keywords and file type filters.
- View and select code snippets for further processing.
- Generate documentation for selected code using the Gemini AI model.
- Check and improve code comments with AI assistance.
- Submit pull requests with generated documentation or improved comments.

## Overview of the Code

The application is structured as follows:

- `github-search-saas/src/`: Contains the main application code.
  - `App.tsx`: The main application component that handles tab navigation between `GeneralInfo`, `CodeSearch`, and `CodeEdit` components.
  - `components/`: Contains React components for different functionalities.
    - `CodeEdit.tsx`: Provides code editing and AI-powered documentation/comment generation features.
    - `CodeSearch.tsx`: Implements code search functionality within GitHub.
    - `GeneralInfo.tsx`: Handles user input for GitHub username, repository, and API tokens.
  - `context/`: Contains the `useGithubContext.tsx` file, which manages global state using React Context.
  - `api/`: Contains `apiconfigs.tsx`, which sets up the Octokit and Axios instances for interacting with the GitHub API.
  - `utils/`: Contains utility functions for API calls, data processing, and cache management.
    - `apiUtils.ts`: Includes functions for fetching file contents and submitting pull requests.
    - `cacheUtils.ts`: Manages caching of API responses and generated content.
    - `generationUtils.ts`: Contains functions for generating READMEs, documentation, and comments using the Gemini AI model.
    - `utils.ts`: Includes utility functions for string manipulation and file downloading.
  - `geminiAPI/`: Contains `geminiAPI.tsx`, which handles interactions with the Gemini AI model.
- `github-search-saas/vite.config.ts`: Configuration file for Vite, the build tool.
- `github-search-saas/eslint.config.js`: Configuration file for ESLint, the linter.

## Architecture

The application follows a component-based architecture using React. It leverages the GitHub API for code search and retrieval, and the Gemini AI model for content generation. React Context is used for managing global state, such as user credentials and search results.

## Setup and Usage

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2/github-search-saas
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables (for convience when running locally):**

    - Create a `.env` file in the `github-search-saas` folder.
    - Add your GitHub token and Gemini API key to the `.env` file:

      ```
      VITE_GITHUB_TOKEN='YOUR_GITHUB_TOKEN'
      VITE_GEMINI_API_KEY='YOUR_GEMINI_API_KEY'
      ```

    - Alternatively, you can set these environment variables directly in your system.
> [!CAUTION]
> Including environment variables when deploying the app will result in leaking them.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server and open the application in your browser.

## Using the Application

1.  **General Information Tab:**

    - Enter your GitHub username and token.
    - Select a repository from the list of repositories fetched using your GitHub username and token.

2.  **Code Search Tab:**

    - Enter a keyword to search for code.
    - Filter by file types (e.g., `js,py,tsx`).
    - View the search results and select code snippets for further processing.

3.  **Code Edit Tab:**

    - Generate documentation for the selected code using the "Generate Documentation" button.
    - Check and improve code comments with AI assistance using the "Generate and Check Comments for all selected files" button.
    - Submit pull requests with generated documentation or improved comments.
> [!TIP]
> Try getting the entire repo in Code Search for best results!

## Important Notes

-   **Do not commit your `.env` file** containing your GitHub token and Gemini API key to the repository. This file should be kept private.
-   Ensure that your GitHub token has the necessary permissions (read and write access to code and pull requests) for the application to function correctly.
-   The Gemini API key is required for generating documentation and comments. You can obtain a free API key from Google Gemini as of time of writing.
-   The application uses caching to improve performance. You can clear the respective cache in the CodeEdit tab to regenerate content.
-   If there are missing items in the search results, try to search with less filters or try again later as it may take some time for the API to index the files. You may also manually filter until you get the expected results...