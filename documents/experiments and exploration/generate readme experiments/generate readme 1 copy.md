# SC4052-Cloud-Computing-Project

This project implements a chatbot application using a cloud-native architecture. It consists of a React frontend, a Go backend, and uses Caddy as a reverse proxy.

## Overview

This repository contains the code for a cloud computing project, designed to be deployed on a cloud platform like AWS. The project is structured as follows:

*   `chatbot-app/`: Contains the React frontend code.
*   `chatbot-backend/`: Contains the Go backend code.
*   `Caddyfile`: Configuration file for the Caddy web server.
*   `docker-compose.yaml`: Defines the services and their configurations for Docker Compose.

## Getting Started

These instructions will guide you on how to set up and run the project.

### Prerequisites

*   [Docker](https://www.docker.com/get-started/) installed on your machine.
*   [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
*   A Gemini API key (if you want to use the conversation service).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Set up environment variables:**

    *   Create a `.env` file in the `chatbot-backend/` directory. You can use the `chatbot-backend/backend-env-example.txt` file as a template.  Make sure to fill in the `JWT_SECRET` and `GEMINI_API_KEY` if you intend to use the conversation service.
    *   Create a `.env` file in the `chatbot-app/` directory. You can use the `chatbot-app/frontend-env-example.txt` file as a template.  Ensure the `VITE_BASE_URL` is correctly set to your backend's API endpoint.

    **Important:** For production, store your `JWT_SECRET` and `GEMINI_API_KEY` securely using Docker secrets or environment variables provided by your cloud provider.

3.  **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images for the frontend and backend, and then starts all the services defined in the `docker-compose.yaml` file.

### Accessing the Application

Once the Docker containers are running, you can access the application in your web browser at `http://localhost`.  If you are deploying to a cloud provider, replace `localhost` with the appropriate domain or IP address.

## Project Structure Details

### `chatbot-app/` (React Frontend)

*   `Dockerfile`: Defines how to build the React application into a Docker image.
*   `src/`: Contains the React components, pages, and logic.
    *   `App.tsx`: Main application component that sets up routing and authentication.
    *   `pages/`: Contains the different pages of the application (e.g., `LoginPage.tsx`, `Dashboard.tsx`, `ConversationPage.tsx`).
    *   `auth/`: Contains authentication-related components and logic (e.g., `useAuth.tsx`, `ProtectedRoute.tsx`).
    *   `api/`: Contains API client setup and interfaces (e.g., `apiConfig.tsx`, `chatbot.tsx`).
    *   `components/`: Contains reusable UI components.
    *   `context/`: Contains the chatbot context for managing chatbot state.
*   `nginx/default.conf`: Nginx configuration file for serving the React app.
*   `vite.config.ts`: Vite configuration file for building the React app.
*   `frontend-env-example.txt`: Example environment variable file for the frontend.

### `chatbot-backend/` (Go Backend)

*   `Dockerfile`: Defines how to build the Go backend into a Docker image.
*   `main.go`: The main entry point for the Go backend application.
*   `chatbot/`: Contains the core chatbot logic.
    *   `auth/`: Contains authentication and JWT handling logic.
    *   `config/`: Contains configuration loading and environment variables.
    *   `db/`: Contains database initialization and connection logic.
    *   `service/`: Contains the business logic and handlers for different services (e.g., `user`, `chatbot`, `conversation`).
    *   `types/`: Contains the data structures and interfaces used throughout the backend.
*   `utils/`: Contains utility functions and middleware.
*   `Makefile`: Contains commands for building and testing the Go backend.
*   `backend-env-example.txt`: Example environment variable file for the backend.

### `Caddyfile`

This file configures the Caddy web server to act as a reverse proxy. It routes requests to the appropriate backend service (frontend or backend API) based on the URL path.  It also handles TLS encryption.

**Important:** The `ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com` in the `Caddyfile` is a placeholder.  You should replace this with your actual domain or IP address.  For local testing, you can use `localhost` but you may need to configure your `/etc/hosts` file.

### `docker-compose.yaml`

This file defines the different services that make up the application (frontend, backend, Caddy) and how they should be built and run. It also defines the network and volume configurations.

**Important:** The `docker-compose.yaml` file uses Docker secrets for sensitive information like the Gemini API key and JWT secret.  Make sure to create the corresponding secret files (`./secrets/gemini_api_key.txt` and `./secrets/jwt_secret.txt`) or adjust the configuration to use environment variables directly.

## Key Components and Technologies

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A build tool that provides a fast and efficient development experience.
*   **Go:** A programming language known for its efficiency and concurrency.
*   **Caddy:** A fast, multi-platform web server with automatic HTTPS.
*   **Docker:** A platform for building, deploying, and managing containerized applications.
*   **Docker Compose:** A tool for defining and running multi-container Docker applications.
*   **JWT (JSON Web Tokens):** A standard for securely transmitting information between parties as a JSON object.
*   **Gemini API:**  Google's generative AI model used for chatbot conversations (optional).

## Important Notes

*   **Security:**  Ensure that your `JWT_SECRET` is strong and kept secret.  Never commit it directly to your repository.
*   **API Keys:** Protect your Gemini API key.  Do not expose it in client-side code.
*   **CORS:** The `Caddyfile` includes CORS headers to allow the frontend to make requests to the backend.  Make sure the `FrontendDomain` environment variable is correctly set.
*   **Database:** The backend uses SQLite as a database.  The database file is stored in the `backend-data` Docker volume.
*   **File Uploads:** Uploaded files are stored in the `backend-uploads` Docker volume.
*   **Error Handling:**  The backend includes basic error handling, but you should implement more robust error handling and logging for production.
*   **Streaming:** The frontend supports streaming responses from the backend using Server-Sent Events (SSE).  This allows for a more interactive chatbot experience.
*   **Environment Variables:**  Pay close attention to the environment variables used in the `docker-compose.yaml` file and make sure they are correctly configured for your environment.
*   **Makefile:** The `chatbot-backend/Makefile` provides convenient commands for building and testing the Go backend.  Use `make build` to build the backend and `make test` to run the tests.
*   **Data Persistence:** The `docker-compose.yaml` file defines volumes for the backend data and uploads, ensuring that data is persisted even when the containers are stopped or restarted.
*   **API File Expiration:** The `API_FILE_EXPIRATION_HOUR` environment variable in the backend controls how long uploaded files are cached in the Gemini API.  Adjust this value based on your needs.
*   **Chatbot Name Validation:** The chatbot name can only contain alphanumeric characters, underscores, or hyphens. It cannot contain special characters or spaces.
*   **File Name Validation:** The file name can only contain alphanumeric characters, spaces, underscores, and hyphens. It cannot contain special characters.
*   **File Size Limit:** The maximum file size for uploaded files is 10MB.
*   **File Type Validation:** Only PDF, JPG, and JPEG files are allowed for upload.