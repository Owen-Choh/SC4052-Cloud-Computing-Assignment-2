```markdown
# Setting up GitHub Actions for your Chatbot Project

This guide will walk you through setting up a GitHub Actions workflow to automatically build, test, and deploy your chatbot application.

## Prerequisites

*   A GitHub repository containing your chatbot project code.
*   A Docker Hub account (or another container registry) to store your built images.
*   An EC2 instance (or other server) to deploy your application to.
*   SSH access to your EC2 instance.
*   Docker and Docker Compose installed on your EC2 instance.

## Steps

### 1. Create a `.github/workflows` directory in your repository.

This directory will contain your workflow files.

### 2. Create a workflow file (e.g., `deploy.yml`) inside the `.github/workflows` directory.

Here's a sample workflow file based on the provided information:

```yaml
name: Deploy Application

on:
  workflow_dispatch:

jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    environment: ec2

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Add backend .env file
      run: echo "${{ secrets.BACKEND_ENV }}" > chatbot-backend/.env

    - name: Add frontend .env file
      run: echo "${{ secrets.FRONTEND_ENV }}" > chatbot-app/.env

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Build and push
      uses: docker/build-push-action@v6
      with:
        context: ./chatbot-app
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/projects:chatbot-app-latest
        cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/projects:chatbot-app-latest
        cache-to: type=inline

    - name: Build and push
      uses: docker/build-push-action@v6
      with:
        context: ./chatbot-backend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/projects:chatbot-backend-latest
        cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/projects:chatbot-backend-latest
        cache-to: type=inline

  deploy:
    needs: build-and-push-image
    runs-on: ubuntu-latest
    environment: ec2

    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy to server
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        SERVER_HOST: ${{ secrets.SERVER_HOST }}
        SERVER_USER: ${{ secrets.SERVER_USER }}
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
      run: |
        echo "$SSH_PRIVATE_KEY" > private_key
        chmod 600 private_key
        scp -i private_key -o StrictHostKeyChecking=no docker-compose.yaml $SERVER_USER@$SERVER_HOST:~/app/SC4052-Cloud-Computing-Project
        ssh -i private_key -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << EOF
          cd ~/app/SC4052-Cloud-Computing-Project
          echo -n $GEMINI_API_KEY > ./secrets/gemini_api_key.txt
          echo -n $JWT_SECRET > ./secrets/jwt_secret.txt
          docker-compose pull
          docker-compose up -d
        EOF
```

### 3. Configure Secrets in GitHub.

Go to your repository's settings, then "Security" and then "Secrets and variables" -> "Actions".  Add the following secrets:

*   `DOCKER_USERNAME`: Your Docker Hub username.
*   `DOCKER_PASSWORD`: Your Docker Hub password or access token.
*   `SSH_PRIVATE_KEY`: The private key for your EC2 instance.  **Important: Treat this with extreme care!**
*   `SERVER_HOST`: The public IP address or domain name of your EC2 instance.
*   `SERVER_USER`: The username used to SSH into your EC2 instance (e.g., `ubuntu`, `ec2-user`).
*   `BACKEND_ENV`: The contents of your `chatbot-backend/backend-env-example.txt` file.
*   `FRONTEND_ENV`: The contents of your `chatbot-app/frontend-env-example.txt` file.
*   `GEMINI_API_KEY`: Your Gemini API Key.
*   `JWT_SECRET`: Your JWT Secret.

### 4.  Create `secrets` directory and `.txt` files in your EC2 instance

Create a `secrets` directory in your EC2 instance in the path specified in the `docker-compose.yaml` file. In this case, it is `~/app/SC4052-Cloud-Computing-Project/secrets`. Then create two `.txt` files, `gemini_api_key.txt` and `jwt_secret.txt`. These files will be populated by the GitHub Actions workflow.

### 5.  Adjust paths in the workflow file (if necessary).

Ensure that the paths in the `scp` and `ssh` commands in the `deploy` job are correct for your project structure on the EC2 instance.

### 6. Commit and push the workflow file to your GitHub repository.

### 7. Manually trigger the workflow.

Since the workflow is triggered by `workflow_dispatch`, you need to manually trigger it from the GitHub Actions tab in your repository.

## Explanation of the Workflow

*   **`name: Deploy Application`**:  The name of your workflow.
*   **`on: workflow_dispatch`**:  This makes the workflow manually triggerable from the GitHub Actions UI.
*   **`jobs:`**: Defines the different jobs that will run in the workflow.
    *   **`build-and-push-image`**: This job builds and pushes the Docker images for your application.
        *   **`runs-on: ubuntu-latest`**: Specifies that the job will run on a clean Ubuntu virtual machine.
        *   **`environment: ec2`**: Specifies the environment for this job.
        *   **`steps:`**: Defines the steps that will be executed in this job.
            *   **`actions/checkout@v3`**: Checks out your repository code.
            *   **`Add backend .env file`**: Creates the `.env` file for the backend using the `BACKEND_ENV` secret.
            *   **`Add frontend .env file`**: Creates the `.env` file for the frontend using the `FRONTEND_ENV` secret.
            *   **`docker/login-action@v2`**: Logs in to Docker Hub using your credentials.
            *   **`docker/setup-buildx-action@v3`**: Sets up Docker Buildx for building multi-platform images.
            *   **`docker/build-push-action@v6`**: Builds and pushes the Docker image for the frontend.
            *   **`docker/build-push-action@v6`**: Builds and pushes the Docker image for the backend.
    *   **`deploy`**: This job deploys the application to your EC2 instance.
        *   **`needs: build-and-push-image`**: Specifies that this job depends on the `build-and-push-image` job and will only run after it completes successfully.
        *   **`runs-on: ubuntu-latest`**: Specifies that the job will run on a clean Ubuntu virtual machine.
        *   **`environment: ec2`**: Specifies the environment for this job.
        *   **`steps:`**: Defines the steps that will be executed in this job.
            *   **`actions/checkout@v3`**: Checks out your repository code.
            *   **`Deploy to server`**: Deploys the application to your EC2 instance using SSH.
                *   Sets environment variables for the SSH private key, server host, server user, Gemini API key, and JWT secret.
                *   Creates a `private_key` file with the SSH private key and sets the correct permissions.
                *   Copies the `docker-compose.yaml` file to the EC2 instance using `scp`.
                *   Executes a series of commands on the EC2 instance using `ssh`:
                    *   Navigates to the application directory.
                    *   Creates the `gemini_api_key.txt` and `jwt_secret.txt` files with the corresponding secrets.
                    *   Pulls the latest Docker images.
                    *   Starts or updates the application using `docker-compose up -d`.

## Important Considerations

*   **Security:**  Protect your SSH private key and other secrets!  Never commit them directly to your repository.  Use GitHub Actions secrets.
*   **Error Handling:**  Add more robust error handling to your workflow.  Check the output of commands and fail the workflow if necessary.
*   **Testing:**  Incorporate automated tests into your workflow to ensure that your application is working correctly before deploying.
*   **Rollbacks:**  Implement a rollback strategy in case a deployment fails.
*   **Zero-Downtime Deployments:**  Consider using techniques like blue/green deployments or rolling updates to minimize downtime during deployments.
*   **Environment Variables:**  Make sure all necessary environment variables are set correctly in your `.env` files or passed as secrets to the Docker containers.
*   **Docker Compose:** Ensure your `docker-compose.yaml` is correctly configured for your application and environment.
*   **Caching:**  Leverage Docker layer caching to speed up build times.
*   **SSH Key Security:**  Consider using SSH keys with passphrases for added security.  You'll need to handle the passphrase in your workflow.
*   **Alternative Deployment Strategies:**  Explore other deployment strategies like using a CI/CD tool specifically designed for Docker deployments (e.g., Jenkins, GitLab CI, CircleCI).

This walkthrough provides a basic framework for setting up GitHub Actions for your chatbot project.  You can customize it further to meet your specific needs and requirements.
```
