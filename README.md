# SC4052-Cloud-Computing-Assignment-2

This repository contains a React-based web application built with TypeScript and Vite. It's designed as a Software as a Service (SaaS) platform for searching and editing code on GitHub.

## Description

The application provides a user interface with three main tabs:

*   **General Info:** Allows users to input their GitHub token, username, and select a repository.
*   **Code Search:** Enables users to search for specific code within the selected repository.
*   **Code Edit:** Provides a space for users to edit and potentially commit changes to the code (Note: This functionality may require further implementation for actual commit operations).

The application uses the GitHub API to fetch repository information and search for code. It also leverages Tailwind CSS for styling.

## Code Overview

The core components of the application are:

*   `src/App.tsx`: This is the main application component that sets up the layout, including the sidebar navigation and the content area for each tab. It uses React's `useState` hook to manage the active tab and renders the corresponding component.
*   `src/components/GeneralInfo.tsx`: This component handles the input of GitHub credentials (token and username) and repository selection. It fetches the user's repositories using the GitHub API and displays them in a dropdown.
*   `src/components/CodeSearch.tsx`: (Implementation details not provided in the file list, but this component would handle code search functionality).
*   `src/components/CodeEdit.tsx`: (Implementation details not provided in the file list, but this component would provide a code editor interface).
*   `src/context/useGithubContext.tsx`: This file defines a React context provider (`GithubProvider`) that manages the application's state, including the GitHub token, username, repository name, search query, and search results. It allows these values to be shared across different components.
*   `src/api/apiconfigs.tsx`: This file configures the Axios instances for making requests to the GitHub API. It also defines the `Octokit` instance for interacting with the GitHub API. It retrieves the GitHub token and Gemini API key from environment variables.

## Architecture

The application follows a component-based architecture, with each tab represented by a separate React component. The `GithubContext` provides a centralized state management solution, allowing components to access and update application-wide data. The application uses Axios to make API requests to GitHub.

## Setup and Usage

Follow these steps to set up and run the application:

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

    **Important:** Never commit your `.env` file to the repository. Add it to your `.gitignore` file to prevent accidental commits.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server, and you can access the application in your browser at the address provided (usually `http://localhost:5173`).

5.  **Build the application:**

    ```bash
    npm run build
    ```

    This will build the application for production and output the files to the `dist` directory.

## Important Notes

*   **Environment Variables:** Make sure to set the `VITE_GITHUB_TOKEN` and `VITE_GEMINI_API_KEY` environment variables in your `.env` file.
*   **GitHub Token:** You'll need a personal access token from GitHub to use the API. You can generate one in your GitHub settings under "Developer settings" -> "Personal access tokens". The token needs the `repo` scope to access private repositories.
*   **Security:** Be extremely careful with your GitHub token. Do not share it publicly or commit it to the repository.
*   **.gitignore:** Ensure that your `.env` file is added to your `.gitignore` file to prevent accidental commits of sensitive information.
*   **API Limits:** Be mindful of GitHub API rate limits. If you exceed the rate limit, you may need to implement error handling and retry mechanisms.
*   **Further Implementation:** The `CodeSearch` and `CodeEdit` components may require further implementation to fully realize their intended functionality.
