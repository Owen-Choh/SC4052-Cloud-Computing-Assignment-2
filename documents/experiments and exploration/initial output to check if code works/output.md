# SC4052-Cloud-Computing-Assignment-2

This repository contains a React application built with TypeScript and Vite, designed to search and interact with code on GitHub. It leverages the GitHub API and the Gemini AI model to provide code search, description, and editing functionalities.

## Description

This application provides a Software as a Service (SaaS) interface for GitHub code search and editing. It allows users to:

*   Search for code snippets within GitHub repositories.
*   View general information about repositories.
*   Generate documentation and README files using AI.
*   Submit pull requests with suggested changes.

## Overview of the Code

The project is structured as a React application with the following key components:

*   `src/App.tsx`: The main application component that manages the overall layout and tab navigation.
*   `src/components`: Contains React components for different functionalities:
    *   `CodeSearch.tsx`: Implements the code search functionality using the GitHub API.
    *   `CodeEdit.tsx`: Provides code editing capabilities and integration with the Gemini AI model for documentation and README generation.
    *   `GeneralInfo.tsx`: Allows users to input their GitHub username and repository details.
*   `src/context/useGithubContext.tsx`: Defines a React context to manage and share application state across components.
*   `src/api/apiconfigs.tsx`: Configures and exports instances of Axios and Octokit for interacting with the GitHub API.
*   `src/geminiAPI/geminiAPI.tsx`: Implements functions for interacting with the Gemini AI model.
*   `vite.config.ts`: Configuration file for the Vite build tool.
*   `eslint.config.js`: Configuration file for the ESLint linter.

## Architecture

The application follows a component-based architecture, with React components responsible for rendering UI elements and handling user interactions. The `GithubContext` provides a centralized state management solution, allowing components to access and update application data. The application interacts with external services through API calls to GitHub and Gemini.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
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

    Replace `<your_github_token>` with your personal GitHub access token and `<your_gemini_api_key>` with your Gemini API key.

    **Important:** Do not commit your `.env` file to the repository. Add it to your `.gitignore` file to prevent accidental commits.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server and open the application in your browser.

## Notes

*   **GitHub Token:** Ensure that your GitHub token has the necessary permissions to search and access repositories.
*   **Gemini API Key:** Make sure your Gemini API key is valid and has access to the required Gemini API services.
*   **.env File:** Never commit your `.env` file to the repository, as it contains sensitive information.
*   **Rate Limits:** Be mindful of the GitHub API rate limits when making requests.
*   **Error Handling:** The application includes basic error handling, but you may need to implement more robust error handling for production use.
*   **Caching:** The application uses a cache to store file contents and AI generated outputs. This can be cleared in the CodeEdit tab.
