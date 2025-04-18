# SC4052-Cloud-Computing-Project Documentation

This document provides a comprehensive guide to the SC4052-Cloud-Computing-Project repository. It is divided into two sections: How-To Guides and Reference Guides. The How-To Guides provide step-by-step instructions for common tasks, while the Reference Guides offer detailed explanations of the project's components and their functionalities.

## How-To Guides

### 1. Setting up the Development Environment

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Owen-Choh/SC4052-Cloud-Computing-Project.git
    cd SC4052-Cloud-Computing-Project
    ```

2.  **Install Docker and Docker Compose:**
    *   Ensure Docker and Docker Compose are installed on your system. Refer to the official Docker documentation for installation instructions:
        *   [Docker Installation](https://docs.docker.com/get-docker/)
        *   [Docker Compose Installation](https://docs.docker.com/compose/install/)

3.  **Configure Environment Variables:**
    *   Create `.env` files in both the `chatbot-app` and `chatbot-backend` directories.
    *   Populate these files with the necessary environment variables. Example files (`frontend-env-example.txt` and `backend-env-example.txt`) are provided as templates.
    *   **Important:** Ensure you have a Gemini API key and a JWT secret. You can either set them as environment variables or store them in files specified by the `GEMINI_API_KEY` and `JWT_SECRET` environment variables.

4.  **Start the Application:**
    *   Navigate to the root directory of the project.
    *   Run the following command to start the application using Docker Compose:
        ```bash
        docker-compose up --build
        ```
        The `--build` flag ensures that the Docker images are built if they don't exist or if the Dockerfiles have been modified.

5.  **Access the Application:**
    *   Once the containers are running, access the application in your web browser using the address specified in your `Caddyfile` (e.g., `ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com`).

### 2. Building and Running the Backend Application Locally

1.  **Navigate to the `chatbot-backend` directory:**
    ```bash
    cd chatbot-backend
    ```

2.  **Build the application:**
    ```bash
    make build
    ```
    This command compiles the `main.go` file and creates an executable file in the `bin` directory.

3.  **Run the application:**
    ```bash
    make run
    ```
    This command executes the compiled binary. Ensure that the database file exists or is created before running the application.

### 3. Running Tests

1.  **Navigate to the `chatbot-backend` directory:**
    ```bash
    cd chatbot-backend
    ```

2.  **Run all tests:**
    ```bash
    make test
    ```
    This command executes all tests in the project.

3.  **Run tests with verbose output:**
    ```bash
    make testv
    ```
    This command executes all tests and displays detailed output for each test.

4.  **Run tests with failfast:**
        ```bash
    make testfast
    ```
    This command executes all tests and stops after the first failure.

### 4. Making Changes to the Frontend Application

1.  **Navigate to the `chatbot-app` directory:**
    ```bash
    cd chatbot-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command starts the Vite development server, which provides hot module replacement (HMR) for rapid development.

4.  **Make changes to the source code:**
    *   Modify the React components in the `src` directory.
    *   The changes will be automatically reflected in the browser.

### 5. Deploying the Application

1.  **Build and push the Docker images:**
    *   Use the GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically build and push the Docker images to Docker Hub.
    *   Alternatively, you can manually build and push the images using the `docker build` and `docker push` commands.

2.  **Deploy the application to the server:**
    *   The GitHub Actions workflow also includes steps to deploy the application to a remote server using SSH.
    *   Ensure that the necessary SSH keys and server details are configured as secrets in the GitHub repository.

## Reference Guides

### 1. Repository Structure

The repository is structured as follows:

```
SC4052-Cloud-Computing-Project/
├── README.md
├── Caddyfile
├── chatbot-app/
│   ├── Dockerfile
│   ├── frontend-env-example.txt
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── index.css
│   │   ├── markdown.css
│   │   ├── vite-env.d.ts
│   ├── nginx/
│   │   └── default.conf
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.app.json
│   └── tsconfig.node.json
├── chatbot-backend/
│   ├── main.go
│   ├── Makefile
│   ├── backend-env-example.txt
│   ├── chatbot/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── db/
│   │   ├── service/
│   │   ├── types/
│   ├── utils/
│   ├── .dockerignore
│   ├── go.mod
│   └── go.sum
├── docker-compose.yaml
└── .github/workflows/deploy.yml
```

*   **`README.md`**: Provides a brief overview of the project.
*   **`Caddyfile`**: Configuration file for the Caddy web server, used for reverse proxying and TLS.
*   **`chatbot-app/`**: Contains the React frontend application.
    *   `Dockerfile`: Defines the steps to build the Docker image for the frontend application.
    *   `frontend-env-example.txt`: Example environment variables for the frontend application.
    *   `vite.config.ts`: Configuration file for the Vite build tool.
    *   `eslint.config.js`: Configuration file for the ESLint linter.
    *   `index.html`: The main HTML file for the React application.
    *   `src/`: Contains the React components, styles, and other source code.
    *   `nginx/default.conf`: Nginx configuration file for serving the React application.
    *   `.dockerignore`: Specifies files and directories to exclude from the Docker image.
    *   `package.json`: Lists the dependencies and scripts for the frontend application.
    *   `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration files.
*   **`chatbot-backend/`**: Contains the Go backend application.
    *   `main.go`: The main entry point for the backend application.
    *   `Makefile`: Defines the build and test commands for the backend application.
    *   `backend-env-example.txt`: Example environment variables for the backend application.
    *   `chatbot/`: Contains the core logic for the chatbot application.
        *   `auth/`: Contains the authentication logic.
        *   `config/`: Contains the configuration settings.
        *   `db/`: Contains the database initialization and connection logic.
        *   `service/`: Contains the business logic and API handlers.
        *   `types/`: Contains the data structures and interfaces.
    *   `utils/`: Contains utility functions and middleware.
    *   `.dockerignore`: Specifies files and directories to exclude from the Docker image.
    *   `go.mod`, `go.sum`: Go module dependency management files.
*   **`docker-compose.yaml`**: Defines the services, networks, and volumes for the Docker Compose deployment.
*   **`.github/workflows/deploy.yml`**: Defines the GitHub Actions workflow for building, testing, and deploying the application.

### 2. Caddyfile

The `Caddyfile` configures the Caddy web server to act as a reverse proxy.

```Caddyfile
ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com {  # Use "localhost" or configure a local domain in /etc/hosts
    tls internal
      
    reverse_proxy /api* http://chatbot-backend:8080  # Proxy API requests
    reverse_proxy /* http://chatbot-frontend:80     # Serve React frontend
    header {
        Access-Control-Allow-Credentials true
    }
}
```

*   **`ec2-54-179-162-106.ap-southeast-1.compute.amazonaws.com`**: Specifies the domain or address that Caddy will serve.  This should be replaced with your actual domain or `localhost` for local testing.
*   **`tls internal`**: Configures Caddy to use an internally generated TLS certificate for HTTPS.
*   **`reverse_proxy /api* http://chatbot-backend:8080`**: Proxies all requests to paths starting with `/api` to the `chatbot-backend` service on port 8080.
*   **`reverse_proxy /* http://chatbot-frontend:80`**: Proxies all other requests to the `chatbot-frontend` service on port 80.
*   **`header { Access-Control-Allow-Credentials true }`**: Sets the `Access-Control-Allow-Credentials` header to `true`, allowing the frontend to send cookies to the backend.

**Note:**  The domain name should be configured correctly to match your server's address.  For local development, you may need to modify your `/etc/hosts` file to map a domain name to `127.0.0.1`.

### 3. chatbot-app/Dockerfile

The `chatbot-app/Dockerfile` defines the steps to build the Docker image for the React frontend application.

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the React app with Nginx (or Caddy can serve directly too, see Caddyfile later)
FROM nginx:alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

*   **Stage 1 (builder):**
    *   Uses the `node:20-alpine` image as the base image.
    *   Sets the working directory to `/app`.
    *   Copies the `package*.json` files to the working directory.
    *   Installs the dependencies using `npm install`.
    *   Copies the entire source code to the working directory.
    *   Builds the React application using `npm run build`.
*   **Stage 2:**
    *   Uses the `nginx:alpine` image as the base image.
    *   Copies the Nginx configuration file (`nginx/default.conf`) to the Nginx configuration directory.
    *   Copies the built React application from the `builder` stage to the Nginx web server directory.
    *   Exposes port 80.
    *   Starts the Nginx web server.

### 4. chatbot-backend/main.go

The `chatbot-backend/main.go` file is the main entry point for the Go backend application.

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/config"
	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/service/chatbotservice"
	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/service/conversation"
	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/service/user"
	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils/middleware"
	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/utils/validate"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	dbConnection, dberr := validate.CheckAndInitDB()
	if dberr != nil {
		return
	}

	mainRouter := http.NewServeMux()
	mainStack := middleware.CreateStack(
		middleware.Logging,
		middleware.CORS,
	)
	mainRouter.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// write to the response which returns to client
		fmt.Fprintf(w, "Hello world!")
	})

	userSubRouter := http.NewServeMux()
	userStore := user.NewStore(dbConnection)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(userSubRouter)

	mainRouter.Handle("/api/user/", http.StripPrefix("/api/user", mainStack(userSubRouter)))

	chatbotSubRouter := http.NewServeMux()
	chatbotStore := chatbotservice.NewStore(dbConnection)
	chatbotHandler := chatbotservice.NewHandler(chatbotStore, userStore)
	chatbotHandler.RegisterRoutes(chatbotSubRouter)

	mainRouter.Handle("/api/chatbot/", http.StripPrefix("/api/chatbot", mainStack(chatbotSubRouter)))

	apiKey := config.Envs.GEMINI_API_KEY
	if apiKey != "" {
		conversationSubRouter := http.NewServeMux()
		conversationStore := conversation.NewConversationStore(dbConnection)
		apiFileStore := conversation.NewAPIFileStore(dbConnection)
		conversationHandler, err := conversation.NewHandler(chatbotStore, conversationStore, apiFileStore, apiKey)
		if err != nil {
			log.Fatalf("Error when starting conversation service, %v", err)
		} else {
			conversationHandler.RegisterRoutes(conversationSubRouter)
			mainRouter.Handle("/api/conversation/", http.StripPrefix("/api/conversation", mainStack(conversationSubRouter)))
		}
	} else {
		log.Fatal("Gemini API key not set, not starting conversation service")
	}

	// set server and start
	server := http.Server{
		Addr:    ":" + config.Envs.Port,
		Handler: mainRouter,
	}
	log.Printf("Starting server on :%s...\n", config.Envs.Port)
	err := server.ListenAndServe()
	if err != nil {
		log.Printf("Error starting server: %s\n", err)
	}
}
```

*   **Database Initialization:**
    *   `validate.CheckAndInitDB()`: Initializes the database connection and creates the necessary tables if they don't exist.
*   **Routing:**
    *   `http.NewServeMux()`: Creates a new HTTP multiplexer to handle incoming requests.
    *   `middleware.CreateStack()`: Creates a middleware stack for logging and CORS.
    *   Subrouters are created for `/api/user/`, `/api/chatbot/`, and `/api/conversation/` endpoints.
*   **Handlers:**
    *   `user.NewHandler()`: Creates a new handler for user-related API endpoints.
    *   `chatbotservice.NewHandler()`: Creates a new handler for chatbot-related API endpoints.
    *   `conversation.NewHandler()`: Creates a new handler for conversation-related API endpoints.
*   **Server Startup:**
    *   `server.ListenAndServe()`: Starts the HTTP server and listens for incoming requests on the port specified in the configuration.

**Note:** The backend application uses SQLite as the database. The database file is stored in the `database_files` directory. The application also uses JWT for authentication. The JWT secret is stored in the `JWT_SECRET` environment variable.

### 5. docker-compose.yaml

The `docker-compose.yaml` file defines the services, networks, and volumes for the Docker Compose deployment.

```yaml
version: "3.9"
services:
  chatbot-backend:
    image: owenchoh/projects:chatbot-backend-latest
    build: 
      context: ./chatbot-backend
    secrets:
      - gemini_api_key
      - jwt_secret
    environment:
      GEMINI_API_KEY: /run/secrets/gemini_api_key
      JWT_SECRET: /run/secrets/jwt_secret
    volumes:
      - backend-data:/app/database_files
      - backend-uploads:/app/database_files/uploads
    networks:
      - caddy_network

  chatbot-frontend:
    image: owenchoh/projects:chatbot-app-latest
    build: 
      context: ./chatbot-app
    depends_on:
      - chatbot-backend
    networks:
      - caddy_network

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - chatbot-frontend
      - chatbot-backend
    networks:
     - caddy_network

networks:
  caddy_network:
    driver: bridge  # Changed from overlay to bridge

secrets:
  gemini_api_key:
    file: ./secrets/gemini_api_key.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

volumes:
  backend-data:
  backend-uploads:
  caddy_data:
  caddy_config:
```

*   **Services:**
    *   `chatbot-backend`: Defines the Go backend application service.
        *   `image`: Specifies the Docker image to use.
        *   `build`: Specifies the build context and Dockerfile.
        *   `secrets`: Specifies the secrets to mount into the container.
        *   `environment`: Sets the environment variables for the container.
        *   `volumes`: Mounts the `backend-data` and `backend-uploads` volumes to persist the database and uploaded files.
        *   `networks`: Connects the container to the `caddy_network` network.
    *   `chatbot-frontend`: Defines the React frontend application service.
        *   `image`: Specifies the Docker image to use.
        *   `build`: Specifies the build context and Dockerfile.
        *   `depends_on`: Specifies that this service depends on the `chatbot-backend` service.
        *   `networks`: Connects the container to the `caddy_network` network.
    *   `caddy`: Defines the Caddy web server service.
        *   `image`: Specifies the Caddy Docker image to use.
        *   `ports`: Exposes ports 80 and 443 for HTTP and HTTPS traffic.
        *   `volumes`: Mounts the `Caddyfile`, `caddy_data`, and `caddy_config` volumes.
        *   `depends_on`: Specifies that this service depends on the `chatbot-frontend` and `chatbot-backend` services.
        *   `networks`: Connects the container to the `caddy_network` network.
*   **Networks:**
    *   `caddy_network`: Defines a bridge network for the services to communicate with each other.
*   **Secrets:**
    *   `gemini_api_key`: Specifies the file containing the Gemini API key.
    *   `jwt_secret`: Specifies the file containing the JWT secret.
*   **Volumes:**
    *   `backend-data`: Defines a volume for persisting the backend database.
    *   `backend-uploads`: Defines a volume for persisting the uploaded files.
    *   `caddy_data`: Defines a volume for persisting Caddy data.
    *   `caddy_config`: Defines a volume for persisting Caddy configuration.

### 6. chatbot-app/src/App.tsx

The `chatbot-app/src/App.tsx` file is the main component for the React frontend application.

```tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/useAuth";
import Dashboard from "./pages/Dashboard";
import ConversationPage from "./pages/ConversationPage";
import { ChatbotProvider } from "./context/ChatbotContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/chat/:username/:chatbotname"
            element={<ConversationPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/Dashboard"
              element={
                <ChatbotProvider>
                  <Dashboard />
                </ChatbotProvider>
              }
            />
          </Route>

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

*   **Routing:**
    *   Uses `react-router-dom` to define the application's routes.
    *   `/`: Redirects to the `/login` page.
    *   `/login`: Renders the `LoginPage` component.
    *   `/chat/:username/:chatbotname`: Renders the `ConversationPage` component for chatting with a specific chatbot.
    *   `/Dashboard`: Renders the `Dashboard` component, which is protected by the `ProtectedRoute` component.
    *   `*`: Redirects to the `/login` page for unknown paths.
*   **Authentication:**
    *   Uses the `AuthProvider` component to manage user authentication state.
    *   Uses the `ProtectedRoute` component to protect the `/Dashboard` route, ensuring that only authenticated users can access it.
*   **Context:**
    *   Uses the `ChatbotProvider` component to provide chatbot-related data to the `Dashboard` component.

### 7. chatbot-backend/chatbot/db/db.go

The `chatbot-backend/chatbot/db/db.go` file contains the database initialization and connection logic.

```go
package db

import (
	"database/sql"
	"errors"
	"log"

	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/config"
	_ "github.com/mattn/go-sqlite3"
)

func GetDBConnection() (*sql.DB, error) {
	return sql.Open("sqlite3", config.Envs.DATABASE_PATH)
}

func InitDB() (bool, error) {
	// Open a connection to the database
	db, err := GetDBConnection()
	if err != nil {
		log.Println(err)
		return false, err
	}
	defer db.Close()

	if checktablesexist(db) {
		return true, errors.New("all tables already exist")
	}

	// Create tables
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS users (
		userid INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		createddate TEXT NOT NULL,
		lastlogin TEXT NOT NULL
	);`)
	if err != nil {
		log.Printf("Error initalising users table: %s\n", err)
		return false, err
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS chatbots (
		chatbotid INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL,
		chatbotname TEXT NOT NULL,
		description TEXT NOT NULL Default '',
		behaviour TEXT NOT NULL,
		usercontext TEXT NOT NULL,
		createddate TEXT NOT NULL,
		updateddate TEXT NOT NULL,
		lastused TEXT NOT NULL,
		isShared BOOLEAN NOT NULL DEFAULT FALSE,
		filepath TEXT NOT NULL DEFAULT '',
		fileUpdatedDate TEXT NOT NULL DEFAULT '',
		FOREIGN KEY(username) REFERENCES users(username),
		UNIQUE(username, chatbotname)
	);`)
	if err != nil {
		log.Printf("Error initalising chatbots table: %s\n", err)
		return false, err
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS conversations (
		chatid INTEGER PRIMARY KEY AUTOINCREMENT,
		conversationid TEXT NOT NULL,
		chatbotid INTEGER NOT NULL,
		username TEXT NOT NULL,
		chatbotname TEXT NOT NULL,
		role TEXT NOT NULL,
		chat TEXT NOT NULL,
		createddate TEXT NOT NULL,
		FOREIGN KEY(chatbotid) REFERENCES chatbots(chatbotid),
		FOREIGN KEY(username) REFERENCES users(username),
		FOREIGN KEY(chatbotname) REFERENCES chatbots(chatbotname)
	);`)
	if err != nil {
		log.Printf("Error initalising conversations table: %s\n", err)
		return false, err
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS apifiles (
		fileid INTEGER PRIMARY KEY AUTOINCREMENT,
		chatbotid INTEGER NOT NULL,
		createddate TEXT NOT NULL,
		filepath TEXT NOT NULL,
		fileuri TEXT NOT NULL,
		FOREIGN KEY(chatbotid) REFERENCES chatbots(chatbotid)
	);`)
	if err != nil {
		log.Printf("Error initalising conversations table: %s\n", err)
		return false, err
	}

	return true, err
}

func checktablesexist(db *sql.DB) bool {
	var answer bool = true

	rows, err := db.Query("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'chatbots', 'conversations', 'apifiles');")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	// Read results into a map
	tableExists := map[string]bool{
		"users":         false,
		"chatbots":      false,
		"conversations": false,
		"apifiles":      false,
	}

	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			log.Fatal(err)
		}
		tableExists[tableName] = true
	}

	// Print results
	for table, exists := range tableExists {
		if !exists {
			log.Printf("Table '%s' does not exist.\n", table)
			answer = false
		}
	}

	return answer
}
```

*   **`GetDBConnection()`**: Establishes a connection to the SQLite database using the path specified in the configuration.
*   **`InitDB()`**: Initializes the database by creating the necessary tables if they don't exist.
    *   `users`: Stores user information (userid, username, password, createddate, lastlogin).
    *   `chatbots`: Stores chatbot information (chatbotid, username, chatbotname, description, behaviour, usercontext, createddate, updateddate, lastused, isShared, filepath, fileUpdatedDate).
    *   `conversations`: Stores conversation history (chatid, conversationid, chatbotid, username, chatbotname, role, chat, createddate).
    *   `apifiles`: Stores API file information (fileid, chatbotid, createddate, filepath, fileuri).
*   **`checktablesexist()`**: Checks if the tables already exist in the database.

### 8. chatbot-backend/chatbot/config/env.go

The `chatbot-backend/chatbot/config/env.go` file handles the configuration settings for the backend application.

```go
package config

import (
	"log"
	"os"
	"strconv"

	"github.com/lpernett/godotenv"
)

type Config struct {
	FrontendDomain           string
	Port                     string
	DATABASE_PATH            string
	FILES_PATH               string
	Default_Time             string
	Time_layout              string
	Timezone                 string
	JWTExpirationInSeconds   int64
	JWTSecret                string
	API_FILE_EXPIRATION_HOUR int64
	GEMINI_API_KEY           string
	MODEL_NAME               string
}

var Envs = initConfig()

func initConfig() Config {
	godotenv.Load()

	return Config{
		FrontendDomain:           getEnv("FrontendDomain", "http://localhost:5173"),
		Port:                     getEnv("BACKEND_PORT", "8080"),
		DATABASE_PATH:            getEnv("DATABASE_PATH", "./database_files/chatbot.db"),
		FILES_PATH:               getEnv("FILES_PATH", "database_files/uploads/"),
		Default_Time:             getEnv("Default_Time", "20 Mar 25 15:32 +0800"),
		Time_layout:              getEnv("Time_layout", "02 Jan 06 15:04 -0700"),
		Timezone:                 getEnv("Timezone", "Asia/Singapore"),
		JWTExpirationInSeconds:   getEnvInt("JWT_EXP_SECONDS", 3600*24*1),
		API_FILE_EXPIRATION_HOUR: getEnvInt("API_FILE_EXPIRATION_HOUR", 47),
		MODEL_NAME:               getEnv("MODEL_NAME", "gemini-2.0-flash-thinking-exp-01-21"),
		JWTSecret:                getEnvSecretFileorOS("JWT_SECRET", "should-have-jwt-secret-here"),
		GEMINI_API_KEY:           getEnvSecretFileorOS("GEMINI_API_KEY", ""),
	}
}

func getEnvSecretFileorOS(envKey string, fallback string) string {
	value := getEnvSecretFile(envKey, fallback)
	if value == "" {
		value = getOSEnv(envKey, fallback)
	} 
	return value
}

func getOSEnv(key string, fallback string) string {
	value := os.Getenv(key) // Get API key from environment variable
	if value == "" {
		log.Printf("OS Environment variable %s not set, using fallback value: %s", key, fallback)
		return fallback
	}

	return value
}

func getEnvSecretFile(envKey string, fallback string) string {
	secretPath := getOSEnv(envKey, "")
	if secretPath == "" {
		return fallback
	}

	apiKey, err := os.ReadFile(secretPath)
	if err != nil {
		log.Printf("Failed to read API key secret: %v", err)
		return fallback
	}

	return string(apiKey)
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	log.Printf("Environment variable %s not set, using fallback value: %s", key, fallback)
	return fallback
}

func getEnvInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		intValue, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			log.Printf("Environment variable %s not set, using fallback value: %d", key, fallback)
			return fallback
		}

		return intValue
	}

	log.Printf("Environment variable %s not set, using fallback value: %d", key, fallback)
	return fallback
}
```

*   **Configuration Loading:**
    *   `godotenv.Load()`: Loads environment variables from a `.env` file.
    *   `getEnv()`: Retrieves an environment variable by key, using a fallback value if the variable is not set.
    *   `getEnvInt()`: Retrieves an environment variable as an integer.
*   **Configuration Structure:**
    *   The `Config` struct defines the structure of the application's configuration.
    *   `Envs`: A global variable of type `Config` that stores the loaded configuration.

### 9. chatbot-backend/utils/middleware/cors.go

The `chatbot-backend/utils/middleware/cors.go` file implements the CORS middleware.

```go
package middleware

import (
	"net/http"

	"github.com/Owen-Choh/SC4052-Cloud-Computing-Assignment-2/chatbot-backend/chatbot/config"
)

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.Envs.FrontendDomain)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
```

*   **CORS Middleware:**
    *   The `CORS` function is a middleware that sets the necessary CORS headers for each request.
    *   `Access-Control-Allow-Origin`: Specifies the origin that is allowed to access the resources.
    *   `Access-Control-Allow-Credentials`: Specifies whether the browser should send credentials (cookies) with the request.
    *   `Access-Control-Allow-Headers`: Specifies the allowed request headers.
    *   `Access-Control-Allow-Methods`: Specifies the allowed HTTP methods.
    *   The middleware handles `OPTIONS` requests by returning a 200 OK status code.

### 10. chatbot-backend/chatbot/auth/jwt.go

The `chatbot-backend/chatbot/auth/jwt.go` file implements the JWT authentication