# SC4052-Cloud-Computing-Project

## Description

This repository contains the code for a cloud computing project, which implements a chatbot application. The application consists of a React-based frontend, a Go-based backend, and a Caddy server for reverse proxying and TLS. The backend leverages the Gemini API for conversational AI capabilities.

## Overview of the Code

The repository is structured as follows:

*   **`Caddyfile`**: Configuration file for the Caddy web server.
*   **`chatbot-app/`**: Contains the React frontend application.
    *   `Dockerfile`: Defines the steps to build a Docker image for the frontend.
    *   `src/`: Contains the React components, pages, and API configurations.
    *   `nginx/default.conf`: Nginx configuration file for serving the React app.
*   **`chatbot-backend/`**: Contains the Go backend application.
    *   `main.go`: The main entry point for the Go backend.
    *   `Makefile`: Contains commands for building and testing the backend.
    *   `chatbot/`: Contains the core logic for the chatbot, including database interactions, authentication, and service handlers.
    *   `utils/`: Contains utility functions and middleware.
*   **`docker-compose.yaml`**: Defines the services, networks, and volumes for Docker Compose.
*   **.dockerignore**: Specifies intentionally untracked files that Docker should exclude.

## Architecture

The application follows a three-tier architecture:

1.  **Frontend (React):** Handles the user interface and interacts with the backend API.
2.  **Backend (Go):** Processes API requests, interacts with the database, and communicates with the Gemini API.
3.  **Reverse Proxy (Caddy):** Routes incoming requests to the appropriate backend service and handles TLS encryption.

## Setup and Usage

Follow these steps to set up and run the application:

### Prerequisites

*   Docker and Docker Compose installed on your machine.
*   A Gemini API key.
*   A Docker Hub account (or other container registry) to push the images to.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Configure the backend:**

    *   Create a `.env` file in the `chatbot-backend/` directory based on the `chatbot-backend/backend-env-example.txt` file.
    *   Set the `GEMINI_API_KEY` environment variable to your Gemini API key.
    *   Set the `JWT_SECRET` environment variable to a secure, randomly generated string.
    *   Create `secrets/` folder and create `gemini_api_key.txt` and `jwt_secret.txt` and paste the keys in the respective files.

3.  **Configure the frontend:**

    *   Create a `.env` file in the `chatbot-app/` directory based on the `chatbot-app/frontend-env-example.txt` file.
    *   Set the `VITE_BASE_URL` environment variable to the URL of your backend API (e.g., `"http://localhost:8080/api"`).

4.  **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images for the frontend and backend, and then start all the services defined in the `docker-compose.yaml` file.

5.  **Access the application:**

    *   Open your web browser and navigate to `https://ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com` (or `https://localhost` if running locally).

## Key Things to Look Out For

*   **Environment Variables:** Ensure that all required environment variables are set correctly in both the frontend and backend `.env` files.
*   **API Keys:** Keep your Gemini API key secure and do not commit it to the repository. Use environment variables or secret management tools to handle sensitive information.
*   **Database:** The backend uses SQLite as the database. The database file is stored in the `database_files/` directory.
*   **CORS:** The backend includes CORS middleware to allow requests from the frontend domain. Make sure the `FrontendDomain` environment variable is set correctly.
*   **Authentication:** The backend uses JWT for authentication. The `JWT_SECRET` environment variable should be set to a secure, randomly generated string.
*   **File Uploads:** The backend handles file uploads for chatbot knowledge bases. Ensure that the `FILES_PATH` environment variable is set correctly and that the backend has write access to the specified directory.
*   **Docker Compose:** The `docker-compose.yaml` file defines the services, networks, and volumes for the application. Make sure to understand the configuration and adjust it as needed.
*   **Makefile:** The `Makefile` in the `chatbot-backend` directory provides convenient commands for building and testing the backend.
*   **Caddyfile:** The `Caddyfile` configures the Caddy web server for reverse proxying and TLS. Make sure to understand the configuration and adjust it as needed.
*   **Error Handling:** The backend includes error handling middleware to catch and log errors. Make sure to review the error handling logic and add additional error handling as needed.
*   **Security:** Review the security considerations for each component of the application, including the frontend, backend, database, and reverse proxy.
*   **Streaming:** The backend supports streaming responses from the Gemini API. This can improve the user experience by providing faster feedback.
*   **Dependencies:** Keep the dependencies in both the frontend and backend up to date to ensure security and stability.
*   **API Rate Limiting:** Be aware of the rate limits for the Gemini API and implement appropriate rate limiting in the backend to avoid exceeding the limits.
*   **File Validation:** The backend validates the file type and size of uploaded files. Make sure to review the validation logic and adjust it as needed.
*   **Context:** The React app uses Context API to manage the state of the chatbots.
*   **Protected Routes:** The React app uses Protected Routes to protect certain pages from unauthorized access.
*   **Markdown:** The React app uses React Markdown to render markdown content.
*   **Axios:** The React app uses Axios to make API requests.
*   **Material UI:** The React app uses Material UI components for the user interface.
*   **ESLint:** The React app uses ESLint to enforce code style and quality.
*   **Typescript:** The React app uses Typescript to provide static typing.
*   **Vite:** The React app uses Vite as a build tool.
*   **Tailwind CSS:** The React app uses Tailwind CSS for styling.
*   **Github Actions:** The repository uses Github Actions for CI/CD.

## Secrets

The repository uses secrets to store sensitive information such as API keys and JWT secrets. These secrets are stored in the `secrets/` directory and are not committed to the repository. The `docker-compose.yaml` file uses these secrets to configure the backend.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.
