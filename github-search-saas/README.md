# SC4052-Cloud-Computing-Assignment-2

This repository contains a React application built with TypeScript and Vite. It's designed as a GitHub search SaaS (Software as a Service) tool that helps users search code within GitHub repositories, generate documentation, and even submit pull requests with suggested README files.

## Description

This application provides a user-friendly interface to:

*   Search for code snippets within GitHub repositories.
*   Generate documentation for selected code.
*   Generate README files for repositories using AI.
*   Submit pull requests with the generated README content.

## Overview of the Code

The project is structured as a React application with the following key components:

*   `src/App.tsx`: The main application component that manages the overall layout and tab navigation.
*   `src/components/`: This directory contains React components for different functionalities:
    *   `CodeEdit.tsx`: Component for generating documentation and README files, and submitting pull requests.
    *   `CodeSearch.tsx`: Component for searching code within GitHub.
    *   `GeneralInfo.tsx`: Component for entering GitHub username, repository, and token.
*   `src/context/useGithubContext.tsx`: React Context for managing and sharing application state across components.
*   `src/api/apiconfigs.tsx`: Contains API configurations for interacting with the GitHub API and Gemini API.
*   `src/geminiAPI/geminiAPI.tsx`: Functions for interacting with the Gemini AI API to generate content.
*   `vite.config.ts`: Vite configuration file.
*   `eslint.config.js`: ESLint configuration file.

## Architecture

The application follows a component-based architecture, leveraging React's context API for state management. It interacts with the GitHub API for code search and repository information, and the Gemini API for content generation.

The main components are:

1.  **General Information Tab:** Allows users to input their GitHub username, repository name, and personal access token.
2.  **Code Search Tab:** Enables users to search for specific code snippets within the specified repository.
3.  **Code Edit Tab:** Provides functionality to generate documentation or a README file based on the search results, and submit a pull request with the generated content.

## Setup and Usage

Follow these steps to set up and use the application:

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd SC4052-Cloud-Computing-Assignment-2
    cd github-search-saas
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the `github-search-saas` folder and add your GitHub token and Gemini API key:

    ```
    VITE_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    **Important:** Do not commit your `.env` file to the repository. Add it to your `.gitignore` file.

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the application in development mode, usually on `http://localhost:5173`.

5.  **Using the Application:**

    *   Enter your GitHub username, repository name, and GitHub token in the "General Information" tab.
    *   Use the "Code Search" tab to search for code snippets within the specified repository.
    *   In the "Code Edit" tab, you can generate documentation or a README file based on the search results. You can also submit a pull request with the generated content.

## Important Notes

*   **GitHub Token:** You need a GitHub Personal Access Token with the appropriate permissions to access the GitHub API.
*   **Gemini API Key:** You need a Gemini API key to use the content generation features.
*   **.env File:** Be extremely careful not to commit your `.env` file, which contains sensitive information like your GitHub token and Gemini API key, to the repository. Always add it to your `.gitignore` file.
*   **Rate Limits:** Be mindful of the GitHub API rate limits. The application may experience issues if the rate limit is exceeded.
*   **Auto Pull Request:** The auto pull request feature is experimental and may not always work as expected. Review the generated content before submitting a pull request.
*   **Cache:** The application uses a cache to store repository file contents and AI output. Clearing the cache may be necessary if you want to regenerate content or fetch fresh file contents.
