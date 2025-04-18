```markdown
# SC4052-Cloud-Computing-Project

## Description

This repository contains the code for a cloud-based chatbot application. It includes a React-based frontend, a Go-based backend, and a Caddy web server for routing and security. The chatbot leverages the Gemini API for conversational AI capabilities.

## Overview of the Code

The repository is structured as follows:

*   **`Caddyfile`**: Configuration file for the Caddy web server.
*   **`chatbot-app/`**: Contains the React frontend code.
    *   **`Dockerfile`**: Defines how to build the React frontend into a Docker image.
    *   **`src/`**: Contains the React components, pages, and logic.
    *   **`nginx/default.conf`**: Nginx configuration for serving the React app.
*   **`chatbot-backend/`**: Contains the Go backend code.
    *   **`main.go`**: The main application file for the Go backend.
    *   **`Makefile`**:  A build file for the Go backend.
    *   **`chatbot/`**: Contains the Go backend logic, including database interactions, API handling, and Gemini API integration.
*   **`docker-compose.yaml`**: Defines the services (frontend, backend, Caddy) and their configurations for Docker Compose.
*   **`secrets/`**: Intended to store sensitive information like API keys (not included directly in the repository).

## Architecture

The application follows a three-tier architecture:

1.  **Frontend (React):** Handles the user interface and user interactions.
2.  **Backend (Go):** Processes user requests, interacts with the database, and communicates with the Gemini API.
3.  **Web Server (Caddy):** Acts as a reverse proxy, handling routing, TLS encryption, and serving static assets.

The frontend communicates with the backend via API calls. The backend uses an SQLite database to store user data, chatbot configurations, and conversation history. The Gemini API is used to generate chatbot responses.

## Setup and Usage

Follow these steps to set up and run the application:

### Prerequisites

*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.
*   A Gemini API key. You can obtain one from the Google AI Studio.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Create `.env` files:**

    Create `.env` files for both the frontend and backend based on the example files provided.

    *   Copy the contents of `chatbot-app/frontend-env-example.txt` to a new file named `chatbot-app/.env`.
    *   Copy the contents of `chatbot-backend/backend-env-example.txt` to a new file named `chatbot-backend/.env`.

3.  **Set Environment Variables:**

    Edit the `.env` files you just created and set the appropriate environment variables.  Pay special attention to the following:

    *   `VITE_BASE_URL` (in `chatbot-app/.env`):  This should point to the backend API endpoint served by Caddy.
    *   `DATABASE_PATH` (in `chatbot-backend/.env`):  This specifies the location of the SQLite database file.
    *   `JWT_SECRET` (in `chatbot-backend/.env`):  A secret key used for signing JWTs.  **Important:** Generate a strong, random secret for production environments.
    *   `GEMINI_API_KEY` (in `chatbot-backend/.env`): Your Gemini API key.

4.  **Create Secrets directory and files:**

    Create a `secrets` directory in the root of the project.
    Create two files inside the `secrets` directory: `gemini_api_key.txt` and `jwt_secret.txt`.
    Place the Gemini API key in `secrets/gemini_api_key.txt` and the JWT secret in `secrets/jwt_secret.txt`.

5.  **Run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images and starts the services defined in `docker-compose.yaml`.

6.  **Access the application:**

    Open your web browser and navigate to `localhost` (or the configured domain in your `Caddyfile`).

## Key Things to Look Out For

*   **Environment Variables:** Ensure all necessary environment variables are correctly set in the `.env` files.  Missing or incorrect variables can lead to application errors.
*   **API Keys:**  Protect your Gemini API key and JWT secret.  Do not commit them directly to the repository. Use environment variables or secret management solutions.
*   **Database Initialization:** The Go backend initializes the SQLite database on startup.  Make sure the backend has the necessary permissions to create and write to the database file.
*   **CORS Configuration:** The `Caddyfile` includes CORS headers to allow requests from the frontend domain.  Adjust the `Access-Control-Allow-Origin` header if your frontend is served from a different domain.
*   **File Uploads:** The backend handles file uploads for chatbot knowledge bases.  Ensure the backend has the necessary permissions to write to the configured `FILES_PATH`.  Also, be mindful of file size limits and security considerations for uploaded files.
*   **Error Handling:**  Pay attention to error messages in the frontend and backend logs.  These messages can provide valuable clues for troubleshooting issues.
*   **Gemini API Usage:**  Be aware of the Gemini API's usage limits and pricing.  Monitor your API usage to avoid unexpected costs.
*   **Security:** This is a basic setup and may not be suitable for production environments without further security hardening. Consider implementing proper authentication, authorization, and input validation to protect against common web vulnerabilities.
*   **Caddyfile Domain:** The `Caddyfile` is configured for a specific domain. You may need to change this to `localhost` or configure a local domain in `/etc/hosts` for local development.
```