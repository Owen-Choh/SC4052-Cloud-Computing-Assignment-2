```markdown
# SC4052-Cloud-Computing-Project

This repository contains the code for a cloud-based chatbot application, developed as part of the SC4052 Cloud Computing module. The application consists of a React frontend, a Go backend, and uses Caddy as a reverse proxy. It leverages Google's Gemini API for conversational AI.

## Description

This project implements a chatbot application with the following features:

*   **User Authentication:** Secure user registration and login.
*   **Chatbot Creation and Customization:** Users can create and customize their own chatbots with specific behaviors and knowledge.
*   **Conversational AI:** Utilizes the Gemini API to provide intelligent and context-aware responses.
*   **File Upload:** Allows users to upload files (PDF, JPG, JPEG) to provide the chatbot with a knowledge base.
*   **Real-time Chat:** Supports streaming responses from the chatbot for a more interactive experience.
*   **Persistence:** Stores user data, chatbot configurations, and conversation history in a SQLite database.

## Overview of the Code

The repository is structured as follows:

*   `README.md`: This file, providing an overview of the project.
*   `Caddyfile`: Configuration file for the Caddy web server, acting as a reverse proxy.
*   `chatbot-app/`: Contains the React frontend code.
    *   `Dockerfile`: Dockerfile for building the React frontend.
    *   `nginx/default.conf`: Nginx configuration file for serving the React app.
    *   `src/`: Contains the React components, pages, and API integrations.
        *   `App.tsx`: Main application component, handling routing and authentication.
        *   `pages/`: Contains React components for different pages, such as `LoginPage`, `Dashboard`, and `ConversationPage`.
        *   `components/`: Contains reusable React components, such as `Sidebar`, `Botconfigs`, `Tab`, `FileUpload` and `DeleteModal`.
        *   `auth/`: Contains authentication-related components and logic.
        *   `api/`: Contains API client for interacting with the backend.
        *   `context/`: Contains React context for managing chatbot state.
    *   `frontend-env-example.txt`: Example environment variable file for the frontend.
    *   `vite.config.ts`: Vite configuration file.
    *   `eslint.config.js`: ESLint configuration file.
    *   `index.html`: Main HTML file for the React app.
    *   `src/App.css`: Global CSS styles for the React app.
    *   `src/index.css`: Global CSS styles for the React app.
    *   `src/markdown.css`: CSS styles for markdown rendering.
    *   `src/vite-env.d.ts`: TypeScript declaration file for Vite environment variables.
*   `chatbot-backend/`: Contains the Go backend code.
    *   `main.go`: Main application entry point, handling routing and server setup.
    *   `Makefile`: Makefile for building and testing the Go backend.
    *   `chatbot/`: Contains the core chatbot logic.
        *   `auth/`: Contains JWT authentication logic.
        *   `config/`: Contains configuration loading logic.
        *   `db/`: Contains database initialization and connection logic.
        *   `service/`: Contains handlers and store interfaces for different services (user, chatbot, conversation).
        *   `types/`: Contains data structures and interfaces.
    *   `utils/`: Contains utility functions, such as middleware and validation.
    *   `backend-env-example.txt`: Example environment variable file for the backend.
    *   `Dockerfile`: Dockerfile for building the Go backend.
*   `docker-compose.yaml`: Docker Compose file for orchestrating the application.
*   `.dockerignore`: Specifies files to exclude from Docker images.
*   `secrets/`: Contains secret files for the Gemini API key and JWT secret (not included in the repository for security reasons).

## Architecture

The application follows a microservices-inspired architecture, with a clear separation between the frontend and backend.

1.  **Frontend (React):** Handles user interaction, displays data, and communicates with the backend via API calls.
2.  **Backend (Go):** Manages user authentication, chatbot creation, conversation logic, and interacts with the Gemini API.
3.  **Reverse Proxy (Caddy):** Routes incoming requests to the appropriate service (frontend or backend) and handles TLS encryption.
4.  **Database (SQLite):** Stores persistent data, such as user accounts, chatbot configurations, and conversation history.
5.  **Gemini API:** Provides the conversational AI capabilities for the chatbots.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Prerequisites:**
    *   Docker and Docker Compose installed on your system.
    *   A Google Cloud project with the Gemini API enabled.
    *   A Gemini API key.
2.  **Configuration:**
    *   Create a `.env` file in the `chatbot-backend/` directory based on the `chatbot-backend/backend-env-example.txt` file. Fill in the required environment variables, including the Gemini API key.
    *   Create a `.env` file in the `chatbot-app/` directory based on the `chatbot-app/frontend-env-example.txt` file. Fill in the required environment variables.
    *   Create `secrets/` directory and create two files `gemini_api_key.txt` and `jwt_secret.txt` and paste the respective keys in the files.
3.  **Build and Run:**
    *   Navigate to the root directory of the repository.
    *   Run `docker-compose up --build` to build the Docker images and start the application.
4.  **Access the Application:**
    *   Open your web browser and navigate to `localhost` or the configured domain in the `Caddyfile`.

## Key Things to Look Out For

*   **API Keys:** Ensure that you have correctly configured the Gemini API key in the backend environment variables and the `secrets/` directory.
*   **Database Path:** The `DATABASE_PATH` environment variable in the backend configuration determines the location of the SQLite database file.
*   **CORS Configuration:** The `Caddyfile` configures CORS to allow requests from the frontend domain. Make sure this is correctly set for your deployment environment.
*   **File Uploads:** The backend handles file uploads to a specific directory. Ensure that the `FILES_PATH` environment variable is correctly configured and that the backend has the necessary permissions to write to that directory.
*   **Docker Compose:** The `docker-compose.yaml` file defines the services and their dependencies. Review this file to understand the application's architecture and configuration.
*   **Streaming Responses:** The `ConversationPage` component in the frontend handles streaming responses from the backend. Pay attention to the implementation of the `EventSource` API for handling server-sent events.
*   **Security:** This project uses JWT for authentication. Ensure that the JWT secret is securely stored and managed.
*   **Error Handling:** The code includes error handling for various operations, such as API calls, database interactions, and file uploads. Review the error handling logic to ensure that it is appropriate for your deployment environment.
*   **Makefile:** The `chatbot-backend/Makefile` contains commands for building and testing the Go backend. Use these commands to ensure that the backend code is working correctly.
*   **Gemini API Quotas:** Be aware of the usage quotas and limitations of the Gemini API.
*   **Caddyfile Configuration:** The `Caddyfile` is configured to use internal TLS. This is suitable for local development, but you may need to configure a different TLS setup for production deployments.
```