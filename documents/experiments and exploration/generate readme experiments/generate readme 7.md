```markdown
# SC4052-Cloud-Computing-Project

## Description

This repository contains the code for a cloud computing project, which implements a chatbot application. The application consists of a React-based frontend, a Go-based backend, and uses Google's Gemini API for conversational AI. Caddy is used as a reverse proxy and handles TLS certificates.

## Overview

The project is structured into three main directories:

*   `chatbot-app`: Contains the React frontend code.
*   `chatbot-backend`: Contains the Go backend code.
*   `Caddyfile`: Contains the configuration for the Caddy web server.

### Code Overview

*   **`chatbot-app`**:
    *   `Dockerfile`: Defines how to build the React frontend into a Docker image using Nginx to serve the static files.
    *   `src/`: Contains the React components, pages, API configurations, and authentication logic.
    *   `vite.config.ts`: Configuration file for Vite, the build tool used for the React application.
    *   `frontend-env-example.txt`: Example environment variables for the frontend. You should rename this to `.env` and fill in the values.
*   **`chatbot-backend`**:
    *   `main.go`: The main entry point for the Go backend application. It sets up the HTTP server, defines API routes, and connects to the SQLite database.
    *   `Makefile`: Contains commands for building and testing the Go backend.
    *   `chatbot/`: Contains the business logic for the chatbot, including database interactions, authentication, and Gemini API integration.
    *   `utils/`: Contains utility functions for tasks such as JSON handling, middleware, and validation.
    *   `backend-env-example.txt`: Example environment variables for the backend. You should rename this to `.env` and fill in the values.
*   **`Caddyfile`**:
    *   Defines the routing rules for the Caddy web server, including reverse proxying API requests to the backend and serving the React frontend.

### Architecture

The application follows a three-tier architecture:

1.  **Frontend (React)**: Handles the user interface and interacts with the backend API.
2.  **Backend (Go)**: Processes API requests, interacts with the database, and communicates with the Gemini API.
3.  **Database (SQLite)**: Stores user data, chatbot configurations, and conversation history.

Caddy acts as a reverse proxy, handling TLS encryption and routing requests to the appropriate backend service.

## Setup and Usage

Follow these steps to set up and run the application:

### Prerequisites

*   Docker and Docker Compose installed on your machine.
*   A Gemini API key from Google.
*   An AWS account to deploy to EC2.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Configure environment variables:**

    *   Rename `chatbot-backend/backend-env-example.txt` to `chatbot-backend/.env` and fill in the required values, including your Gemini API key and JWT secret.
    *   Rename `chatbot-app/frontend-env-example.txt` to `chatbot-app/.env` and set the `VITE_BASE_URL` to the correct backend URL.
    *   Create `secrets/gemini_api_key.txt` and `secrets/jwt_secret.txt` and put the corresponding values in them.

3.  **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images for the frontend and backend, and starts all the services defined in the `docker-compose.yaml` file.

4.  **Access the application:**

    Open your web browser and navigate to `https://ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com` (or the address specified in your Caddyfile) to access the chatbot application.

## Key Things to Look Out For

*   **Environment Variables:** Ensure that all required environment variables are properly configured in the `.env` files. Missing or incorrect environment variables can cause the application to fail.
*   **Gemini API Key:** Make sure your Gemini API key is valid and has the necessary permissions to access the Gemini API.
*   **Database Migrations:** The Go backend automatically initializes the SQLite database.
*   **Caddy Configuration:** Review the `Caddyfile` to understand how requests are routed and ensure that the domain name is correctly configured.
*   **Docker Compose:** Familiarize yourself with the `docker-compose.yaml` file to understand how the different services are linked and configured.
*   **Security:** The application uses JWT for authentication. Ensure that the JWT secret is kept secure and that appropriate measures are taken to protect against unauthorized access.
*   **Error Handling:** Check the logs for any errors or warnings, and implement proper error handling in both the frontend and backend.
*   **File Uploads:** The backend handles file uploads. Ensure that appropriate security measures are in place to prevent malicious file uploads.
*   **CORS:** The backend uses CORS middleware to allow requests from the frontend domain. Make sure that the `FrontendDomain` environment variable is correctly configured.
*   **Makefile:** The backend uses a makefile to simplify common tasks such as building and testing the application.
*   **Dockerignore:** The `.dockerignore` files prevent unnecessary files from being included in the Docker images, reducing their size and build time.
```