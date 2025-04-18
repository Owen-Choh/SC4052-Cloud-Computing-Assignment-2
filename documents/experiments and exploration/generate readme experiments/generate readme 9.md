# SC4052-Cloud-Computing-Project

This repository contains the code for a cloud computing project, focusing on building a chatbot application. The application consists of a React frontend, a Go backend, and uses Caddy as a reverse proxy. It leverages Google's Gemini API for conversational AI capabilities.

## Description

This project demonstrates a full-stack cloud application with a focus on containerization and deployment. It includes:

*   **React Frontend (`chatbot-app/`):** A user interface built with React, TypeScript, and Tailwind CSS for interacting with the chatbot.
*   **Go Backend (`chatbot-backend/`):** An API server built with Go that handles user authentication, chatbot management, and communication with the Gemini API.
*   **Caddy Reverse Proxy (`Caddyfile`):** A configuration file for Caddy, a web server that acts as a reverse proxy, routing requests to the frontend and backend services.
*   **Docker Compose (`docker-compose.yaml`):** A file for defining and managing multi-container Docker applications, simplifying deployment.

## Overview of the Code

Here's a breakdown of the key components:

*   **`Caddyfile`:** This file configures Caddy to:
    *   Serve the React frontend.
    *   Proxy API requests ( `/api*` ) to the Go backend.
    *   Enable TLS (HTTPS) using Caddy's automatic certificate management.
    *   Sets the `Access-Control-Allow-Credentials` header to `true` to allow cookies to be sent in cross-origin requests.
*   **`chatbot-app/Dockerfile`:** This Dockerfile builds the React frontend:
    *   Uses a multi-stage build:
        *   First, it uses a Node.js image to build the React application.
        *   Then, it uses an Nginx image to serve the built application.
    *   Copies the `default.conf` file to configure Nginx.
*   **`chatbot-backend/main.go`:** This is the main file for the Go backend:
    *   Sets up an HTTP server.
    *   Connects to a SQLite database.
    *   Defines API endpoints for user authentication, chatbot management, and conversation handling.
    *   Integrates with the Gemini API for generating chatbot responses.
    *   Uses middleware for logging and CORS (Cross-Origin Resource Sharing).
*   **`chatbot-app/src/App.tsx`:** This is the main component of the React application:
    *   Sets up routing using `react-router-dom`.
    *   Provides authentication using `useAuth`.
    *   Protects routes using `ProtectedRoute`.
    *   Renders the `LoginPage`, `Dashboard`, and `ConversationPage` components.
*   **`chatbot-backend/Makefile`:** This file contains commands to build and test the Go backend.
*   **`chatbot-app/frontend-env-example.txt`:** This file shows the environment variables required for the frontend.
*   **`docker-compose.yaml`:** This file defines the services (backend, frontend, Caddy) and their configurations for Docker Compose.

## Architecture

The application follows a microservices-inspired architecture, with the frontend, backend, and reverse proxy running as separate containers. This allows for independent scaling and deployment of each component.

The frontend communicates with the backend via API calls. Caddy acts as a reverse proxy, routing requests to the appropriate service and handling TLS encryption. The backend interacts with a SQLite database to store user data, chatbot configurations, and conversation history. The backend also communicates with the Gemini API to generate chatbot responses.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Install Docker and Docker Compose:** Make sure you have Docker and Docker Compose installed on your system. You can find instructions on how to install them on the Docker website.

3.  **Configure environment variables:**

    *   Create a `.env` file in the `chatbot-backend/` directory based on the `chatbot-backend/backend-env-example.txt` file.
    *   Create a `.env` file in the `chatbot-app/` directory based on the `chatbot-app/frontend-env-example.txt` file.
    *   **Important:** Set the `GEMINI_API_KEY` environment variable in the `chatbot-backend/.env` file with your actual Gemini API key.
    *   **Important:** Set the `JWT_SECRET` environment variable in the `chatbot-backend/.env` file with a secure secret key.
    *   Alternatively, you can create `secrets/gemini_api_key.txt` and `secrets/jwt_secret.txt` and set the environment variables to the path of these files.

4.  **Run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images and start the containers.

5.  **Access the application:** Open your web browser and navigate to `localhost` or the domain you configured in your `Caddyfile`.

## Key Things to Look Out For

*   **Gemini API Key:** Ensure you have a valid Gemini API key and that it is correctly set in the `chatbot-backend/.env` file.
*   **JWT Secret:** Use a strong and secure secret key for the `JWT_SECRET` environment variable.
*   **Database Path:** The `DATABASE_PATH` environment variable specifies the location of the SQLite database file. Make sure the backend has write permissions to this location.
*   **CORS Configuration:** The `FrontendDomain` environment variable in the `chatbot-backend/.env` file must match the domain where your React frontend is running.
*   **File Uploads:** The application allows users to upload files for chatbot context. Be mindful of file size limits and security considerations.
*   **Error Handling:** The code includes basic error handling, but you may want to add more robust error handling and logging for production deployments.
*   **Security:** This project provides a basic implementation of authentication and authorization. For production deployments, you should implement more robust security measures, such as input validation, output encoding, and protection against common web vulnerabilities.
*   **Streaming:** The application supports streaming responses from the Gemini API. This can improve the user experience by providing faster feedback. However, you should be aware of the limitations of streaming and handle errors appropriately.
*   **Docker Secrets:** The `docker-compose.yaml` file uses Docker secrets to manage sensitive information, such as the Gemini API key and JWT secret. This is a more secure way to store secrets than including them directly in the `docker-compose.yaml` file.
*   **Caddy Configuration:** The `Caddyfile` is configured to use internal TLS. This is suitable for local development, but you should use a valid certificate for production deployments.
*   **Makefile:** The `Makefile` in the `chatbot-backend` directory provides commands for building and testing the Go backend. You can use these commands to automate your development workflow.
*   **Environment Variables:** The application uses environment variables to configure various settings. This makes it easy to deploy the application to different environments without modifying the code.
*   **Context:** The application uses context to pass request-scoped values, such as the user ID and username, between middleware and handlers. This is a common pattern in Go web applications.
*   **Validation:** The application uses the `go-playground/validator/v10` package to validate user input. This helps to prevent errors and improve security.
*   **Middleware:** The application uses middleware to handle common tasks, such as logging and CORS. This helps to keep the handlers clean and focused on their core logic.
*   **Interfaces:** The application uses interfaces to define the contracts between different components. This makes it easier to test and maintain the code.
*   **Error Handling:** The application includes basic error handling, but you may want to add more robust error handling and logging for production deployments.
*   **Regular Expressions:** The application uses regular expressions to validate chatbot names and file names. This helps to prevent errors and improve security.
*   **File Uploads:** The application allows users to upload files for chatbot context. Be mindful of file size limits and security considerations.
*   **Timezones:** The application uses the `time` package to handle timezones. This is important for ensuring that the application behaves correctly in different timezones.
*   **UUIDs:** The application uses the `github.com/google/uuid` package to generate unique identifiers. This is useful for tracking conversations and other entities.
*   **Bcrypt:** The application uses the `golang.org/x/crypto/bcrypt` package to hash passwords. This is important for security.
*   **JWT:** The application uses the `github.com/golang-jwt/jwt/v5` package to generate and verify JWTs (JSON Web Tokens). This is used for authentication and authorization.
*   **CORS:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils/middleware` package to handle CORS (Cross-Origin Resource Sharing). This is important for allowing the frontend to make requests to the backend.
*   **Logging:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils/middleware` package to log requests. This is useful for debugging and monitoring the application.
*   **Validation:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils/validate` package to validate user input. This helps to prevent errors and improve security.
*   **Utils:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils` package to provide utility functions. This helps to keep the code clean and organized.
*   **Config:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/config` package to manage configuration settings. This makes it easy to deploy the application to different environments without modifying the code.
*   **Auth:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/auth` package to handle authentication and authorization. This is important for security.
*   **DB:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/db` package to interact with the database. This helps to keep the code clean and organized.
*   **Types:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/types` package to define data types. This helps to improve code readability and maintainability.
*   **Service:** The application uses the `github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/service` package to implement the business logic. This helps to keep the code clean and organized.

This README provides a comprehensive overview of the project, its architecture, and how to set it up and use it. It also highlights key things to look out for when using the repository.
