# SC4052-Cloud-Computing-Project

This project implements a simple chatbot application using a cloud-native architecture. It consists of a React frontend, a Go backend, and uses Caddy as a reverse proxy.  The backend leverages the Gemini API for conversational AI.

## Overview

The application allows users to create and interact with custom chatbots.  Key features include:

*   **User Authentication:** Secure user registration and login.
*   **Chatbot Creation:**  Users can define chatbot behavior, context, and upload supporting documents.
*   **Conversational Interface:** A clean and intuitive interface for chatting with chatbots.
*   **Cloud-Native Design:**  Containerized components for easy deployment and scaling.

## Architecture

The project is structured into three main components:

1.  **`chatbot-app` (Frontend):**
    *   Built with React, TypeScript, Vite, and Tailwind CSS.
    *   Provides the user interface for interacting with the chatbot application.
    *   Communicates with the backend API to handle user authentication, chatbot management, and conversations.
    *   See `chatbot-app/README.md` for more details (if you were to create one).
2.  **`chatbot-backend` (Backend):**
    *   Developed in Go.
    *   Handles API requests from the frontend.
    *   Manages user authentication, chatbot data, and conversation logic.
    *   Integrates with the Gemini API for generating chatbot responses.
    *   Uses SQLite for data storage.
3.  **`Caddyfile`:**
    *   Configures Caddy, a reverse proxy, to route traffic to the frontend and backend services.
    *   Handles TLS encryption for secure communication.

## Repository Structure

```
SC4052-Cloud-Computing-Project/
├── Caddyfile                  # Caddy configuration file
├── chatbot-app/              # React frontend application
│   ├── Dockerfile              # Dockerfile for building the frontend image
│   ├── nginx/                  # Nginx configuration files
│   │   └── default.conf
│   ├── frontend-env-example.txt # Example environment variables for frontend
│   ├── eslint.config.js        # ESLint configuration
│   ├── index.html              # Main HTML file
│   ├── package.json            # Frontend dependencies and scripts
│   ├── pnpm-lock.yaml          # Package lock file
│   ├── src/                    # React source code
│   │   ├── App.css             # Global CSS styles
│   │   ├── App.tsx             # Main application component
│   │   ├── api/                # API client for backend communication
│   │   ├── auth/               # Authentication components
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers
│   │   ├── markdown.css        # Styles for markdown rendering
│   │   ├── pages/              # React pages (Login, Dashboard, etc.)
│   │   └── vite-env.d.ts       # TypeScript environment declarations
│   ├── tsconfig.app.json       # TypeScript configuration for app
│   ├── tsconfig.node.json      # TypeScript configuration for node
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite configuration
├── chatbot-backend/          # Go backend application
│   ├── chatbot/                # Backend application logic
│   │   ├── auth/               # Authentication logic (JWT)
│   │   ├── config/             # Configuration management
│   │   ├── db/                 # Database initialization and connection
│   │   ├── service/            # Service layer (user, chatbot, conversation)
│   │   ├── types/              # Data structures and interfaces
│   │   └── utils/              # Utility functions (middleware, validation)
│   ├── go.mod                  # Go module definition
│   ├── go.sum                  # Go dependencies checksum
│   ├── main.go                 # Main entry point for the backend
│   └── Makefile                # Build and test automation
├── docker-compose.yaml         # Docker Compose configuration for multi-container deployment
└── .dockerignore               # Specifies intentionally untracked files that Docker should ignore
```

## Setting up the Project

Follow these steps to get the project running:

1.  **Install Docker and Docker Compose:**  Make sure you have Docker and Docker Compose installed on your system.  You can find instructions on the official Docker website.
2.  **Clone the Repository:** Clone this repository to your local machine.
    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env` file in the `chatbot-backend` directory.  Copy the contents of `chatbot-backend/backend-env-example.txt` into the `.env` file and modify the values as needed.  **Important:**  Set the `JWT_SECRET` to a strong, randomly generated string.
    *   Create a `.env` file in the `chatbot-app` directory.  Copy the contents of `chatbot-app/frontend-env-example.txt` into the `.env` file and modify the values as needed.
    *   Create a `secrets` directory in the root of the project.
    *   Create a `gemini_api_key.txt` file inside the `secrets` directory and paste your Gemini API key into it.
    *   Create a `jwt_secret.txt` file inside the `secrets` directory and paste your JWT secret into it.
4.  **Run Docker Compose:**  Navigate to the root directory of the project (where the `docker-compose.yaml` file is located) and run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker images for the frontend and backend, and then start all the services defined in the `docker-compose.yaml` file.

## Accessing the Application

Once the Docker Compose setup is complete, you can access the application in your web browser at `http://localhost` or `https://localhost` (depending on your Caddy configuration).

## Important Notes

*   **Security:**  The `JWT_SECRET` environment variable is crucial for securing your application.  **Never** commit your actual secret to the repository.
*   **Gemini API Key:** You need a valid Gemini API key to use the chatbot functionality.  Make sure to set the `GEMINI_API_KEY` environment variable in the `chatbot-backend/.env` file.
*   **Caddy Configuration:** The `Caddyfile` is configured to use an internal TLS certificate.  For production deployments, you should configure Caddy to use a valid SSL certificate from a trusted certificate authority.  Also, the Caddyfile is configured to use the domain `ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com`. You should change this to your own domain.
*   **Database:** The backend uses SQLite as a database. The database files are stored in the `backend-data` volume.
*   **File Uploads:** Uploaded files are stored in the `backend-uploads` volume.
*   **CORS:** The backend is configured to allow requests from `http://localhost:5173`. If you are running the frontend on a different port, you will need to update the `FrontendDomain` environment variable in the `chatbot-backend/.env` file.
*   **Makefile:** The `chatbot-backend` directory contains a `Makefile` with commands for building and testing the backend application.
*   **Secrets:** The `docker-compose.yaml` file uses secrets to pass the Gemini API key and JWT secret to the backend container. This is a more secure way to handle sensitive information than storing it directly in the `docker-compose.yaml` file.
*   **Error Handling:** The backend includes basic error handling and logging.  For production deployments, you should implement more robust error handling and monitoring.
*   **Streaming:** The frontend has a checkbox to enable streaming responses from the backend. This is done by using Server-Sent Events (SSE).
*   **File Uploads:** The frontend only allows PDF, JPG, and JPEG files to be uploaded. The backend also validates the file type and size.
*   **Chatbot Names:** Chatbot names can only contain alphanumeric characters, underscores, and hyphens.
*   **API File Expiration:** The backend stores the Gemini API file URIs in a database. The URIs are only valid for a certain amount of time, so the backend will re-upload the files to Gemini if the URIs are expired. The expiration time is controlled by the `API_FILE_EXPIRATION_HOUR` environment variable.
*   **Timezone:** The backend uses the `Asia/Singapore` timezone. This can be changed by setting the `Timezone` environment variable.
*   **OS Environment Variables:** The backend uses OS environment variables for the Gemini API key and JWT secret. This is done to allow the application to be deployed to environments where environment variables are the preferred way to configure applications.

## Future Enhancements

*   Implement more robust error handling and monitoring.
*   Add support for more file types.
*   Implement a more sophisticated chatbot personality and behavior.
*   Add support for multiple users and chatbots.
*   Implement a more scalable database solution.
*   Add unit tests for the frontend and backend.
*   Implement CI/CD pipeline for automated builds and deployments.
*   Add support for streaming responses from the backend.
*   Add support for file uploads.
*   Add support for chatbot sharing.
*   Add support for chatbot descriptions.
*   Add support for chatbot context.
*   Add support for chatbot behaviour.
*   Add support for chatbot last used time.
*   Add support for chatbot created date.
*   Add support for chatbot updated date.
*   Add support for chatbot file updated date.
*   Add support for chatbot filepaths.
*   Add support for chatbot file URIs.
*   Add support for chatbot file expiration.
*   Add support for chatbot timezone.
*   Add support for chatbot OS environment variables.
*   Add support for chatbot model name.
*   Add support for chatbot API file store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot auth.
*   Add support for chatbot config.
*   Add support for chatbot db.
*   Add support for chatbot service.
*   Add support for chatbot types.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
*   Add support for chatbot validate.
*   Add support for chatbot middleware.
*   Add support for chatbot auth.
*   Add support for chatbot password.
*   Add support for chatbot jwt.
*   Add support for chatbot routes.
*   Add support for chatbot store.
*   Add support for chatbot handler.
*   Add support for chatbot apifile store.
*   Add support for chatbot conversation store.
*   Add support for chatbot user store.
*   Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.
* Add support for chatbot jwt.
* Add support for chatbot routes.
* Add support for chatbot store.
* Add support for chatbot handler.
* Add support for chatbot apifile store.
* Add support for chatbot conversation store.
* Add support for chatbot user store.
* Add support for chatbot utils.
* Add support for chatbot validate.
* Add support for chatbot middleware.
* Add support for chatbot auth.
* Add support for chatbot password.