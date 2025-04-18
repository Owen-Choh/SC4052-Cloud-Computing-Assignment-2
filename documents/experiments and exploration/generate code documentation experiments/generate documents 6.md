# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to the `SC4052-Cloud-Computing-Assignment-2` repository. It is divided into two main sections: How-To Guides and Reference Guides. The How-To Guides will walk you through common tasks, while the Reference Guides provide detailed information about the codebase.

## How-To Guides

### 1. Setting up the Development Environment

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    Note: Make sure you have Node.js and pnpm installed on your system.
3.  **Set up environment variables:**
    *   Create a `.env` file in the root directory of the project.
    *   Add the following variables to the `.env` file, replacing the placeholders with your actual API keys:
        ```
        VITE_GITHUB_TOKEN=<your_github_token>
        VITE_GEMINI_API_KEY=<your_gemini_api_key>
        ```
    *   Obtain a GitHub personal access token with the `repo` scope from GitHub.
    *   Obtain a Gemini API key from Google AI Studio.
4.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    This command will start the Vite development server, and you can access the application in your browser at the address it provides.

### 2. Running the Application

After setting up the development environment, you can run the application using the following command:

```bash
pnpm dev
```

This will start the Vite development server. Open your web browser and navigate to the address provided in the console to view the application.

### 3. Building the Application for Production

To build the application for production, run the following command:

```bash
pnpm build
```

This command will create an optimized build of the application in the `dist` directory.

### 4. Linting the Code

To run the linter and check for code style issues, use the following command:

```bash
pnpm lint
```

This command will use ESLint to analyze the code and report any violations of the configured linting rules.

## Reference Guide

### 1. Project Structure

The project has the following directory structure:

```
SC4052-Cloud-Computing-Assignment-2/
├── .eslint.config.js           # ESLint configuration file
├── .env                        # Environment variables (API keys)
├── index.html                  # Main HTML file
├── package.json                # Project dependencies and scripts
├── pnpm-lock.yaml              # Dependency lock file
├── README.md                   # Project documentation
├── src/
│   ├── api/                    # Contains API configuration
│   │   └── apiconfigs.tsx      # Configuration for GitHub API requests
│   ├── components/             # React components
│   │   ├── CodeEdit.tsx        # Component for code editing (not implemented in the provided code)
│   │   ├── CodeSearch.tsx      # Component for searching GitHub code
│   │   └── GeneralInfo.tsx     # Component for entering general information
│   ├── context/                # React context provider
│   │   └── useGithubContext.tsx# Manages global state for the application
│   ├── geminiAPI/              # Gemini API integration
│   │   └── geminiAPI.tsx       # Function to generate content using Gemini API
│   ├── App.css                 # Global CSS styles
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global CSS styles
│   ├── main.tsx                # Entry point for the React application
│   ├── vite-env.d.ts           # TypeScript definition file for Vite environment variables
├── tsconfig.app.json         # TypeScript configuration for the application
├── tsconfig.json             # Main TypeScript configuration file
├── tsconfig.node.json        # TypeScript configuration for Node.js related files
└── vite.config.ts            # Vite configuration file
```

### 2. Key Components and Files

#### `src/App.tsx`

*   **Purpose**: This is the root component of the application. It manages the tab navigation and renders the appropriate component based on the selected tab.
*   **State**: Uses `useState` hook to manage the currently active tab (`GeneralInfo`, `CodeSearch`, or `CodeEdit`).
*   **Functionality**:
    *   Renders a sidebar with clickable tabs to switch between different sections of the application.
    *   Uses conditional rendering to display the component corresponding to the selected tab within the `GithubProvider`.
*   **Note**: The `CodeEdit` component's functionality is not fully implemented in the provided code.

#### `src/components/CodeSearch.tsx`

*   **Purpose**: This component handles the code search functionality, allowing users to search for code snippets on GitHub.
*   **Context**: Uses the `useGithubContext` hook to access and update global state variables such as `username`, `repository`, `query`, `fileTypes`, `results`, and `descriptions`.
*   **State**:
    *   `loading`:  A boolean state variable to indicate whether a search is in progress.
    *   `error`:  A state variable to store any error messages that occur during the search.
    *   `loadingDescriptions`: An object state variable to track loading state for descriptions, keyed by item SHA.
*   **Functionality**:
    *   Constructs a search query based on user inputs (search query, file types, username, repository).
    *   Uses the GitHub API to search for code.
    *   Displays the search results as a list of clickable items.
    *   Allows users to select code snippets and generate descriptions using the Gemini API.
    *   Displays code descriptions using the `react-markdown` component.
*   **Note**: The GitHub API is accessed using the `octokit` library. Rate limiting can occur if too many requests are made in a short period. Ensure your GitHub token has the necessary scopes to perform searches and access code content.

#### `src/components/GeneralInfo.tsx`

*   **Purpose**: This component provides a form for users to enter their GitHub username, repository name, and token.
*   **Context**: Uses the `useGithubContext` hook to access and update global state variables such as `username`, `repository`, `token`, and `repos`.
*   **State**:
    *   `loading`: A boolean state variable to indicate whether repositories are being fetched.
    *   `error`: A state variable to store any error messages that occur during the fetching of repositories.
*   **Functionality**:
    *   Allows users to enter their GitHub username and select a repository from a dropdown list.
    *   Fetches the list of repositories for a given username using the GitHub API.
    *   Updates the global state with the entered information.
*   **Note**: The application currently does not persist or securely store the GitHub token. This is important for security.

#### `src/context/useGithubContext.tsx`

*   **Purpose**: This file defines the `GithubContext` and `GithubProvider`, which are used to manage global state for the application.
*   **Context**: Provides a way for components to access and update shared state variables without prop drilling.
*   **State**: Manages the following state variables:
    *   `username`: The GitHub username.
    *   `repository`: The name of the GitHub repository.
    *   `token`: The GitHub personal access token.
    *   `selectedItems`: An array of SHA values for selected code snippets.
    *   `repos`: An array of repository names.
    *   `query`: The code search query.
    *   `fileTypes`: A string of comma seperated file types
    *   `results`: The code search results.
    *   `descriptions`: A record of descriptions of code snippets, keyed by SHA.
*   **Functionality**:
    *   Provides setter functions to update the state variables.
    *   Wraps the application with the `GithubProvider` to make the context available to all components.
*   **Note**: Accessing context values outside the scope of `GithubProvider` will throw an error.

#### `src/api/apiconfigs.tsx`

*   **Purpose**: This file contains the configuration for making API requests to the GitHub API and declares the Octokit client.
*   **Configuration**:
    *   `GITHUB_TOKEN`:  Retrieved from the `.env` file. This token is used for authenticating requests to the GitHub API.
    *   `GITHUB_API_URL`:  The base URL for the GitHub API.
    *   `githubSearchCodeApi`: axios instance configured for code search.
    *   `githubSearchRepoApi`: axios instance configured for repository search.
    *   `githubGetCodeApi`: axios instance configured for getting code content.
    *   `octokit`: An instance of the Octokit client, authenticated with the `GITHUB_TOKEN`.  It is configured with the github token from the .env file.
*   **Note**: Ensure that the `VITE_GITHUB_TOKEN` environment variable is set correctly in the `.env` file.  It is recommended to refresh the octokit instance when the token is changed, otherwise the old token will still be used

#### `src/geminiAPI/geminiAPI.tsx`

*   **Purpose**: This file contains the function to generate content using the Gemini API.
*   **Configuration**:
    *   `GEMINI_API_KEY`:  Retrieved from the `.env` file.
    *   `GoogleGenerativeAI`: The main interface for interacting with the Gemini API.
    *   `model`: The specific Gemini model used for generating content.
    *    `generationConfig`: The configuration parameters for content generation.
*   **Functionality**:
    *   The `generateContent` function takes a prompt as input and sends it to the Gemini API.
    *   The function returns the generated text content as a string.
*   **Note**: Ensure that the `VITE_GEMINI_API_KEY` environment variable is set correctly in the `.env` file.

#### `vite.config.ts`

*   **Purpose**: This file contains the configuration for the Vite build tool.
*   **Configuration**:
    *   `plugins`: Specifies the plugins used by Vite, including `@vitejs/plugin-react-swc` for React support and `tailwindcss` for Tailwind CSS integration.

#### `.eslint.config.js`

*   **Purpose**: This file configures ESLint, a JavaScript linting tool, to enforce code style and quality standards.
*   **Configuration**: Extends recommended configurations from `@eslint/js` and `typescript-eslint`.  Includes plugins for `react-hooks` and `react-refresh`.
    Configures rules for code style, formatting, and potential errors.

### 3. Global State Management with Context

The application uses React Context to manage global state. The `useGithubContext` hook provides access to the following state variables:

*   `username`: GitHub username.
*   `repository`: Repository name.
*   `token`: GitHub personal access token.
*   `selectedItems`: Selected code snippets.
*   `repos`: List of repositories.
*    `query`: Code query
*    `fileTypes`: file types
*    `results`: Github code search results
*    `descriptions`: Gemini API code descriptions

### 4. API Interactions

The application interacts with two external APIs:

*   **GitHub API**: Used for searching code and fetching repository information.
*   **Gemini API**: Used for generating code descriptions.

API keys are stored in the `.env` file and accessed using `import.meta.env`.

### 5. Dependency Management

The project uses pnpm for dependency management. The `package.json` file lists the project's dependencies and scripts.

## Important Notes

*   **Security**: The GitHub token is stored in the browser's memory and should be treated with care. Avoid committing the `.env` file to the repository.  Consider implementing a more secure method of handling API keys.
*   **Rate Limiting**: The GitHub API is subject to rate limits. Implement error handling and consider using a caching mechanism to avoid exceeding the limits.
*   **Error Handling**: Implement comprehensive error handling throughout the application to provide a better user experience.
*   **Code Editing**: The `CodeEdit` component is not fully implemented and requires further development to provide code editing functionality.
*   **Responsiveness**: Test the application on different screen sizes to ensure it is responsive and provides a good user experience on all devices.
