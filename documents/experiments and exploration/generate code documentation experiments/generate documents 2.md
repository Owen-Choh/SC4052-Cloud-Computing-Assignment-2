# SC4052-Cloud-Computing-Assignment-2 Documentation

This document provides an overview and guide to the SC4052 Cloud Computing Assignment 2 repository, detailing its structure, components, and usage.

## Table of Contents
1.  [Introduction](#introduction)
2.  [Repository Structure](#repository-structure)
3.  [Components](#components)
4.  [Contexts](#contexts)
5.  [API Configurations](#api-configurations)
6.  [Gemini API Integration](#gemini-api-integration)
7.  [Setup and Installation](#setup-and-installation)
8.  [Configuration](#configuration)
9.  [Scripts](#scripts)
10. [Dependencies](#dependencies)
11. [Development](#development)
12. [Contributing](#contributing)
13. [License](#license)

## 1. Introduction

This repository contains the code for Assignment 2 of the SC4052 Cloud Computing module. The project is a React-based SaaS application for searching and editing code on GitHub, enhanced with code description capabilities using the Gemini API. It leverages Vite, TypeScript, Tailwind CSS, Octokit, and other modern web development tools.

## 2. Repository Structure

The repository is structured as follows:

*   `README.md`: This file, providing an overview of the project.
*   `index.html`: The main HTML file for the React application.
*   `src/`: Contains the source code for the application.
    *   `App.tsx`: The main application component.
    *   `main.tsx`: Entry point for the React application.
    *   `App.css`: Global CSS styles.
    *   `index.css`: Global CSS styles.
    *   `vite-env.d.ts`: TypeScript environment declaration file for Vite.
    *   `api/`: Contains API configuration and setup.
        *   `apiconfigs.tsx`: Configuration for GitHub API and Octokit.
    *   `components/`: Contains React components.
        *   `CodeEdit.tsx`: Component for editing code (not implemented in the provided code).
        *   `CodeSearch.tsx`: Component for searching code on GitHub.
        *   `GeneralInfo.tsx`: Component for general information input (GitHub token, username, repository).
    *   `context/`: Contains React context.
        *   `useGithubContext.tsx`: Manages application state using React Context.
    *   `geminiAPI/`: Contains Gemini API integration.
        *   `geminiAPI.tsx`: Logic to generate code descriptions using the Gemini API.
*   `eslint.config.js`: ESLint configuration file.
*   `vite.config.ts`: Vite configuration file.
*   `tsconfig.json`: TypeScript configuration file.
*   `tsconfig.app.json`: TypeScript configuration file for the app.
*   `tsconfig.node.json`: TypeScript configuration file for Node.
*   `package.json`: Node.js package manifest.
*   `pnpm-lock.yaml`: PNPM lock file for managing dependencies.

## 3. Components

### 3.1. App.tsx

*   **Description**: The main application component that sets up the layout and navigation. It uses state to manage which tab is currently active (`GeneralInfo`, `CodeSearch`, or `CodeEdit`).
*   **Functionality**:
    *   Renders a sidebar with navigation links.
    *   Conditionally renders the `GeneralInfo`, `CodeSearch`, or `CodeEdit` components based on the active tab.
    *   Wraps the main content with a `GithubProvider` to provide global state.
*   **Key Elements**:
    *   `useState` hook to manage the active tab.
    *   `GithubProvider` to share state across components.

### 3.2. CodeSearch.tsx

*   **Description**: This component allows users to search for code snippets on GitHub.
*   **Functionality**:
    *   Takes user input for search query, username, repository, and file types.
    *   Uses the GitHub API to search for code based on the provided criteria.
    *   Displays the search results, including a checkbox to select items and a button to describe code using the Gemini API.
    *   Displays descriptions generated by the Gemini API.
*   **Key Elements**:
    *   Input fields for search parameters.
    *   Button to trigger the search.
    *   Display of search results with selection checkboxes.
    *   Integration with the Gemini API to generate code descriptions.

### 3.3. GeneralInfo.tsx

*   **Description**: This component handles the input of general information such as GitHub token, username, and repository.
*   **Functionality**:
    *   Allows users to input their GitHub token, username, and select a repository.
    *   Fetches the list of repositories for a given username using the GitHub API.
    *   Updates the global state with the provided information.
*   **Key Elements**:
    *   Input fields for GitHub token and username.
    *   Select dropdown for choosing a repository.
    *   Button to fetch repositories.

### 3.4. CodeEdit.tsx

*   **Description**: Placeholder component for code editing functionality (not fully implemented in the provided code).

## 4. Contexts

### 4.1. useGithubContext.tsx

*   **Description**: This context provider manages the global state for the application.
*   **Functionality**:
    *   Provides state variables for GitHub token, username, repository, selected items, search query, file types, search results, and code descriptions.
    *   Provides setter functions to update these state variables.
*   **Key Elements**:
    *   `GithubContext` for providing and consuming the state.
    *   `GithubProvider` component to wrap the application and provide the context.
    *   `useGithubContext` hook for accessing the context in functional components.

## 5. API Configurations

### 5.1. apiconfigs.tsx

*   **Description**: This file configures the GitHub API and sets up the Octokit instance for making API requests.
*   **Functionality**:
    *   Defines the GitHub API URL.
    *   Creates an Octokit instance with the provided GitHub token.
    *   Creates Axios instances for making requests to the GitHub API with the required headers.
*   **Key Elements**:
    *   `GITHUB_TOKEN`: Variable to store the GitHub token.
    *   `octokit`: Octokit instance for making API requests.
    *   `githubSearchCodeApi`: Axios instance for code search API.
    *   `githubSearchRepoApi`: Axios instance for repository search API.

## 6. Gemini API Integration

### 6.1. geminiAPI.tsx

*   **Description**: This file handles the integration with the Gemini API to generate code descriptions.
*   **Functionality**:
    *   Uses the `@google/generative-ai` library to interact with the Gemini API.
    *   Defines a function `generateContent` that takes a prompt as input and returns the generated text from the Gemini API.
*   **Key Elements**:
    *   `GEMINI_API_KEY`: Variable to store the Gemini API key.
    *   `GoogleGenerativeAI` instance for interacting with the Gemini API.
    *   `generateContent` function to generate text from the Gemini API.

## 7. Setup and Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd SC4052-Cloud-Computing-Assignment-2
    ```

2.  **Install dependencies using PNPM:**

    ```bash
    pnpm install
    ```

    If you don't have PNPM installed, you can install it using npm:

    ```bash
    npm install -g pnpm
    ```

## 8. Configuration

1.  **Create a `.env` file** in the root directory of the project.

2.  **Add your GitHub token and Gemini API key** to the `.env` file:

    ```
    VITE_GITHUB_TOKEN=<your_github_token>
    VITE_GEMINI_API_KEY=<your_gemini_api_key>
    ```

    Replace `<your_github_token>` and `<your_gemini_api_key>` with your actual tokens.

## 9. Scripts

The following scripts are defined in the `package.json` file:

*   `dev`: Starts the development server.
    ```bash
    pnpm dev
    ```
*   `build`: Builds the application for production.
    ```bash
    pnpm build
    ```

*   `lint`: Runs ESLint to lint the code.
    ```bash
    pnpm lint
    ```
*   `preview`: Starts a local server to preview the production build.
    ```bash
    pnpm preview
    ```

## 10. Dependencies

The project uses the following main dependencies:

*   `react`: JavaScript library for building user interfaces.
*   `react-dom`: Provides DOM-specific methods for React.
*   `vite`: A build tool that aims to provide a faster and leaner development experience for modern web projects.
*   `typescript`: Adds static typing to JavaScript.
*   `tailwindcss`: A utility-first CSS framework for rapidly designing custom designs.
*   `axios`: Promise based HTTP client for the browser and node.js
*   `octokit`: GitHub SDK for JavaScript
*   `eslint`: Tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
*   `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript.
*   `@typescript-eslint/parser`: Parser that allows ESLint to understand TypeScript syntax.
*   `react-markdown`: Markdown component for React.
*   `@google/generative-ai`: Google Gemini API

## 11. Development

### Code Style
*   This project uses ESLint with the recommended TypeScript rules.
### Committing
*   All commits should have a descriptive message.

## 12. Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request to the main branch.

## 13. License

This project is open-source and available under the MIT License. See the `LICENSE` file for more information.
