# SC4052-Cloud-Computing-Assignment-2

This repository contains a React-based web application that leverages the GitHub API and the Gemini API to provide a Software as a Service (SaaS) for searching and editing code. It allows users to search for code snippets within GitHub repositories, view general repository information, and generate documentation or README files using AI.

## Overview

The application is structured into three main sections, accessible through a sidebar:

1.  **General Info**: Allows users to input a GitHub username and select a repository to interact with.
2.  **Code Search**: Enables users to search for specific code snippets within the selected repository, filtering by file types.
3.  **Code Edit**: Provides functionality to generate documentation or a README file for the repository, leveraging the Gemini API. Users can also submit a pull request with the generated content.

## Architecture

The application follows a component-based architecture, built with React. Key components include:

*   `App.tsx`: The main application component that manages the overall layout and tab navigation.
*   `GeneralInfo.tsx`: Component for inputting GitHub username, token and selecting a repository.
*   `CodeSearch.tsx`: Component for searching code within a GitHub repository.
*   `CodeEdit.tsx`: Component for generating documentation and README files using the Gemini API, and submitting pull requests.
*   `useGithubContext.tsx`: React Context Provider to manage global state such as username, repository, and search results.
*   `geminiAPI/geminiAPI.tsx`: Handles communication with the Gemini API for content generation.
*   `api/apiconfigs.tsx`: Defines API configurations and initializes Octokit for interacting with the GitHub API.

## Setup and Usage

Follow these steps to set up and use the application:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2/github-search-saas
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory of the `github-search-saas` folder and add your GitHub token and Gemini API key:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    **Important:** Do not commit the `.env` file to the repository. Add it to your `.gitignore` file.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server. Open your browser and navigate to the address provided (usually `http://localhost:5173`).

5.  **Using the application:**

    *   In the "General Info" tab, enter your GitHub username and token. Select the desired repository from the dropdown menu.
    *   In the "Code Search" tab, enter your search query and file type filters (optional). Click "Search" to view the results.
    *   In the "Code Edit" tab, click either "Generate Documentation" or "Generate README" to generate content using the Gemini API. You can adjust the model temperature to control the level of variation in the output. You can also configure to automatically submit a pull request with the new output. Click "Clear Cache" to remove the current file contents and AI output from temporary storage.
    *   Click "Submit Pull Request" to submit the output to your repository.

## Notes

*   **GitHub Token:** Ensure your GitHub token has the necessary permissions (e.g., `repo`) to access and modify the repository.
*   **Environment Variables:** Never commit your `.env` file containing sensitive information such as API keys and tokens to the repository. Add `.env` to your `.gitignore` file.
*   **Gemini API Usage:** Be mindful of the Gemini API's usage limits and pricing. Implement appropriate error handling and rate limiting to prevent unexpected costs or service disruptions.
*   **Pull Requests:** The application automates the process of submitting pull requests. Review the generated content carefully before submitting to ensure it meets your requirements.
*   **Caching**: Caching has been implemented for file contents and the gemini ai output to save on api calls, make sure to clear the cache if your repository has been updated since your last search.
