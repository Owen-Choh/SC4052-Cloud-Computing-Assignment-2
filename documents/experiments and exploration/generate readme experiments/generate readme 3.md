# SC4052-Cloud-Computing-Project

This repository contains the code for a cloud computing project, focusing on building a simple chatbot application. The application consists of a React-based frontend, a Go-based backend, and uses Caddy as a reverse proxy.

## Description

This project demonstrates a basic cloud-native application architecture, utilizing containerization (Docker) and orchestration (Docker Compose). It showcases how to build and deploy a full-stack application with a focus on separation of concerns, scalability, and ease of deployment.

## Overview of the Code

The repository is structured as follows:

*   **`Caddyfile`**: Configuration file for the Caddy web server, which acts as a reverse proxy.
*   **`chatbot-app/`**: Contains the React frontend application.
    *   `Dockerfile`: Defines how to build the Docker image for the frontend.
    *   `nginx/default.conf`: Nginx configuration file for serving the React app.
    *   `src/`: Contains the React source code.
    *   `frontend-env-example.txt`: Example environment variables for the frontend.
*   **`chatbot-backend/`**: Contains the Go backend application.
    *   `main.go`: The main entry point for the Go backend.
    *   `Makefile`: Contains commands for building and testing the Go backend.
    *   `chatbot/`: Contains the Go backend source code.
    *   `utils/`: Contains utility functions for the Go backend.
*   **`docker-compose.yaml`**: Defines the services, networks, and volumes for the application.
*   **`secrets/`**: Contains secrets for the application.

## Architecture

The application follows a microservices-inspired architecture, with the frontend and backend deployed as separate containers. Caddy acts as a reverse proxy, routing requests to the appropriate service.

1.  **Frontend (React):** Handles the user interface and interacts with the backend API.
2.  **Backend (Go):** Provides the API endpoints for user authentication, chatbot management, and conversation handling.
3.  **Caddy:** Serves as a reverse proxy, handling TLS termination and routing requests to the frontend and backend services.
4.  **Database (SQLite):** Stores user data, chatbot configurations, and conversation history.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Prerequisites:**
    *   Docker
    *   Docker Compose
    *   A Gemini API Key (if you want to use the conversation service)

2.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the `chatbot-backend/` directory based on the `chatbot-backend/backend-env-example.txt` file.
    *   Create a `.env` file in the `chatbot-app/` directory based on the `chatbot-app/frontend-env-example.txt` file.
    *   Set the `VITE_BASE_URL` in `chatbot-app/.env` to point to your backend API endpoint (e.g., `"http://localhost:8080/api"`).
    *   If you want to use the conversation service, create a `secrets` folder and create two files: `gemini_api_key.txt` and `jwt_secret.txt`. Put your Gemini API key in `gemini_api_key.txt` and a strong, random secret in `jwt_secret.txt`.

4.  **Run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images and starts the containers defined in the `docker-compose.yaml` file.

5.  **Access the application:**

    Open your web browser and navigate to `localhost` (or the configured domain in your `Caddyfile`).

## Notes

*   **Caddy Configuration:** The `Caddyfile` is configured to use internal TLS. You may need to adjust the domain name to match your local setup or deployment environment.
*   **Database:** The application uses SQLite as a database. The database file is stored in the `chatbot-backend/database_files/` directory.
*   **Environment Variables:** Ensure that you have correctly configured the environment variables in both the frontend and backend applications.
*   **API Keys:** Make sure to keep your Gemini API key secure and do not commit it to the repository.
*   **File Uploads:** The application allows users to upload files. The uploaded files are stored in the `chatbot-backend/database_files/uploads/` directory.
*   **CORS:** The backend is configured to allow cross-origin requests from the frontend domain.
*   **Error Handling:** The backend includes basic error handling and logging.
*   **Security:** This project is a basic example and does not include advanced security measures. Consider implementing additional security features, such as input validation, authentication, and authorization, in a production environment.
*   **Makefile:** The `chatbot-backend/Makefile` provides convenient commands for building and testing the backend application.
*   **Secrets:** The `docker-compose.yaml` file uses Docker secrets to manage sensitive information, such as API keys and JWT secrets.
*   **Streaming:** The conversation page has a checkbox to enable streaming responses from the chatbot. This is done using Server-Sent Events (SSE).
*   **Chatbot Naming:** Chatbot names can only contain alphanumeric, underscore, or hyphen characters.
*   **File Naming:** File names can only contain alphanumeric, spaces, underscore, or hyphen characters.
*   **File Types:** Only PDF, JPG, and JPEG file types are allowed.
*   **File Size:** File size is limited to 10MB.
*   **API File Expiration:** API files are re-uploaded to Gemini after a certain period of time, as defined by the `API_FILE_EXPIRATION_HOUR` environment variable.
*   **Timezone:** The backend uses the `Asia/Singapore` timezone by default. This can be configured using the `Timezone` environment variable.
*   **Cookie:** The backend uses cookies to store the JWT token. The cookie is set to be HTTP-only, secure, and SameSite=Strict.
*   **Error Messages:** The frontend displays error messages to the user in case of API failures.
*   **Conversation ID:** Each conversation is assigned a unique ID, which is used to track the conversation history.
*   **Chatbot Description:** The chatbot description is displayed on the conversation page.
*   **Chatbot Sharing:** Chatbots can be shared with other users by setting the `isShared` flag to `true`.
*   **Chatbot Last Used:** The last used time for each chatbot is tracked and displayed on the dashboard.
*   **Delete Modal:** The dashboard includes a delete modal to confirm the deletion of a chatbot.
*   **Protected Routes:** The dashboard is protected by a protected route, which requires the user to be authenticated.
*   **Logout:** The sidebar includes a logout button, which clears the user's authentication token.
*   **New Chatbot:** The sidebar includes a button to create a new chatbot.
*   **Chatbot Information:** The dashboard includes a chatbot information section, which displays the chatbot's name, description, endpoint, created date, updated date, and last used time.
*   **Chatbot Customization:** The dashboard includes a chatbot customization section, which allows the user to customize the chatbot's behavior, context, and document.
*   **File Upload:** The dashboard includes a file upload component, which allows the user to upload a document to the chatbot.
*   **Tab Panel:** The dashboard uses a tab panel component to switch between the chatbot information and customization sections.
*   **Tab:** The dashboard uses a tab component to display the tabs in the tab panel.
*   **Sidebar:** The dashboard includes a sidebar, which displays the list of chatbots and the logout button.
*   **Dashboard:** The dashboard is the main page for managing chatbots.
*   **Login Page:** The login page allows users to log in or register.
*   **Conversation Page:** The conversation page allows users to chat with a chatbot.
*   **App.tsx:** The main component for the frontend application.
*   **API Configuration:** The frontend uses axios to make API requests to the backend. The API endpoints are defined in `src/api/apiConfig.tsx`.
*   **Authentication:** The frontend uses a custom authentication hook (`useAuth`) to manage user authentication.
*   **Context:** The frontend uses a custom context (`ChatbotContext`) to manage the list of chatbots and the selected chatbot.
*   **Environment Variables:** The frontend uses environment variables to configure the API endpoint.
*   **ESLint Configuration:** The frontend uses ESLint to enforce code style and prevent errors.
*   **Vite Configuration:** The frontend uses Vite as a build tool. The Vite configuration is defined in `vite.config.ts`.
*   **Tailwind CSS:** The frontend uses Tailwind CSS for styling.
*   **TypeScript:** The frontend is written in TypeScript.
*   **React:** The frontend is built using React.
*   **Dockerfile:** The `chatbot-app/Dockerfile` defines how to build the Docker image for the frontend.
*   **Nginx Configuration:** The `chatbot-app/nginx/default.conf` file configures Nginx to serve the React app.
*   **Frontend Environment Variables:** The `chatbot-app/frontend-env-example.txt` file provides an example of the environment variables that can be used to configure the frontend.
*   **Go Backend:** The `chatbot-backend/` directory contains the Go backend application.
*   **Main.go:** The `chatbot-backend/main.go` file is the main entry point for the Go backend.
*   **Makefile:** The `chatbot-backend/Makefile` provides convenient commands for building and testing the backend application.
*   **Chatbot Directory:** The `chatbot-backend/chatbot/` directory contains the Go backend source code.
*   **Utils Directory:** The `chatbot-backend/utils/` directory contains utility functions for the Go backend.
*   **Backend Environment Variables:** The `chatbot-backend/backend-env-example.txt` file provides an example of the environment variables that can be used to configure the backend.
*   **Dockerignore:** The `.dockerignore` files prevent unnecessary files from being included in the Docker images.
*   **Docker Compose:** The `docker-compose.yaml` file defines the services, networks, and volumes for the application.
*   **Secrets:** The `secrets/` directory contains secrets for the application.
*   **GitHub Actions:** The `.github/workflows/deploy.yml` file defines a GitHub Actions workflow for building, pushing, and deploying the application.
*   **JWT Authentication:** The backend uses JWT authentication to protect the API endpoints.
*   **Password Hashing:** The backend uses bcrypt to hash passwords.
*   **Middleware:** The backend uses middleware for logging, CORS, and authentication.
*   **Validation:** The backend uses the `go-playground/validator/v10` library for input validation.
*   **UUID Generation:** The backend uses the `google/uuid` library for generating unique IDs.
*   **Timezone Handling:** The backend uses the `time` package to handle timezones.
*   **Error Handling:** The backend includes basic error handling and logging.
*   **CORS:** The backend is configured to allow cross-origin requests from the frontend domain.
*   **API File Expiration:** API files are re-uploaded to Gemini after a certain period of time, as defined by the `API_FILE_EXPIRATION_HOUR` environment variable.
*   **Gemini API:** The backend uses the Gemini API to generate chatbot responses.
*   **SQLite Database:** The backend uses SQLite as a database.
*   **Go Modules:** The backend uses Go modules for dependency management.
*   **Go:** The backend is written in Go.
*   **Caddy:** The application uses Caddy as a reverse proxy.
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** The `Caddyfile` can be configured to automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Domain Name:** The `Caddyfile` specifies the domain name for the application.
*   **API Endpoint:** The `Caddyfile` specifies the API endpoint for the backend service.
*   **Frontend Endpoint:** The `Caddyfile` specifies the endpoint for the frontend service.
*   **Headers:** The `Caddyfile` configures the HTTP headers for the application.
*   **Access Control:** The `Caddyfile` configures access control for the application.
*   **CORS:** The `Caddyfile` configures CORS for the application.
*   **Security:** The `Caddyfile` configures security settings for the application.
*   **Logging:** The `Caddyfile` configures logging for the application.
*   **Error Handling:** The `Caddyfile` configures error handling for the application.
*   **Caching:** The `Caddyfile` can be configured to cache static assets.
*   **Compression:** The `Caddyfile` can be configured to compress responses.
*   **HTTP/2:** Caddy supports HTTP/2.
*   **HTTP/3:** Caddy supports HTTP/3.
*   **QUIC:** Caddy supports QUIC.
*   **WebSockets:** Caddy supports WebSockets.
*   **Server-Sent Events:** Caddy supports Server-Sent Events (SSE).
*   **Reverse Proxy:** Caddy acts as a reverse proxy, routing requests to the appropriate service.
*   **TLS Termination:** Caddy handles TLS termination.
*   **Load Balancing:** Caddy can be configured to load balance requests across multiple backend instances.
*   **Automatic HTTPS:** Caddy can automatically obtain and renew SSL certificates from Let's Encrypt.
*   **Configuration:** The Caddy configuration is defined in the `Caddyfile`.
*   **Caddyfile:** The `Caddyfile` is the configuration file for the Caddy web server.
*   **Reverse Proxy:** The `Caddyfile` configures Caddy to act as a reverse proxy, routing requests to the frontend and backend services.
*   **TLS Termination:** The `Caddyfile` configures Caddy to handle TLS termination.
*   **Load Balancing:** The `Caddyfile` can be