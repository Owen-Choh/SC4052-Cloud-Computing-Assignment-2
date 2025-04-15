# SC4052-Cloud-Computing-Assignment-2

This repository contains a React application built with TypeScript and Vite. It's designed as a GitHub Search SaaS (Software as a Service) tool, allowing users to search for code within GitHub repositories, generate documentation, and even submit pull requests using AI.

## Overview

The application provides a user interface with three main tabs:

*   **General Info:** Allows users to input their GitHub username, token, and select a repository.
*   **Code Search:** Enables users to search for specific code snippets within the selected repository.
*   **Code Edit:** Provides functionality to generate README files, documentation, and validate comments using the Gemini AI model. It also supports submitting pull requests with the generated content.

## Code Architecture

The application follows a component-based architecture, with the main components located in the `github-search-saas/src/components` directory:

*   `App.tsx`: The main application component that manages the tab navigation.
*   `GeneralInfo.tsx`: Component for entering GitHub credentials and repository information.
*   `CodeSearch.tsx`: Component for searching code within the specified repository.
*   `CodeEdit.tsx`: Component for generating documentation, README files, and submitting pull requests.

The application uses the following key technologies:

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A build tool that provides fast development and optimized builds.
*   **Tailwind CSS:** A utility-first CSS framework for styling the application.
*   **Octokit:** A GitHub API client for interacting with the GitHub API.
*   **Gemini API:** Google's AI model used for generating documentation and README files.
*   **Context API:** Used to manage and share state across the application. See `github-search-saas/src/context/useGithubContext.tsx`

## Setup and Usage

Follow these steps to set up and use the application:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/SC4052-Cloud-Computing-Assignment-2.git
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the project and add your GitHub token and Gemini API key:

    ```
    VITE_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    *   You can generate a GitHub token with the necessary permissions (repo, read:org) from your GitHub settings.
    *   You can obtain a Gemini API key from the Google AI Studio website.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server and open the application in your browser.

5.  **Using the Application:**

    *   Navigate to the "General Info" tab and enter your GitHub username, token, and select a repository.
    *   Go to the "Code Search" tab to search for code snippets within the selected repository.
    *   Use the "Code Edit" tab to generate documentation, README files, and submit pull requests.

## Important Notes

*   **Do not commit your `.env` file:** Ensure that your `.env` file is added to your `.gitignore` file to prevent your GitHub token and Gemini API key from being exposed.
*   **API Rate Limits:** Be mindful of the GitHub API rate limits. Avoid making excessive requests to prevent your token from being temporarily blocked.
*   **Gemini API Usage:** The Gemini API has its own usage limits. Refer to the Google AI Studio documentation for more information.
*   **Pull Request Submissions:** The application provides functionality to submit pull requests. Use this feature with caution and ensure that you review the generated content before submitting.
*   **Cache:** The application uses a cache to store file contents and AI generated content. This is to improve performance and reduce API calls. You can clear the cache in the "Code Edit" tab.
*   **Error Handling:** The application includes basic error handling. If you encounter any issues, check the console for error messages and refer to the documentation for the GitHub API and Gemini API.
*   **Model Temperature:** The model temperature slider in the "Code Edit" tab controls the amount of variation in the AI generated output. A higher temperature will result in more creative and unpredictable output, while a lower temperature will result in more conservative and predictable output.
