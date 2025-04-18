# SC4052-Cloud-Computing-Project

This repository contains the code for a cloud computing project, focusing on building a chatbot application. The application consists of a React frontend, a Go backend, and uses Google's Gemini API for conversational AI.

## Description

This project demonstrates the deployment of a full-stack application to the cloud, utilizing containerization (Docker) and orchestration (Docker Compose). The chatbot application allows users to create and interact with custom chatbots, leveraging the power of cloud computing for scalability and reliability.

## Overview of the Code

The repository is structured as follows:

*   `Caddyfile`: Configuration file for the Caddy web server, used for reverse proxying and TLS.
*   `chatbot-app/`: Contains the React frontend code.
    *   `Dockerfile`: Defines the steps to build a Docker image for the React application.
    *   `src/`: Contains the React components, pages, and API configurations.
    *   `nginx/default.conf`: Nginx configuration file for serving the React app.
    *   `frontend-env-example.txt`: Example environment variables for the frontend.
*   `chatbot-backend/`: Contains the Go backend code.
    *   `main.go`: The main application file, handling routing, database connections, and API logic.
    *   `Makefile`: Contains commands for building and testing the Go backend.
    *   `chatbot/`: Contains the business logic for the chatbot application.
    *   `utils/`: Contains utility functions and middleware.
    *   `backend-env-example.txt`: Example environment variables for the backend.
*   `docker-compose.yaml`: Defines the services, networks, and volumes for the application.
*   `.dockerignore`: Specifies files and directories to exclude from the Docker build context.

## Architecture

The application follows a microservices architecture, with the frontend and backend deployed as separate containers. Caddy acts as a reverse proxy, routing requests to the appropriate service. The backend uses a SQLite database for storing user data, chatbot configurations, and conversation history. The Gemini API is used to generate chatbot responses.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Owen-Choh/SC4052-Cloud-Computing-Project.git
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Set up environment variables:**

    *   Create `.env` files in both the `chatbot-app/` and `chatbot-backend/` directories, based on the provided `frontend-env-example.txt` and `backend-env-example.txt` files respectively.
    *   **Important:** Do not commit your `.env` files to the repository. Add them to `.gitignore`.
    *   Ensure you have a Gemini API key and set it in the backend's `.env` file.
    *   Create `secrets/` folder and create `gemini_api_key.txt` and `jwt_secret.txt` and paste the values in.

3.  **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images for the frontend and backend, and then start the application.

4.  **Access the application:**

    *   Open your web browser and navigate to `localhost` (or the configured domain in your `Caddyfile`).

## Notes

*   **Environment Variables:** Be extremely careful not to commit your `.env` files, which contain sensitive information such as API keys and secrets. Always add `.env` to your `.gitignore` file.
*   **API Keys:** Ensure that your Gemini API key is properly configured in the backend's `.env` file.
*   **Database:** The application uses a SQLite database, which is stored in the `database_files/` directory.
*   **Caddy:** The `Caddyfile` is configured to use internal TLS. You may need to adjust the configuration for production deployments.
*   **Makefile:** The `chatbot-backend/Makefile` provides convenient commands for building and testing the Go backend.
*   **Frontend Base URL:** Ensure the `VITE_BASE_URL` in `chatbot-app/frontend-env-example.txt` is correctly set to your backend API endpoint.
*   **Docker Hub:** The `docker-compose.yaml` file uses images from Docker Hub. You may need to adjust the image names if you are using your own Docker Hub repository.
*   **CORS:** The backend is configured to allow CORS requests from the frontend domain. Ensure that the `FrontendDomain` environment variable is correctly set.
*   **File Uploads:** The application allows users to upload files to the chatbot. Ensure that the `FILES_PATH` environment variable is correctly set and that the backend has write access to the specified directory.
*   **Streaming Responses:** The frontend supports streaming responses from the chatbot. This feature is enabled by default.
*   **Error Handling:** The application includes basic error handling. You may need to add more robust error handling for production deployments.
*   **Security:** This project is for demonstration purposes only and may not be secure enough for production deployments. You should take appropriate security measures before deploying this application to a production environment.
*   **Rate Limiting:** Consider implementing rate limiting to prevent abuse of the Gemini API.
*   **Data Validation:** The backend uses data validation to ensure that user input is valid. You may need to add more robust data validation for production deployments.
*   **Testing:** The backend includes unit tests. You should add more comprehensive tests for production deployments.
*   **Deployment:** The `deploy.yml` file in `.github/workflows/` is a GitHub Actions workflow that automates the deployment of the application to an EC2 instance. You will need to configure the secrets in your GitHub repository to match your EC2 instance.
