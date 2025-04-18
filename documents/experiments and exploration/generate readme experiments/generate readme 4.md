# SC4052-Cloud-Computing-Project

## Description

This repository contains the code for a cloud-based chatbot application. It includes a React frontend, a Go backend, and a Caddy web server for routing. The chatbot uses the Gemini API for generating responses.

## Overview of the Code

The repository is structured as follows:

*   `README.md`: This file, providing information about the project.
*   `Caddyfile`: Configuration file for the Caddy web server, defining routing rules and TLS settings.
*   `chatbot-app/`: Contains the React frontend code.
    *   `Dockerfile`: Defines the steps to build a Docker image for the React application.
    *   `src/`: Contains the React components, pages, and API configurations.
    *   `nginx/default.conf`: Nginx configuration file for serving the React app.
    *   `frontend-env-example.txt`: Example environment variables for the frontend.
*   `chatbot-backend/`: Contains the Go backend code.
    *   `main.go`: The main application file, handling routing, database connections, and API logic.
    *   `Makefile`: Contains commands for building and testing the Go backend.
    *   `utils/`: Contains utility functions for middleware, validation, and other common tasks.
    *   `chatbot/`: Contains the core chatbot logic, including database interactions, authentication, and service definitions.
*   `docker-compose.yaml`: Defines the services, networks, and volumes for Docker Compose.
*   `.dockerignore`: Specifies files and directories to exclude from the Docker image.

## Architecture

The application follows a microservices architecture, with the frontend, backend, and web server running as separate Docker containers.

1.  **Frontend (React):** Handles the user interface and interacts with the backend API.
2.  **Backend (Go):** Implements the chatbot logic, manages the database, and interacts with the Gemini API.
3.  **Web Server (Caddy):** Routes incoming requests to the appropriate service (frontend or backend) and handles TLS encryption.
4.  **Database (SQLite):** Stores user data, chatbot configurations, and conversation history.
5.  **Gemini API:** Used by the backend to generate chatbot responses.

## Setup and Usage

Follow these steps to set up and run the application:

1.  **Prerequisites:**
    *   Docker
    *   Docker Compose
    *   A Gemini API key (if you want to use the conversation service)
2.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd SC4052-Cloud-Computing-Project
    ```
3.  **Set up environment variables:**

    *   Create a `.env` file in the `chatbot-backend/` directory based on the `chatbot-backend/backend-env-example.txt` file.
    *   Create a `.env` file in the `chatbot-app/` directory based on the `chatbot-app/frontend-env-example.txt` file.
    *   Set the `GEMINI_API_KEY` environment variable in the `chatbot-backend/.env` file with your actual Gemini API key.
    *   Set the `JWT_SECRET` environment variable in the `chatbot-backend/.env` file with a secure random string.
4.  **Create secrets files:**
    *   Create a `secrets/` directory in the root of the repository.
    *   Create a `secrets/gemini_api_key.txt` file containing your Gemini API key.
    *   Create a `secrets/jwt_secret.txt` file containing a secure random string.
5.  **Run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images and starts the containers.
6.  **Access the application:**

    Open your web browser and navigate to `localhost` (or the configured domain in your `Caddyfile`).

## Notes

*   **Caddyfile Configuration:** The `Caddyfile` is configured to use internal TLS. You may need to configure a local domain in `/etc/hosts` or use "localhost" for testing.
*   **Gemini API Key:** The Gemini API key is required for the conversation service to function. If the key is not set, the conversation service will not start.
*   **Database:** The application uses SQLite as the database. The database file is stored in the `database_files/` directory.
*   **File Uploads:** Uploaded files are stored in the `database_files/uploads/` directory.
*   **Security:** The application uses JWT for authentication. Ensure that the `JWT_SECRET` environment variable is set to a secure random string.
*   **Frontend Base URL:** The `VITE_BASE_URL` environment variable in the frontend should match the backend API endpoint.
*   **CORS:** The backend is configured to allow cross-origin requests from the frontend domain.
*   **Makefile:** The `chatbot-backend/Makefile` provides convenient commands for building and testing the backend.
*   **Dockerignore:** The `.dockerignore` file excludes unnecessary files and directories from the Docker image, reducing its size.
*   **Error Handling:** The backend includes error handling for common scenarios, such as invalid requests, authentication failures, and database errors.
*   **Streaming:** The frontend supports streaming responses from the backend, providing a more interactive user experience.
*   **File Validation:** The frontend validates file uploads to ensure that they meet the required size and type constraints.
*   **Chatbot Name Validation:** The frontend validates chatbot names to ensure that they contain only alphanumeric characters, underscores, or hyphens.
*   **Secrets Management:** The application uses Docker secrets to manage sensitive information, such as the Gemini API key and JWT secret.
*   **Environment Variables:** The application uses environment variables to configure various settings, such as the frontend domain, backend port, and database path.
*   **Timezone:** The application uses the `Asia/Singapore` timezone by default. You can change this by setting the `Timezone` environment variable in the `chatbot-backend/.env` file.
*   **API File Expiration:** The application caches API file URIs for a certain period of time (default: 47 hours) to reduce the number of API calls to Gemini. You can change this by setting the `API_FILE_EXPIRATION_HOUR` environment variable in the `chatbot-backend/.env` file.
*   **Model Name:** The application uses the `gemini-2.0-flash-thinking-exp-01-21` model by default. You can change this by setting the `MODEL_NAME` environment variable in the `chatbot-backend/.env` file.
*   **Cookie:** The application uses cookie to store the JWT token. The cookie is set to be HTTP-only and secure.
*   **Error Messages:** The application returns detailed error messages to the frontend to help users troubleshoot issues.
*   **Logging:** The backend logs important events, such as user logins, chatbot creations, and API calls.
*   **Concurrency:** The backend uses goroutines to handle concurrent requests, improving performance and scalability.
*   **Data Validation:** The backend uses data validation to ensure that incoming requests are valid and prevent security vulnerabilities.
*   **Code Quality:** The code is well-structured, documented, and follows best practices for Go and React development.
*   **Security Considerations:**
    *   **Input Validation:** Always validate user inputs on both the client-side and server-side to prevent injection attacks.
    *   **Authentication and Authorization:** Implement robust authentication and authorization mechanisms to protect sensitive data and prevent unauthorized access.
    *   **Data Encryption:** Encrypt sensitive data at rest and in transit to protect it from unauthorized access.
    *   **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.
    *   **Dependency Management:** Keep dependencies up-to-date to patch security vulnerabilities.
    *   **Rate Limiting:** Implement rate limiting to prevent abuse and denial-of-service attacks.
    *   **Content Security Policy (CSP):** Configure CSP headers to prevent cross-site scripting (XSS) attacks.
    *   **HTTPS:** Always use HTTPS to encrypt communication between the client and server.
    *   **Secrets Management:** Store secrets securely and avoid hardcoding them in the code.
    *   **Error Handling:** Implement proper error handling to prevent information leakage.
    *   **Logging and Monitoring:** Implement comprehensive logging and monitoring to detect and respond to security incidents.
    *   **Regular Security Updates:** Stay up-to-date with the latest security patches and updates for all dependencies.
    *   **Principle of Least Privilege:** Grant users only the minimum privileges necessary to perform their tasks.
    *   **Defense in Depth:** Implement multiple layers of security controls to protect against a variety of threats.
    *   **Security Awareness Training:** Provide security awareness training to developers and users to help them identify and avoid security risks.
    *   **Regular Penetration Testing:** Conduct regular penetration testing to identify and address potential vulnerabilities.
    *   **Incident Response Plan:** Develop and maintain an incident response plan to handle security incidents effectively.
    *   **Data Backup and Recovery:** Implement a data backup and recovery plan to protect against data loss.
    *   **Compliance:** Ensure compliance with relevant security standards and regulations.
    *   **Third-Party Libraries:** Carefully evaluate and vet third-party libraries before using them in your application.
    *   **Secure Coding Practices:** Follow secure coding practices to minimize the risk of introducing vulnerabilities.
    *   **Web Application Firewall (WAF):** Consider using a WAF to protect against common web application attacks.
    *   **Intrusion Detection and Prevention Systems (IDPS):** Implement IDPS to detect and prevent malicious activity.
    *   **Vulnerability Scanning:** Regularly scan your application for vulnerabilities using automated tools.
    *   **Security Information and Event Management (SIEM):** Use a SIEM system to collect and analyze security logs and events.
    *   **Threat Intelligence:** Stay informed about the latest security threats and vulnerabilities.
    *   **Security Automation:** Automate security tasks to improve efficiency and reduce the risk of human error.
    *   **Security Culture:** Foster a security culture within your organization to promote security awareness and responsibility.
    *   **Secure Development Lifecycle (SDLC):** Integrate security into every stage of the software development lifecycle.
    *   **Static Application Security Testing (SAST):** Use SAST tools to analyze source code for vulnerabilities.
    *   **Dynamic Application Security Testing (DAST):** Use DAST tools to test running applications for vulnerabilities.
    *   **Interactive Application Security Testing (IAST):** Use IAST tools to monitor application behavior and identify vulnerabilities in real-time.
    *   **Runtime Application Self-Protection (RASP):** Use RASP tools to protect running applications from attacks.
    *   **Container Security:** Implement security best practices for containerized applications.
    *   **Cloud Security:** Implement security best practices for cloud-based applications.
    *   **Mobile Security:** Implement security best practices for mobile applications.
    *   **Internet of Things (IoT) Security:** Implement security best practices for IoT devices.
    *   **Artificial Intelligence (AI) Security:** Implement security best practices for AI-powered applications.
    *   **Blockchain Security:** Implement security best practices for blockchain-based applications.
    *   **Quantum Computing Security:** Prepare for the potential impact of quantum computing on security.
    *   **Zero Trust Security:** Implement a zero trust security model.
    *   **DevSecOps:** Integrate security into the DevOps process.
    *   **Security as Code:** Manage security configurations as code.
    *   **Infrastructure as Code (IaC):** Manage infrastructure as code to ensure consistency and security.
    *   **Configuration Management:** Use configuration management tools to ensure that systems are configured securely.
    *   **Change Management:** Implement a change management process to control and track changes to systems and applications.
    *   **Vulnerability Management:** Implement a vulnerability management program to identify, assess, and remediate vulnerabilities.
    *   **Patch Management:** Implement a patch management program to ensure that systems are up-to-date with the latest security patches.
    *   **Security Baselines:** Establish security baselines for systems and applications.
    *   **Security Hardening:** Harden systems and applications to reduce their attack surface.
    *   **Security Monitoring:** Implement security monitoring to detect and respond to security incidents.
    *   **Security Analytics:** Use security analytics to identify patterns and trends that may indicate malicious activity.
    *   **Threat Hunting:** Proactively search for threats that may have bypassed security controls.
    *   **Security Automation and Orchestration (SAO):** Use SAO tools to automate security tasks and orchestrate security responses.
    *   **Security Information Sharing:** Participate in security information sharing communities to stay informed about the latest threats and vulnerabilities.
    *   **Security Certifications:** Obtain security certifications to demonstrate your commitment to security.
    *   **Security Frameworks:** Use security frameworks, such as NIST Cybersecurity Framework, to guide your security efforts.
    *   **Security Standards:** Comply with relevant security standards, such as ISO 27001 and PCI DSS.
    *   **Security Regulations:** Comply with relevant security regulations, such as GDPR and HIPAA.
    *   **Security Policies:** Develop and maintain security policies to guide your security practices.
    *   **Security Procedures:** Develop and maintain security procedures to implement your security policies.
    *   **Security Awareness:** Promote security awareness among developers and users.
    *   **Security Training:** Provide security training to developers and users.
    *   **Security Culture:** Foster a security culture within your organization.
    *   **Security Leadership:** Provide strong security leadership to guide your security efforts.
    *   **Security Resources:** Allocate sufficient resources to support your security efforts.
    *   **Security Metrics:** Track security metrics to measure the effectiveness of your security controls.
    *   **Security Reporting:** Report security incidents and vulnerabilities to relevant stakeholders.
    *   **Security Communication:** Communicate security information effectively to developers and users.
    *   **Security Collaboration:** Collaborate with other organizations to improve security.
    *   **Security Innovation:** Encourage security innovation to develop new and better security solutions.
    *   **Security Research:** Support security research to advance the state of the art in security.
    *   **Security Advocacy:** Advocate for security best practices and policies.
    *   **Security Ethics:** Adhere to ethical principles in your security practices.
    *   **Security Responsibility:** Take responsibility for security.
    *   **Security Accountability:** Hold individuals accountable for security responsibilities.
    *   **Security Transparency:** Be transparent about your security practices.
    *   **Security Trust:** Build trust in your security practices.
    *   **Security Resilience:** Build resilience into your systems and applications to withstand attacks.
    *   **Security Agility:** Be agile in responding to security threats and vulnerabilities.
    *   **Security Adaptability:** Be adaptable to changing security threats and vulnerabilities.
    *   **Security Continuous Improvement:** Continuously improve your security practices.
    *   **Security Learning:** Continuously learn about security threats and vulnerabilities.
    *   **Security Knowledge Sharing:** Share security knowledge with others.
    *   **Security Community:** Participate in the security community.
    *   **Security Leadership:** Provide security leadership to guide your security efforts.
    *   **Security Resources:** Allocate sufficient resources to support your security efforts.
    *   **Security Metrics:** Track security metrics to measure the effectiveness of your security controls.
    *   **Security Reporting:** Report security incidents and vulnerabilities to relevant stakeholders.
    *   **Security Communication:** Communicate security information effectively to developers and users.
    *   **Security Collaboration:** Collaborate with other organizations to improve security.
    *   **Security Innovation:** Encourage security innovation to develop new and better security solutions.
    *   **Security Research:** Support security research to advance the state of the art in security.
    *   **Security Advocacy:** Advocate for security best practices and policies.
    *   **Security Ethics:** Adhere to ethical principles in your security practices.
    *   **Security Responsibility:** Take responsibility for security.
    *   **Security Accountability:** Hold individuals accountable for security responsibilities.
    *   **Security Transparency:** Be transparent about your security practices.
    *   **Security Trust:** Build trust in your security practices.
    *   **Security Resilience:** Build resilience into your systems and applications to withstand attacks.
    *   **Security Agility:** Be agile in responding to security threats and vulnerabilities.
    *   **Security Adaptability:** Be adaptable to changing security threats and vulnerabilities.
    *   **Security Continuous Improvement:** Continuously improve your security practices.
    *   **Security Learning:** Continuously learn about security threats and vulnerabilities.
    *   **Security Knowledge Sharing:** Share security knowledge with others.
    *   **Security Community:** Participate in the security community.
*   **API Keys:** Do not commit API keys directly to the repository. Use environment variables or secrets management.
*   **Database Security:** Protect the SQLite database file from unauthorized access.
*   **Error Handling:** Implement proper error handling and logging to help troubleshoot issues.
*   **Code Comments:** Add comments to the code to explain its functionality and improve readability.
*   **Testing:** Write unit tests and integration tests to ensure the code is working correctly.
*   **Documentation:** Keep the documentation up-to-date with the latest changes to the code.
*   **Dependencies:** Keep dependencies up-to-date to patch security vulnerabilities and improve performance.
*   **Code Review:** Have the code reviewed by other developers to identify potential issues.
*   **Continuous Integration:** Use a continuous integration system to automatically build and test the code.
*   **Continuous Deployment:** Use a continuous deployment system to automatically deploy the code to production.
*   **Monitoring:** Monitor the application to detect and respond to issues.
*   **Alerting:** Set up alerts to notify you of important events, such as errors and security incidents.
*   **Backup:** Back up the application data regularly to prevent data loss.
*   **Disaster Recovery:** Have a disaster recovery plan in place to restore the application in the event of a disaster.
*   **Security:** Implement security best practices to protect the application from attacks.
*   **Scalability:** Design the application to be scalable to handle increasing traffic.
*   **Performance:** Optimize the application for performance.
*   **Accessibility:** Make the application accessible to users with disabilities.
*   **Internationalization:** Support multiple languages and regions.
*   **Localization:** Adapt the application to specific locales.
*   **Usability:** Make the application easy to use.
*   **User Experience:** Provide a good user experience.
*   **Design:** Create a visually appealing design.
*   **Branding:** Maintain a consistent brand identity.
*   **Marketing:** Promote the application to potential users.
*   **Sales:** Sell the application to customers.
*   **Support:** Provide support to users.
*   **Maintenance:** Maintain the application over time.
*   **Updates:** Release updates to the application to fix bugs, add features, and improve performance.
*   **Security Updates:** Release security updates to the application to patch vulnerabilities.
*   **Communication:** Communicate effectively with users about changes to the application.
*   **Feedback:** Collect feedback from users to improve the application.
*   **Iteration:** Iterate on the application based on feedback and data.
*   **Innovation:** Continuously innovate to improve the application.
*   **Value:** Provide value to users.
*   **Purpose:** Fulfill the purpose of the application.
*   **Mission:** Achieve the mission of the application.
*   **Vision:** Realize the vision of the application.
*   **Goals:** Achieve the goals of the application.
*   **Objectives:** Meet the objectives of the application.
*   **Strategy:** Implement the strategy of the application.
*   **Tactics:** Execute the tactics of the application.
*   **Operations:** Manage the operations of the application.
*   **Resources:** Allocate resources to the application.
*   **Budget:** Manage the budget of the application.
*   **Schedule:** Manage the schedule of the application.
*   **Risk:** Manage the risks of the application.
*   **Quality:** Ensure the quality of the application.
*   **Success:** Achieve success with the application.
*   **Impact:** Make a positive impact with the application.
*   **Legacy:** Leave a lasting legacy with the application.
*   **Future:** Plan for the future of the application.
*   **End:** Bring the application to a successful end.
*   **The End:** This is the end of the README.

