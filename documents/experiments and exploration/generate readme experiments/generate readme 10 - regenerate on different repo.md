# SC4052-Cloud-Computing-Assignment-2

This repository contains a React application built with TypeScript and Vite. It's designed as a GitHub search SaaS (Software as a Service) tool, allowing users to search for code snippets within GitHub repositories and generate documentation or README files using the Gemini AI model.

## Overview of the Code

The application is structured into several main components:

*   `src/App.tsx`: This is the main application component. It manages the different tabs (GeneralInfo, CodeSearch, CodeEdit) and renders the corresponding components.
*   `src/components`: This directory contains the UI components:
    *   `CodeEdit.tsx`: Allows users to generate documentation or README files for a selected repository using the Gemini AI model.
    *   `CodeSearch.tsx`: Enables users to search for code snippets within GitHub repositories.
    *   `GeneralInfo.tsx`: Provides input fields for the GitHub token, username, and repository selection.
*   `src/context/useGithubContext.tsx`: This file sets up a React Context to manage and share state across the application, such as the GitHub token, username, repository, search query, and search results.
*   `src/api/apiconfigs.tsx`: Contains API configurations for interacting with the GitHub API and Gemini API, including setting up authentication headers.
*   `src/geminiAPI/geminiAPI.tsx`: Implements functions to interact with the Gemini AI model for generating content, such as documentation or README files.
*   `vite.config.ts`: Configuration file for Vite, the build tool.
*   `eslint.config.js`: Configuration file for ESLint, the linting tool.

## Architecture

The application follows a component-based architecture, leveraging React's component model to build a modular and maintainable UI. It uses React Context to manage global state, making it easier to share data between components. The application interacts with external APIs (GitHub and Gemini) through dedicated API configuration files.

## Setup and Usage

Follow these steps to set up and use the application:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the project and add your GitHub token and Gemini API key:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    *   You can generate a GitHub token with the appropriate permissions from your GitHub settings.
    *   You'll need to obtain a Gemini API key from Google AI Studio.

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the application in development mode, and you can access it in your browser at the address provided (usually `http://localhost:5173`).

5.  **Using the Application:**

    *   **General Information Tab:** Enter your GitHub token, username, and select a repository.
    *   **Code Search Tab:** Enter a code snippet to search for, filter by file types, and view the search results.
    *   **Code Edit Tab:** Generate documentation or a README file for the selected repository based on the search results.

## Important Notes

*   **Do not commit your `.env` file:** Ensure that your `.env` file, which contains sensitive information like your GitHub token and Gemini API key, is not committed to the repository. Add `.env` to your `.gitignore` file.
*   **API Rate Limits:** Be mindful of the API rate limits for both the GitHub API and Gemini API. Avoid making excessive requests in a short period.
*   **Error Handling:** The application includes basic error handling, but you may need to enhance it for production use.
*   **Security:** For a production environment, consider implementing more robust security measures to protect sensitive data.
*   **Cost:** Be aware of the costs associated with using the Gemini API, as it may incur charges based on usage.
