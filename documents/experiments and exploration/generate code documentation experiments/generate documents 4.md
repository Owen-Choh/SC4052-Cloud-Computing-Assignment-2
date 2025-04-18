# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides a comprehensive guide to understanding and utilizing the SC4052-Cloud-Computing-Assignment-2 repository. It's split into two sections: **How-To Guides** for accomplishing specific tasks and **Reference Guides** for in-depth information about the project's components.

## How-To Guides

This section provides step-by-step instructions for common tasks related to the project.

### Setting up the Project Locally

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```

    Replace `<repository_url>` with the actual URL of this GitHub repository.
2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

    This command uses `pnpm` (if you do not have `pnpm` you can install it with `npm install -g pnpm`) to install all necessary packages listed in `package.json`.
3.  **Configure Environment Variables:**

    *   Create a `.env` file in the `github-search-saas` directory.
    *   Add your GitHub token and Gemini API key to the `.env` file:

    ```
    VITE_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

    Replace `YOUR_GITHUB_TOKEN` and `YOUR_GEMINI_API_KEY` with your actual credentials.  Ensure you have the necessary permissions for the GitHub token.
4.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This command starts the Vite development server, and you can access the application usually at `http://localhost:5173`.

### Searching for Code

1.  Navigate to the "CodeSearch" tab in the application's sidebar.
2.  In the "Enter code snippet..." field, type in the code you want to search for.
3.  Optionally, in the "Filter by comma seperated file types..." field, enter the file extensions you are interested in (e.g., `js, py, tsx`).
4.  Click the "Search" button.
5.  The results will be displayed below the search bar.  Click on the links to view the code in GitHub.
6.  You can select code snippets by clicking the checkbox, this stores the selections in the application context.
7.  Click describe to have a generated description of the code from the Gemini AI model.

### Specifying a GitHub User or Repository

1.  Navigate to the "GeneralInfo" tab in the application's sidebar.
2.  In the "GitHub Username" field, enter the desired GitHub username.
3.  Click the "Get Repos" button. A list of repositories under that username is populated in the "Repository Name" dropdown.
4.  Select the desired repository from the "Repository Name" dropdown.
5.  Return to the "CodeSearch" tab to perform searches within the specified user or repository.

### Running Linters

```bash
npm run lint
```

This command checks the project for code style and potential errors using ESLint, as configured in `eslint.config.js`.

## Reference Guides

This section provides detailed information about the project's structure, components, and technologies.

### Project Structure

The project is structured as follows:

*   `README.md`:  The main documentation file providing an overview of the project.
*   `github-search-saas/`:  The root directory for the React application.
    *   `src/`: Contains the application's source code.
        *   `App.tsx`: The main application component that renders the layout and manages tab switching.
        *   `main.tsx`: The entry point for the React application, rendering the `App` component into the HTML.
        *   `App.css`:  CSS file for the main `App` component.
        *   `index.css`: Global CSS styles for the application.
        *   `vite-env.d.ts`:  TypeScript declaration file for Vite environment variables.
        *   `api/`: Contains modules for making API calls.
            *   `apiconfigs.tsx`: Defines API configurations, including URLs, headers, and authentication tokens (GitHub token).
        *   `components/`: Contains React components.
            *   `CodeEdit.tsx`: A placeholder component (implementation omitted).
            *   `CodeSearch.tsx`: Component for searching GitHub code based on a query.
            *   `GeneralInfo.tsx`: Component for entering general information, such as GitHub username and repository name.
        *   `context/`: Contains React context providers.
            *   `useGithubContext.tsx`: Defines a React context for managing application state related to GitHub information and search queries.
        *   `geminiAPI/`: Contains modules for making API calls to the Gemini AI model.
            * `geminiAPI.tsx`: Defines API configurations, to interact with the Gemini AI model and returns a description of code.
    *   `index.html`: The main HTML file for the application.
    *   `vite.config.ts`: Vite configuration file.
    *   `eslint.config.js`: ESLint configuration file.
    *   `tsconfig.json`:  The main TypeScript configuration file.
    *   `package.json`: Lists project dependencies and scripts.
    *   `pnpm-lock.yaml`: Records the specific versions of dependencies used in the project.
    *   `tsconfig.app.json`: TypeScript configuration file for the application.
    *   `tsconfig.node.json`: TypeScript configuration file for node.

### Key Components

*   **`App.tsx`**: This is the heart of the application. It defines the basic layout with a sidebar for navigation between different functionalities.
*   **`CodeSearch.tsx`**: This component handles code searches on GitHub.  It uses the GitHub API (configured in `api/apiconfigs.tsx`) to fetch results and displays them to the user. Also interacts with the Gemini API, configured in `geminiAPI/geminiAPI.tsx`.
*   **`GeneralInfo.tsx`**: This component allows users to input their GitHub username and select a repository.  The information entered here is used to scope the code searches.
*   **`useGithubContext.tsx`**: This context provider manages application-wide state, such as the GitHub username, repository name, search query, and search results. This simplifies data sharing between components.
*   **`apiconfigs.tsx`**: This file centralizes the API configurations, making it easier to manage and update API endpoints and authentication headers.
*   **`geminiAPI.tsx`**: This file centralizes the Gemini API configurations, making it easier to manage and update API endpoints.
*   **`vite.config.ts`**: This file configures Vite, the build tool used for the project.  It specifies plugins, such as the React SWC plugin, and other build options.
*   **`eslint.config.js`**: This file configures ESLint, a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. The linter checks code quality and style issues.
*   **`package.json`**: This file lists all the project's dependencies and defines various scripts for building, testing, and running the application.

### Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**:  A superset of JavaScript that adds static typing.
*   **Vite**:  A fast build tool and development server for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly designing custom designs.
*   **ESLint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
*   **GitHub API**: Used for searching code within GitHub repositories.
*   **Gemini AI API**: Used for generating descriptions of the code.

### Environment Variables

The application uses the following environment variables, which should be defined in a `.env` file:

*   `VITE_GITHUB_TOKEN`:  Your personal access token for the GitHub API.
*   `VITE_GEMINI_API_KEY`:  Your API key for the Gemini AI model.

**Note:**  Never commit your `.env` file to version control!

### Using the GithubContext

The GithubContext manages and provides application-wide state related to Github.

*   **Accessing Values:** Inside a functional component, use the `useGithubContext` hook to access context values:

    ```typescript
    import { useGithubContext } from './context/useGithubContext';

    function MyComponent() {
      const { username, repository, query } = useGithubContext();

      return (
        <div>
          <p>Username: {username}</p>
          <p>Repository: {repository}</p>
          <p>Query: {query}</p>
        </div>
      );
    }
    ```

*   **Updating Values:** Use the setter functions provided by the context (e.g., `setUsername`, `setRepository`, `setQuery`) to update the state:

    ```typescript
    import { useGithubContext } from './context/useGithubContext';

    function MyInputComponent() {
      const { setUsername } = useGithubContext();

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
      };

      return (
        <input type="text" onChange={handleInputChange} />
      );
    }
    ```

### Deployment (Conceptual)

While specific deployment instructions are not included in this project, the application, being a React application built with Vite, can be deployed to various platforms such as Netlify, Vercel, or AWS Amplify. The build process is initiated using `npm run build`, which generates optimized static assets ready for deployment.

This documentation should provide a solid starting point for understanding and working with the SC4052-Cloud-Computing-Assignment-2 repository.
