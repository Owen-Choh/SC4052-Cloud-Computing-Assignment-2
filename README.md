# SC4052-Cloud-Computing-Assignment-2

This repository contains a React-based web application for searching and editing code on GitHub, enhanced with AI-powered documentation generation.

## Description

This project provides a Software as a Service (SaaS) interface for interacting with GitHub repositories. It allows users to:

*   Search for code snippets within public GitHub repositories.
*   View general information about a repository.
*   Generate documentation for a selected repository using the Gemini AI model.
*   Edit code and submit pull requests directly from the web interface.

## Overview of the Code

The application is structured as follows:

*   `github-search-saas/src/App.tsx`: This is the main application component that sets up the layout and routing between different tabs (GeneralInfo, CodeSearch, CodeEdit).
*   `github-search-saas/src/components`: This directory contains React components for each tab:
    *   `CodeSearch.tsx`: Implements the code search functionality, allowing users to query GitHub repositories for specific code snippets.
    *   `GeneralInfo.tsx`: Provides an interface for users to input their GitHub username and select a repository.
    *   `CodeEdit.tsx`: Enables users to generate documentation and README files using AI, and submit pull requests.
*   `github-search-saas/src/context/useGithubContext.tsx`: Defines a React context to manage and share state across different components, such as the GitHub username, repository name, and search query.
*   `github-search-saas/src/api/apiconfigs.tsx`: Configures the API clients for interacting with the GitHub API, including setting the base URLs and authentication headers.
*   `github-search-saas/src/geminiAPI/geminiAPI.tsx`: Implements the integration with the Gemini AI model for generating documentation and README files.
*   `github-search-saas/vite.config.ts`: Configuration file for Vite, the build tool used in this project.
*   `github-search-saas/eslint.config.js`: Configuration file for ESLint, the linting tool used in this project.

## Architecture

The application follows a component-based architecture using React. It utilizes a context provider to manage global state and Axios to make API requests to GitHub. The Gemini AI integration is encapsulated in a separate module to handle documentation generation.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2/github-search-saas
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory of the project and add the following variables:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    Replace `<your_github_token>` with your personal GitHub access token and `<your_gemini_api_key>` with your Gemini API key.  You can generate a GitHub token [here](https://github.com/settings/tokens). You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/).

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server. Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173/`).

5.  **Using the application:**

    *   Enter your GitHub username and select a repository in the "General Information" tab.
    *   Search for code snippets in the "Code Search" tab.
    *   Generate documentation or a README file for the selected repository in the "Code Edit" tab.

## Important Notes

*   **Do not commit your `.env` file** to the repository, as it contains sensitive information such as your GitHub token and Gemini API key. Add `.env` to your `.gitignore` file.
*   The application uses the GitHub API, so be mindful of the [API rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).