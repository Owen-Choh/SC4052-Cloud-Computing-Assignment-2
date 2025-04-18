```markdown
# SC4052-Cloud-Computing-Assignment-2

## Description

This repository contains a React application built with TypeScript and Vite. It provides a Software as a Service (SaaS) interface for searching and editing code within GitHub repositories, leveraging the Gemini AI model for documentation and README generation.

## Overview

The application is structured into three main tabs:

*   **GeneralInfo:** Allows users to input their GitHub token, username, and select a repository.
*   **CodeSearch:** Enables searching for code snippets within the selected repository, filtering by file types.
*   **CodeEdit:** Provides functionality to generate documentation and README files based on the code in the repository, using the Gemini AI model. It also allows users to submit a pull request with the generated content.

## Architecture

The application follows a component-based architecture using React. It utilizes a context provider (`GithubProvider`) to manage and share state across different components.

*   `App.tsx`: Main application component, handling tab navigation.
*   `components`: Contains React components for each tab (`GeneralInfo`, `CodeSearch`, `CodeEdit`).
*   `context`: Defines the `GithubContext` for managing application state.
*   `api`: Includes API configurations for interacting with GitHub and Gemini.
*   `geminiAPI`: Implements functions for interacting with the Gemini AI model.

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

    Create a `.env` file in the root directory of the `github-search-saas` folder with the following variables:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    Replace `<your_github_token>` with your GitHub Personal Access Token (PAT) and `<your_gemini_api_key>` with your Gemini API key.

    *   **Note:** Make sure to add `.env` to your `.gitignore` file to avoid committing your API keys.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    This will start the development server. Open your browser and navigate to the address provided (usually `http://localhost:5173`).

5.  **Using the application:**

    *   In the **GeneralInfo** tab, enter your GitHub token and username. Click "Get Repos" to load your repositories and select one from the dropdown.
    *   In the **CodeSearch** tab, enter a code snippet to search for. You can filter by file types using a comma-separated list (e.g., `js,ts,py`). Click "Search" to view the results.  Click 'Describe' on a listed item to get an AI generated description of the code.
    *   In the **CodeEdit** tab, you can generate documentation or a README file for the selected repository.  You must perform a search first. The generated content will appear in the output textarea, and you can download it as a Markdown file or submit a pull request directly to the repository.

## Important Notes

*   **Do not commit your `.env` file:** Ensure your `.env` file containing your API keys is added to your `.gitignore` file.
*   **GitHub Token Permissions:** The GitHub token requires the `repo` scope to access and modify repositories.
*   **Gemini API Key Security:** Treat your Gemini API key with the same care as any other password.
*   **Cache Clearing:** Utilize the "Clear File Content cache" and "Clear AI output cache" buttons in the CodeEdit tab to refresh cached data and ensure the application uses the latest repository contents or AI generated results.
*   **Pull Request Submissions:** Before submitting a pull request, review the generated content in the output textarea to ensure its accuracy and relevance.  The pull request will be submitted to a new branch of your repository.

## Libraries Used

*   React
*   TypeScript
*   Vite
*   @mui/material
*   Axios
*   Octokit
*   @google/genai
*   react-markdown

## Pull Request Details
```
{
  "branchName": "generated-readme",
  "commitMessage": "Generated README from github search saas",
  "fileContent": "# SC4052-Cloud-Computing-Assignment-2\n\n## Description\n\nThis repository contains a React application built with TypeScript and Vite. It provides a Software as a Service (SaaS) interface for searching and editing code within GitHub repositories, leveraging the Gemini AI model for documentation and README generation.\n\n## Overview\n\nThe application is structured into three main tabs:\n\n*   **GeneralInfo:** Allows users to input their GitHub token, username, and select a repository.\n*   **CodeSearch:** Enables searching for code snippets within the selected repository, filtering by file types.\n*   **CodeEdit:** Provides functionality to generate documentation and README files based on the code in the repository, using the Gemini AI model. It also allows users to submit a pull request with the generated content.\n\n## Architecture\n\nThe application follows a component-based architecture using React. It utilizes a context provider (`GithubProvider`) to manage and share state across different components.\n\n*   `App.tsx`: Main application component, handling tab navigation.\n*   `components`: Contains React components for each tab (`GeneralInfo`, `CodeSearch`, `CodeEdit`).\n*   `context`: Defines the `GithubContext` for managing application state.\n*   `api`: Includes API configurations for interacting with GitHub and Gemini.\n*   `geminiAPI`: Implements functions for interacting with the Gemini AI model.\n\n## Setup and Usage\n\nFollow these steps to set up and use the application:\n\n1.  **Clone the repository:**\n\n    ```bash\n    git clone <repository-url>\n    cd SC4052-Cloud-Computing-Assignment-2\n    ```\n\n2.  **Install dependencies:**\n\n    ```bash\n    npm install\n    ```\n\n3.  **Create a `.env` file:**\n\n    Create a `.env` file in the root directory of the `github-search-saas` folder with the following variables:\n\n    ```\n    VITE_GITHUB_TOKEN=<your_github_token>\n    VITE_GEMINI_API_KEY=<your_gemini_api_key>\n    ```\n\n    Replace `<your_github_token>` with your GitHub Personal Access Token (PAT) and `<your_gemini_api_key>` with your Gemini API key.\n\n    *   **Note:** Make sure to add `.env` to your `.gitignore` file to avoid committing your API keys.\n\n4.  **Run the application:**\n\n    ```bash\n    npm run dev\n    ```\n\n    This will start the development server. Open your browser and navigate to the address provided (usually `http://localhost:5173`).\n\n5.  **Using the application:**\n\n    *   In the **GeneralInfo** tab, enter your GitHub token and username. Click \"Get Repos\" to load your repositories and select one from the dropdown.\n    *   In the **CodeSearch** tab, enter a code snippet to search for. You can filter by file types using a comma-separated list (e.g., `js,ts,py`). Click \"Search\" to view the results.  Click 'Describe' on a listed item to get an AI generated description of the code.\n    *   In the **CodeEdit** tab, you can generate documentation or a README file for the selected repository.  You must perform a search first. The generated content will appear in the output textarea, and you can download it as a Markdown file or submit a pull request directly to the repository.\n\n## Important Notes\n\n*   **Do not commit your `.env` file:** Ensure your `.env` file containing your API keys is added to your `.gitignore` file.\n*   **GitHub Token Permissions:** The GitHub token requires the `repo` scope to access and modify repositories.\n*   **Gemini API Key Security:** Treat your Gemini API key with the same care as any other password.\n*   **Cache Clearing:** Utilize the \"Clear File Content cache\" and \"Clear AI output cache\" buttons in the CodeEdit tab to refresh cached data and ensure the application uses the latest repository contents or AI generated results.\n*   **Pull Request Submissions:** Before submitting a pull request, review the generated content in the output textarea to ensure its accuracy and relevance.  The pull request will be submitted to a new branch of your repository.\n\n## Libraries Used\n\n*   React\n*   TypeScript\n*   Vite\n*   @mui/material\n*   Axios\n*   Octokit\n*   @google/genai\n*   react-markdown",
  "filePath": "README.md",
  "pullRequestBody": "This is a generated README from github search saas",
  "pullRequestTitle": "Generated README"
}
