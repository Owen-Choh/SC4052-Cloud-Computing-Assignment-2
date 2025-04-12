# SC4052-Cloud-Computing-Assignment-2

This repository contains a React application built with TypeScript and Vite, designed to assist with GitHub code search and documentation generation. It leverages the GitHub API and the Gemini AI model to provide a Software as a Service (SaaS) experience.

## Description

This application provides a user interface to:

*   Search for code snippets within GitHub repositories.
*   Generate documentation for selected code.
*   Generate README files for repositories.
*   Submit pull requests with generated content.

## Overview of the Code

The project is structured as follows:

*   `github-search-saas/src/App.tsx`: This is the main application component, handling tab navigation between different functionalities (General Info, Code Search, Code Edit).
*   `github-search-saas/src/components/`: This directory contains React components for each tab:
    *   `CodeEdit.tsx`: Allows users to generate documentation and README files, and submit pull requests.
    *   `CodeSearch.tsx`: Provides a code search interface using the GitHub API.
    *   `GeneralInfo.tsx`: Handles user input for GitHub username, repository, and token.
*   `github-search-saas/src/context/useGithubContext.tsx`: Manages application state using React Context, providing data like username, repository, search query, and API token to different components.
*   `github-search-saas/src/api/apiconfigs.tsx`: Configures and exports Axios instances for interacting with the GitHub API, including setting the base URL and authorization headers. Also sets up the Octokit client.
*   `github-search-saas/src/geminiAPI/geminiAPI.tsx`: Contains functions for interacting with the Gemini AI model to generate documentation and README files.
*   `github-search-saas/vite.config.ts`: Vite configuration file, including plugins for React and Tailwind CSS.
*   `github-search-saas/eslint.config.js`: ESLint configuration file for linting the TypeScript code.

## Architecture

The application follows a component-based architecture, with React components responsible for rendering the UI and handling user interactions. React Context is used for state management, providing a centralized way to access and update application data. Axios is used for making API requests to the GitHub API, and the Gemini AI model is accessed through custom functions.

## Setup and Usage

Follow these steps to set up and use the application:

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the `github-search-saas` folder and add your GitHub token and Gemini API key:

    ```
    VITE_GITHUB_TOKEN=[Your GitHub Token]
    VITE_GEMINI_API_KEY=[Your Gemini API Key]
    ```

    **Important:** Do not commit your `.env` file to the repository. Add it to your `.gitignore` file.

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the application in development mode, usually on `http://localhost:5173`.

5.  **Using the Application:**

    *   **General Info Tab:** Enter your GitHub username and token. Click "Get Repos" to populate the repository dropdown.
    *   **Code Search Tab:** Enter a code snippet to search for, and optionally filter by file types. Select the files you want to use for documentation generation.
    *   **Code Edit Tab:** Generate documentation or a README file based on the selected files. You can also submit a pull request with the generated content.

## Important Notes

*   **API Keys:** Ensure you have a valid GitHub API token and Gemini API key. Store these securely and do not commit them to the repository.
*   **Rate Limits:** Be mindful of GitHub API rate limits. Avoid making excessive requests in a short period.
*   **Caching:** The application uses a cache to store repository file contents and generated AI output. This can speed up subsequent operations, but you can clear the cache if needed.
*   **Pull Requests:** The application can submit pull requests to your repository. Use this feature with caution and review the generated content before submitting.
*   **Error Handling:** The application includes basic error handling, but you may need to add more robust error handling for production use.
*   **Auto Pull Request:** The auto pull request feature is experimental and may not always work as expected. Use with caution.
